<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
      <el-table-column prop="name" label="门店名称"></el-table-column>
      <el-table-column prop="shopStatus" label="门店状态" width="180" :formatter="(row)=>row.shopStatus?'已启用':'已禁用'"></el-table-column>
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
  },
  methods: {
    handleCheckDetail(row, column) {
      console.log(row, column) // eslint-disable-line
      // this.$router.push({
      //   path: '/user/detail',
      //   query: {
      //     code: row.userId
      //   }
      // })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>
