<template>
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
        <div v-if='item.key==="type"'>{{scope.row[item.value] | statusDescrible}}</div>
        <div v-else-if='item.key==="money"'>{{scope.row[item.value] | money}}</div>
        <div v-else-if='item.key==="memberPhone"'>{{scope.row[item.value]}}<span v-if="scope.row['groupFlag']">(发起人)</span></div>
        <div v-else-if='item.key==="pay"'>{{scope.row[item.value] ? '已付款' : '待付款'}}</div>
        <div v-else>{{scope.row[item.value]}}</div>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: 'TableInfo',
  props: {
    columns: Array,
    tableData: Array
  }
}
</script>