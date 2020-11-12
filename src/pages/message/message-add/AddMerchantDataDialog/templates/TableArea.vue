<template>
  <div class="wrapper">
    <el-table 
      :data="tableData" 
      style="width: 100%" 
      :cell-style="{ textAlign:'center' }" 
      :header-cell-style="{ textAlign:'center' }" 
      size="mini"
      ref="multipleTable"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="用户手机" prop="username" />
      <el-table-column label="注册时间" prop="createTime" />
    </el-table>
  </div>
</template>

<script>
  export default {
    name: 'TableArea',
    props: {
      tableData: { type: Array, default: () => [] }
    },
    methods: {
      handleSelectionChange(val) {
        this.$emit('select', val)
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
