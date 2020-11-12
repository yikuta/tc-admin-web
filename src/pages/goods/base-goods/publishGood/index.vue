<template>
  <div class="app-container">
    <el-steps :active="step" finish-status="success" simple style="margin-top: 20px">
      <el-step title="1.选择商品分类" ></el-step>
      <el-step title="2.编辑基本信息" ></el-step>
      <el-step title="3.编辑商品详情" ></el-step>
    </el-steps>
    <div v-if="step === 0">
      <class-transfer
        ref="selectCategory"
        class="class-transfer"
        @select="updateClassList"
        :classList="classList"
        :selectName="selectName"
      />
    </div>
    <div v-show="step === 1">
      <goods-info ref="goodInfo" :skuNewList="skuNewList" :gid="gid" :units="units" :paramsGroupList="paramsGroupList" :specList="specList" :newAddList.sync='newAddList' :form="form" @back="handlePrev" />
    </div>
    <div v-if="step === 2">
      <goods-detail
        ref="goodDetail"
        :gid="gid"
        :goodImageList="goodImageList"
        :videoCoverList="videoCoverList"
        :videoList="videoList"
        :contentsList="contentsList"
      />
    </div>
    <el-card class="step" size="mini" align="center">
      <el-button type="primary" @click="handlePrev" v-if="(!gid && step !== 0) || (gid && step === 2)">上一步</el-button>
      <el-button type="primary" @click="handleNext">{{ step === 2 ? '发布' : '下一步' }}</el-button>
    </el-card>
  </div>
</template>

<script>
  import ClassTransfer from './templates/classTransfer.vue'
  import GoodsInfo from './templates/goodInfo.vue'
  import GoodsDetail from './templates/goodDetail.vue'
  import { fetchVariableByCodeList } from '@/api/setting/dataSetting'
  import { filterEmptyParams, deepClone, mergeArray } from '@/utils/util'
  import { getBaseGood, getCategoryById, querySpecAndParmasById, publishBaseGood, updateBaseGood } from '@/api/baseGoods'

  /* const units = [
      { id: 1, name: '箱' },
      { id: 2, name: '件' },
      { id: 3, name: '个' }
    ]*/

  export default {
    name: 'goodsForm',
    components: { ClassTransfer, GoodsInfo, GoodsDetail },
    data() {
      return {
        gid: null, // 商品good id
        units: [],
        step: 0, // 步骤
        classList: [], // 分类路径
        oldClassList: [], // 旧分类路径
        selectName: [], // 分类名称
        detail: {}, // 编辑商品旧数据缓存
        goodImageList: [], // 商品图片列表
        videoCoverList: [], // 视频封面图片列表
        videoList: [], // 视频列表
        contentsList: [], // 富文本列表
        paramsGroupList: [], // 参数列表
        specList: [], // 规格列表
        effectiveSpecList: [], // 有效规格值
        skuList: [], // 规格数值列表
        newAddList: [], // 新规格数值列表
        skuNewList: [{}], // sku-table-new 承接值
        form: {
          id: null,
          commodityNo: null,
          draft: false,
          baseCategoryPath: '',
          commodityCategoryId: null, // 商品分类id
          commodityName: '', // 商品名称
          introduction: '', // 商品介绍
          unit: null, // 单位
          baseCommoditySpecificationList: [], // 规格
          baseCommodityParamList: [], // 参数
          baseCommodityMediaList: [] // 媒体数据
        }
      }
    },
    created() {
      const { id } = this.$route.query
      if (id) {
        this.gid = Number(id)
        this.fetchBaseGoodRequest()
      }
      this.fetchVariableByCodeList() // 从数据字典获取单位
    },
    watch: {
      newAddList: {
        handler(e) {
          console.log('%c⧭', 'color: #aa00ff', e) // eslint-disable-line
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      // 上一步
      handlePrev() {
        this.step > 0 && --this.step
      },
      // 下一步
      handleNext() {
        if (this.step === 0) {
          if (this.classList.includes(undefined) || this.classList.includes(null) || this.classList.length < 3) {
            this.$message.error('请选择二三级分类')
            return
          }
          if (!this.oldClassList.length || (this.oldClassList.join('') !== this.classList.join(''))) {
            this.oldClassList = deepClone(this.classList)
            this.fetchParamsAndSpecByCategoryId()
          }
          this.step = 1
        } else if (this.step === 1) {
          if (this.$refs.goodInfo.validateForm()) { // 表单验证通过
            this.step = 2
          }
        } else if (this.step === 2) {
          if (this.$refs.goodDetail.validateMediaList()) {
            this.handleSubmit()
          }
        }
      },
      fetchVariableByCodeList() {
        fetchVariableByCodeList({ code: 'PROD_BASIC_UNIT' }).then(res => {
          if (res.code === 200) {
            this.units = res.result
          }
        })
      },
      // 获取商品信息
      fetchBaseGoodRequest() {
        getBaseGood(this.gid).then(res => {
          if (res.code === 200) {
            this.step = Number(this.$route.query.step) // 成功后跳转到指定页面
            this.initEditGoodInfo(res)
          }
        })
      },
      // 编辑时，页面数据初始化
      async initEditGoodInfo(res) {
        this.detail = res.result
        const {
          commodityNo, commodityName, introduction, unit, baseCategoryPath, commodityCategoryId,
          baseCommoditySpecificationList, // 规格表格
          baseCommodityParamList, // 参数组
          baseCommodityMediaList // 媒体信息组
        } = res.result
        // 媒体信息列表
        this.initEditMediaList(baseCommodityMediaList)
        // 参数列表
        this.initEditParamsList(baseCommodityParamList)
        // 保存规格列表
        const specList = JSON.parse(res.result.originalSpecification)
        // 分类路径
        const classList = baseCategoryPath.split('|')
        classList.forEach((id, index) => {
          this.fetchCategoryById(Number(id), index)
        })
        this.form = {
          id: this.gid || null,
          commodityNo, commodityName, introduction, baseCategoryPath, commodityCategoryId,
          unit: unit && unit.value // 单位
        }
        await this.editQuerySpecAndParamsById(classList[2], specList)
        this.initEditSpecificationList(specList, baseCommoditySpecificationList) // 规格列表
      },
      // 合并关联规则和参数
      editQuerySpecAndParamsById(id, specList) {
        if (id) {
          return new Promise((resolve, reject) => {
            const noExistSpecsList = []
            const specIds = specList.map(spec => spec.id)
            querySpecAndParmasById(id).then(res => {
              if (res.code === 200) {
                res.result.baseCategorySpecificationList.forEach(exist_spec => {
                  const index = specIds.indexOf(exist_spec.id)
                  if (index > -1) { // 在列表中
                    specList[index].tags = mergeArray(specList[index].tags, exist_spec.specificationValueList, 'id')
                  } else {
                    noExistSpecsList.push({ ...exist_spec, tags: exist_spec.specificationValueList })
                  }
                })
                specList.concat(noExistSpecsList)
                resolve()
              }
            }).catch((error) => {
              reject(error)
            })
          })
        }
        return false
      },
      // 根据categoryId获取参数和规格 添加-接口
      fetchParamsAndSpecByCategoryId() {
        const id = this.classList[2]
        if (id) { // 第三级分类存在
          querySpecAndParmasById(id).then(res => {
            if (res.code === 200) {
              const { baseParamGroupList, baseCategorySpecificationList } = res.result
              this.initParamsAddSpecificationList(baseCategorySpecificationList, baseParamGroupList)
            } else {
              this.$message.error(res.message)
            }
          })
        }
      },
      // 根据id获取分类名称 编辑-接口
      fetchCategoryById(id, index) {
        getCategoryById(id).then(res => {
          if (res.code === 200) {
            this.updateClassList({ index, item: res.result })
          }
        })
      },
      initEditMediaList(baseCommodityMediaList) {
        const goodImageList = []
        const videoCoverList = []
        const videoList = []
        const contentsList = []
        baseCommodityMediaList.map(item => {
          if (item.type.value === 2) { // 视频
            if (item.cover) {
              videoCoverList.push({
                id: item.id,
                commodityId: this.gid,
                cover: true,
                type: 'VIDEO',
                typeValue: item.typeValue,
                fileUrl: item.typeValue
              })
            } else {
              videoList.push({
                id: item.id,
                commodityId: this.gid,
                cover: false,
                type: 'VIDEO',
                typeValue: item.typeValue,
                fileUrl: item.typeValue
              })
            }
          } else if (item.type.value === 1) { // 商品图片
            goodImageList.push({
              id: item.id,
              commodityId: this.gid,
              cover: true,
              type: 'IMAGE',
              typeValue: item.typeValue,
              fileUrl: item.typeValue
            })
          } else if (item.type.value === 3) {
            contentsList.push({
              id: item.id,
              commodityId: this.gid,
              cover: false,
              type: 'DETAIL',
              typeValue: item.typeValue
            })
          }
        })
        this.goodImageList = goodImageList
        this.videoCoverList = videoCoverList
        this.videoList = videoList
        this.contentsList = contentsList
      },
      initEditParamsList(baseCommodityParamList) {
        this.paramsGroupList = (baseCommodityParamList || []).map(item => {
          return {
            name: item.paramName,
            commodityId: item.commodityId,
            id: item.id,
            baseParamOptionList: item.paramValue ? JSON.parse(item.paramValue) : []
          }
        })
      },
      initEditSpecificationList(specList, skuList) {
        this.specList = specList
        // 新增默认无选项
        if (!((skuList[0].tags && skuList[0].tags.length) || (skuList[0].skuInfo && (skuList[0].skuInfo !== 'null' && skuList[0].skuInfo !== '[]')))) {
          this.skuNewList = skuList
        } else {
          this.skuList = (skuList || []).map(item => {
            item.id = item.id ? item.id.toString() : null
            item.tags = item.skuInfo ? JSON.parse(item.skuInfo) : []
            item.tags.forEach(tag => { tag.id = tag.id ? tag.id.toString() : null })
            delete item.skuInfo
            return item // id, commodityId, costPrice, marketPrice, skuNo, stock, weight, skuInfo
          }).sort((a, b) => a.id - b.id)
        }
      },
      // 初始化参数 - 添加
      initParamsAddSpecificationList(baseCategorySpecificationList, baseParamGroupList) {
        // 规格
        this.specList = baseCategorySpecificationList.map(item => {
          item.tags = item.specificationValueList // specificationValueList, name, id, sort
          delete item.specificationValueList
          return item
        })
        this.skuList = []
        // 参数
        const results = (baseParamGroupList || []).map(group => {
          group.baseParamOptionList = (group.baseParamOptionList || []).map(param => {
            param.selectedValue = (param.paramType.value === 2 ? [] : undefined)
            param.value = [1, 2, 3].includes(param.paramType.value) ? (param.value ? JSON.parse(param.value) : []) : param.value
            return param
          })
          return group
        })
        this.paramsGroupList = results
      },
      // 设置classList
      updateClassList({ index, item }) {
        this.$set(this.classList, index, item.id)
        this.$set(this.selectName, index, item.name)
      },
      filterDataId(data, key) {
        const regexp = new RegExp(`${key}$`)
        return deepClone(data).map(item => {
          if (regexp.test(item.id)) delete item.id;
          (item.tags || []).forEach(tag => {
            if (/_tag_id$/.test(tag.id)) delete tag.id
          })
          return item
        })
      },
      // 发布商品请求
      handleSubmit() {
        const self = this
        this.$confirm(`确定要${this.gid ? '保存编辑' : '发布'}吗？`, '提示', {}).then(() => {
          this.form.baseCategoryPath = this.classList.join('|')
          this.form.commodityCategoryId = this.classList[2] // 商品分类id
          this.form.originalSpecification = JSON.stringify(this.effectiveSpecList)
          const baseCommoditySpecificationList = []
          if (self.newAddList && self.newAddList.length > 0) {
            baseCommoditySpecificationList.push({
              id: self.newAddList[0].id || null,
              commodityId: self.newAddList[0].commodityId || null,
              skuNo: self.newAddList[0].skuNo || null,
              weight: self.newAddList[0].weight, marketPrice: self.newAddList[0].marketPrice, costPrice: self.newAddList[0].costPrice, stock: self.newAddList[0].stock
            })
          } else {
            this.skuList.forEach(item => {
              const { id, weight, marketPrice, costPrice, stock, tags, commodityId, skuNo } = item
              const newItem = {
                id: /_sku_id$/.test(id) ? null : id,
                weight, marketPrice, costPrice, stock, skuNo,
                skuInfo: JSON.stringify(tags),
                commodityId: this.gid || commodityId || null
              }
              baseCommoditySpecificationList.push(newItem)
            })
          }
          this.form.baseCommoditySpecificationList = baseCommoditySpecificationList
          const postData = filterEmptyParams(this.form)
          const promise = this.gid ? updateBaseGood(postData) : publishBaseGood(postData)
          promise.then(res => {
            if (res.code === 200) {
              this.$message.success('发布成功！')
              this.$router.push('/goods/baseGoods/index')
            }
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .class-transfer {
    margin: 20px 0;
  }

  .step {
    margin-top: 20px;
  }
</style>
