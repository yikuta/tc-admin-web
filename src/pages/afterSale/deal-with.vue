<template>
  <div class="app-container">
    <express-detail-head title="工单处理"/>
    <div class="express-detail-container">
      <order-info :baseInfo='baseInfo' :orderType='orderType' :permission="orderType && orderType.value === 3 ? 'AFTER_SALE_SHOP_REL_ORDER_VIEW' : 'AFTER_SALE_REQ_REL_ORDER_VIEW'"/>
      <after-goods :tableData='goodsList' :hasStore='true'/>
      <sale-question :questionInfo='questionInfo' :orderType='orderType'/>
      <deal-order
        :goodsList='goodsList'
        @submit='handleSubmit'
        :refundableAmount='refundableAmount'
        :commoditySumActualPayment='commoditySumActualPayment'
        :commoditySumFreight='commoditySumFreight'
        :orderNum='orderNum'
        :orderState='orderState'
        :orderType='orderType'/>
    </div>
  </div>
</template>
<script>
import { Common, DealWith } from './templates'
import { QUESTION_INFO } from './config'
import { fetchAfterSaleDetailByAfterSaleNum, asyncAfterSaleControlPlatform } from '@/api/afterSale'
export default {
  components: {
    ...Common,
    ...DealWith
  },
  data() {
    return {
      baseInfo: [
        {
          label: '工单编号',
          value: '',
          key: 'afterSaleNum'
        },
        {
          label: '关联订单',
          value: '',
          key: 'orderNum'
        },
        {
          label: '业务类型',
          value: '',
          key: 'orderType'
        },
        {
          label: '申请售后类型',
          value: '',
          key: 'requestType'
        },
        {
          label: '工单发起',
          value: '',
          key: 'afterSaleSource'
        },
        {
          label: '申请时间',
          value: '',
          key: 'createTime'
        },
        {
          label: '客户姓名',
          value: '',
          key: 'memberName'
        },
        {
          label: '客户电话',
          value: '',
          key: 'memberPhone'
        },
        {
          label: '售后状态',
          value: '',
          key: 'afterSaleState'
        }
      ],
      goodsList: [],
      questionInfo: QUESTION_INFO,
      refundableAmount: 0,
      commoditySumActualPayment: 0, // 实付金额
      commoditySumFreight: 0, // 运费金额
      orderNum: '',
      orderState: {},
      orderType: {}
    }
  },
  mounted() {
    this.handleDetail()
  },
  methods: {
    handleDetail() {
      const { afterSaleNum } = this.$route.query
      fetchAfterSaleDetailByAfterSaleNum(afterSaleNum).then(res => {
        if (res.code === 200) {
          const { result } = res
          this.baseInfo.map(item => {
            if (
              typeof result.baseAfterSaleInfo[item.key] === 'object' &&
              result.baseAfterSaleInfo[item.key]
            ) {
              item.value = result.baseAfterSaleInfo[item.key].describe
            } else {
              item.value = result.baseAfterSaleInfo[item.key] || '-'
            }
          })
          // 订单类型
          this.orderState = result.baseAfterSaleInfo.orderState
          this.orderType = result.baseAfterSaleInfo.orderType
          // 订单号
          this.orderNum = result.baseAfterSaleInfo.orderNum
          this.goodsList = result.baseAfterSaleCommodityInfos || []
          this.questionInfo.map(item => {
            if (
              typeof result.baseAfterSaleQuestion[item.key] === 'object' &&
              result.baseAfterSaleQuestion[item.key] && item.key !== 'afterSaleImage'
            ) {
              item.value = result.baseAfterSaleQuestion[item.key].describe
            } else {
              item.value = result.baseAfterSaleQuestion[item.key] || '-'
            }
          })
          this.refundableAmount = result.refundableAmount || 0
          this.commoditySumActualPayment = result.commoditySumActualPayment || 0
          this.commoditySumFreight = result.commoditySumFreight || 0
        }
      })
    },
    handleSubmit(info, afterSaleChooseTreatmentPlan) {
      this.$confirm('是否确认方案', '提示', {}).then(() => {
        const { afterSaleNum } = this.$route.query
        let obj = {}
        if (afterSaleChooseTreatmentPlan === 'REFUND') {
          obj = {
            commodityRefundAmount: info ? info.actualRefundAmount : '',
            freightRefundAmount: info ? info.freightRefundAmount : 0
          }
        } else if (afterSaleChooseTreatmentPlan === 'RETURN_REFUND') {
          obj = {
            omsStoreInfo: { ...info }
          }
        } else if (afterSaleChooseTreatmentPlan === 'COUPON_COMPENSATION') {
          if (info && info.length > 0) {
            obj = {
              detailCouponRecordDtoList: info.map(item => {
                return {
                  couponCode: item.couponCode,
                  couponNum: item.number
                }
              })
            }
          } else {
            this.$message.error('请选择优惠券')
            return
          }
        } else if (afterSaleChooseTreatmentPlan === 'REJECT_APPLICATION') {
          obj = {
            rejectReason: info.rejectReason
          }
        } else if (afterSaleChooseTreatmentPlan === 'EXCHANGE') {
          obj = {
            baseExchangeCommodityInfo: info.baseExchangeCommodityInfo || {},
            omsStoreInfo: info.omsStoreInfo
          }
        } else if (afterSaleChooseTreatmentPlan === 'SUPPLEMENTARY_DELIVERY') {
          obj = {
            reshipmentGoodsInfoDto: info || []
          }
        }
        let common = {
          afterSaleChooseTreatmentPlan,
          refundableAmount: this.refundableAmount,
          afterSaleNum
        }
        asyncAfterSaleControlPlatform({ ...common, ...obj }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '处理成功')
            this.$router.push('orderPlatform')
          }
        })
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
