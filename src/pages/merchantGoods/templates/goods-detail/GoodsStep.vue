<template>
  <el-steps :active="step" finish-status="success" simple style="margin-top: 20px">
    <el-step title="1.选择商品分类" ></el-step>
    <el-step title="2.编辑基本信息" ></el-step>
    <el-step title="3.编辑商品详情" ></el-step>
  </el-steps>
</template>
<script>
export default {
  name: 'GoodsStep',
  props: {
    step: Number,
    default: () => 0
  }
}
</script>