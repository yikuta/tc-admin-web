<template>
  <el-dialog
    title="补贴门店"
    :visible.sync="visible"
    width="500px"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-alert type="success" :closable="false">补贴门店的金额将从平台通联营销账户中直接转账到门店余额，操作前请先确定账户有足够的金额。</el-alert>
    <el-form ref="dialogForm" :model="form" :rules="formRules" size="mini" label-width="100px">
      <el-form-item label="营销账户余额">{{collection.marketingBalance}}元</el-form-item>
      <el-form-item label="商家账号">{{collection.bossAccount}}</el-form-item>
      <el-form-item label="门店编码">{{collection.shopCode}}</el-form-item>
      <el-form-item label="门店名称">{{collection.shopName}}</el-form-item>
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
  import { fetchSubsidyTips, createSubsidy } from '@/api/financial/shop'
  const rules = {
    amount: [
      { required: true, message: '请输入补贴金额', trigger: 'blur' },
      { pattern: /^((([1-9]\d{0,4})(\.\d{1,2})?)|(0.\d{1,2})|100000)$/, message: '请输入10万以内的小数（保留小数点后2位, 不含0）', trigger: 'blur' }
    ],
    remark: [
      { required: true, message: '请输入补贴说明', trigger: 'blur' },
      { max: 200, message: '请输入200个以内任意字符~', trigger: 'blur' }
    ]
  }
  export default {
    name: 'SubsidyDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      shopCode: String
    },
    data() {
      return {
        formRules: rules,
        form: {
          amount: '',
          remark: ''
        },
        collection: {}
      }
    },
    methods: {
      handleOpen() {
        this.fetchSubsidyTips()
      },
      fetchSubsidyTips() {
        fetchSubsidyTips({
          shopCode: this.shopCode
        }).then(res => {
          if (res.code === 200) {
            this.collection = res.result
          }
        })
      },
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
            createSubsidy({
              applyReason: remark,
              auditAmount: amount,
              shopCode: this.shopCode
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
