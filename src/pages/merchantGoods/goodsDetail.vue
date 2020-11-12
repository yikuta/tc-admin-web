<template>
  <div class="app-container">
    <goods-step :step='step'/>
    <div v-if="step === 0">
      <class-transfer
        ref="selectCategory"
        class="class-transfer"
        @select="updateClassList"
        :gid="gid"
        :classList="classList"
        :selectName="selectName"
      />
    </div>
    <div v-show="step === 1">
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
import { fetchMerchantGoodsById, asyncMerchantGoodsEdit, asyncMerchantGoodsAdd } from '@/api/merchantGoods'
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
        shopCode: '',
        commodityNo: null,
        draft: false,
        baseCategoryPath: '',
        commodityCategoryId: null, // 商品分类id
        productName: '', // 商品名称
        comments: '', // 商品介绍
        goodsParams: [], // 参数
        shopGoodsImgs: [] // 媒体数据
      },
      baseInfo: {
        salePrice: '',
        marketPrice: '',
        saleLimit: 0
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
      fetchMerchantGoodsById(this.gid).then(res => {
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
        baseCategoryRootId, baseCategorySecondId, baseCategoryId, videoUrl, videoCover,
        introduction, category, channelCommodityNo, shopCode, goodsCategoryId,
        channelCommodityName,
        goodsParams, // 参数组
        headImgs, // 商品图片
        detailImgs, // 商品详情
        saleLimit,
        marketPrice,
        salePrice
      } = res.result
      // 媒体信息列表
      this.initEditMediaList(headImgs, detailImgs, videoUrl, videoCover)
      // 参数列表
      await this.fetchParamsAndSpecByCategoryId(baseCategoryId)
      this.initEditParamsList(goodsParams || [])
      // 分类路径
      const classList = [baseCategoryRootId, baseCategorySecondId, baseCategoryId]
      classList.forEach((id, index) => {
        this.fetchCategoryById(Number(id), index)
      })
      this.baseInfo = {
        salePrice,
        marketPrice,
        saleLimit
      }
      this.form = {
        id: this.gid || null,
        productName: channelCommodityName,
        comments: introduction,
        category,
        goodsCategoryId,
        channelCommodityNo,
        shopCode,
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
    initEditMediaList(baseCommodityMediaList = [], detailImgs = [], videoUrl, videoCover) {
      const goodImageList = []
      const videoCoverList = []
      const videoList = []
      const contentsList = []
      if (baseCommodityMediaList && baseCommodityMediaList.length) {
        // 商品图片
        baseCommodityMediaList.map(item => {
          if (item) {
            goodImageList.push({
              commodityId: this.gid,
              cover: true,
              type: 'IMAGE',
              typeValue: 0,
              fileUrl: item
            })
          }
        })
      }
      // 商品详情图
      if (detailImgs && detailImgs.length) {
        detailImgs.map(item => {
          if (item) {
            contentsList.push({
              commodityId: this.gid,
              cover: false,
              type: 'IMAGE',
              typeValue: 1,
              fileUrl: item
            })
          }
        })
      }
      // 视频
      if (videoUrl) {
        videoList.push({
          commodityId: this.gid,
          cover: false,
          type: 'VIDEO',
          typeValue: '111',
          fileUrl: videoUrl
        })
      }
      // 视频封面
      if (videoCover) {
        videoCoverList.push({
          commodityId: this.gid,
          cover: false,
          type: 'IMAGE',
          typeValue: '222',
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
          if (this.paramsGroupList[j].id === baseCommodityParamList[i].paramGroupId) {
            this.paramsGroupList[j].baseParamOptionList.forEach(item => {
              if (item.id === baseCommodityParamList[i].paramOptionId) {
                obj = item
              }
            })
            if (obj.paramType) {
              obj.selectedValue = obj.paramType.value === 2 ? (baseCommodityParamList[i].paramValue && baseCommodityParamList[i].paramValue.split(',')) : baseCommodityParamList[i].paramValue
            }
          }
          if (obj.paramType) {
            this.$set(this.paramsGroupList[j].baseParamOptionList, 'selectedValue', obj.selectedValue)
          }
        }
      }
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
        const [baseCategoryRootId, baseCategorySecondId, baseCategoryId] = this.classList
        const { productName, comments, baseCommodityMediaList, category, goodsCategoryId, channelCommodityNo, shopCode, baseCommodityParamList } = this.form
        let headImgsList = baseCommodityMediaList.filter(item => item.typeValue === 1)
        let detailImgsList = baseCommodityMediaList.filter(item => item.typeValue === 3)
        let videoUrlList = baseCommodityMediaList.filter(item => item.typeValue === 2 && item.type === 'VIDEO')
        let videoCover = baseCommodityMediaList.filter(item => item.typeValue === 2 && item.type === 'IMAGE')
        let arr = baseCommodityParamList.map(item => {
          return {
            paramGroupId: item.groupId,
            paramOptionId: item.optionId,
            paramValue: item.paramValue,
            baseCategoryId: baseCategoryId
          }
        })

        let obj = {
          baseCategoryRootId,
          baseCategorySecondId,
          baseCategoryId,
          category,
          channelCommodityNo,
          shopCode,
          id: this.gid,
          goodsCategoryId
        }
        // 编辑自营商品
        Object.assign(obj, {
          channelCommodityName: productName,
          introduction: comments,
          goodsParams: arr,
          headImgs: headImgsList.map(item => item.fileUrl),
          detailImgs: detailImgsList.map(item => item.fileUrl),
          videoUrl: videoUrlList.length ? videoUrlList[0].fileUrl : '',
          videoCover: videoCover.length ? videoCover[0].fileUrl : '',
          ...this.baseInfo
        })
        const postData = filterEmptyParams(obj)
        const promise = this.gid ? asyncMerchantGoodsEdit(postData) : asyncMerchantGoodsAdd(postData)
        promise.then(res => {
          if (res.code === 200) {
            this.$message.success('发布成功！')
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