<template>
  <!-- <el-card> -->
    <el-table
      :data="dataList"
      header-row-class-name="table-head"
    >
      <el-table-column
        v-for="(item,index) in columns"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width='item.width'
      ></el-table-column>
    </el-table>
  <!-- </el-card> -->
</template>
<script>
export default {
  props: {
    dataList: { type: Array, default: () => [] }
  },
  data() {
    return {
      columns: [
        {
          label: '操作时间',
          prop: 'createTime',
          width: 200
        },
        {
          label: '操作内容',
          prop: 'content'
        },
        {
          label: '操作人',
          prop: 'operator',
          width: 200
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
// /deep/ .table-head th{
//   background: #f9fafc !important
// }
</style>