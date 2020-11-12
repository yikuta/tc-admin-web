<template>
  <div class="app-container">
    <step-bar :active="currentStep" />
    <template v-if="currentStep === 0">
      <publish-goods-choice />
    </template>
    <template v-else-if="currentStep === 1">
      <publish-goods-info ref="infoForm" @on-pre="handlePre" @on-next="handleNext" />
    </template>
    <template v-else>
      <publish-goods-edit ref="editGoods" />
    </template>
    <div class="action-area">
      <el-button v-if="isAblePre" type="primary" @click="handlePre(false)">上一步</el-button>
      <el-button v-if="isAbleNext" type="primary" @click="handleNext(false)">下一步</el-button>
      <el-button v-if="isShowSave" type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { PublishGoods } from './components'
import { reqAddMallGoods, reqUpdateMallGoods, checkCommodityHasRepeat } from '@/api/mallGoods'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'publishAssembleGoods',
  components: {
    ...PublishGoods
  },
  computed: {
    ...mapState('assembleGoods', ['curBaseGoods', 'curAssembleGoods', 'curForm', 'curSkuTable', 'curGoodsDetail']),
    isAblePre() {
      if (!this.curAssembleGoods.id) {
        return this.currentStep !== 0
      } else {
        return this.currentStep === 2
      }
    },
    isAbleNext() {
      // return this.currentStep !== 2 && this.currentStep !== 1
      return this.currentStep !== 2
    },
    isShowSave() {
      return this.currentStep === 2
    }
  },
  data() {
    return {
      currentStep: 0
    }
  },
  beforeMount() {
    let { active } = this.$route.query
    if (!active || isNaN(Number(active))) {
      this.currentStep = 0
    } else if (Number(active) === 1) {
      this.currentStep = 1
    } else {
      this.currentStep = 0
    }
  },
  beforeDestroy() {
    this.clearBaseGoods()
    this.clearAssembleGoods()
    this.clearSingleItemData()
  },
  methods: {
    ...mapActions('assembleGoods', ['setBaseGoods', 'clearBaseGoods', 'clearAssembleGoods', 'clearSingleItemData']),
    handlePre(fromChangeGoods) {
      this.$confirm(fromChangeGoods ? '返回重新选择商品将会清空本页已填写的数据，确定要返回并选择其他商品吗？' : '返回上一步将清空本页已填写的所有信息，确定要返回吗？', '提示', {
        confirmButtonText: '确定返回',
        cancelButtonText: '我再想想'
      })
        .then(() => {
          if (this.currentStep === 1) {
            this.clearBaseGoods()
            this.clearSingleItemData()
          }
          this.currentStep -= 1
        })
        .catch(() => {})
    },
    handleCheckCommodityHasRepeat() {
      return new Promise((resolve, reject) => {
        checkCommodityHasRepeat({
          baseCommodityId: this.currentGoodsId,
          businessNo: 2,
          channelCommodityId: '',
          cityCode: '',
          commodityType: 1
        }).then(res => {
          if (res.code === 200) {
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(res => {
          reject(res)
        })
      })
    },
    async handleNext(isValid) {
      // if (this.currentStep === 0) {
      //   const { result } = await this.handleCheckCommodityHasRepeat()
      //   if (!result) {
      //     this.$message.error('当前商品已被引用，请重新选择！')
      //     return
      //   }
      // }
      if (!this.curBaseGoods.id && this.curBaseGoods.id !== 0) {
        this.$message('请选择一个基础商品')
      } else if (!this.curBaseGoods.enable && !this.curAssembleGoods) {
        this.$message('请选择已经启用的基础商品')
      } else if (this.currentStep === 1 && !isValid) {
        this.$refs['infoForm'].validateNext()
      } else {
        this.currentStep += 1
      }
    },
    handleSave() {
      if (!this.curAssembleGoods.id) {
        // 发布渠道商品
        let req = JSON.parse(JSON.stringify(this.curForm)) || {}
        // console.log('发布渠道商品 ', req)
        req.freightId = req.transfer ? '' : req.freightId
        req.channelCommodityNo = this.curGoodsDetail.channelCommodityNo
        req.baseCommodityNo = this.curGoodsDetail.commodityNo
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
        req.channelCommoditySpecificationList = this.curSkuTable.map(item => {
          let temp = {
            ...item,
            baseSkuId: item.id,
            baseSkuNo: item.skuNo
          }
          delete temp.id
          delete temp.commodityId
          return temp
        })
        req.channelCategoryIdList = this.curForm.showCategoryList.map(item => {
          return item[item.length - 1].value
        })
        req.channelCommoditySub = {}
        req.channelCommoditySub.offLine = req.offLine
        req.channelCommoditySub.shelfOffMode = req.putOffMethod
        req.channelCommoditySub.nextLowerDate = req.putOffTime
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
        const headerContent = this.$refs['editGoods'].getContentHeader()
        const bottomContent = this.$refs['editGoods'].getContentBottom()
        req.channelCommodityMediaList.push({ type: 4, typeValue: headerContent.value, htmlValue: headerContent.html })
        req.channelCommodityMediaList.push({ type: 5, typeValue: bottomContent.value, htmlValue: bottomContent.html })
        // req.channelCommoditySub.headDetail = this.$refs['editGoods'].getContentHeader()
        // req.channelCommoditySub.tailDetail = this.$refs['editGoods'].getContentBottom()
        if (this.$refs['editGoods'].form.imageUrl) {
          req.thumbnailImage = this.$refs['editGoods'].form.imageUrl
          req.resetCoverImage = 1
          req.channelCommodityMediaList.push({ channelCommodityId: req.id, type: 1, cover: 1, typeValue: req.thumbnailImage })
        }
        this._reqAddMallGoods({
          // createUser: 2,
          baseCommodityId: this.curBaseGoods.id,
          ...req,
          businessNo: 2,
          commodityType: 1
        })
      } else {
        // 编辑渠道商品
        let curForm = JSON.parse(JSON.stringify(this.curForm)) || {}
        let curGoodsDetail = JSON.parse(JSON.stringify(this.curGoodsDetail)) || {}
        let curSkuTable = JSON.parse(JSON.stringify(this.curSkuTable || [])) || []
        curGoodsDetail.channelCommoditySpecificationList = curSkuTable
        curGoodsDetail.introduction = curForm.introduction
        curGoodsDetail.channelCommodityName = curForm.commodityName
        curGoodsDetail.baseSale = curForm.baseSale
        curGoodsDetail.sort = curForm.sort
        curGoodsDetail.transfer = curForm.transfer
        curGoodsDetail.freightId = curForm.transfer ? '' : curForm.freightId
        curGoodsDetail.special = curForm.special
        curGoodsDetail.channelCommoditySub.offLine = curForm.offLine
        curGoodsDetail.channelCommoditySub.nextUpperDate = curForm.putOnTime
        curGoodsDetail.channelCommoditySub.nextLowerDate = curForm.putOffTime
        curGoodsDetail.channelCommoditySub.shelfOnMode = curForm.putOnMethod
        curGoodsDetail.channelCommoditySub.shelfOffMode = curForm.putOffMethod
        // 拼团城市
        curGoodsDetail.channelCommoditySub.provinceCode = curForm.cityCategory[0]
        curGoodsDetail.channelCommoditySub.cityCode = curForm.cityCategory[1]
        // 限购配置
        curGoodsDetail.channelCommoditySub.restrictionType = curForm.restrictionType
        curGoodsDetail.channelCommoditySub.restrictionQuantity = curForm.restrictionQuantity
        // 佣金配置
        curGoodsDetail.channelCommoditySub.commissionType = curForm.commissionType
        curGoodsDetail.channelCommoditySub.commissionValue = curForm.commissionValue
        let req = { ...curGoodsDetail }
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
        const headerContent = this.$refs['editGoods'].getContentHeader()
        const bottomContent = this.$refs['editGoods'].getContentBottom()
        req.channelCommodityMediaList.push({ channelCommodityId: req.id, type: 4, typeValue: headerContent.value, htmlValue: headerContent.html })
        req.channelCommodityMediaList.push({ channelCommodityId: req.id, type: 5, typeValue: bottomContent.value, htmlValue: bottomContent.html })
        if (this.$refs['editGoods'].form.imageUrl) {
          req.thumbnailImage = this.$refs['editGoods'].form.imageUrl
          req.resetCoverImage = 1
          req.channelCommodityMediaList.push({ channelCommodityId: req.id, type: 1, cover: 1, typeValue: req.thumbnailImage })
        }
        req.businessNo = 2
        req.commodityStatus = (req.commodityStatus || {}).value
        req.commodityType = (req.commodityType || {}).value
        req.unit = (req.unit || {}).value
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
