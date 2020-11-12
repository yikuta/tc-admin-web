<template>
  <div class="tableList">
    <el-table 
      :data="tableData.data" 
      style="width: 100%" 
      :cell-style="{ textAlign:'center' }" 
      :header-cell-style="{ textAlign:'center' }"
      v-loading='loading'>
      <el-table-column prop="index" label="序号" width="100">
        <template slot-scope='scope'>
          <span v-show="!loading">{{(tableData.pageNo - 1) * tableData.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="generateNum" label="退款单号" width="180"></el-table-column>
      <el-table-column prop="afterSaleNum" label="来源工单" width="180"></el-table-column>
      <el-table-column prop="orderNum" label="来源订单" width="200"></el-table-column>
      <el-table-column prop="chooseTreatmentPlan" label="退款类别">
        <template v-slot:default="{row}">{{row['chooseTreatmentPlan'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="refundableAmount" label="可退金额" :formatter="(row)=>formatMoney(row['refundableAmount'])"></el-table-column>
      <el-table-column prop="actualRefundAmount" label="实退金额" :formatter="(row)=>formatMoney(row['actualRefundAmount'])"></el-table-column>
      <el-table-column prop="refundState" label="退款状态">
        <template v-slot:default="{row}">{{row['refundState'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="refundType" label="退款方式">
        <template v-slot:default="{row}">{{row['refundType'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="memberPhone" label="退款账户" :formatter="(row)=>formatNoneValue(row['memberPhone'])"></el-table-column>
      <el-table-column prop="createTime" label="生成时间" width="160px">
        <span slot-scope="{row}">{{row['createTime'] | format('yyyy-MM-dd HH:mm:ss')}}</span>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleDetail(row)" v-np='"AFTER_SALE_REFUND_DETAIL_VIEW"'>查看详情</el-link>
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
      default: () => {}
    },
    loading: Boolean
  },
  data() {
    return {}
  },
  methods: {
    handleDetail(row) {
      this.$router.push({
        path: '/afterSale/workFormDetail',
        query: {
          afterSaleNum: row.afterSaleNum,
          generateNum: row.generateNum,
          type: 'Refund'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.tableList{
  margin-top: 20px;
}
</style>