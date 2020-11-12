<template>
  <div class="app-container">
    <section>
      <div class="header">
        <h4 class="title">提现信息</h4>
      </div>
      <el-row :gutter="20" class="desc-list">
        <el-col :span="9" class="desc-item">
          <span class="label">商家账号：</span>
          <span class="content">{{detail.bossAccount}}</span>
        </el-col>

        <el-col :span="9" class="desc-item">
          <span class="label">门店编码：</span>
          <span class="content">{{detail.shopCode}}</span>
        </el-col>

        <el-col :span="9" class="desc-item">
          <span class="label">门店名称：</span>
          <span class="content">{{detail.shopName}}</span>
        </el-col>

        <el-col :span="9" class="desc-item">
          <span class="label">提现金额：</span>
          <span class="content">¥ {{detail.auditAmount}}</span>
        </el-col>
      </el-row>
    </section>
    <section>
      <div class="header">
        <h4 class="title">操作日志</h4>
      </div>
      <base-table
        :list="list"
        :pagination="pagination"
        :columns="logsTableColumns"
        @change="handleTableChange"
      ></base-table>
    </section>
  </div>
</template>
<script>
  import { mergeObject } from '@/utils/util'
  import { logsTableColumns } from './const'
  import { fetchAuditCashOutLogs } from '@/api/financial/shop'
  export default {
    name: 'ShopWithdrawLogs',
    components: {
      BaseTable: () => import('@/components/BaseTable')
    },
    data() {
      return {
        logsTableColumns,
        id: null,
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: [],
        detail: {}
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.fetchTableList()
    },
    methods: {
      fetchTableList() {
        fetchAuditCashOutLogs({ id: this.id }).then(res => {
          if (res.code === 200) {
            const { auditAmount, bossAccount, shopCode, shopName, pageObj } = res.result
            this.detail = { auditAmount, bossAccount, shopCode, shopName }
            this.list = pageObj.itemVOs
            this.pagination.total = pageObj.totalCount
          }
        })
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchTableList()
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
