<template>
  <div class="detail-head">
    <span>{{title}}</span>
    <el-button size='small' type="primary" @click="handleBack">返回</el-button>
  </div>
</template>
<script>
export default {
  props: {
    title: String
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-head{
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