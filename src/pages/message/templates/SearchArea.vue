<template>
  <div class="wrapper">
    <el-card class="box-card">
      <slot></slot>
      <div class="action">
        <el-button type="primary" size="small" @click="handleSearch">查询</el-button>
        <el-button type="plain" size="small" @click="handleReset">重置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'SearchArea',
  methods: {
    handleReset() {
      this.$emit('resetFields')
    },
    handleSearch() {
      this.$emit('onSearch')
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  margin-bottom: 20px;
  .title {
    border-left: 6px solid rgba(64, 158, 255, 1);
    padding-left: 10px;
  }
  .action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>