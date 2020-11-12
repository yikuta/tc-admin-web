<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }">
      <el-table-column prop="memberCode" label="用户编号"></el-table-column>
      <el-table-column prop="memberPhone" label="用户手机" width="180"></el-table-column>
      <el-table-column prop="nickName" label="昵称"></el-table-column>
      <el-table-column prop="memberGreyBlackType" label="类型">
        <template v-slot:default="{row}">{{row['memberGreyBlackType'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column prop="number" label="流入次数"></el-table-column>
      <el-table-column prop="createTime" label="流入时间" width="200"></el-table-column>
      <el-table-column label="操作" width="100">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleRemove(row)">移除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'TableArea',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    handleRemove(row) {
      this.$confirm(`需要将用户移除${row.memberGreyBlackType.value === 1 ? '灰' : '黑'}名单吗？`, '确认', {}).then(() => {
        this.$emit('remove', {
          memberGreyBlackType: row.memberGreyBlackType.value === 1 ? 'GREY' : 'BLACK',
          memberId: row.memberId
        })
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>
