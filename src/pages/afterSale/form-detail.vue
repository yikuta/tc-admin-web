<template>
  <div class="app-container">
    <express-detail-head :title="`${title}详情-${orderState.describe}`" />
    <div class="express-detail-container">
      <express-detail-step
        :orderState='orderState'
        :orderType='orderType'
        :orderStatusTime='orderStatusTime'
        :currentState='currentState'
        :stepList='stepList'
        :type='type'
        :rejectReason='rejectReason'
        :receiptGoodsFailReason='receiptGoodsFailReason'
        :tableData='goodsList'
        @update='handleDetail'
        :logisticsCode="logisticsCode"
        :button='button'
        :logisticsNum="logisticsNum"
      />
      <sale-question
        :questionInfo='afterSaleInfo'
        :orderType='orderType'
        :type='type'
        :title="title+'信息'"
      />
      <div v-if="(type === 'ReturnGoods' || type === 'ExchangeGoods') && (goodsList && goodsList.length && goodsList[0].deliverGoodsChannel!=='MIDDLE_GROUND')">
        <p>退回仓库：{{omsStoreInfo.omsRepertoryName}}</p>
        <p>仓库地址：{{omsStoreInfo.omsAddress}}</p>
      </div>
      <after-goods :tableData='goodsList' :type='type'/>
      <!-- 换货商品 -->
      <exchange-goods :tableData='baseExchangeCommodityInfo' v-if="type === 'ExchangeGoods'"/>
      <sale-question :questionInfo='questionInfo' :orderType='orderType'/>
      <!-- 退款流水 -->
      <refund-table
        :tableData='recordList'
        v-if='isShowRefund'
        title="退款流水"
        :columns="refundColumn"
      />
      <!-- 发券记录 -->
      <refund-table
        :tableData='reCouponDetailFlowVos'
        :columns='stampsColumns'
        v-if='isShowStamps'
        title="发券记录"
      />
      <log-info :logList="logList" />
    </div>
  </div>
</template>
<script>
import { Common } from './templates'
import { QUESTION_INFO, STAMPS_COLUMNS, REFUND_COLUMN,
  REFUND_BASE_INFO, AGAIN_BASE_INFO_PRE, RETURN_BASE_INFO, AGAIN_BASE_INFO, STAMPS_BASE_INFO, EXCHANGE_BASE_INFO, EXCHANGE_BASE_INFO_PRE,
  REFUND_STEP, RETURN_STEP, AGAIN_STEP, STAMPS_STEP, EXCHANGE_STEP } from './config'
import {
  fetchAfterSaleRefundDetail,
  fetchAfterSaleExchangeGoodsDetail,
  fetchAfterSaleSendStampsDetail,
  fetchAfterSaleAgainSupplyDetail,
  fetchAfterSaleReturnGoodsDetail
} from '@/api/afterSale'
export default {
  components: {
    ...Common
  },
  data() {
    return {
      afterSaleInfo: [],
      goodsList: [],
      questionInfo: QUESTION_INFO,
      recordList: [],
      logList: [],
      logisticsCode: '', // 物流公司编号
      logisticsNum: '', // 物流编码
      orderState: {
        value: '',
        describe: ''
      },
      currentState: '',
      orderStatusTime: [],
      list: [
        {
          key: 'fetchAfterSaleRefundDetail',
          value: fetchAfterSaleRefundDetail
        },
        {
          key: 'fetchAfterSaleExchangeGoodsDetail',
          value: fetchAfterSaleExchangeGoodsDetail
        },
        {
          key: 'fetchAfterSaleSendStampsDetail',
          value: fetchAfterSaleSendStampsDetail
        },
        {
          key: 'fetchAfterSaleAgainSupplyDetail',
          value: fetchAfterSaleAgainSupplyDetail
        },
        {
          key: 'fetchAfterSaleReturnGoodsDetail',
          value: fetchAfterSaleReturnGoodsDetail
        }
      ],
      type: 'Refund',
      stepList: REFUND_STEP,
      isShowRefund: true, // 是否展示退款流水列表
      isShowStamps: false, // 是否展示发券记录列表
      stampsColumns: STAMPS_COLUMNS,
      receiptGoodsFailReason: '',
      rejectReason: '',
      reCouponDetailFlowVos: [],
      refundColumn: REFUND_COLUMN,
      baseExchangeCommodityInfo: [],
      omsStoreInfo: {},
      orderType: {}, // 订单类型
      button: false // 退货单待退款状态下能否点击退款按钮（true:禁点）
    }
  },
  beforeRouteEnter(to, from, next) {
    let title = ''
    switch (to.query.type) {
      case 'Refund':
        title = '退款单'
        break
      case 'ReturnGoods':
        title = '退货单'
        break
      case 'AgainSupply':
        title = '补发单'
        break
      case 'SendStamps':
        title = '发券单'
        break
      case 'ExchangeGoods':
        title = '换货单'
        break
      default:
        title = '退款单'
        break
    }
    to.meta.title = title + '详情'
    next()
  },
  mounted() {
    this.$nextTick(() => {
      this.handleDetail()
    })
  },
  computed: {
    title() {
      switch (this.type) {
        case 'Refund':
          return '退款单'
        case 'ReturnGoods':
          return '退货单'
        case 'AgainSupply':
          return '补发单'
        case 'SendStamps':
          return '发券单'
        case 'ExchangeGoods':
          return '换货单'
        default:
          return '退款单'
      }
    }
  },
  methods: {
    handleDetail() {
      const { afterSaleNum, generateNum, type } = this.$route.query
      this.type = type
      let fn = this.list.filter(
        item => item.key === `fetchAfterSale${type}Detail`
      )[0].value
      fn(afterSaleNum, generateNum).then(res => {
        if (res.code === 200) {
          const { result } = res
          this.goodsList = result.afterSaleCommodityInfos || []
          this.questionInfo.map(item => {
            item.value = result.baseAfterSaleQuestion[item.key] || '-'
          })
          this.recordList = []
          result.refundDetailFlowVo ? this.recordList.push(result.refundDetailFlowVo) : []
          this.logList = result.afterSaleOperationLogVos || []
          this.currentState = result.currentState
          this.orderStatusTime = result.linkedListDate
          this.orderState = result.baseAfterSaleDetailInfo.baseStateVo || {
            value: '',
            describe: ''
          }
          this.rejectReason = result.rejectReason
          this.receiptGoodsFailReason = result.receiptGoodsFailReason
          this.reCouponDetailFlowVos = result.reCouponDetailFlowVos || []
          this.baseExchangeCommodityInfo = []
          result.baseExchangeCommodityInfo ? this.baseExchangeCommodityInfo.push(result.baseExchangeCommodityInfo) : []
          this.orderType = result.baseAfterSaleDetailInfo.orderType || {}
          switch (type) {
            case 'Refund':
              this.stepList = REFUND_STEP
              this.afterSaleInfo = REFUND_BASE_INFO
              if (this.orderState.value === 1) {
                this.rejectReason =
                  '请您尽量在买家退还货物后同意退款，避免钱货两空！'
              } else if (this.orderState.value === 2) {
                this.rejectReason = '退款方案已审核通过，等待退款'
              } else if (this.orderState.value === 5) {
                this.rejectReason = '拒绝原因：' + result.rejectReason
              }
              break
            case 'ReturnGoods':
              this.stepList = RETURN_STEP
              this.afterSaleInfo = RETURN_BASE_INFO
              if (this.orderState.value === 4) {
                this.rejectReason = result.receiveRemark ? '收货成功备注：' + result.receiveRemark : (result.rejectReason ? '收货失败原因：' + result.rejectReason : '')
              }
              break
            case 'AgainSupply':
              this.isShowRefund = false
              this.stepList = AGAIN_STEP
              this.afterSaleInfo = this.orderType.value === 2 ? AGAIN_BASE_INFO_PRE : AGAIN_BASE_INFO
              break
            case 'SendStamps':
              this.isShowRefund = false
              this.isShowStamps = true
              this.stepList = STAMPS_STEP
              this.afterSaleInfo = STAMPS_BASE_INFO
              break
            case 'ExchangeGoods':
              this.isShowRefund = false
              this.stepList = EXCHANGE_STEP
              this.afterSaleInfo = this.orderType.value === 2 ? EXCHANGE_BASE_INFO_PRE : EXCHANGE_BASE_INFO
              if (this.orderState.value === 6) {
                this.rejectReason = '拒绝原因：' + result.rejectReason
              }
              break
          }
          // 仓库信息
          this.omsStoreInfo = result.omsStoreInfo || {}
          this.afterSaleInfo.map(item => {
            if (
              typeof result.baseAfterSaleDetailInfo[item.key] === 'object' &&
              result.baseAfterSaleDetailInfo[item.key]
            ) {
              item.value = result.baseAfterSaleDetailInfo[item.key].describe
            } else if (item.key === 'actualRefundAmount') {
              item.value = result.baseAfterSaleDetailInfo[item.key] || result.baseAfterSaleDetailInfo[item.key] === 0 ? (result.baseAfterSaleDetailInfo[item.key] * 1).toFixed(2) : '-'
            } else if (item.key === 'refundableAmount') {
              if (result.baseAfterSaleDetailInfo[item.key] || result.baseAfterSaleDetailInfo[item.key] === 0) {
                item.value = (result.baseAfterSaleDetailInfo[item.key] * 1).toFixed(2) + '元（商品金额：' + result.baseAfterSaleDetailInfo['commodityRefundableAmount'] + '元；运费：' + result.baseAfterSaleDetailInfo['freightRefundableAmount'] + '元）'
              } else {
                item.value = '-'
              }
            } else {
              item.value =
                result.baseAfterSaleDetailInfo[item.key] || result.baseAfterSaleDetailInfo[item.key] === 0 ? result.baseAfterSaleDetailInfo[item.key] : '-'
            }
          })
          this.logisticsCode = result.logisticsCode || ''
          this.logisticsNum = result.logisticsNum
          this.button = result.button
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.express-detail-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  padding: 20px;
  overflow: hidden;
}
</style>
