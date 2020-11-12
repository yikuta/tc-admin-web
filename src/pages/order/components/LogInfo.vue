<template>
  <div class="order-detail-list">
    <p class="order-text">操作日志</p>
    <table-info :columns='columns' :tableData='logData'/>
  </div>
</template>
<script>
import TableInfo from './TableInfo'
export default {
  components: {
    TableInfo
  },
  props: {
    logData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          label: '时间',
          value: 'createTime',
          key: 'date',
          width: 200
        }, {
          label: '操作内容',
          value: 'content'
        }, {
          label: '操作人',
          value: 'operator',
          width: 200
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
</style>
