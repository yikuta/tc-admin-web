<template>
  <div class="order-detail-list">
    <p class="order-text">处理记录</p>
    <el-table 
      :data="recordList"
      header-row-class-name="table-head">
      <el-table-column prop="generateNum" label="编号"></el-table-column>
      <el-table-column prop="chooseTreatmentPlan" label="处理方案">
        <template v-slot:default="{row}">{{row['chooseTreatmentPlan'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="生成时间"></el-table-column>
      <el-table-column prop="detailPlanState" label="方案状态">
        <template v-slot:default="{row}">{{row['detailPlanState'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="description" label="处理结果描述" :formatter="(row)=>formatNoneValue(row['description'])"></el-table-column>
      <el-table-column label="操作" width="100px">
        <template v-slot:default="{ row }">
          <el-button type="text" @click="handleDetail(row)" :disabled="row.chooseTreatmentPlan.value === 6" v-np='permission'>查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    recordList: {
      type: Array,
      default: () => []
    },
    permission: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      typeList: ['Refund', 'ReturnGoods', 'AgainSupply', 'SendStamps', 'ExchangeGoods']
    }
  },
  methods: {
    handleDetail(row) {
      this.$router.push({
        path: '/afterSale/workOrderPlanDetail',
        query: {
          generateNum: row.generateNum,
          afterSaleNum: this.$route.query.afterSaleNum,
          type: row.chooseTreatmentPlan.value === 2 && row.refundFlag ? 'Refund' : this.typeList[row.chooseTreatmentPlan.value - 1]
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('./index.scss')
</style>