<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
      <el-table-column prop="name" label="商品名称" width="180">
        <template v-slot:default="{ row, column }">
          <el-link type="primary" @click="handleCheckDetail(row, column)">{{row['name']}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="销售价格" width="180"></el-table-column>
      <el-table-column prop="status" label="商品状态" width="180"></el-table-column>
      <el-table-column prop="goodsPic" label="商品头图" width="180">
        <el-image style="width: 40px; height: 40px" slot-scope="{row}" :src="row['goodsPic']" fit="fill" />
      </el-table-column>
      <el-table-column prop="phone" label="用户手机" width="180"></el-table-column>
      <el-table-column prop="nick" label="昵称"></el-table-column>
      <el-table-column prop="platform" label="商品所属"></el-table-column>
      <el-table-column prop="subscribeTime" label="订阅时间"></el-table-column>
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
    handleCheckDetail() {
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
