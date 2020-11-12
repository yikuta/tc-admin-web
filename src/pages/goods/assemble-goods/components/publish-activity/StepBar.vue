<template>
  <div class="wrapper">
    <el-steps :active="active" finish-status="success" simple style="margin-top: 20px">
      <el-step title="选择套餐商品"></el-step>
      <el-step title="设置套餐信息"></el-step>
      <el-step title="套餐预览确认"></el-step>
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
</style>
