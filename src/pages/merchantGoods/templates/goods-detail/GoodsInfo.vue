<template>
  <div class="good-info">
    <el-form label-width="100px" size="mini" :model="form" :rules="rules" ref="form">
      <el-form-item label="商品分类">
        <template v-for="(item, index) in selectName">
          <span v-if="index !== 0"> <i class="el-icon-arrow-right"/> </span>
          {{ item }}
        </template>
        <el-button type="text" @click="handleBack">修改分类</el-button>
      </el-form-item>
      <el-form-item label="商品编码" prop="channelCommodityNo" v-if="gid && type==='goodsList'">
        <el-input v-model="form.channelCommodityNo" type="text" disabled placeholder="商品编码"></el-input>
      </el-form-item>
      <el-form-item label="店铺分类" prop="goodsCategoryId" v-if="type==='goodsList'">
        <el-select v-model="form.goodsCategoryId" style="width:100%" @change="handleChange">
          <el-option v-for="item of typeList" :key="item.id" :label="item.categoryName" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品名称" prop="productName">
        <el-input v-model="form.productName" type="text" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品简介" prop="comments">
        <el-input v-model="form.comments" type="textarea" placeholder="请输入商品简介"></el-input>
      </el-form-item>
      <goods-params :paramsGroupList="paramsGroupList" />
    </el-form>
  </div>
</template>

<script>
  import { fetchGoodsCategoryByCode } from '@/api/merchantGoods'
  export default {
    name: 'GoodsInfo',
    props: {
      gid: {
        type: String,
        default: ''
      },
      paramsGroupList: {
        type: Array,
        default: () => []
      },
      form: {
        type: Object,
        default: {}
      },
      selectName: {
        type: Array,
        default: () => []
      }
    },
    components: {
      GoodsParams: resolve => {
        return require(['./GoodsParams.vue'], resolve)
      }
    },
    data() {
      return {
        rules: {
          productName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 50, message: '最多允许50个任意字符', trigger: 'blur' }
          ],
          comments: [
            // { required: true, message: '请输入简介', trigger: 'blur' },
            { min: 3, max: 200, message: '3~200个字符', trigger: 'blur' }
          ],
          baseCategoryPath: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ],
          goodsCategoryId: [
            { required: true, message: '请选择店铺分类', trigger: 'change' }
          ]
        },
        type: '',
        typeList: []
      }
    },
    mounted() {
      this.renderSku()
      // this.form.shopCode = this.gid
      this.type = this.$route.query.type || ''
      if (this.type && this.$route.query.shopCode) {
        this.$nextTick(() => {
          this.handleTypeList()
        })
      }
    },
    methods: {
      handleBack() {
        this.$emit('back')
      },
      renderSku() {
        const timer = setInterval(() => {
          if (this.$refs.sku_box) {
            clearInterval(timer)
            this.$refs.sku_box.setSkuData(this.$parent.specList, this.$parent.skuList)
          }
        }, 800)
      },
      formatSpecList() {
        const { specList, effectiveSpecList, skuList } = this.$refs.sku_box.getSkuData()
        const baseCommoditySpecificationList = []
        skuList.forEach(item => {
          const { id, weight, marketPrice, costPrice, stock, tags, commodityId, skuNo } = item
          const newItem = {
            id, weight, marketPrice, costPrice, stock, skuNo,
            skuInfo: JSON.stringify(tags),
            commodityId: this.gid || commodityId || null
          }
          baseCommoditySpecificationList.push(newItem)
        })
        this.$parent.specList = specList
        this.$parent.effectiveSpecList = effectiveSpecList
        this.$parent.skuList = baseCommoditySpecificationList
      },
      formatParamsList() {
        let list = (this.paramsGroupList || []).map(group => {
          let arr = (group.baseParamOptionList || []).map(item => {
            return {
              groupId: group.id,
              optionId: item.id,
              paramValue: Array.isArray(item.selectedValue) ? item.selectedValue.join() : item.selectedValue
            }
          })
          return arr
          // return {
          //   commodityId: group.commodityId,
          //   id: this.gid ? group.id : null,
          //   paramName: group.name, // 参数名称
          //   paramValue: JSON.stringify(group.baseParamOptionList) // 参数值
          // }
        })
        this.$parent.form.baseCommodityParamList = list.reduce((r, item) => r.concat(item), [])
      },
      validateForm() {
        let flag = true
        this.$refs.form.validate(validate => {
          if (validate) { // 表单验证通过
            this.formatParamsList()
          } else {
            this.$message.error('表单验证不通过')
            flag = false
          }
        })
        return flag
      },
      // 获取店铺分类
      handleTypeList() {
        fetchGoodsCategoryByCode(this.$route.query.shopCode).then(res => {
          if (res.code === 200) {
            this.typeList = res.result || []
          } else {
            this.typeList = []
          }
        })
      },
      handleChange(val) {
        this.form.category = this.typeList.filter(item => item.id === val)[0].name
      }
    }
  }
</script>

<style lang="scss" scoped>
  .list-item {
    .title {
      font-size: 15px;
      font-weight: 600;
      color: #606266;
      margin-bottom: 8px;
    }

    .content {
      padding-left: 10px;
    }
  }
  /deep/ .el-form-item__error {
    padding-top: 3px;
  }
</style>
