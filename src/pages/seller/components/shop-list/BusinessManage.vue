<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" inline size="small">
      <span>提示：若门店的状态是销店中，则无法修改门店状态</span>
      <el-row :style="{display:'flex',alignItems:'center',marginBottom:'10px',marginTop:'10px'}">
        <el-form-item label="状态" :prop="status">
          <el-radio-group v-model="form.status" @change="handleChangeRadio">
            <el-radio :label="'open'">启用</el-radio>
            <el-radio :label="'close'">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BusinessManage',
  data() {
    return {
      form: {}
    }
  },
  beforeMount() {
    let form = {}
    this.form = form
  },
  methods: {
    handleChangeRadio() {
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
