<template>
  <el-dialog :visible.sync="dialogTableVisible" title="待提交审核列表" :close-on-click-modal='false'>
    <el-table :data="tableData">
      <el-table-column property="id" label="id" width="180"></el-table-column>
      <el-table-column property="name" label="门店名称"></el-table-column>
      <el-table-column property="operationName" label="操作人" width="100"></el-table-column>
      <el-table-column property="createTime" label="保存时间" width="180"></el-table-column>
      <el-table-column property="control" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="text" @click.stop="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" @click="handleDelete(scope.row, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      dialogTableVisible: false
    }
  },
  watch: {
    dialogTableVisible(newVal) {
      this.$emit('update:visible', newVal)
    },
    visible(newVal) {
      this.dialogTableVisible = newVal
    }
  },
  methods: {
    handleEdit(row) {
      this.$emit('edit', row.id)
    },
    handleDelete(row, index) {
      this.$confirm('删除后该数据不恢复，确定要删除吗？', '提示', {}).then(() => {
        this.$emit('delete', row.id, index)
      })
    }
  }
}
</script>