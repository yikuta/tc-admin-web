<template>
  <div class="app-container">
    <search-form
      :buttons="['reset', 'search']"
      :formConfig="listForm"
      :form="form"
      @change="handleSearch"
    ></search-form>
    <!-- <div class="total-amount">
       <el-button class="multiple-audits" type="primary" size="mini">批量审核</el-button>
       <span>待付款金额：￥{{waitAmount}}（含提现状态为待付款、付款失败的金额）</span>
     </div>-->
    <base-table
      :list="list"
      :pagination="pagination"
      :columns="listTableColumns"
      @change="handleTableChange"
    >
      <el-table-column slot="operates" label="操作" width="130px">
        <template slot-scope="{ row }">
          <el-button v-if="row.auditStatus.value === 1" type="text" v-np="'GPR_SUBSIDY_AUDIT'" @click="handleCheckShopList(row)">审核</el-button>
          <el-button type="text" v-np="'COMMON_OPERATE_LOG'" @click="handleCheckLogs(row)">操作日志</el-button>
        </template>
      </el-table-column>
    </base-table>
    <form-dialog :visible.sync="dialogVisible" :id="currentRow.id"/>
  </div>
</template>
<script>
  import { mergeObject, filterEmptyParams } from '@/utils/util'
  import { listForm, listTableColumns } from './const/list'
  import { fetchFinancialLeaderAuditList, fetchFinancialLeaderSubsidyAuditList } from '@/api/financial/leader'

  export default {
    name: 'LeaderSubsidy',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      FormDialog: () => import('./templates/FormDialog')
    },
    data() {
      return {
        listForm,
        listTableColumns,
        form: {
          regimentalCode: { value: '' },
          phoneNumber: { value: '' },
          auditStatus: { value: '' },
          name: { value: '' }
        },
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: [],
        dialogVisible: false,
        currentRow: {},
        waitAmount: 0
      }
    },
    mounted() {
      this.handleSearchAll()
    },
    methods: {
      getSearchData() {
        const { regimentalCode, phoneNumber, name, auditStatus } = this.form
        return filterEmptyParams({
          financeAuditType: 'SUBSIDY',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          regimentalCode: regimentalCode.value,
          phoneNumber: phoneNumber.value,
          auditStatus: auditStatus.value,
          name: name.value
        })
      },
      handleSearchAll() {
        const postData = this.getSearchData()
        // this.fetchWaitPayAmount(postData)
        this.fetchTableList(postData)
      },
      fetchWaitPayAmount(params) {
        fetchFinancialLeaderSubsidyAuditList(params).then(res => {
          if (res.code === 200) {
            this.waitAmount = res.result
          }
        })
      },
      fetchTableList(params) {
        fetchFinancialLeaderAuditList(params).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
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
          name: 'leaderSubsidyLogs',
          query: { id: row.id }
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
