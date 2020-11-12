<template>
  <el-dialog
    title="提现申请审核"
    :visible.sync="visible"
    width="500px"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules" size="mini" label-width="80px">
      <el-form-item label="门店名称">{{row.shopName}}</el-form-item>
      <el-form-item label="门店编码">{{row.shopCode}}</el-form-item>
      <el-form-item label="商家账号">{{row.bossAccount}}</el-form-item>
      <el-form-item label="提现金额">¥ {{row.auditAmount}}</el-form-item>
      <el-form-item label="审核结果" prop="auditStatus">
        <el-radio-group v-model="form.auditStatus">
          <el-radio :label="true">审核通过</el-radio>
          <el-radio :label="false">审核拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核说明" prop="remark">
        <el-input type="textarea" :row="4" v-model="form.remark" placeholder="请输入补贴说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleCancel">我再想想</el-button>
      <el-button size="mini" type="primary" @click="handleConfirm">确认审核</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { batchAuditShopCashOutResult } from '@/api/financial/shop'
  const rules = {
    auditStatus: [
      { required: true, message: '请选择审核结果', trigger: 'blur' }
    ],
    remark: [
      { required: true, message: '请输入补贴说明', trigger: 'blur' },
      { max: 200, message: '200以内的任意字符', trigger: 'blur' }
    ]
  }
  export default {
    name: 'AuditDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      row: {
        type: Object,
        default: () => ({})
      },
      origin: {
        type: String,
        default: 'list'
      }
    },
    data() {
      return {
        formRules: rules,
        form: {
          auditStatus: '',
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
        this.form.auditStatus = ''
        this.form.remark = ''
        this.handleClose()
      },
      batchAuditShopCashOutResult() {
        batchAuditShopCashOutResult({
          agreedFlag: this.form.auditStatus,
          auditReason: this.form.remark,
          ids: [this.row.id]
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            if (this.origin === 'list') {
              this.$parent.fetchAllList && this.$parent.fetchAllList()
            } else {
              this.$parent.fetchAuditCashOutDetail && this.$parent.fetchAuditCashOutDetail()
            }
            this.handleCancel()
          }
        })
      },
      handleConfirm() {
        this.$refs.dialogForm.validate(validate => {
          if (validate) {
            if (this.form.auditStatus) {
              this.$confirm(`提现申请审核通过后，将直接向门店【${this.row.shopName}】的提现银行卡发放提现金额【${this.row.auditAmount}】元，确定要审核通过吗？`, '提现申请审核', {
                confirmButtonText: '通过审核',
                cancelButtonText: '我再想想'
              }).then(() => {
                this.batchAuditShopCashOutResult()
              })
            } else {
              this.$confirm(`提现申请审核拒绝后，门店【${this.row.shopName}】的提现金额【${this.row.auditAmount}】元将解冻并可用于支付或再次提现，确定要审核拒绝吗？`, '提现申请审核', {
                confirmButtonText: '审核拒绝',
                cancelButtonText: '我再想想'
              }).then(() => {
                this.batchAuditShopCashOutResult()
              })
            }
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
