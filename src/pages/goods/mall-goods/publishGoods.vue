<template>
  <div class="app-container">
    <step-bar :active="currentStep" />
    <template v-if="currentStep === 0">
      <publish-goods-choice @selectedCurrentGoods="currentGoods => {
        currentGoodsId = currentGoods.id
        currentGoodsEnable = currentGoods.enable
      }" @clearSelectedCurrentGoods="currentGoodsId=''" :currentGoodsId="currentGoodsId" />
    </template>
    <template v-else-if="currentStep === 1">
      <publish-goods-info
        ref="infoForm"
        :currentGoodsId="currentGoodsId"
        :curForm="curForm"
        :curSkuTable="curSkuTable"
        :curGoodsDetail="curGoodsDetail"
        @on-pre="handlePre"
        @on-next="handleNext"
        @on-cache="handleCache"
        @set-current-id="id => currentGoodsId = id"
        @on-change-pre-visible="()=>{
          isChannel = true
        }"
      />
    </template>
    <template v-else>
      <publish-goods-edit ref="editGoods" :isChannel="isChannel" :curGoodsDetail="curGoodsDetail" />
    </template>
    <div class="action-area">
      <el-button v-if="isAblePre" type="primary" @click="handlePre(false)">上一步</el-button>
      <el-button v-if="isAbleNext" type="primary" @click="handleNext(false)">下一步</el-button>
      <el-button v-if="isShowSave" type="primary" :loading="submitLoading" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
import { PublishGoods } from './components'
import { reqAddMallGoods, reqUpdateMallGoods, checkCommodityHasRepeat } from '@/api/mallGoods'

export default {
  name: 'publishMallGoods',
  components: {
    ...PublishGoods
  },
  computed: {
    key() {
      return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    },
    isAblePre() {
      if (!this.isChannel) {
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
      isShowPre: true,
      currentStep: 0,
      currentGoodsId: '', // 由基础商品列表选择的基础商品id
      currentGoodsEnable: true, // 由基础商品列表选择的基础商品enable
      curForm: '',
      curSkuTable: '',
      curGoodsDetail: '',
      isChannel: false, // 是否渠道商品
      submitLoading: false
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
  methods: {
    handlePre(fromChangeGoods) {
      this.$confirm(fromChangeGoods ? '返回重新选择商品将会清空本页已填写的数据，确定要返回并选择其他商品吗？' : '返回上一步将清空本页已填写的所有信息，确定要返回吗？', '提示', {
        confirmButtonText: '确定返回',
        cancelButtonText: '我再想想'
      })
        .then(() => {
          if (this.currentStep === 1) {
            this.currentGoodsId = ''
            this.curForm = ''
            this.curSkuTable = ''
            this.curGoodsDetail = ''
          }
          this.currentStep -= 1
        })
        .catch(() => {})
    },
    handleCheckCommodityHasRepeat() {
      // 验证商品是否已经被引用过
      return new Promise((resolve, reject) => {
        checkCommodityHasRepeat({
          baseCommodityId: this.currentGoodsId,
          businessNo: 1,
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
      if (this.currentStep === 0) {
        const { result } = await this.handleCheckCommodityHasRepeat()
        if (!result) {
          this.$message.error('当前引用的商品已经被商城商品渠道引用过，不能重复引用，请先核实确认~')
          return
        }
      }
      if (!this.currentGoodsId && this.currentGoodsId !== 0) {
        this.$message.error('请选择一个基础商品')
      } else if (!this.currentGoodsEnable) {
        this.$message.error('请选择已经启用的基础商品')
      } else if (this.currentStep === 1 && !isValid) {
        this.$refs['infoForm'].validateNext()
      } else {
        this.currentStep += 1
      }
    },
    handleSave() {
      if (!this.isChannel) {
        // 发布渠道商品
        let req = JSON.parse(JSON.stringify(this.curForm)) || {}
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
        req.channelCommoditySub.shelfOffMode = req.putOffMethod
        req.channelCommoditySub.nextLowerDate = req.putOffTime
        delete req.putOffMethod
        delete req.putOffTime
        if (!req.channelCommoditySub.nextLowerDate) delete req.channelCommoditySub.nextLowerDate
        req.channelCommoditySub.shelfOnMode = req.putOnMethod
        req.channelCommoditySub.nextUpperDate = req.putOnTime
        delete req.putOnMethod
        delete req.putOnTime
        if (!req.channelCommoditySub.nextUpperDate) delete req.channelCommoditySub.nextUpperDate
        req.channelCommodityMediaList = []
        const headerContent = this.$refs['editGoods'].getContentHeader()
        const bottomContent = this.$refs['editGoods'].getContentBottom()
        req.channelCommodityMediaList.push({ type: 4, typeValue: headerContent.value, htmlValue: headerContent.html })
        req.channelCommodityMediaList.push({ type: 5, typeValue: bottomContent.value, htmlValue: bottomContent.html })
        if (this.$refs['editGoods'].form.imageUrl) {
          req.thumbnailImage = this.$refs['editGoods'].form.imageUrl
          req.resetCoverImage = 1
          req.channelCommodityMediaList.push({ type: 1, cover: 1, typeValue: req.thumbnailImage })
        }
        this._reqAddMallGoods({
          // createUser: 2,
          baseCommodityId: this.currentGoodsId,
          ...req,
          businessNo: 1,
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
        curGoodsDetail.channelCommoditySub.nextUpperDate = curForm.putOnTime
        curGoodsDetail.channelCommoditySub.nextLowerDate = curForm.putOffTime
        curGoodsDetail.channelCommoditySub.shelfOnMode = curForm.putOnMethod
        curGoodsDetail.channelCommoditySub.shelfOffMode = curForm.putOffMethod
        curGoodsDetail.businessNo = curGoodsDetail.businessNo.value
        curGoodsDetail.unit = curGoodsDetail.unit.value
        curGoodsDetail.commodityStatus = curGoodsDetail.commodityStatus.value
        curGoodsDetail.commodityType = 1
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
          req.channelCommodityMediaList.push({
            cover: 1,
            type: 1,
            typeValue: req.thumbnailImage
          })
        }
        req.businessNo = 1
        req.commodityStatus = (req.commodityStatus || {}).value
        req.commodityType = 1
        this.submitLoading = true
        reqUpdateMallGoods(req)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.$router.push({ path: '/goods/mallGoods' })
            } else {
              this.$alert(res.message, '提示', {
                confirmButtonText: '确定'
              })
            }
            this.submitLoading = false
          })
          .catch(() => {
            this.submitLoading = false
          })
      }
    },
    handleCache(form, sku, curGoodsInfo) {
      this.curForm = form
      this.curSkuTable = sku
      this.curGoodsDetail = curGoodsInfo
    },
    _reqAddMallGoods(form) {
      this.submitLoading = true
      return reqAddMallGoods(form)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.push({ path: '/goods/mallGoods' })
          }
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
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
