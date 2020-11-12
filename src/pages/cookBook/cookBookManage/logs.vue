<template>
  <div class="app-container">
    <detail-head title="操作日志" />
    <div class="head">菜谱信息</div>
    <div style="margin-bottom:24px">菜谱名称：{{$route.query.name}}</div>
    <div class="head">操作日志</div>
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column label="操作时间" prop="createTime" />
      <el-table-column label="操作内容" prop="content" />
      <el-table-column label="操作人" prop="operator" />
    </el-table>
  </div>
</template>
<script>
import DetailHead from '../templates/DetailHead'
import { fetchCookBooksLogs } from '@/api/cookBook'
export default {
  name: 'cookBookLog',
  components: {
    DetailHead
  },
  mounted() {
    this.handleLogs()
  },
  data() {
    return {
      tableData: []
    }
  },
  methods: {
    handleLogs() {
      fetchCookBooksLogs({}, this.$route.query.id).then(res => {
        if (res.code === 200) {
          this.tableData = res.result.itemVOs || []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.head{
  font-weight: 600;
  margin-bottom: 24px;
  font-size: 14px;
}
</style>