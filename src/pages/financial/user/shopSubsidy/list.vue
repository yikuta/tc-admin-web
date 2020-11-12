<template>
  <div class="app-container">
    <search-form
      :buttons="['reset', 'search']"
      :formConfig="listForm"
      :form="form"
      @change="handleSearch"
    ></search-form>
    <div class="total-amount">
      <span>待付款金额：￥{{waitAmount}}（含提现状态为待付款、付款失败的金额）</span>
    </div>
    <base-table
      :list="list"
      :pagination="pagination"
      :columns="tableColumns"
      :key="id"
      @change="handleTableChange"
    >
      <el-table-column slot="operates" label="操作" width="180px">
        <template slot-scope="{ row }">
          <el-button v-if="row.auditStatus && row.auditStatus.value === 1" type="text" v-np="'SHOP_SUBSIDY_REC_ADT'" @click="handleCheckShopList(row)">审核</el-button>
          <el-button v-if="row.handleStatus && row.handleStatus.value === 14" type="text" v-np="'SHOP_PAY_ADT_RETRY'" @click="handleCheckRetry(row)">重试</el-button>
          <el-button type="text" v-if="row.handleStatus && row.handleStatus.value === 14" v-np="'SHOP_PAY_ADT_REJECT'" @click="handleRejectAudit(row)">驳回</el-button>
          <el-button type="text" v-np="'COMMON_OPERATE_LOG'" @click="handleCheckLogs(row)">操作日志</el-button>
        </template>
      </el-table-column>
    </base-table>
    <form-dialog :visible.sync="dialogVisible" :id="currentRow.id"/>
    <reject-dialog
      :visible.sync="rejectDialogVisible"
      :row="currentRow"
    ></reject-dialog>
  </div>
</template>
<script>
  import { mergeObject, filterEmptyParams } from '@/utils/util'
  import { listForm, tableColumns } from './const/list'
  import { fetchFinancialShopAuditList, fetchFinancialShopSubsidyAuditList, retryShopAuditCashOut } from '@/api/financial/shop'

  export default {
    name: 'ShopSubsidy',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      FormDialog: () => import('./templates/FormDialog'),
      RejectDialog: () => import('./templates/RejectAuditDialog')
    },
    data() {
      return {
        listForm,
        tableColumns,
        form: {
          bossAccount: { value: '' },
          shopCode: { value: '' },
          auditStatus: { value: '' },
          shopName: { value: '' },
          handleStatus: { value: '' }
        },
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: [],
        dialogVisible: false,
        rejectDialogVisible: false,
        currentRow: {},
        waitAmount: 0
      }
    },
    mounted() {
      this.handleSearchAll()
    },
    methods: {
      getSearchData() {
        const { bossAccount, shopCode, auditStatus, shopName, handleStatus } = this.form
        return filterEmptyParams({
          financeAuditType: 'SUBSIDY',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          bossAccount: bossAccount.value,
          shopCode: shopCode.value,
          auditStatus: auditStatus.value,
          shopName: shopName.value,
          handleStatus: handleStatus.value
        })
      },
      handleSearchAll() {
        const postData = this.getSearchData()
        this.fetchWaitPayAmount(postData)
        this.fetchTableList(postData)
      },
      fetchWaitPayAmount(params) {
        fetchFinancialShopSubsidyAuditList(params).then(res => {
          if (res.code === 200) {
            this.waitAmount = res.result
          }
        })
      },
      fetchTableList(params) {
        fetchFinancialShopAuditList(params).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
            this.pagination.total = res.result.totalCount
          }
        })
      },
      handleSearch(type) {
        if (type === 'search') {
          this.handleSearchAll()
        } else if (type === 'reset') {
          this.pagination.pageNo = 1
          for (let key in this.form) {
            this.form[key].value = ''
          }
          this.handleSearchAll()
        }
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.handleSearchAll()
      },
      handleCheckLogs(row) {
        this.$router.push({
          name: 'shopSubsidyLogs',
          query: { id: row.id }
        })
      },
      // 驳回
      handleRejectAudit(row) {
        this.rejectDialogVisible = true
        this.currentRow = row
      },
      // 重试
      handleCheckRetry(row) {
        this.$confirm(
          '重试之前请先确认相应的失败原因已处理，确认要重试吗？',
          '补贴付款重试',
          {
            confirmButtonText: '确认重试',
            cancelButtonText: '我再想想'
          }).then(() => {
          retryShopAuditCashOut({ id: row.id, loginUserDto: [] }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.fetchAllList()
            }
          })
        })
      },
      handleCheckShopList(row) {
        this.currentRow = row
        this.dialogVisible = true
      }
    }
  }
</script>
<style scoped lang="scss">
  .total-amount {
    color: #333;
    font-size: 15px;
    line-height: 30px;
    padding: 10px 0;
  }
</style>
