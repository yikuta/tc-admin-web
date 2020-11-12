<template>
  <div class="wrapper">
    <div>门店名称：{{shopName}}</div>
    <div :style="{margin:'20px 0'}">请选择此门店开通的业务</div>
    <el-form ref="form" :model="form" label-width="80px" size="mini">
      <el-form-item label-width="0px" prop="business1">
        <el-checkbox v-model="form.business1">净菜业务</el-checkbox>
      </el-form-item>
      <el-form-item label="状态" prop="business1Status">
        <el-radio-group v-model="form.business1Status">
          <el-radio :label="'open'">开通</el-radio>
          <el-radio :label="'close'">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="负责运维" prop="business1Devops">
        <el-select v-model="form.business1Devops" placeholder="请选择" clearable>
          <el-option v-for="item in devOpsOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="0px" prop="business2">
        <el-checkbox v-model="form.business2">社区团购</el-checkbox>
      </el-form-item>
      <el-form-item label="状态" prop="business2Status">
        <el-radio-group v-model="form.business2Status">
          <el-radio :label="'open'">开通</el-radio>
          <el-radio :label="'close'">关闭</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="负责运维" prop="business2Devops">
        <el-select v-model="form.business2Devops" placeholder="请选择" clearable>
          <el-option v-for="item in devOpsOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'BusinessManage',
  props: {
    shopName: String
  },
  data() {
    return {
      form: {
        business1: false,
        business1Status: 'open',
        business1Devops: '',
        business2: false,
        business2Status: 'open',
        business2Devops: ''
      },
      devOpsOption: [
        { value: '1', label: '彭于晏 (15515155005)' },
        { value: '2', label: '彭于晏 (15515155005)' },
        { value: '3', label: '彭于晏 (15515155005)' }
      ]
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
