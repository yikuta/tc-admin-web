<template>
  <!-- <el-card> -->
  <el-table :data="tableData" header-row-class-name="table-head">
    <el-table-column v-for="(item,index) in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
  </el-table>
  <!-- </el-card> -->
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {

    }
  }
}
</script>
<style lang="scss" scoped>
// /deep/ .table-head th{
//   background: #f9fafc !important
// }
</style>
