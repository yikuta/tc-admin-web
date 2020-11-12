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
      <el-table-column prop="generateNum" label="补发单号"></el-table-column>
      <el-table-column prop="afterSaleNum" label="来源工单"></el-table-column>
      <el-table-column prop="orderNum" label="来源订单"></el-table-column>
      <el-table-column prop="chooseTreatmentPlan" label="售后类别">
        <template v-slot:default="{row}">{{row['chooseTreatmentPlan'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="reshipmentState" label="补发状态">
        <template v-slot:default="{row}">{{row['reshipmentState'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="goods" label="售后商品">
        <template v-slot:default="{row}">
          <div v-if="row.commodityInfoDetailListVoList.length > 0">
            <p v-for="(item, index) in row.commodityInfoDetailListVoList" :key="index">{{item.commodityName}}*{{item.commodityNum}}_{{item.commodityCode}}</p>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="生成时间" width="160px">
        <span slot-scope="{row}">{{row['createTime'] | format('yyyy-MM-dd HH:mm:ss')}}</span>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleDetail(row)" v-np='"AFTER_SALE_COMPENSATE_ORDER_DETAIL_VIEW"'>查看详情</el-link>
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
          type: 'AgainSupply'
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