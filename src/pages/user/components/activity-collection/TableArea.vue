<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
      <el-table-column prop="name" label="活动名称" width="180"></el-table-column>
      <el-table-column prop="activityTime" label="活动时间" width="180"></el-table-column>
      <el-table-column prop="source" label="活动来源" width="180"></el-table-column>
      <el-table-column prop="phone" label="用户手机" width="180"></el-table-column>
      <el-table-column prop="nick" label="昵称"></el-table-column>
      <el-table-column prop="collectTime" label="收藏时间"></el-table-column>
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
