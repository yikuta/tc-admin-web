<template>
  <div class="good-info">
    <el-form label-width="100px" size="mini" :model="form" :rules="rules" ref="form">
      <el-form-item label="商品分类">
        <template v-for="(item, index) in $parent.selectName">
          <span v-if="index !== 0"> <i class="el-icon-arrow-right"/> </span>
          {{ item }}
        </template>
        <el-button type="text" v-if="!gid" @click="handleBack">修改分类</el-button>
      </el-form-item>
      <el-form-item label="商品编码">
        <el-input disabled placeholder="后台生成，不用填写" v-model="form.commodityNo"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="commodityName">
        <el-input v-model="form.commodityName" type="text" placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <el-form-item label="商品简介" prop="introduction">
        <el-input v-model="form.introduction" type="textarea" placeholder="请输入商品简介"></el-input>
      </el-form-item>
      <el-form-item label="商品单位" prop="unit">
        <el-select v-model="form.unit" placeholder="请选择商品单位">
          <el-option v-for="item in units" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品SKU">
        <sku-box ref="sku_box" :fetch-suggestions="fetchSuggestions" :specList="specList" :skuNewList="skuNewList"/>
      </el-form-item>
      <good-params :paramsGroupList="paramsGroupList" />
    </el-form>
  </div>
</template>

<script>
  import { fetchBaseSpecificationList } from '@/api/baseCategory'
  import searchFormat from '@/utils/searchFormat'

  export default {
    name: 'GoodsInfo',
    props: {
      gid: {
        type: Number,
        default: undefined
      },
      units: {
        type: Array,
        default: () => []
      },
      paramsGroupList: {
        type: Array,
        default: () => []
      },
      form: {
        type: Object,
        default: {}
      },
      skuNewList: {
        type: Array,
        default: () => [{}]
      },
      specList: {
        tyep: Array,
        default: () => []
      }
    },
    components: {
      SkuBox: () => import('@/components/SkuBox/index.vue'),
      GoodParams: () => import('./goodParams.vue')
    },
    data() {
      return {
        rules: {
          commodityName: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 3, max: 50, message: '3~50个字符', trigger: 'blur' }
          ],
          introduction: [
            { required: true, message: '请输入简介', trigger: 'blur' },
            { min: 3, max: 200, message: '3~200个字符', trigger: 'blur' }
          ],
          unit: [
            { required: true, message: '请选择单位', trigger: 'blur' }
          ],
          baseCategoryPath: [
            { required: true, message: '请选择分类', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.renderSku()
    },
    methods: {
      handleBack() {
        this.$emit('back')
      },
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
        this.$parent.specList = specList
        this.$parent.effectiveSpecList = effectiveSpecList
        this.$parent.skuList = skuList
      },
      validateParamsList() {
        let validateFlag = true;
        (this.paramsGroupList || []).map(group => {
          (group.baseParamOptionList || []).forEach(param => {
            if (param.paramType.value === 4) {
              if (param.selectedValue && param.selectedValue.length > 100) {
                this.$set(param, 'error', '单行文本不超过100个字符')
                validateFlag = false
              }
            } else if (param.paramType.value === 5) {
              if (param.selectedValue && param.selectedValue.length > 500) {
                this.$set(param, 'error', '多行文本不超过500个字符')
                validateFlag = false
              }
            }
          })
        })
        return validateFlag
      },
      formatParamsList() {
        this.$parent.form.baseCommodityParamList = (this.paramsGroupList || []).map(group => {
          return {
            commodityId: group.commodityId,
            id: this.gid ? group.id : null,
            paramName: group.name, // 参数名称
            paramValue: JSON.stringify(group.baseParamOptionList) // 参数值
          }
        })
      },
      validateForm() {
        let flag = true
        this.$refs.form.validate(validate => {
          if (validate) { // 表单验证通过
            if (!this.$refs.sku_box.validateSku()) {
              // this.$message.error('规格表格验证不通过')
              flag = false; return
            }
            const { effectiveSpecList, skuNewList } = this.$refs.sku_box.getSkuData()
            if (skuNewList) {
              // add new
              if (!skuNewList[0].costPrice) {
                this.$message.error('成本价不能为空!')
                flag = false; return
              } else if (!skuNewList[0].marketPrice) {
                this.$message.error('市场价不能为空!')
                flag = false; return
              } else if (!skuNewList[0].stock) {
                this.$message.error('库存不能为空!')
                flag = false; return
              } else if (!skuNewList[0].weight) {
                this.$message.error('重量不能为空!')
                flag = false; return
              }
              this.$emit('update:newAddList', skuNewList)
              if (!this.validateParamsList()) {
                flag = false
              } else {
                this.formatParamsList()
              }
            } else {
              if (!effectiveSpecList.length) {
                this.$message.error('规格值不能为空!')
                flag = false; return
              } else {
                this.formatSpecList()
              }

              if (!this.validateParamsList()) {
                flag = false
              } else {
                this.formatParamsList()
              }
            }
          } else {
            this.$message.error('表单验证不通过')
            flag = false
          }
        })
        return flag
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
</style>
