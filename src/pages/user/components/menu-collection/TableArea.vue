<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
      <el-table-column prop="cookbookName" label="菜谱名称"></el-table-column>
      <el-table-column prop="memberPhone" label="用户手机" width="180"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="createTime" label="收藏时间" width="200"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TableArea',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>
