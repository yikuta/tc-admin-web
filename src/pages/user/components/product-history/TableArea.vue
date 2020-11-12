<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
      <el-table-column prop="name" label="商品名称" width="180">
        <template v-slot:default="{ row }">
          <el-link type="primary" :disabled="!row['enable']">{{row['channelCommodityName']}}</el-link>
        </template>
      </el-table-column>
      <el-table-column prop="salePrice" label="销售价格" width="180"></el-table-column>
      <el-table-column prop="status" label="商品状态" width="180">commodityStatus
        <template slot-scope="scope">
          <p>{{scope.row.commodityStatus | statusDescrible}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="goodsPic" label="商品头图" width="180">
        <el-image style="width: 40px; height: 40px" slot-scope="{row}" :src="row['thumbnailImage']" fit="fill" />
      </el-table-column>
      <el-table-column prop="memberPhone" label="用户手机" width="180"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="platform" label="商品所属">
        <template slot-scope="scope">
          <p>{{scope.row.channelCommodityType | statusDescrible}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="浏览时间" width="180px">
        <template slot-scope="scope">
          <p>{{scope.row.createTime | format('yyyy-MM-dd HH:mm:ss')}}</p>
        </template>
      </el-table-column>
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
    handleCheckDetail(row) {
      this.$router.push({
        path: '/goods/mallGoods/mallGoodsPreview',
        query: { id: row['id'] }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>
