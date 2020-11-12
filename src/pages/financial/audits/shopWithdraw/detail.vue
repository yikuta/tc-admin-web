<template>
  <div class="app-container">
    <el-row style="padding-bottom: 20px;font-size: 15px;">
      <el-col :span="8">审核状态：{{detail.auditStatus && detail.auditStatus.describe}}</el-col>
      <el-col :span="8">提现状态：{{detail.handleStatus && detail.handleStatus.describe}}</el-col>
    </el-row>
    <section>
      <div class="header">
        <h4 class="title">商家信息</h4>
      </div>
      <el-row :gutter="20" class="desc-list">
        <el-col :span="8" class="desc-item">
          <span class="label">商家账号：</span>
          <span class="content">{{detail.bossAccount}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">商家姓名：</span>
          <span class="content">{{detail.legalPersonName}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">门店编码：</span>
          <span class="content">{{detail.shopCode}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">门店名称：</span>
          <span class="content">{{detail.shopName}}</span>
        </el-col>
      </el-row>
    </section>
    <section>
      <div class="header">
        <h4 class="title">账户信息</h4>
      </div>
      <el-row :gutter="20" class="desc-list">
        <el-col :span="8" class="desc-item">
          <span class="label">账户余额：</span>
          <span class="content">¥ {{detail.balance}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">可提现金额：</span>
          <span class="content">¥ {{detail.castOutAmount}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">冻结金额：</span>
          <span class="content">¥ {{detail.frozenAmount}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">待结算金额：</span>
          <span class="content">¥ {{detail.pendingAmount}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">累积收入：</span>
          <span class="content">¥ {{detail.totalIncome}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">累积支出：</span>
          <span class="content">¥ {{detail.totalExpenses}}</span>
        </el-col>
      </el-row>
    </section>
    <section>
      <div class="header">
        <h4 class="title">提现信息</h4>
      </div>
      <el-row :gutter="20" class="desc-list">
        <el-col :span="8" class="desc-item">
          <span class="label">申请时间：</span>
          <span class="content">{{detail.createTime}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">提现金额：</span>
          <span class="content">¥ {{detail.auditAmount}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">到账金额：</span>
          <span class="content">¥ {{detail.auditAmount}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">提现手续费：</span>
          <span class="content">¥ {{detail.feeAmount}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">收款户名：</span>
          <span class="content">{{detail.username}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">银行账号：</span>
          <span class="content">{{detail.bankAccount}}</span>
        </el-col>

        <el-col :span="8" class="desc-item">
          <span class="label">收款银行：</span>
          <span class="content">{{detail.bankName}}</span>
        </el-col>
      </el-row>
    </section>
    <el-button
      type="primary"
      size="small"
      @click="handleAudit"
      v-if="detail.auditStatus && detail.auditStatus.value === 1"
      style="position: relative;left: 50%;margin-left: -30px;"
    >审  核</el-button>
    <form-dialog
      :visible.sync="dialogVisible"
      :row="detail"
      origin="detail"
    ></form-dialog>
  </div>
</template>
<script>
  import { fetchAuditCashOutDetail } from '@/api/financial/shop'
  export default {
    name: 'ShopWithdrawDetail',
    components: {
      FormDialog: () => import('./templates/FormDialog')
    },
    data() {
      return {
        id: null,
        detail: {},
        dialogVisible: false
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.fetchAuditCashOutDetail()
    },
    methods: {
      fetchAuditCashOutDetail() {
        fetchAuditCashOutDetail({ id: this.id }).then(res => {
          if (res.code === 200) {
            this.detail = res.result
          }
        })
      },
      handleAudit() {
        this.dialogVisible = true
      }
    }
  }
</script>
<style scoped lang="scss">

  section {
    padding-bottom: 10px;

    .header {
      padding-bottom: 16px;

      .title {
        font-weight: 500;
        display: inline-block;
        line-height: 20px;
        margin: 0 5px 0 6px;
        vertical-align: middle;
      }

      &:before {
        content: '';
        width: 4px;
        height: 16px;
        background-color: #00a0e9;
        display: inline-block;
        vertical-align: middle;
      }
    }
  }
</style>
