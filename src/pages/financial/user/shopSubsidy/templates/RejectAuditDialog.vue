<template>
  <el-dialog
    title="补贴驳回"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="500px"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules" size="mini" label-width="80px">
      <el-form-item label="门店名称">{{row.shopName}}</el-form-item>
      <el-form-item label="门店编码">{{row.shopCode}}</el-form-item>
      <el-form-item label="商家账号">{{row.bossAccount}}</el-form-item>
      <el-form-item label="补贴金额">¥ {{row.auditAmount}}</el-form-item>
      <el-form-item label="驳回原因" prop="remark">
        <el-input type="textarea" :row="4" v-model="form.remark" placeholder="请输入驳回原因" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleCancel">我再想想</el-button>
      <el-button size="mini" type="primary" @click="handleConfirm">确认驳回</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { rejectShopAuditCashOut } from '@/api/financial/shop'
  const rules = {
    remark: [
      { required: true, message: '请输入驳回原因', trigger: 'blur' },
      { max: 200, message: '100以内的任意字符', trigger: 'blur' }
    ]
  }
  export default {
    name: 'RejectAuditDialog',
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
      rejectShopAuditCashOut() {
        rejectShopAuditCashOut({
          rejectReason: this.form.remark,
          id: this.row.id
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.$parent.handleSearchAll && this.$parent.handleSearchAll()
            this.handleCancel()
          }
        })
      },
      handleConfirm() {
        this.$refs.dialogForm.validate(validate => {
          if (validate) {
            this.$confirm(
              `【${this.row.shopName}】门店的提现驳回后，会将用户的提现金额【¥ ${this.row.auditAmount}】元解冻，并可以重新提现，确定要驳回吗？`,
              '提现驳回',
              {
                confirmButtonText: '确认驳回',
                cancelButtonText: '我再想想'
              }).then(() => {
              this.rejectShopAuditCashOut()
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
