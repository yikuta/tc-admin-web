<template>
  <el-dialog
    title="搭配价设置"
    :visible.sync="visible"
    @open="handleOpen"
    @close="handleCancel(false)"
    :close-on-click-modal="false"
    width="600"
  >
    <el-alert
      title="搭配数量是指商品在此套餐中需要购买的数量，同一个商品中任意规格购买此数量即可。"
      type="success"
      :closable="false"
    />
    <el-form :model="form" :rules="rules" size="small" ref="form" label-width="80px" style="margin-top: 14px">
      <el-form-item label="基础销量" prop="quantity">
        <el-input   @input="handleInputInteger" v-model="form.quantity" autocomplete="off" placeholder="请填写基础销量" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleSubmit">确定设置</el-button>
      <el-button size="mini" @click="handleCancel(false)">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { notEmptyStr } from '@/utils/util'
  export default {
    name: 'QuantitySetting',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      quantity: {
        type: Number,
        default: null
      }
    },
    data() {
      return {
        form: {
          quantity: ''
        },
        rules: {
          quantity: [
            { required: true, message: '请填写搭配数量', trigger: 'blur' },
            { min: 0, max: 10000, message: '请输入1万以内的整数', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleOpen() {
        this.form.quantity = this.quantity
      },
      handleInputInteger(value) {
        if (notEmptyStr(value) && value !== '0') {
          if (value.substr(0, 1) === '0') {
            value = value.substr(1)
          }
          this.$set(this.form, 'quantity', value.replace(/\D/g, ''))
        }
      },
      handleSubmit() {
        this.$refs.form.validate(validate => {
          if (validate) {
            this.$emit('close', true, this.form.quantity)
          }
        })
      },
      handleCancel(isSuccess) {
        this.$emit('close', isSuccess)
      }
    }
  }
</script>

<style lang='scss' scoped>
  /deep/ .el-dialog__body {
    padding: 12px 20px;
  }
</style>
