<template>
  <div class="app-container">
    <step-bar :active="currentStep" />
    <template v-if="currentStep === 0">
      <publish-bundle-choice />
    </template>
    <template v-else-if="currentStep === 1">
      <publish-bundle-info ref="infoForm" @on-pre="handlePre" @on-next="handleNext" />
    </template>
    <template v-else>
      <publish-bundle-edit ref="editGoods" :goodImageList="goodImageList" :videoCoverList="videoCoverList" :videoList="videoList" :contentsList="contentsList" />
    </template>
    <div class="action-area">
      <el-button v-if="isAblePre" type="primary" @click="handlePre(false)">上一步</el-button>
      <el-button v-if="isAbleNext" type="primary" @click="handleNext(false)" :disabled="disabledNext">下一步</el-button>
      <el-button v-if="isShowSave" type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { PublishBundle } from './components'
import { reqAddMallGoods, reqUpdateMallGoods } from '@/api/mallGoods'
import { reqAssembleGoodsInfoById } from '@/api/assembleGoods'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'publishAssembleBundle',
  components: {
    ...PublishBundle
  },
  computed: {
    ...mapState('assembleGoods', ['bundleMainGoods', 'bundleMainGoods_Copy', 'bundleRetinueGoods', 'bundleRetinueGoods_Copy', 'curBundleDetail', 'curForm']),
    isAblePre() {
      return this.currentStep !== 0
    },
    isAbleNext() {
      return this.currentStep !== 2
    },
    isShowSave() {
      return this.currentStep === 2
    },
    disabledNext() {
      // if (this.bundleMainGoods && this.bundleRetinueGoods.length >= 1) {
      //   return false
      // }
      if (this.bundleMainGoods) {
        return false
      }
      return true
    }
  },
  data() {
    return {
      currentStep: 0,
      id: '', // 编辑时套餐id
      form: {
        // 发布套餐第三步使用的数据
        baseCommodityMediaList: []
      },
      goodImageList: [],
      videoCoverList: [],
      videoList: [],
      contentsList: []
    }
  },
  beforeMount() {
    const { id } = this.$route.query
    this.id = id
  },
  mounted() {
    if (this.id || this.id === 0) {
      reqAssembleGoodsInfoById({ id: this.id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            // 处理后端用于回显的佣金数据
            if (result.channelCommoditySub && result.channelCommoditySub.commissionType && result.channelCommoditySub.commissionType.value === 2) {
              result.channelCommoditySub.commissionValue *= 100
            }
            this.setCurBundleDetail(result)
            let packageList = result.channelCommodityPackageList || []
            let retinueGoods = []
            packageList.map(item => {
              if (item.main) {
                this.setBundleMainGoods(item)
              } else {
                retinueGoods.push(item)
              }
            })
            this.setBundleRetinueGoods(retinueGoods)
            this.setBundleFormData({ form: result })
            let channelCommodityMediaList = result.channelCommodityMediaList || []
            channelCommodityMediaList.map(item => {
              item.type && item.type.value === 3 ? this.contentsList.push((item = { ...item, fileUrl: item.typeValue })) : null
              item.type && item.type.value === 1 ? this.goodImageList.push((item = { ...item, fileUrl: item.typeValue })) : null
              item.type && item.type.value === 2 && item.cover ? this.videoCoverList.push((item = { ...item, fileUrl: item.typeValue })) : null
              item.type && item.type.value === 2 && !item.cover ? this.videoList.push((item = { ...item, fileUrl: item.typeValue })) : null
              return item
            })
          }
        })
        .catch(() => {})
    }
  },
  beforeDestroy() {
    this.clearBundleMainGoods()
    this.clearBundleRetinueGoods()
    this.clearBundleFormData()
    this.clearCurBundleDetail()
    this.clearBundleMainGoods_Copy()
    this.clearBundleRetinueGoods_Copy()
  },
  methods: {
    ...mapActions('assembleGoods', [
      'clearBundleMainGoods',
      'clearBundleRetinueGoods',
      'clearBundleFormData',
      'clearBundleMainGoods_Copy',
      'clearBundleRetinueGoods_Copy',
      'setCurBundleDetail',
      'clearCurBundleDetail',
      'setBundleMainGoods',
      'setBundleRetinueGoods',
      'setBundleFormData'
    ]),
    handlePre(fromChangeGoods) {
      this.$confirm(fromChangeGoods ? '返回重新选择商品将会清空本页已填写的数据，确定要返回并选择其他商品吗？' : '返回上一步将清空本页已填写的所有信息，确定要返回吗？', '提示', {
        confirmButtonText: '确定返回',
        cancelButtonText: '我再想想'
      })
        .then(() => {
          if (this.currentStep === 1) {
            this.clearBundleMainGoods_Copy()
            this.clearBundleRetinueGoods_Copy()
            this.clearBundleFormData()
          }
          this.currentStep -= 1
        })
        .catch(() => {})
    },
    handleNext(isValid) {
      if (this.currentStep === 1 && !isValid) {
        this.$refs['infoForm'].validateNext()
      } else {
        this.currentStep += 1
      }
    },
    handleSave() {
      const res = this.$refs['editGoods'].validateMediaList()
      if (!res) return
      const content = this.$refs['editGoods'].getCustomContent()
      if (!content.value || content.value === '[]') {
        this.$message('请填写商品详情')
        return
      }
      if (!this.curBundleDetail || !this.curBundleDetail.id) {
        // 发布渠道商品
        let req = JSON.parse(JSON.stringify(this.curForm)) || {}
        req.freightId = req.transfer ? '' : req.freightId
        req.baseCommodityId = this.bundleMainGoods_Copy.id
        req.baseCommodityNo = this.bundleMainGoods_Copy.commodityNo
        req.channelCommodityName = req.commodityName
        if (req.baseSale && !isNaN(Number(req.baseSale))) {
          req.baseSale = Number(req.baseSale)
        } else {
          delete req.baseSale
        }
        if (req.sort && !isNaN(Number(req.sort))) {
          req.sort = Number(req.sort)
        } else {
          delete req.sort
        }

        let mainGoods = {
          baseCommodityId: this.bundleMainGoods_Copy.id,
          baseCommodityNo: this.bundleMainGoods_Copy.commodityNo,
          channelCommoditySpecificationList: this.bundleMainGoods_Copy.baseCommoditySpecificationList.map(item => {
            return {
              ...item,
              baseSkuId: item.id,
              baseSkuNo: item.skuNo,
              baseCommodityId: this.bundleMainGoods_Copy.id
            }
          }),
          limitCount: this.bundleMainGoods_Copy.matchNum,
          main: true
        }
        let retinueGoods = this.bundleRetinueGoods_Copy.map(item => {
          return {
            baseCommodityId: item.id,
            baseCommodityNo: item.commodityNo,
            channelCommoditySpecificationList: item.baseCommoditySpecificationList.map(commodity => {
              return {
                ...commodity,
                baseSkuId: commodity.id,
                baseSkuNo: commodity.skuNo,
                baseCommodityId: item.id
              }
            }),
            limitCount: item.matchNum,
            main: false
          }
        })
        req.channelCommodityPackageList = [mainGoods, ...retinueGoods]
        req.channelCategoryIdList = this.curForm.showCategoryList.map(item => {
          return item[item.length - 1].value
        })
        req.channelCommoditySub = {}
        req.channelCommoditySub.discount = req.discount
        req.channelCommoditySub.shelfOffMode = req.putOffMethod
        req.channelCommoditySub.nextLowerDate = req.putOffTime
        req.channelCommoditySub.offLine = req.offLine
        delete req.putOffMethod
        delete req.putOffTime
        delete req.offLine
        if (!req.channelCommoditySub.nextLowerDate) delete req.channelCommoditySub.nextLowerDate
        req.channelCommoditySub.shelfOnMode = req.putOnMethod
        req.channelCommoditySub.nextUpperDate = req.putOnTime
        delete req.putOnMethod
        delete req.putOnTime
        if (!req.channelCommoditySub.nextUpperDate) delete req.channelCommoditySub.nextUpperDate

        // 拼团城市
        req.channelCommoditySub.provinceCode = req.cityCategory[0]
        req.channelCommoditySub.cityCode = req.cityCategory[1]
        delete req.cityCategory
        // 限购配置
        req.channelCommoditySub.restrictionType = req.restrictionType
        delete req.restrictionType
        req.restrictionQuantity ? (req.channelCommoditySub.restrictionQuantity = req.restrictionQuantity) : null
        delete req.restrictionQuantity
        // 佣金配置
        req.channelCommoditySub.commissionType = req.commissionType
        delete req.commissionType
        req.commissionValue ? (req.channelCommoditySub.commissionValue = req.commissionValue) : null
        delete req.commissionValue

        req.channelCommodityMediaList = []
        req.channelCommodityMediaList.push({
          cover: false,
          type: 3, // 'DETAIL'
          typeValue: content.value,
          htmlValue: content.html
        })
        Array.prototype.push.apply(req.channelCommodityMediaList, this.form.baseCommodityMediaList)
        // if (this.$refs['editGoods'].form.imageUrl) {
        //   req.thumbnailImage = this.$refs['editGoods'].form.imageUrl
        //   req.resetCoverImage = 1
        // }
        req.channelCommoditySub.packageType = req.bundleType
        this._reqAddMallGoods({
          // createUser: 2,
          ...req,
          businessNo: 2,
          commodityType: 2,
          storeNo: 1
        })
      } else {
        // 编辑渠道商品
        let curForm = JSON.parse(JSON.stringify(this.curForm)) || {}
        let curBundleDetail = JSON.parse(JSON.stringify(this.curBundleDetail)) || {}
        // 主商品，搭配商品
        let mainGoods = {
          id: this.bundleMainGoods_Copy.id,
          baseCommodityId: this.bundleMainGoods_Copy.baseCommodityId,
          baseCommodityNo: this.bundleMainGoods_Copy.commodityNo,
          channelCommoditySpecificationList: this.bundleMainGoods_Copy.channelCommoditySpecificationList.map(item => {
            return {
              ...item,
              baseSkuId: item.baseSkuId,
              baseSkuNo: item.skuNo,
              baseCommodityId: this.bundleMainGoods_Copy.id
            }
          }),
          limitCount: this.bundleMainGoods_Copy.matchNum,
          main: true
        }
        let retinueGoods = this.bundleRetinueGoods_Copy.map(item => {
          let obj = {
            id: item.baseCommodityId ? item.id : '',
            baseCommodityId: item.baseCommodityId || item.id,
            baseCommodityNo: item.commodityNo,
            limitCount: item.matchNum,
            main: false
          }
          if (item.channelCommoditySpecificationList) {
            obj.channelCommoditySpecificationList = item.channelCommoditySpecificationList.map(commodity => {
              return {
                ...commodity,
                baseSkuId: commodity.baseSkuId,
                baseSkuNo: commodity.skuNo,
                baseCommodityId: item.baseCommodityId
              }
            })
          } else {
            obj.channelCommoditySpecificationList = item.baseCommoditySpecificationList.map(commodity => {
              return {
                ...commodity,
                baseSkuId: commodity.baseSkuId,
                baseSkuNo: commodity.skuNo,
                baseCommodityId: item.baseCommodityId
              }
            })
          }
          return obj
        })
        curBundleDetail.channelCommodityPackageList = [mainGoods, ...retinueGoods]
        curBundleDetail.introduction = curForm.introduction
        curBundleDetail.channelCommodityName = curForm.commodityName
        curBundleDetail.baseSale = curForm.baseSale
        curBundleDetail.sort = curForm.sort
        curBundleDetail.transfer = curForm.transfer
        curBundleDetail.freightId = curForm.transfer ? '' : curForm.freightId
        curBundleDetail.discount = curForm.discount
        curBundleDetail.channelCommoditySub.discount = curForm.discount
        curBundleDetail.channelCommoditySub.nextUpperDate = curForm.putOnTime
        curBundleDetail.channelCommoditySub.nextLowerDate = curForm.putOffTime
        curBundleDetail.channelCommoditySub.shelfOnMode = curForm.putOnMethod
        curBundleDetail.channelCommoditySub.shelfOffMode = curForm.putOffMethod
        curBundleDetail.channelCommoditySub.offLine = curForm.offLine
        // 拼团城市
        curBundleDetail.channelCommoditySub.provinceCode = curForm.cityCategory[0]
        curBundleDetail.channelCommoditySub.cityCode = curForm.cityCategory[1]
        // 限购配置
        curBundleDetail.channelCommoditySub.restrictionType = curForm.restrictionType
        curBundleDetail.channelCommoditySub.restrictionQuantity = curForm.restrictionQuantity
        // 佣金配置
        curBundleDetail.channelCommoditySub.commissionType = curForm.commissionType
        curBundleDetail.channelCommoditySub.commissionValue = curForm.commissionValue
        curBundleDetail.unit = curForm.unit
        curBundleDetail.storeNo = curForm.storeNo
        curBundleDetail.channelCommoditySub.packageType = curForm.bundleType
        let req = { ...curBundleDetail }
        if (req.baseSale && !isNaN(Number(req.baseSale))) {
          req.baseSale = Number(req.baseSale)
        } else {
          delete req.baseSale
        }
        if (req.sort && !isNaN(Number(req.sort))) {
          req.sort = Number(req.sort)
        } else {
          delete req.sort
        }
        req.channelCategoryIdList = curForm.showCategoryList.map(item => {
          return item[item.length - 1].value
        })
        req.channelCommodityMediaList = []
        req.channelCommodityMediaList.push({
          cover: false,
          type: 3,
          typeValue: content.value,
          htmlValue: content.html
        })
        Array.prototype.push.apply(req.channelCommodityMediaList, this.form.baseCommodityMediaList)
        req.channelCommodityMediaList = req.channelCommodityMediaList.map(item => {
          return {
            ...item,
            channelCommodityId: req.id
          }
        })
        // if (this.$refs['editGoods'].form.imageUrl) {
        //   req.thumbnailImage = this.$refs['editGoods'].form.imageUrl
        //   req.resetCoverImage = 1
        // }
        req.businessNo = 2
        req.commodityType = 2
        req.commodityStatus = req.commodityStatus.value
        req.storeNo = 1
        reqUpdateMallGoods(req)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.$router.push({ path: '/goods/assembleGoods' })
            }
          })
          .catch(() => {
            // console.log(err)
          })
      }
    },
    _reqAddMallGoods(form) {
      return reqAddMallGoods(form)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.push({ path: '/goods/assembleGoods' })
          }
        })
        .catch(() => {
          // console.log(err)
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  .action-area {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>

