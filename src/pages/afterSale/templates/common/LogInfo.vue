<template>
  <div class="order-detail-list">
    <p class="order-text">操作日志</p>
    <el-table 
      :data="logList"
      header-row-class-name="table-head">
      <el-table-column prop="createTime" label="时间"></el-table-column>
      <el-table-column prop="operationContent" label="操作内容"></el-table-column>
      <el-table-column prop="operator" label="操作人"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    logList: {
      type: Array,
      default: () => []
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('./index.scss');
</style>
