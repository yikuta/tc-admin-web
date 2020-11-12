<template>
  <div class="refund-and-return">
    <p class="table-text">拒绝原因</p>
    <div style="width:90%">
      <el-input 
        type="textarea"
        :rows="3"
        v-model="form.rejectReason"></el-input>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      form: {
        rejectReason: ''
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.refund-and-return{
  display: flex;
}
.table-text{
  font-size:14px;
  line-height: 32px;
  padding: 0;
  margin: 0 20px 0 0;
}
</style>