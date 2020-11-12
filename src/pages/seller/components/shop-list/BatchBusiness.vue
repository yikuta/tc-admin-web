<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" inline size="small">
      <span>提示：若门店的状态是销店中，则无法修改门店状态</span>
      <el-row :style="{display:'flex',alignItems:'center',marginBottom:'10px',marginTop:'10px'}">
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="2">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BatchBusiness',
  data() {
    return {
      form: {
        status: ''
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
}
</style>
