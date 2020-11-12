<template>
  <div class="wrapper">
    <el-dialog title="佣金设置" :visible="visible" @update:visible="onChange">
      <div>
        <p>可以设置团长佣金和推客佣金两部分，仅在团长和分销功能打开的情况下生效</p>
      </div>
      <div>一级团长佣金</div>
      <el-form ref="form" :rules="rules" :model="fetchData" label-width="100px" size="mini">
        <el-form-item label="佣金类型">
          <el-radio-group v-model="fetchData.commissionType" @change="onChangeCommissionType">
            <el-radio :label="1">固定佣金</el-radio>
            <el-radio :label="2">比例佣金</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="团长佣金" prop="masterCommission">
          <el-input v-model="fetchData.masterCommission" placeholder="请填写团长佣金" clearable>
            <template #append>{{fetchData.commissionType===2?'%':'元'}}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="onChange(false)">我再想想</el-button>
        <el-button size="mini" type="primary" @click="handleUpdatePrice" :loading="loading">确定设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CommissionDialog',
  props: {
    visible: Boolean,
    fetchData: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      loading: false,
      rules: { masterCommission: [{ validator: this.validateCommission, trigger: 'blur' }] }
    }
  },
  methods: {
    handleUpdatePrice() {
      this.$emit('on-update-commission')
    },
    onChange(visible) {
      this.$emit('update:visible', visible)
    },
    /**
     * @description: 改变佣金类型
     */
    onChangeCommissionType() {
      this.fetchData.masterCommission = 0
      this.$refs['form'].clearValidate()
    },
    /**
     * @description: 校验佣金
     */
    validateCommission(rule, masterCommission, callback) {
      if (this.fetchData.commissionType === 1) {
        if (!masterCommission) {
          callback()
        } else if (/^\d+(\.\d{1,2})?$/.test(masterCommission) && Number(masterCommission) < 10000 && Number(masterCommission) >= 0) {
          callback()
        } else {
          callback('请输入0-10000之间的两位小数')
        }
      } else {
        if (!masterCommission) {
          callback()
        } else if (/^\d+?$/.test(masterCommission) && Number(masterCommission) <= 100 && Number(masterCommission) >= 0) {
          callback()
        } else {
          callback('请输入小于等于100的整数')
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
