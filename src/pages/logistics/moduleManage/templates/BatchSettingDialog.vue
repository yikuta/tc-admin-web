<template>
  <el-dialog
    title="批量设置"
    :visible="visible"
    width="800px"
    @close="$emit('close', false)"
  >
    <div class="batch-wrapper">
      <input-number class="input-style" v-model="form.minCount" :type="unitType === 1 ? 'integer' : 'decimal'" />
      <span>{{ unitType === 1 ? '件内' : 'kg内' }}</span>
      <input-number class="input-style" v-model="form.minAmount" type="decimal" />
      <span>元;&nbsp;&nbsp;&nbsp;&nbsp;每增加</span>
      <input-number class="input-style" v-model="form.increaseCount" :type="unitType === 1 ? 'integer' : 'decimal'" />
      <span>{{ unitType === 1 ? '件' : 'kg' }}，增加运费</span>
      <input-number class="input-style" v-model="form.increaseAmount" type="decimal" />
      <span>元</span>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="plain" size="mini" @click="$emit('close', false)">取消</el-button>
      <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import InputNumber from '@/components/InputNumber'
  import { notEmptyStr } from '@/utils/util'
  export default {
    name: 'BatchSettingDialog',
    components: { InputNumber },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      unitType: {
        type: Number,
        default: 1
      },
      form: {
        type: Object,
        default: () => ({
          minCount: '',
          minAmount: '',
          increaseCount: '',
          increaseAmount: ''
        })
      }
    },
    data() {
      return {}
    },
    methods: {
      handleSave() {
        for (let key in this.form) {
          if (!notEmptyStr(this.form[key])) {
            this.$message.error('数据不能为空')
            return
          }
        }
        this.$emit('close', true, { ...this.form })
        this.form = {}
      }
    }
  }
</script>
<style lang="scss" scoped>
  .batch-wrapper {
    .input-style {
      width: 72px;
    }
  }
</style>
