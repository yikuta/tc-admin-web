<template>
  <div class="app-container">
    <goods-step :step='step'/>
    <div v-show="step === 0">
      <class-transfer
        ref="selectCategory"
        class="class-transfer"
        @select="updateClassList"
        :gid="gid"
        :classList="classList"
        :selectName="selectName"
      />
    </div>
    <div v-if="step === 1">
      <goods-info 
        ref="goodInfo" 
        :gid="gid" 
        :paramsGroupList="paramsGroupList" 
        :form="form" 
        @back="handlePrev"
        :selectName="selectName"/>
    </div>
    <div v-if="step === 2">
      <goods-images
        ref="goodDetail"
        :gid="gid"
        :goodImageList="goodImageList"
        :videoCoverList="videoCoverList"
        :videoList="videoList"
        :contentsList.sync="contentsList"
      />
    </div>
    <el-card class="step" size="mini" align="center">
      <el-button type="primary" @click="handlePrev" :disabled="step === 0">上一步</el-button>
      <el-button type="primary" @click="handleNext">{{ step === 2 ? '发布' : '下一步' }}</el-button>
    </el-card>
  </div>
</template>
<script>
import { GoodsDetail } from './templates'
import { deepClone } from '@/utils/util'
import { getCategoryById, querySpecAndParmasById } from '@/api/baseGoods'
import { asyncMerchantGoodsAdd, fetchGoodsDetailById } from '@/api/merchantGoods'
import { filterEmptyParams } from '@/utils/util'
export default {
  components: {
    ...GoodsDetail
  },
  data() {
    return {
      gid: null,
      step: 0, // 步骤
      classList: [], // 分类路径
      oldClassList: [], // 旧分类路径
      selectName: [], // 分类名称
      goodImageList: [], // 商品图片列表
      videoCoverList: [], // 视频封面图片列表
      videoList: [], // 视频列表
      paramsGroupList: [], // 参数列表
      contentsList: [], // 商品图片详情列表
      form: {
        id: null,
        commodityNo: null,
        draft: false,
        baseCategoryPath: '',
        commodityCategoryId: null, // 商品分类id
        productName: '', // 商品名称
        comments: '', // 商品介绍
        goodsParams: [], // 参数
        shopGoodsImgs: [] // 媒体数据
      },
      type: ''
    }
  },
  created() {
    const { code, type } = this.$route.query
    this.type = type || ''
    if (code) {
      this.gid = code
      this.fetchBaseGoodRequest()
      this.step = 1
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
        this.step = 1
        if (!this.oldClassList.length || (this.oldClassList.join('') !== this.classList.join(''))) {
          this.oldClassList = deepClone(this.classList)
        }
        this.fetchParamsAndSpecByCategoryId(this.classList[2])
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
    // 设置classList
    updateClassList({ index, item }) {
      this.$set(this.classList, index, item.id)
      this.$set(this.selectName, index, item.name)
    },
    // 获取商品信息
    fetchBaseGoodRequest() {
      let fn = fetchGoodsDetailById
      fn(this.gid).then(res => {
        if (res.code === 200) {
          // this.step = Number(this.$route.query.step) // 成功后跳转到指定页面
          this.initEditGoodInfo(res)
        }
      })
    },
    // 编辑时，页面数据初始化
    async initEditGoodInfo(res) {
      this.detail = res.result
      const {
        commodityNo, baseCategoryPath, commodityCategoryId,
        rootId, parentId, categoryId, videoUrl,
        category, productCode, shopCode,
        goodsName, goodsInfo, paramVoList, imgVoList,
        videoCover
      } = res.result
      // 媒体信息列表
      this.initEditMediaList(imgVoList, videoUrl, videoCover)
      // 参数列表
      await this.fetchParamsAndSpecByCategoryId(categoryId)
      this.initEditParamsList(paramVoList || [])
      // 分类路径
      const classList = [rootId, parentId, categoryId]
      classList.forEach((id, index) => {
        this.fetchCategoryById(Number(id), index)
      })
      this.form = {
        id: this.gid || null,
        productName: goodsName,
        comments: goodsInfo,
        category, productCode, shopCode,
        commodityNo, baseCategoryPath, commodityCategoryId
      }
    },
    // 根据categoryId获取参数 添加-接口
    async fetchParamsAndSpecByCategoryId(id) {
      if (id) { // 第三级分类存在
        await querySpecAndParmasById(id).then(res => {
          if (res.code === 200) {
            const { baseParamGroupList } = res.result
            this.initParamsAddSpecificationList(baseParamGroupList)
          }
        })
      }
    },
    initEditMediaList(baseCommodityMediaList = [], videoUrl, videoCover) {
      const goodImageList = []
      const videoCoverList = []
      const videoList = []
      const contentsList = []
      if (baseCommodityMediaList && baseCommodityMediaList.length) {
        baseCommodityMediaList.map(item => {
          if (item.imageUrl) {
            if (item.type === 2) { // 视频
              videoList.push({
                commodityId: this.gid,
                cover: false,
                type: 'VIDEO',
                typeValue: item.typeValue,
                fileUrl: item.imageUrl
              })
            } else if (item.type === 1) { // 商品图片
              goodImageList.push({
                commodityId: this.gid,
                cover: true,
                type: 'IMAGE',
                typeValue: item.type,
                fileUrl: item.imageUrl
              })
            } else if (item.type === 3) {
              contentsList.push({
                commodityId: this.gid,
                cover: false,
                type: 'IMAGE',
                typeValue: item.type,
                fileUrl: item.imageUrl
              })
            }
          }
        })
      }
      if (videoCover) {
        videoCoverList.push({
          commodityId: this.gid,
          cover: false,
          type: 'IMAGE',
          typeValue: 2,
          fileUrl: videoCover
        })
      }
      this.goodImageList = goodImageList
      this.videoCoverList = videoCoverList
      this.videoList = videoList
      this.contentsList = contentsList
    },
    // 根据id获取分类名称 编辑-接口
    fetchCategoryById(id, index) {
      getCategoryById(id).then(res => {
        if (res.code === 200) {
          this.updateClassList({ index, item: res.result })
        }
      })
    },
    initEditParamsList(baseCommodityParamList) {
      for (let i = 0; i < baseCommodityParamList.length; i++) {
        for (let j = 0; j < this.paramsGroupList.length; j++) {
          let obj = {}
          if (this.paramsGroupList[j].id === baseCommodityParamList[i].groupId) {
            this.paramsGroupList[j].baseParamOptionList.forEach(item => {
              if (item.id === baseCommodityParamList[i].optionId) {
                obj = item
              }
            })
            obj.selectedValue = obj.paramType.value === 2 ? (baseCommodityParamList[i].paramValue && baseCommodityParamList[i].paramValue.split(',')) : baseCommodityParamList[i].paramValue
          }
          if (obj) {
            this.$set(this.paramsGroupList[j].baseParamOptionList, 'selectedValue', obj.selectedValue)
          }
        }
      }
      // this.paramsGroupList = (baseCommodityParamList || []).map(item => {
      //   return {
      //     // name: item.paramName,
      //     // commodityId: item.commodityId,
      //     // id: item.id,
      //     // baseParamOptionList: item.paramValue ? JSON.parse(item.paramValue) : []
      //     // categoryId: item.categoryId,
      //     // groupId: item.groupId,
      //     // optionId: item.optionId,
      //     // paramValue: item.paramValue
      //   }
      // })
    },
    // 初始化参数 - 添加
    initParamsAddSpecificationList(baseParamGroupList) {
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
    // 发布商品请求
    handleSubmit() {
      this.$confirm(`确定要${this.gid ? '保存编辑' : '发布'}吗？`, '提示', {}).then(() => {
        const [rootId, parentId, categoryId] = this.classList
        const { productName, comments, baseCommodityMediaList, category, productCode, shopCode, baseCommodityParamList } = this.form
        let headImgsList = baseCommodityMediaList.filter(item => item.typeValue === 1)
        let detailImgsList = baseCommodityMediaList.filter(item => item.typeValue === 3)
        let videoUrlList = baseCommodityMediaList.filter(item => item.typeValue === 2 && item.type === 'VIDEO')
        let videoCover = baseCommodityMediaList.filter(item => item.typeValue === 2 && item.type === 'IMAGE')
        let arr = baseCommodityParamList.map(item => {
          return {
            groupId: item.groupId,
            optionId: item.optionId,
            paramValue: item.paramValue,
            categoryId: categoryId
          }
        })
        let obj = {
          rootId,
          parentId,
          categoryId,
          category,
          productCode,
          shopCode,
          id: this.gid
        }
        Object.assign(obj, {
          goodsName: productName,
          goodsInfo: comments,
          params: arr,
          goodsImgList: headImgsList.map(item => item.fileUrl),
          detailImgList: detailImgsList.map(item => item.fileUrl),
          videoList: videoUrlList.map(item => item.fileUrl),
          videoCover: videoCover && videoCover.length ? videoCover[0].fileUrl : ''
        })
        const postData = filterEmptyParams(obj)
        const promise = this.gid ? asyncMerchantGoodsAdd(postData) : asyncMerchantGoodsAdd(postData)
        promise.then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '发布成功！')
            this.$router.go(-1)
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.step{
  margin-top:20px
}
</style>