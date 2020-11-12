<template>
  <div class="express-detail-head">
    <span>配送区域</span>
    <el-button size='small' type="primary" @click="handleBack">返回</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    handleBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.express-detail-head{
  display: flex;
  justify-content: space-between;
  padding: 0 0 10px;
  font-size: 14px;
  span{
    line-height: 32px;
    &::before{
      content: '';
      display: inline-block;
      width: 5px;
      height: 20px;
      background: rgba(64, 158, 255, 1);
      float: left;
      margin: 6px 8px 0 0;
    }
  }
}
</style>