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
      <el-table-column prop="name" label="菜谱名称"></el-table-column>
      <el-table-column label="封面图" prop="homeImgUrl" >
        <template v-slot:default="{row}">
          <el-image 
            style="width: 100px; height: 100px"
            :src="row.homeImgUrl" 
            :preview-src-list="[row.homeImgUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus" label="审核状态">
        <template v-slot:default="{row}">{{row['auditStatus'] | auditStatus}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间"></el-table-column>
      <el-table-column prop="bookSource" label="数据来源">
        <template v-slot:default="{row}">{{row['bookSource'] ? (row['bookSource'] === 1 ? '平台发布' : '用户发布') : '-'}}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleDetail(row)">审核</el-link>
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
          pageSize: 20,
          pageNo: 1,
          data: []
        }
      }
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  filters: {
    auditStatus(val) {
      if (val === 10) {
        return '待审核'
      } else if (val === 11) {
        return '审核通过'
      } else if (val === 12) {
        return '审核拒绝'
      } else {
        return '-'
      }
    }
  },
  methods: {
    handleDetail(row) {
      this.$router.push({ path: 'cookBookDetail', query: { id: row.id, isAudit: true }})
    }
  }
}
</script>
<style lang="scss" scoped>
.tableList{
  margin-top: 0;
}
</style>