<template>
  <div class="wrapper">
    <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="选择关联添加商品"></el-step>
      <el-step title="编辑基本信息"></el-step>
      <el-step title="编辑商品详情"></el-step>
    </el-steps>
  </div>
</template>

<script>
export default {
  name: 'StepBar',
  props: {
    active: {
      default: 0
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>
