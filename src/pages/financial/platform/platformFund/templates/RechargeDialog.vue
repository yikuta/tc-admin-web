<template>
  <el-dialog
    class="dialog-form"
    title="平台账户充值"
    :visible.sync="visible"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleClose"
    width="500"
  >
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <div class="tips">充值功能仅账户的提现记录，实际操作请财务人员登录对应的商户后台操作</div>

      <el-form-item label="充值账户" prop="accountType">
        <el-select v-model="form.accountType" placeholder="请选择充值账户" disabled>
          <el-option v-for="item in accountTypes" :key="item.key" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="充值金额" prop="auditAmount">
        <el-input v-model="form.auditAmount" autocomplete="off" placeholder="请输入充值金额" />
      </el-form-item>

      <div class="tips">单次充值不能超过100万</div>

      <el-form-item label="经办人" prop="agent">
        <el-input v-model="form.agent" autocomplete="off" placeholder="请填写实际充值的经办人姓名" />
      </el-form-item>

      <el-form-item label="充值说明" prop="instructions">
        <el-input type="textarea" :rows="4" v-model="form.instructions" autocomplete="off" placeholder="请填写充值说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleClose">我再想想</el-button>
      <el-button size="mini" type="primary" @click="handleSubmit">确定充值</el-button>
    </div>
  </el-dialog>
</template>
<script>
  import regexp from '@/constants/regexp'
  import { AccountTypes } from '../const/list'
  import { addPlatformRecharge } from '@/api/financial/platform'
  const rules = {
    accountType: [{ required: true, message: '请选择充值账户', trigger: 'blur' }],
    auditAmount: [
      { required: true, message: '请输入充值金额', trigger: 'blur' },
      { pattern: regexp.max100Money, message: '请输入正确格式金额（保留小数点后两位）', trigger: 'blur' }
    ],
    agent: [
      { required: true, message: '请填写经办人', trigger: 'blur' },
      { pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_·\u4e00-\u9fa5]{1,19}$/, message: '2～20个字符（汉字、数字、字母、下划线）', trigger: 'blur' }
    ],
    instructions: [
      { required: true, message: '请填写充值说明', trigger: 'blur' },
      { max: 200, message: '请输入200个以内任意字符~', trigger: 'blur' }
    ]
  }
  export default {
    name: 'RechargeDialog',
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
        form: {
          accountType: '',
          auditAmount: '',
          agent: '',
          instructions: ''
        }
      }
    },
    methods: {
      handleOpen() {
        this.form.accountType = this.type
      },
      handleClose() {
        this.$emit('update:visible', false)
      },
      addPlatformRecharge() {
        addPlatformRecharge(this.form).then(res => {
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
            this.$confirm(`确定要向【${accountType}】充值【${this.form.auditAmount}】元吗？`, '平台账户充值', {
              confirmButtonText: '确定充值',
              cancelButtonText: '暂不充值'
            }).then(() => {
              this.addPlatformRecharge()
            })
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
  .tips {
    margin-bottom: 14px;
    color: #c0c4cc;
    line-height: 16px;
    margin-left: 80px;
  }
</style>
