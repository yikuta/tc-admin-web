<template>
  <el-dialog
    title="补贴团长"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-alert type="success" :closable="false">补贴团长的金额将直接为团长增加相应的金额，提现时从微信支出。</el-alert>
    <el-form ref="dialogForm" :model="form" :rules="formRules" size="mini" label-width="80px">
      <el-form-item label="团长账号">{{collection.phoneNumber}}</el-form-item>
      <el-form-item label="团长编码">{{collection.regimentalCode}}</el-form-item>
      <el-form-item label="团长姓名">{{collection.name}}</el-form-item>
      <el-form-item label="补贴金额" prop="amount">
        <el-input v-model="form.amount" placeholder="请输入补贴金额" />
      </el-form-item>
      <div class="tips">*当次补贴最高不能超过10万元</div>
      <el-form-item label="补贴说明" prop="remark">
        <el-input type="textarea" row="4" v-model="form.remark" placeholder="请输入补贴说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleCancel">取 消</el-button>
      <el-button size="mini" type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { createLeaderSubsidy } from '@/api/financial/leader'
  const rules = {
    amount: [
      { required: true, message: '请输入补贴金额', trigger: 'blur' },
      { pattern: /^((([1-9]\d{0,4})(\.\d{1,2})?)|100000)$/, message: '请输入10万以内的小数（保留小数点后2位, 不含0）', trigger: 'blur' }
    ],
    remark: [
      { required: true, message: '请输入补贴说明', trigger: 'blur' },
      { max: 200, message: '200以内的任意字符', trigger: 'blur' }
    ]
  }
  export default {
    name: 'SubsidyDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      collection: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        formRules: rules,
        form: {
          amount: '',
          remark: ''
        }
      }
    },
    methods: {
      handleOpen() {},
      handleClose() {
        this.$emit('update:visible', false)
      },
      handleCancel() {
        this.form.amount = ''
        this.form.remark = ''
        this.handleClose()
      },
      handleConfirm() {
        this.$refs.dialogForm.validate(validate => {
          if (validate) {
            const { amount, remark } = this.form
            createLeaderSubsidy({
              auditAmount: amount,
              applyReason: remark,
              regimentalCode: this.collection.regimentalCode
            }).then(res => {
              if (res.code === 200) {
                this.$message.success(res.message)
                this.handleCancel()
                this.$parent.searchTableList()
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  /deep/ .el-alert--success.is-light {
    margin-bottom: 10px;
  }
  /deep/ .el-dialog__body {
    padding: 10px 20px;
  }

  .tips {
    margin-bottom: 14px;
    color: #888;
    line-height: 16px;
    margin-left: 80px;
  }
</style>
