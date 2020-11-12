<template>
  <div class="order-detail-list">
    <p class="order-text">支付信息
      <span style="color:#FF0005;margin-left:30px;font-size:14px">付款状态：{{ payStatus | statusDescrible }}</span>
    </p>
    <table-info :columns='columns' :tableData='paymentRecord'/>
  </div>
</template> 
<script>
import TableInfo from './TableInfo'
export default {
  components: {
    TableInfo
  },
  props: {
    payStatus: {
      type: Object,
      default: () => {}
    },
    paymentRecord: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          label: '交易流水号',
          value: 'tradeNum',
          width: 240
        }, {
          label: '支付渠道',
          value: 'payTradeType',
          key: 'type'
        }, {
          label: '支付账号',
          value: 'payPhone'
        }, {
          label: '支付时间',
          value: 'payTime',
          key: 'date'
        }, {
          label: '支付金额',
          value: 'payMoney',
          key: 'money'
        }
      ],
      tableData: [
        // {
        //   number: '2678888899898899',
        //   channel: '微信支付',
        //   account: '19867888887',
        //   date: '2020-03-03 08:00:00',
        //   pay: '￥10.00'
        // }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
</style>