<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
      <el-table-column prop="channelCommodityName" label="商品名称" width="180">
        <template v-slot:default="{ row }">
          <div style="color:#409EFF">{{row['channelCommodityName']}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="salePrice" label="销售价格" width="180"></el-table-column>
      <el-table-column prop="commodityStatus" label="商品状态" width="180">
        <template v-slot:default="{row}">{{row['commodityStatus'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="thumbnailImage" label="商品头图" width="180">
        <el-image style="width: 40px; height: 40px" slot-scope="{row}" :src="row['thumbnailImage']" fit="fill" />
      </el-table-column>
      <el-table-column prop="memberPhone" label="用户手机" width="180"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="channelCommodityType" label="商品所属">
        <template v-slot:default="{row}">{{row['channelCommodityType'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="收藏时间"></el-table-column>
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
