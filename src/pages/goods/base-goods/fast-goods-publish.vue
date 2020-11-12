<template>
  <div class="app-container fast-goods-publish">
    <div class="title">说明：快速发布商品仅能发商品基本信息，只有基本信息的商品不能进行销售。</div>
    <el-form class="" :model="form" size="mini" label-width="100px" :rules="rule" ref="form">
      <el-form-item label="所属分类" prop="baseCategoryPath">
        <category-box class="el-cascader-wrapper" @change="handleCategoryChange"></category-box>
      </el-form-item>
      <el-form-item label="商品编码">
        <el-input disabled placeholder="后台生成，不用填写"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="commodityName">
        <el-input v-model="form.commodityName" placeholder="请输入商品名称" :maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="商品简介" prop="introduction">
        <el-input v-model="form.introduction" type="textarea" placeholder="请输入商品简介" :maxlength="200"></el-input>
      </el-form-item>
      <el-form-item label="商品单位" prop="unit">
        <el-select v-model="form.unit" placeholder="请输入商品单位">
          <el-option v-for="(item, index) in option.unit" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品SKU">
        <sku-box ref="skubox" :fetch-suggestions="fetchSuggestions" :specList="specList" :skuNewList="skuNewList"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave">发布</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CategoryBox from '@/components/Category/index'
import { addBaseGoodsListByFast } from '@/api/baseGoods'
import { fetchVariableByCodeList } from '@/api/setting/dataSetting'
import { querySpecAndParmasById } from '@/api/baseGoods'
import { filterEmptyParams } from '@/utils/util'
import { fetchBaseSpecificationList } from '@/api/baseCategory'
import searchFormat from '@/utils/searchFormat'
export default {
  name: 'FastPublish',
  components: {
    SkuBox: resolve => {
      return require(['@/components/SkuBox/index.vue'], resolve)
    },
    CategoryBox
  },
  data() {
    return {
      specList: [], // 规格列表
      skuNewList: [{}],
      skuList: [], // SKU列表
      form: {
        commodityName: '', // 名称
        introduction: '', // 简介
        unit: '', // 单位
        baseCategoryPath: '', // 商品分类路径
        commodityCategoryId: null, // 商品分类ID
        draft: true
      },
      rule: {
        commodityName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        introduction: [{ required: true, message: '请输入简介', trigger: 'blur' }],
        unit: [{ required: true, message: '请选择单位', trigger: 'blur' }],
        baseCategoryPath: [{ required: true, message: '请选择分类', trigger: 'blur' }]
      },
      option: {
        unit: [
          /* { id: 1, name: '箱' },
          { id: 2, name: '件' },
          { id: 3, name: '个' }*/
        ]
      }
    }
  },
  mounted() {
    this.fetchVariableByCodeList()
  },
  methods: {
    fetchSuggestions(queryString, callback) {
      fetchBaseSpecificationList({
        pageNo: 1,
        pageSize: 500,
        searchs: JSON.stringify(searchFormat({
          name: { value: queryString, name: 'name', matchType: 'CONTAIN' }, // 规格名称
          enable: { value: true, name: 'enable', matchType: 'EQUAL', type: 'boolean' }
        }))
      }).then(res => {
        if (res.code === 200 && res.result.itemVOs.length) {
          callback(res.result.itemVOs.map(item => {
            item.tags = item.specificationValueList
            return item
          }))
        } else {
          callback([])
        }
      }).catch(() => {
        callback([])
      })
    },
    fetchVariableByCodeList() {
      fetchVariableByCodeList({ code: 'PROD_BASIC_UNIT' }).then(res => {
        if (res.code === 200) {
          this.option.unit = res.result
        }
      })
    },
    // 分类变化
    handleCategoryChange(item) {
      this.form.baseCategoryPath = item.value.join('|')
      this.form.commodityCategoryId = item.value[item.value.length - 1]
      if (item && item.value[2]) { // 第三级分类存在
        this.getParamsByCategoryId(item.value[2])
      }
    },
    // 根据categoryId获取参数和规格 添加-接口
    getParamsByCategoryId(id) {
      querySpecAndParmasById(id).then(res => {
        if (res.code === 200) {
          const { baseCategorySpecificationList } = res.result
          this.initSpecificationList(baseCategorySpecificationList)
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // 初始化参数
    initSpecificationList(baseCategorySpecificationList) {
      this.specList = baseCategorySpecificationList.map(item => {
        item.tags = item.specificationValueList // specificationValueList, name, id, sort
        delete item.specificationValueList
        return item
      })
      this.$refs.skubox.setSkuData(this.specList, [])
    },
    // 保存数据
    handleSave() {
      this.$refs.form.validate(validate => {
        if (validate) {
          if (!this.$refs.skubox.validateSku()) return
          this.$confirm('确定要发布吗？', '提示', {}).then(() => {
            const { effectiveSpecList, skuList } = this.$refs.skubox.getSkuData()

            const baseCommoditySpecificationList = []
            skuList.forEach(item => {
              const { id, weight, marketPrice, costPrice, stock, tags, commodityId, skuNo } = item
              const newItem = {
                id: /_sku_id$/.test(id) ? null : id,
                weight, marketPrice, costPrice, stock, skuNo,
                skuInfo: JSON.stringify(tags),
                commodityId: this.gid || commodityId || null
              }
              baseCommoditySpecificationList.push(newItem)
            })

            this.form.originalSpecification = JSON.stringify(effectiveSpecList)
            this.form.baseCommoditySpecificationList = baseCommoditySpecificationList
            const postData = filterEmptyParams(this.form)
            addBaseGoodsListByFast(postData).then(res => {
              if (res.code === 200) {
                this.$message.success('发布成功!')
                this.$router.push('/goods/baseGoods/index')
              }
            })
          })
        } else {
          this.$nextTick(() => {
            window.scrollTo(0, document.getElementsByClassName('is-error')[0].getBoundingClientRect().top)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .fast-goods-publish {
    .title {
      font-size: 14px;
      color: #909399;
      margin-bottom: 10px;
    }
  }
</style>
