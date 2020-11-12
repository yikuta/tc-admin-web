<template>
  <el-dialog
    title="门店补贴审核"
    :visible.sync="visible"
    width="500px"
    @open="handleOpen"
    @close="handleClose"
  >
    <el-form ref="dialogForm" :model="form" :rules="formRules" size="mini" label-width="80px">
      <el-form-item label="商家账号">{{collection.bossAccount}}</el-form-item>
      <el-form-item label="门店编码">{{collection.shopCode}}</el-form-item>
      <el-form-item label="门店名称">{{collection.shopName}}</el-form-item>
      <el-form-item label="申请原因">{{collection.applyReason}}</el-form-item>
      <el-form-item label="补贴金额">¥ {{collection.auditAmount}}</el-form-item>
      <el-form-item label="营销账户余额" label-width="100px">¥ {{collection.marketingBalance}}</el-form-item>
      <el-form-item label="审核结果" prop="result">
        <el-radio-group v-model="form.result">
          <el-radio v-for="item in auditStatus" :key="item.label" :label="item.value">{{item.label}}</el-radio>
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
  import { fetchShopSubsidy, auditShopSubsidy } from '@/api/financial/shop'
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
        this.fetchShopSubsidy()
      },
      fetchShopSubsidy() {
        fetchShopSubsidy({ id: this.id }).then(res => {
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
      auditShopSubsidy() {
        auditShopSubsidy({
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
      },
      handleConfirm() {
        this.$refs.dialogForm.validate(validate => {
          if (validate) {
            if (this.form.result) {
              this.$confirm(
                `审核通过后将直接从平台通联营销账户转账【${this.collection.auditAmount}】元到商家通联余额账户，确定要通过【${this.collection.shopName}】门店的补贴审核吗？`,
                '门店补贴审核',
                {
                  confirmButtonText: '通过审核',
                  cancelButtonText: '我再想想'
                }).then(() => {
                this.auditShopSubsidy()
              })
            } else {
              this.$confirm(
                `审核拒绝将举动执行任何划款操作，确定要拒绝【${this.collection.shopName}】门店的补贴申请吗？`,
                '门店补贴审核',
                {
                  confirmButtonText: '通过审核',
                  cancelButtonText: '我再想想'
                }).then(() => {
                this.auditShopSubsidy()
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
