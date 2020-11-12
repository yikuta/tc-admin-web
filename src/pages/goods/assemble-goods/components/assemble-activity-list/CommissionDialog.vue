<template>
  <div class="wrapper">
    <el-dialog title="佣金设置" :visible="visible" @update:visible="onChange">
      <div>
        <p>可以设置团长佣金和推客佣金两部分，仅在团长和分销功能打开的情况下生效</p>
      </div>
      <div>一级团长佣金</div>
      <el-form ref="form" :model="fetchData" label-width="100px" size="mini">
        <el-form-item label="佣金类型">
          <el-radio-group v-model="fetchData.commissionType">
            <el-radio :label="0">固定佣金</el-radio>
            <el-radio :label="1">比例佣金</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="团长佣金">
          <el-input v-model="fetchData.masterCommission" placeholder="请填写团长佣金" clearable>
            <template #append>{{fetchData.commissionType?'%':'元'}}</template>
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
      loading: false
    }
  },
  methods: {
    handleUpdatePrice() {
      this.$emit('on-update-commission')
    },
    onChange(visible) {
      this.$emit('update:visible', visible)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
