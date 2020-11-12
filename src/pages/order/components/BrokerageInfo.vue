<template>
  <div class="order-detail-list">
    <p class="order-text">佣金记录</p>
    <table-info :columns='columns' :tableData='brokerageData'/>
  </div>
</template>
<script>
import TableInfo from './TableInfo'
export default {
  components: {
    TableInfo
  },
  props: {
    brokerageData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          label: '变动金额',
          value: 'commissionMoney',
          width: 200
        }, {
          label: '变动后的总额',
          value: 'commissionMoneySum'
        }, {
          label: '备注',
          value: 'remark'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
</style>
