<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column prop="sendStatusDesc" label="发送状态"/>
      <el-table-column prop="sendTime" label="发送时间"></el-table-column>
      <el-table-column label="消息标题" prop="title" />
      <el-table-column label="内容" prop="content" />
      <el-table-column label="用户名（接收人）" prop="memberName" />
      <el-table-column prop="memberPhone" label="用户手机（接收人）"></el-table-column>
      <el-table-column prop="extra" label="失败原因" v-if="type !== 'IM'"></el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'TableArea',
    props: {
      tableData: { type: Array, default: () => [] },
      type: String
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
