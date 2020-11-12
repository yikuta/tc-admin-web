<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="80px" size="mini">
      <el-form-item v-for="item of formItems" :label="item.label" :prop="item.value" :key="item.value">
        <el-select v-model="form[item.value]" placeholder="请选择" clearable>
          <el-option v-for="item in devOpsOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BatchDevops',
  data() {
    this.formItems = [
      { value: 'devOps1', label: '净菜业务' },
      { value: 'devOps2', label: '社区团购' }
    ]
    return {
      form: {},
      devOpsOption: [
        { value: '1', label: '彭于晏 (15515155005)' },
        { value: '2', label: '彭于晏 (15515155005)' },
        { value: '3', label: '彭于晏 (15515155005)' }
      ]
    }
  },
  beforeMount() {
    let form = {}
    this.formItems.forEach(item => {
      Object.assign(form, { [item.value]: '' })
    })
    this.form = form
  }
}
</script>

<style lang='scss' scoped>
</style>
