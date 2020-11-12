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
      <el-table-column prop="afterSaleNum" label="工单编号" width="200"></el-table-column>
      <el-table-column prop="orderNum" label="关联订单" width="200"></el-table-column>
      <el-table-column prop="orderType" label="业务类型">
        <template v-slot:default="{row}">{{row['orderType'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="saleSource" label="工单发起">
        <template v-slot:default="{row}">{{row['saleSource'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="storeName" label="所属商家" :formatter="(row)=>formatNoneValue(row['storeName'])"></el-table-column>
      <el-table-column prop="requestType" label="申请售后类型">
        <template v-slot:default="{row}">{{row['requestType'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="申请时间" width="160px"></el-table-column>
      <el-table-column prop="afterSaleState" label="售后状态">
        <template v-slot:default="{row}">{{row['afterSaleState'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="chooseTreatmentPlan" label="处理方案">
        <template v-slot:default="{row}">{{row['chooseTreatmentPlan'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="memberName" label="客户姓名" :formatter="(row)=>formatNoneValue(row['memberName'])"></el-table-column>
      <el-table-column prop="memberPhone" label="客户电话" :formatter="(row)=>formatNoneValue(row['memberPhone'])"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleDetail(row)" v-np='"AFTER_SALE_SHOP_DETAIL_VIEW"'>查看详情</el-link>
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
        path: '/afterSale/workOrderDetail',
        query: { afterSaleNum: row.afterSaleNum }
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