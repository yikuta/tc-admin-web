<template>
  <div>
    <p>可退金额&nbsp;&nbsp;<span>{{total}}</span><span>&nbsp;&nbsp;(商品金额：{{commoditySumActualPayment}}元，运费：{{commoditySumFreight}}元)</span></p>
    <div>商品金额&nbsp;&nbsp;
      <el-input-number :min="0" :max="total" v-model="form.actualRefundAmount" :precision="2" style="width:180px" size="small"></el-input-number>&nbsp;元
    </div>
    <div style="margin-top:10px">实退运费&nbsp;&nbsp;
      <el-input-number :min="0" :max="commoditySumFreight" v-model="form.freightRefundAmount" :precision="2" style="width:180px" size="small"></el-input-number>&nbsp;元
    </div>
  </div>
</template>
<script>
export default {
  props: {
    refundableAmount: Number,
    commoditySumActualPayment: Number,
    commoditySumFreight: Number
  },
  data() {
    return {
      form: {
        actualRefundAmount: 0,
        freightRefundAmount: 0
      }
    }
  },
  computed: {
    total() {
      return this.refundableAmount
    }
  }
}
</script>
