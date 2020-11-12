<template>
  <div class="order-detail-list">
    <p class="order-text">售后信息</p>
    <el-table
      :data="tableData"
      header-row-class-name="table-head"
    >
      <el-table-column
        v-for="(item,index) in columns"
        :key="index"
        :prop="item.value"
        :label="item.label"
        :width='item.width'
        align="center"
      >
        <template slot-scope="scope">
          <!-- <div v-if="item.key==='date'">{{scope.row[item.value] | format('yyyy-MM-dd HH:mm:ss')}}</div> -->
          <!-- <div v-if='item.key==="afterSaleState"'>{{scope.row[item.value] ? '已发货' : '未发货'}}</div> -->
          <div v-if='item.key==="type"'>{{scope.row[item.value] | statusDescrible}}</div>
          <div v-else-if="item.key==='afterSaleNum'" style="color:#409EFF;cursor:pointer" @click="handleClick(scope.row[item.value])">{{scope.row[item.value]}}</div>
          <div v-else>{{scope.row[item.value]}}</div>
        </template>
      </el-table-column>
    </el-table>
    <!-- <table-info :columns='columns' :tableData='tableData'/> -->
  </div>
</template> 
<script>
import TableInfo from './TableInfo'
export default {
  components: {
    TableInfo
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      columns: [
        {
          label: '售后工单号',
          value: 'afterSaleNum',
          width: 200,
          key: 'afterSaleNum'
        }, {
          label: '售后类型',
          value: 'choosePlan',
          key: 'type'
        }, {
          label: '售后商品',
          value: 'commodityName'
        }, {
          label: '售后状态',
          value: 'afterSaleState',
          key: 'type'
        }
      ]
    }
  },
  methods: {
    handleClick(code) {
      this.$router.push({
        path: '/afterSale/workOrderDetail',
        query: { afterSaleNum: code }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
</style>