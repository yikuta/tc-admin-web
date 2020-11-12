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
        prop="id"
        label="总仓ID"
        width="240"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="name"
        label="总仓名称"
        width="300"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="area"
        label="配送范围"
        align='center'
      >
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        align='center'
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="handleEditOrder(scope.$index, scope.row)"
          >查看详情</el-button>
        </template>
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
