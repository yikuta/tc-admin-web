<template>
  <div class="app-container">
    <search-form
      :buttons="['reset', 'search']"
      :formConfig="listSearchForm"
      :form="form"
      @change="handleSearch"
    >
      <template slot="createTime">
        <date-range
          label="提现日期"
          prop="createTime"
          :startTime.sync="form.createBeginTime.value"
          :endTime.sync="form.createEndTime.value"
        />
      </template>
    </search-form>
    <base-table
      :list="list"
      :pagination="pagination"
      :columns="listTableColumns"
      @change="handleTableChange"
      @selection-change="handleSelectionChange"
      :selection="true"
    ></base-table>
    <div class="annotation">
      *注：
      <ul>
        <li>1、本页面只展示通联营销账户、通联余额账户的提现记录；</li>
        <li>2、只作记录的提现不在本页面展示；</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { mergeObject, filterEmptyParams } from '@/utils/util'
  import { listSearchForm, listTableColumns } from './const'
  import { fetchFinancialLeaderCashOutList } from '@/api/financial/leader'
  export default {
    name: 'AuditList',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      DateRange: () => import('../../templates/DateRange')
    },
    data() {
      return {
        listSearchForm,
        listTableColumns,
        form: {
          phoneNumber: { value: '', matchType: 'EQUAL', tempType: 'String' },
          regimentalCode: { value: '', matchType: 'EQUAL', tempType: 'String' },
          createBeginTime: { value: '' },
          createEndTime: { value: '' }
        },
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        selectionKeys: [],
        list: []
      }
    },
    mounted() {
      this.fetchAllList()
    },
    methods: {
      fetchAllList() {
        const params = this.getParams()
        this.fetchTableList(params)
      },
      getParams() {
        const { phoneNumber, regimentalCode, createBeginTime, createEndTime } = this.form
        return filterEmptyParams({
          phoneNumber: phoneNumber.value,
          regimentalCode: regimentalCode.value,
          createBeginTime: createBeginTime.value,
          createEndTime: createEndTime.value
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
      handleSearch(type) {
        if (type === 'search') {
          this.fetchAllList()
        } else if (type === 'reset') {
          this.pagination.pageNo = 1
          for (let key in this.form) {
            if (this.form[key]) {
              this.form[key].value = ''
            } else {
              this.form[key] = ''
            }
          }
          this.fetchAllList()
        }
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchAllList()
      },
      handleSelectionChange(value) {
        this.selectionKeys = value
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

  .annotation {
    font-size: 14px;
    line-height: 30px;

    ul {
      color: #666;
      list-style: none;
      margin-top: 0;

      .red-color {
        color: #F56C6C;
      }
    }
  }
</style>
