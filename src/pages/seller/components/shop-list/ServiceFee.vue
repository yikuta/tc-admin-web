<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" inline size="small" style=" width: 520px">
      <span class="tip">说明：按商家实际收入(包含平台优惠券补贴)扣去服务费，四舍五入</span>
      <el-row :style="{display:'flex',alignItems:'center',marginBottom:'10px',marginTop:'10px'}">
        每笔订单扣取
        <el-form-item label="" prop="free">
          <!-- <el-input v-model="form.free"></el-input> -->
          <el-input-number :min="0" :max="99" step-strictly v-model="form.free" size="mini"></el-input-number>
        </el-form-item>
        %，作为平台服务费
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'ServiceFee',
  data() {
    return {
      form: {
        free: ''
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .el-form-item {
    margin-bottom: 0px;
  }
  .tip{
    font-size: 12px;
    color: #999;
  }
}
</style>
