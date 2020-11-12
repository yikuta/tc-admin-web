<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column label="消息模版编号" prop="num" />
      <el-table-column label="消息类型" prop="type" >
        <template v-slot:default="{row}">{{row['type'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column label="消息标题" prop="title" />
      <el-table-column label="内容" prop="content" />
      <el-table-column label="创建人" prop="user" />
      <el-table-column prop="flag" label="状态">
        <template v-slot:default="{row}">{{row['flag'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column label="操作" width="220">
        <template v-slot:default="{row}">
          <el-button type="text" size="mini">查看消息</el-button>
          <el-button type="text" size="mini" @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" size="mini" @click="handleDelete">快速创建</el-button>
          <el-button type="text" size="mini" @click="handleControl(row)">{{row.flag ? '停用' : '启用'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'TableArea',
    props: {
      tableData: { type: Array, default: () => [] }
    },
    data() {
      return {
        currentRow: {}
      }
    },
    methods: {
      // 启用/停用
      handleControl(row) {
        if (row.flag) {
          this.$confirm('将无法使用该PUSH（文字）模版发送PUSH（文字）（非已创建的消息队列）？', '提示', {}).then(() => {
            row.flag = false
          })
        } else {
          row.flag = true
        }
      },
      handleDelete(item) {
        // 清空选择内容
      },
      handleEdit(row) {
        this.$emit('onEdit', row)
      }
    }
  }
</script>

<style lang='scss' scoped>
.wrapper {
  margin: 0;
  .package-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
