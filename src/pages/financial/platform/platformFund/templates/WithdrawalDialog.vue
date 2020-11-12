<template>
  <el-dialog
    class="dialog-form"
    title="平台账户提现"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleClose(false)"
    width="500"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <div class="tips">提现功能仅操作本系统中的账户余额，实际操作请财务人员登录对应的商户后台操作</div>

      <el-form-item label="提现账户" prop="accountType">
        <el-select v-model="form.accountType" placeholder="请选择提现账户" disabled>
          <el-option v-for="item in accountTypes" :key="item.key" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="仅作记录" prop="amount">
        <el-switch v-model="isRecord" :disabled="true"></el-switch>
      </el-form-item>
      <div class="tips">已从通联后台提现，仅在此处做记录的，请选择此项，否则会向通联发起提现操作。</div>

      <el-form-item label="提现金额" prop="auditAmount">
        <el-input v-model="form.auditAmount" :disabled="form.id" autocomplete="off" placeholder="请填写充值金额" />
      </el-form-item>

      <div class="tips">单次提现不能超过100万，且不能超账户可用余额</div>

      <el-form-item label="手续费" prop="feeAmount">
        <el-input v-model="form.feeAmount" autocomplete="off" placeholder="请填写提现手续费" />
      </el-form-item>

      <div class="tips">单次提现手续费不能超过10万，通联提现手续费默认为1元每笔。</div>

      <el-form-item label="经办人" prop="agent">
        <el-input v-model="form.agent" :disabled="form.id" autocomplete="off" placeholder="请填写实际提现的经办人姓名" />
      </el-form-item>

      <el-form-item label="提现说明" prop="instructions">
        <el-input type="textarea" :rows="4" v-model="form.instructions" autocomplete="off" placeholder="请填写提现说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleSubmit">现在提现</el-button>
      <el-button size="mini" @click="handleClose">我再想想</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import regexp from '@/constants/regexp'
  import { AccountTypes } from '../const/list'
  import { platformWithdrawalTongLian, platformWithdrawalOthers } from '@/api/financial/platform'
  const rules = {
    accountType: [{ required: true, message: '请选择提现账户', trigger: 'blur' }],
    auditAmount: [
      { required: true, message: '请输入提现金额', trigger: 'blur' },
      { pattern: regexp.max100Money, message: '请输入正确格式金额（保留小数点后两位）', trigger: 'blur' }
    ],
    feeAmount: [
      { required: true, message: '请输入提现手续费', trigger: 'blur' },
      { pattern: /^((([1-9]\d{0,4})(\.\d{1,2})?)|(0.\d{1,2})|99999.99|0)$/, message: '请输入正确格式金额（保留小数点后两位）', trigger: 'blur' }
    ],
    agent: [
      { required: true, message: '请填写经办人', trigger: 'blur' },
      { pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_·\u4e00-\u9fa5]{1,19}$/, message: '2～20个字符（汉字、数字、字母、下划线）', trigger: 'blur' }
    ],
    instructions: [
      { required: true, message: '请填写提现说明', trigger: 'blur' },
      { max: 200, message: '请输入200个以内任意字符~', trigger: 'blur' }
    ]
  }
  export default {
    name: 'WithdrawalDialog',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      type: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        rules,
        accountTypes: AccountTypes,
        isRecord: true,
        form: {
          feeAmount: 1,
          accountType: '',
          auditAmount: '',
          agent: '',
          instructions: ''
        }
      }
    },
    methods: {
      handleOpen() {
        // 重置表单数据
        this.$nextTick(() => {
          this.$refs.form.clearValidate()
        })
        this.form = {
          feeAmount: 1,
          accountType: this.type,
          auditAmount: '',
          agent: '',
          instructions: ''
        }
      },
      handleClose() {
        this.$emit('update:visible', false)
      },
      platformWithdrawalTongLian() {
        const postData = { ...this.form }
        delete postData.feeAmount
        platformWithdrawalTongLian(postData).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.$parent.fetchPlatformSummary()
            this.handleClose()
          }
        })
      },
      platformWithdrawalOthers() {
        platformWithdrawalOthers(this.form).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.$parent.fetchPlatformSummary()
            this.handleClose()
          }
        })
      },
      handleSubmit() {
        this.$refs.form.validate(validate => {
          if (validate) {
            const accountType = AccountTypes.filter(item => item.value === this.form.accountType)[0].label
            this.$confirm(`确定要从【${accountType}】提现【${this.form.auditAmount}】元吗？`, '平台账户提现', {
              confirmButtonText: '确定提现',
              cancelButtonText: '暂不提现'
            }).then(() => {
              if ([1, 2].includes(this.form.accountType)) {
                this.platformWithdrawalOthers()
              } else {
                this.platformWithdrawalTongLian()
              }
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
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
