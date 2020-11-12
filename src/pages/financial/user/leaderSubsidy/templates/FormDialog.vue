<template>
  <el-dialog
    title="团长补贴审核"
    :visible.sync="visible"
    :close-on-click-modal="false"
    width="500px"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules" size="mini" label-width="100px">
      <el-alert type="success" :closable="false">团长补贴审核通过后直接为团长账户增加相应的资金余额，待提现时从微信账户支出。</el-alert>
      <el-form-item label="团长编码：">{{collection.regimentalCode}}</el-form-item>
      <el-form-item label="团长账号：">{{collection.phoneNumber}}</el-form-item>
      <el-form-item label="团长姓名：">{{collection.name}}</el-form-item>
      <el-form-item label="申请原因：">{{collection.applyReason}}</el-form-item>
      <el-form-item label="补贴金额：">¥ {{collection.auditAmount}}</el-form-item>
      <el-form-item label="审核结果" prop="result">
        <el-radio-group v-model="form.result">
          <el-radio v-for="item in auditStatus" :key="item.value" :label="item.value">{{item.label}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核说明" prop="remark">
        <el-input type="textarea" :row="4" v-model="form.remark" placeholder="请输入审核说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleCancel">取 消</el-button>
      <el-button size="mini" type="primary" @click="handleConfirm">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import { fetchLeaderSubsidy, auditLeaderSubsidy } from '@/api/financial/leader'
  const rules = {
    result: [
      { required: true, message: '请选择审核结果', trigger: 'blur' }
    ],
    remark: [
      { required: true, message: '请输入审核说明', trigger: 'blur' },
      { max: 200, message: '200以内的任意字符', trigger: 'blur' }
    ]
  }
  const auditStatus = [
    { label: '审核通过', value: true },
    { label: '审核拒绝', value: false }
  ]
  export default {
    name: 'SubsidyDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      id: String
    },
    data() {
      return {
        auditStatus,
        formRules: rules,
        form: {
          result: null,
          remark: ''
        },
        collection: {}
      }
    },
    methods: {
      handleOpen() {
        this.fetchLeaderSubsidy()
      },
      fetchLeaderSubsidy() {
        fetchLeaderSubsidy({ id: this.id }).then(res => {
          if (res.code === 200) {
            this.collection = res.result
          }
        })
      },
      handleClose() {
        this.$emit('update:visible', false)
      },
      handleCancel() {
        this.form.result = ''
        this.form.remark = ''
        this.handleClose()
      },
      handleConfirm() {
        this.$refs.dialogForm.validate(validate => {
          if (validate) {
            auditLeaderSubsidy({
              id: this.id,
              agreedFlag: this.form.result,
              auditReason: this.form.remark
            }).then(res => {
              if (res.code === 200) {
                this.$alert(res.message, '提示', {
                  closeOnPressEscape: false,
                  closeOnClickModal: false,
                  showConfirmButton: false,
                  cancelButtonText: '关闭'
                }).finally(() => {
                  this.handleCancel()
                  this.$parent.handleSearchAll && this.$parent.handleSearchAll()
                })
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
