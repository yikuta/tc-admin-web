<template>
  <el-dialog
    title="提现申请审核"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="500px"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules" size="mini" label-width="80px">
      <el-alert
        :title="alertData"
        type="success"
        :closable="false"
      />
      <el-form-item label="审核结果" prop="auditStatus">
        <el-radio-group v-model="form.auditStatus">
          <el-radio :label="true">审核通过</el-radio>
          <el-radio :label="false">审核拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核说明" prop="remark">
        <el-input type="textarea" :row="4" v-model="form.remark" placeholder="请输入审核说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleCancel">我再想想</el-button>
      <el-button size="mini" type="primary" @click="handleConfirm">确认审核</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { batchAuditLeaderCashOutResult, batchAuditResultTips } from '@/api/financial/leader'
  const rules = {
    auditStatus: [
      { required: true, message: '请选择审核结果', trigger: 'blur' }
    ],
    remark: [
      { required: true, message: '请输入审核说明', trigger: 'blur' },
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
      selectionRows: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        formRules: rules,
        form: {
          auditStatus: '',
          remark: ''
        },
        alertData: ''
      }
    },
    watch: {
      visible(n) {
        if (n) {
          this.getTips()
        }
      }
    },
    computed: {
      total: function() {
        let total = 0
        this.selectionRows.forEach(item => {
          total += Number(item.auditAmount)
        })
        return total
      }
    },
    methods: {
      getTips() {
        // 弹窗打开显示提现信息
        batchAuditResultTips({
          ids: this.selectionRows.map(item => item.id)
        }).then(res => {
          if (res.code === 200) {
            this.alertData = res.result
          }
        })
      },
      handleOpen() {},
      handleClose() {
        this.$emit('update:visible', false)
      },
      handleCancel() {
        this.form.auditStatus = ''
        this.form.remark = ''
        this.handleClose()
      },
      batchAuditCashOutResult() {
        batchAuditLeaderCashOutResult({
          agreedFlag: this.form.auditStatus,
          auditReason: this.form.remark,
          ids: this.selectionRows.map(item => item.id)
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.handleCancel()
            this.$parent.fetchAllList()
          }
        })
      },
      handleConfirm() {
        this.$refs.dialogForm.validate(validate => {
          if (validate) {
            // 验证过后需要掉后台接口获取提示信息
            batchAuditResultTips({
              agreedFlag: this.form.auditStatus,
              auditReason: this.form.remark,
              ids: this.selectionRows.map(item => item.id)
            }).then(res => {
              if (res.code === 200) {
                if (this.form.auditStatus) {
                  this.$confirm(res.result, '提现申请审核', {
                    confirmButtonText: '通过审核',
                    cancelButtonText: '我再想想'
                  }).then(() => {
                    this.batchAuditCashOutResult()
                  })
                } else {
                  this.$confirm(res.result, '提现申请审核', {
                    confirmButtonText: '审核拒绝',
                    cancelButtonText: '我再想想'
                  }).then(() => {
                    this.batchAuditCashOutResult()
                  })
                }
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
