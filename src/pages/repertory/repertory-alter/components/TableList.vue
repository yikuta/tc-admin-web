<template>
  <div class="order-list">
    <el-table
      :data="tableData.data"
      stripe
      style="width: 100%"
      header-row-class-name='table-head'
      v-loading="loading"
    >
      <el-table-column
        prop="commodityNo"
        label="商品编码"
        width="140"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="commodityStockTypeDesc"
        label="库存类型"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="stockChangeTypeDesc"
        label="变动类型"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="stockChange"
        label="库存变动"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="stock"
        label="变动后库存"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="changeTime"
        label="变动时间"
        align='center'
      >
        <span slot-scope="{row}">{{row['changeTime'] | format('yyyy-MM-dd HH:mm:ss')}}</span>
      </el-table-column>
      <el-table-column
        prop="changeSigns"
        label="标识"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="stockChangeDescribeDesc"
        label="变动说明"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="stockChangeSourceDesc"
        label="变动来源"
        align='center'
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Object,
      default: () => {
        return {
          data: [],
          pageNo: 1,
          pageSize: 20
        }
      }
    },
    loading: Boolean
  },
  methods: {
    handleEditOrder() { // params: index, row
      this.$router.push('saleAreaDetail?id=' + 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-text {
  float: left;
}
.table-text p {
  margin: 0;
}
/deep/ .table-head th {
  background: #f9fafc !important;
}
.table-img {
  margin-right: 5px;
  border: 1px solid #999;
  width: 80px;
  height: 80px;
  float: left;
}
</style>
