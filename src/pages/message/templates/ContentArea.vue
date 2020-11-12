<template>
  <div class="wrapper">
    <el-card class="box-card">
      <div slot="header">
        <span :class="{'title':titleStyle}">{{contentTitle}}</span>
        <slot name='control'></slot>
      </div>
      <slot></slot>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'ContentArea',
  props: {
    contentTitle: {
      type: String,
      default: ''
    },
    titleStyle: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .title {
    border-left: 6px solid rgba(64, 158, 255, 1);
    padding-left: 10px;
    line-height: 28px;
  }
  .action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>