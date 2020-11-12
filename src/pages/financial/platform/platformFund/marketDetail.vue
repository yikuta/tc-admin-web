<template>
  <div class="app-container">
    <search-form
      :buttons="['reset', 'search']"
      :formConfig="marketSearchForm"
      :form="form"
      @change="handleSearch"
    >
      <template slot="createTime">
        <date-range
          label="交易日期"
          prop="createTime"
          :startTime.sync="form.createBeginTime.value"
          :endTime.sync="form.createEndTime.value"
        />
      </template>
      <template slot="createOrderTime">
        <date-range
          label="下单日期"
          prop="createOrderTime"
          :startTime.sync="form.createOrderBeginTime.value"
          :endTime.sync="form.createOrderEndTime.value"
        />
      </template>
      <template slot="more-operates">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          v-np="'MARKETING_FINANCE_EXPORT'"
          @click="handleOperatesChange('export')"
        >导出查询结果</el-button>
      </template>
    </search-form>

    <base-table
      :list="list"
      :pagination="pagination"
      :columns="marketTableColumns"
      @change="handleTableChange"
    >
      <template slot="orderNum" slot-scope="{ row, index, column }">
        <el-link type="primary" @click="handleNavigateTo(row)">{{row['orderNum']}}</el-link>
      </template>
    </base-table>
  </div>
</template>
<script>
  import { mergeObject, filterEmptyParams } from '@/utils/util'
  import { marketSearchForm, marketTableColumns } from './const/market'
  import { fetchPlatformMarketList, fetchFinancialPlatformMarketingExportDetail } from '@/api/financial/platform'

  export default {
    name: 'ShopFundDetail',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      DateRange: () => import('../../templates/DateRange')
    },
    data() {
      return {
        marketSearchForm,
        marketTableColumns,
        form: {
          transactionType: { value: '' },
          businessType: { value: '' },
          orderType: { value: '' },
          orderNum: { value: '' },
          targetAccount: { value: '' },
          targetCode: { value: '' },
          targetName: { value: '' },
          createBeginTime: { value: '' },
          createEndTime: { value: '' },
          createOrderBeginTime: { value: '' },
          createOrderEndTime: { value: '' }
        },
        pagination: {
          total: 0,
          pageSize: 10,
          pageNo: 1
        },
        list: []
      }
    },
    mounted() {
      this.fetchAllList()
    },
    methods: {
      getParams() {
        const {
          transactionType, businessType, orderType, orderNum, targetAccount,
          targetCode, targetName, createOrderBeginTime, createOrderEndTime,
          createBeginTime, createEndTime
        } = this.form
        return filterEmptyParams({
          transactionType: transactionType.value,
          businessType: businessType.value,
          orderType: orderType.value,
          orderNum: orderNum.value,
          targetAccount: targetAccount.value,
          targetCode: targetCode.value,
          targetName: targetName.value,
          createBeginTime: createBeginTime.value,
          createEndTime: createEndTime.value,
          createOrderBeginTime: createOrderBeginTime.value,
          createOrderEndTime: createOrderEndTime.value,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        })
      },
      fetchAllList() {
        this.fetchTableList()
      },
      // 获取列表
      fetchTableList() {
        fetchPlatformMarketList(this.getParams()).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
            this.pagination.total = res.result.totalCount
          }
        })
      },
      handleSearch(type) {
        if (type === 'search') {
          this.fetchAllList()
        } else if (type === 'reset') {
          for (let key in this.form) {
            this.form[key].value = ''
          }
          this.pagination.pageNo = 1
          this.fetchAllList()
        }
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchAllList()
      },
      handleOperatesChange(type) {
        if (type === 'export') {
          fetchFinancialPlatformMarketingExportDetail(this.getParams()).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
            }
          })
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  .describe-table {
    padding: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px solid #e4e4e4;
    line-height: 40px;
    font-size: 14px;
    color: #909399;
    /*color: #606266;*/
  }
</style>
