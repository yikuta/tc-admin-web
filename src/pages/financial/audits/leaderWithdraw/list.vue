<template>
  <div class="app-container">
    <search-form
      :buttons="['reset', 'search']"
      :formConfig="listForm"
      :form="form"
      @change="handleSearch"
    >
      <template slot="createTime">
        <date-range
          label="申请时间"
          prop="createTime"
          :startTime.sync="form.createBeginTime.value"
          :endTime.sync="form.createEndTime.value"
        />
      </template>
    </search-form>
    <div class="total-amount">
      <el-button class="multiple-audits" type="primary" size="mini" v-np="'GPR_WITHDRAW_BATCH_AUDIT'" @click="handleOpenMultiple">批量审核</el-button>
      <span>待付款金额：￥{{collection}}（含提现状态为待付款、付款失败的金额）</span>
    </div>
    <base-table
      :list="list"
      :pagination="pagination"
      :columns="listTableColumns"
      @change="handleTableChange"
      @selection-change="handleSelectionChange"
      :selection="true"
      :selectableCallback="selectableCallback"
    >
      <el-table-column slot="operates" label="操作" width="220px">
        <template slot-scope="{ row }">
          <el-button type="text" v-if="row.auditStatus && row.auditStatus.value === 1" v-np="'GPR_WITHDRAW_AUDIT'" @click="handleCheckAudit(row)">审核</el-button>
          <el-button type="text" v-if="row.handleStatus && row.handleStatus.value === 14" v-np="'GPR_WITHDRAW_RETRY'" @click="handleRetryAudit(row)">重试</el-button>
          <el-button type="text" v-if="row.handleStatus && row.handleStatus.value === 14" v-np="'GPR_WITHDRAW_REJECT'" @click="handleRejectAudit(row)">驳回</el-button>
          <el-button type="text" v-np="'FIN_REGIMENTAL_CASTOUT_RECORD'" @click="handleCheckDetail(row)">详情</el-button>
          <el-button type="text" v-np="'COMMON_OPERATE_LOG'" @click="handleCheckLogs(row)">操作日志</el-button>
        </template>
      </el-table-column>
    </base-table>
    <form-dialog
      :visible.sync="dialogVisible"
      :row="currentRow"
    ></form-dialog>
    <multiple-dialog
      :visible.sync="mDialogVisible"
      :selectionRows="selectionKeys"
    ></multiple-dialog>
    <reject-dialog
      :visible.sync="rejectDialogVisible"
      :row="currentRow"
    ></reject-dialog>
  </div>
</template>
<script>
  import { mergeObject, filterEmptyParams } from '@/utils/util'
  import { listForm, listTableColumns } from './const'
  import { fetchFinancialLeaderCashOutList, fetchFinancialLeaderCashOutCollection, retryLeaderAuditCashOut } from '@/api/financial/leader'
  export default {
    name: 'AuditList',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      DateRange: () => import('../../templates/DateRange'),
      FormDialog: () => import('./templates/FormDialog'),
      MultipleDialog: () => import('./templates/MultipleAuditDialog'),
      RejectDialog: () => import('./templates/RejectAuditDialog')
    },
    data() {
      return {
        listForm,
        listTableColumns,
        form: {
          phoneNumber: { value: '', matchType: 'EQUAL', tempType: 'String' },
          regimentalCode: { value: '', matchType: 'EQUAL', tempType: 'String' },
          name: { value: '', matchType: 'CONTAIN', tempType: 'String' },
          auditStatus: { value: '', matchType: 'EQUAL', tempType: 'Number' },
          handleStatus: { value: '', matchType: 'EQUAL', tempType: 'Number' },
          createBeginTime: { value: '' },
          createEndTime: { value: '' }
        },
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: [],
        selectionKeys: [],
        currentRow: {},
        collection: 0,
        mDialogVisible: false,
        dialogVisible: false,
        rejectDialogVisible: false
      }
    },
    mounted() {
      this.fetchAllList()
    },
    methods: {
      fetchAllList() {
        const params = this.getParams()
        this.fetchFinancialCashOutCollection(params)
        this.fetchTableList(params)
      },
      getParams() {
        const { phoneNumber, regimentalCode, name, auditStatus, handleStatus, createBeginTime, createEndTime } = this.form
        return filterEmptyParams({
          phoneNumber: phoneNumber.value,
          regimentalCode: regimentalCode.value,
          name: name.value,
          auditStatus: auditStatus.value,
          handleStatus: handleStatus.value,
          createBeginTime: createBeginTime.value,
          createEndTime: createEndTime.value,
          pageSize: this.pagination.pageSize,
          pageNo: this.pagination.pageNo
        })
      },
      fetchTableList(params) {
        fetchFinancialLeaderCashOutList(params).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
            this.pagination.total = res.result.totalCount
          }
        })
      },
      fetchFinancialCashOutCollection(params) {
        fetchFinancialLeaderCashOutCollection(params).then(res => {
          if (res.code === 200) {
            this.collection = res.result
          }
        })
      },
      selectableCallback(row) {
        return row.auditStatus.value === 1
      },
      handleSearch(type) {
        if (type === 'search') {
          this.fetchAllList()
        } else if (type === 'reset') {
          this.pagination.pageNo = 1
          for (let key in this.form) {
            if (this.form[key]) {
              this.form[key].value = ''
            }
          }
          this.fetchAllList()
        }
      },
      handleCheckAudit(row) {
        this.dialogVisible = true
        this.currentRow = row
      },
      handleRejectAudit(row) {
        this.rejectDialogVisible = true
        this.currentRow = row
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchAllList()
      },
      handleCheckDetail(row) {
        this.$router.push({
          name: 'leaderWithdrawDetail',
          query: { id: row.id }
        })
      },
      handleCheckLogs(row) {
        this.$router.push({
          name: 'leaderWithdrawLogs',
          query: { id: row.id }
        })
      },
      handleSelectionChange(value) {
        this.selectionKeys = value
      },
      handleOpenMultiple() {
        if (this.selectionKeys.length) {
          this.mDialogVisible = true
        } else {
          this.$message.error('请至少选择一项')
        }
      },
      handleRetryAudit(row) {
        this.$confirm('重试之前请先确认相应的失败原因已处理，确认要重试吗？', '提现付款重试', {
          confirmButtonText: '确定重试',
          cancelButtonText: '我再想想'
        }).then(() => {
          retryLeaderAuditCashOut({ id: row.id, loginUserDto: [] }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.fetchAllList()
            }
          })
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .total-amount {
    color: #666;
    font-size: 14px;
    line-height: 30px;
    padding: 10px 0;
  }

  .multiple-audits {
    display: inline-block;
    margin-right: 20px;
  }
</style>
