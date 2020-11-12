<template>
<div class="order-detail-list">
    <p class="order-text">{{title}}</p>
    <div v-if="tableData.length === 0" class="no-data">
      暂无数据
    </div>
    <el-table
      v-else
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
          <div v-if="item.key==='money'">{{scope.row[item.value] | money}}</div>
          <div v-else-if="item.key==='status'">{{scope.row[item.value] | statusDescrible}}</div>
          <div v-else>{{scope.row[item.value]}}</div>
        </template>
      </el-table-column>
    </el-table>
</div>
</template>
<script>
export default {
  name: 'TableInfo',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    title: String,
    tableData: {
      type: Array,
      default: []
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('./index.scss');
.no-data{
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px solid #e1e8ed;
  color: #909399;
  font-size: 14px;
}
</style>