<template>
  <div class="order-detail-list">
    <p class="order-text">选择处理方案</p>
    <div class="btns">
      <el-button
        v-for="(item,index) in btns"
        :key="item.key"
        :class="{'active':activeKey===item.key && (refundableAmount !== 0 || (refundableAmount === 0 && !goodsList[0].deliverGoodsChannel))}"
        :disabled="handleDisable(item)"
        @click="handleChange(item.key, item.value)"
        v-show="index < btnsLength">
        <span>{{item.name}}</span>
      </el-button>
    </div>
    <component
      :is='componentsList[activeKey - 1]'
      :goodsList='goodsList'
      ref="refund"
      :refundableAmount='refundableAmount'
      :commoditySumActualPayment='commoditySumActualPayment'
      :commoditySumFreight='commoditySumFreight'
      :orderNum='orderNum'
      :orderType='orderType'></component>
    <div class="btn-group">
      <el-button size="small" type="primary" @click="handleSubmit">提交</el-button>
      <el-button size="small" @click="handleBack">取消</el-button>
    </div>
  </div>
</template>
<script>
import Refund from './Refund'
import RefundAndReturn from './RefundAndReturn'
import SupplementaryDelivery from './SupplementaryDelivery'
import SendVouchersCompensation from './SendVouchersCompensation'
import ExchangeGoods from './ExchangeGoods'
import RefuseApplied from './RefuseApplied'
export default {
  components: {
    Refund,
    RefundAndReturn,
    SupplementaryDelivery,
    SendVouchersCompensation,
    ExchangeGoods,
    RefuseApplied
  },
  props: {
    orderNum: {
      type: String,
      default: () => ''
    },
    btnsLength: {
      type: Number,
      default: () => 6
    },
    goodsList: {
      type: Array,
      default: () => []
    },
    refundableAmount: {
      type: Number,
      default: () => 0
    },
    commoditySumActualPayment: {
      type: Number,
      default: () => 0
    },
    commoditySumFreight: {
      type: Number,
      default: () => 0
    },
    orderState: {
      type: Object,
      default: {
        describe: '待发货',
        value: 50
      }
    },
    orderType: {
      type: Object,
      default: {
        describe: '快递到家',
        value: 1
      }
    }
  },
  data() {
    return {
      btns: [
        { key: '1', name: '直接退款', value: 'REFUND' },
        { key: '2', name: '退货退款', value: 'RETURN_REFUND' },
        { key: '3', name: '补充发货', value: 'SUPPLEMENTARY_DELIVERY' },
        { key: '4', name: '发券补偿', value: 'COUPON_COMPENSATION' },
        { key: '5', name: '换货', value: 'EXCHANGE' },
        { key: '6', name: '拒绝申请', value: 'REJECT_APPLICATION' }
      ],
      activeKey: '1',
      afterSaleChooseTreatmentPlan: 'REFUND',
      componentsList: [Refund, RefundAndReturn, SupplementaryDelivery, SendVouchersCompensation, ExchangeGoods, RefuseApplied]
    }
  },
  methods: {
    handleChange(key, value) {
      this.activeKey = key
      this.afterSaleChooseTreatmentPlan = value
    },
    handleBack() {
      this.$router.go(-1)
    },
    handleSubmit() {
      const { form, goodsData, baseExchangeCommodityInfo, reshipmentGoodsInfoDto } = this.$refs.refund
      const { afterSaleChooseTreatmentPlan, goodsList } = this
      let data = {}
      if (afterSaleChooseTreatmentPlan === 'REFUND') {
        // 如果售后商品已发货，商品金额+实退金额不能为0
        if (goodsList && goodsList[0] && goodsList[0].deliverGoodsChannel) {
          if (form.actualRefundAmount * 100 + form.freightRefundAmount * 100 > 0) {
            data = form
          } else {
            this.$message.error('商品金额+实退金额不能为0')
            return
          }
        } else {
          data = form
        }
      } else if (afterSaleChooseTreatmentPlan === 'REJECT_APPLICATION') {
        data = form
      } else if (afterSaleChooseTreatmentPlan === 'RETURN_REFUND') {
        data = {
          omsAddress: form.address,
          omsRepertoryCode: form.repertoryCode,
          omsRepertoryName: form.repertoryName
        }
      } else if (afterSaleChooseTreatmentPlan === 'COUPON_COMPENSATION') {
        data = goodsData
      } else if (afterSaleChooseTreatmentPlan === 'EXCHANGE') {
        data = {
          baseExchangeCommodityInfo,
          omsStoreInfo: {
            omsAddress: form.address,
            omsRepertoryCode: form.repertoryCode,
            omsRepertoryName: form.repertoryName
          }
        }
      } else if (afterSaleChooseTreatmentPlan === 'SUPPLEMENTARY_DELIVERY') {
        data = reshipmentGoodsInfoDto
      }
      this.$emit('submit', data, afterSaleChooseTreatmentPlan)
    },
    handleDisable(item) {
      const { orderType, refundableAmount, goodsList } = this
      return ((goodsList.length && !goodsList[0].deliverGoodsChannel) || (orderType && orderType.value === 2) && goodsList[0].offlineFlag) && ((refundableAmount === 0 && item.key === '1' && goodsList[0].deliverGoodsChannel) || (item.key === '2' || item.key === '3' || item.key === '4' || item.key === '5'))
    }
  }
}
</script>
<style lang="scss" scoped>
.order-detail-list{
  margin-bottom: 20px;
  overflow: hidden;
}
.order-text{
  padding: 0 20px 0 0;
  font-size: 16px;
  color: #333;
  margin: 0;
  overflow: hidden;
  height: 54px;
  line-height: 54px;
}
.order-text button{
  float: right;
  margin-top: 10px;
}
.order-text::before{
  content: '';
  display: inline-block;
  width: 5px;
  height: 16px;
  background: rgba(64, 158, 255, 1);
  float: left;
  margin: 17px 8px 0 0;
}
.btns{
  margin-bottom: 20px;
}
.btns ul{
  overflow: hidden;
  padding: 0;
}
// .btns ul li{
//   float: left;
//   cursor: pointer;
//   list-style: none;
//   // padding: 0 20px;
// }
// .btns ul li span{
//   width: 100px;
//   text-align: center;
//   display: inline-block;
//   height: 40px;
//   line-height: 40px;
//   border: 1px solid rgba(215, 215, 215, 1);
//   border-radius: 4px;
//   margin-right: 24px;
//   font-size: 14px;
// }
.active{
  background: #409EFF;
  color: white;
}
.btn-group{
  margin-top: 20px;
  text-align: center;
  button{
    width: 108px;
  }
}
</style>
