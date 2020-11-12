<template>
  <div class="app-container">
    <div class="describe-header" style="padding: 0 20px">
      <el-row>
        <el-col :span='8' v-for="(item, index) in describeHeader" :key="index">
          {{item.title}} {{collection[item.prop]}}
        </el-col>
      </el-row>
    </div>

    <search-form
      :buttons="['reset', 'search']"
      :formConfig="detailForm"
      :form="form"
      @change="handleSearch"
    >
      <template slot="createDate">
        <date-range
          label="交易日期"
          prop="createDate"
          :startTime.sync="form.createBeginTime"
          :endTime.sync="form.createEndTime"
        />
      </template>
      <template slot="orderDate">
        <date-range
          label="下单日期"
          prop="orderDate"
          :startTime.sync="form.createOrderBeginTime"
          :endTime.sync="form.createOrderEndTime"
        ></date-range>
      </template>
      <template slot="more-operates">
        <el-button
          type="primary"
          icon="el-icon-download"
          size="mini"
          v-np="'GPR_FI_DTL_EXPORT'"
          @click="handleOperatesChange('export')"
        >导出查询结果</el-button>
        <el-button
          type="primary"
          size="mini"
          v-np="'GPR_SUBSIDY_CREATE'"
          @click="handleOperatesChange('add')"
        >补贴团长</el-button>
      </template>
    </search-form>

    <div class="describe-table">
      <dl>
        <dt>查询统计</dt>
        <dd>
          <el-row>
            <el-col :span='8' v-for="(item, index) in describeTable" :key="index">
              {{item.title}} ￥{{collection[item.prop]}}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span='8' v-for="(item, index) in describeTable1" :key="index">
              {{item.title}} ￥{{collection[item.prop]}}
            </el-col>
          </el-row>
        </dd>
      </dl>
    </div>

    <base-table
      :list="list"
      :pagination="pagination"
      :columns="detailTableColumns"
      @change="handleTableChange"
    >
      <template slot="orderNum" slot-scope="{ row, index, column }">
        <el-link type="primary" @click="handleNavigateTo(row)">{{row['orderNum']}}</el-link>
      </template>
    </base-table>
    <form-dialog
      :visible.sync="dialogVisible"
      :regimentalCode="regimentalCode"
      :collection="collection"
    ></form-dialog>
  </div>
</template>
<script>
  import { mergeObject, filterEmptyParams, deepClone } from '@/utils/util'
  import { describeHeader, detailForm, detailTableColumns, describeTable, describeTable1 } from './const/detail'
  import { fetchFinancialLeaderDetail, exportFinancialLeaderDetail, fetchFinancialLeaderDetailCollection } from '@/api/financial/leader'

  const initForm = {
    transactionType: { value: '' }, // 测试
    regimentalBusinessType: { value: '' }, // 业务类型
    orderType: { value: '' }, // 订单类型
    orderNum: { value: '' },
    createBeginTime: '',
    createEndTime: '',
    createOrderBeginTime: '',
    createOrderEndTime: ''
  }

  export default {
    name: 'ShopFundDetail',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      FormDialog: () => import('./templates/FormDialog'),
      DateRange: () => import('../../templates/DateRange')
    },
    data() {
      return {
        detailForm,
        describeHeader,
        describeTable,
        describeTable1,
        detailTableColumns,
        regimentalCode: null,
        form: deepClone(initForm),
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: [],
        collection: {},
        dialogVisible: false
      }
    },
    mounted() {
      this.regimentalCode = this.$route.query.regimentalCode
      this.searchTableList()
    },
    methods: {
      getParams() {
        const {
          transactionType, regimentalBusinessType, orderType,
          orderNum, createBeginTime, createEndTime,
          createOrderBeginTime, createOrderEndTime
        } = this.form
        return filterEmptyParams({
          regimentalCode: this.regimentalCode,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          createBeginTime, createEndTime, createOrderBeginTime, createOrderEndTime,
          orderNum: orderNum.value,
          orderType: orderType.value,
          regimentalBusinessType: regimentalBusinessType.value,
          transactionType: transactionType.value
        })
      },
      fetchFinancialCollection(params) {
        fetchFinancialLeaderDetailCollection(params).then(res => {
          if (res.code === 200) {
            this.collection = res.result
          }
        })
      },
      fetchTableList(params) {
        fetchFinancialLeaderDetail(params).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
            this.pagination.total = res.result.totalCount
          }
        })
      },
      handleOperatesChange(type) {
        if (type === 'add') {
          this.dialogVisible = true
        } else if (type === 'export') {
          exportFinancialLeaderDetail(this.getParams()).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
            }
          })
        }
      },
      searchTableList() {
        const params = this.getParams()
        this.fetchFinancialCollection(params)
        this.fetchTableList(params)
      },
      handleSearch(type) {
        if (type === 'search') {
          this.pagination.pageNo = 1
          this.searchTableList()
        } else if (type === 'reset') {
          this.pagination.pageNo = 1
          this.form = deepClone(initForm)
          this.searchTableList()
        }
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchTableList()
      },
      handleNavigateTo(row) {
        let pathName = 'expressServiceDetail'
        switch (row.orderType.value) {
          // 快递到家
          case 1: pathName = 'expressServiceDetail'; break
          // 爆品预售
          case 2: pathName = 'productPreSaleDetail'; break
          // 商家自营
          case 3: pathName = 'merchantOwnedDetail'; break
          // 商家采购
          case 4: pathName = 'procurementDetail'; break
        }
        this.$router.push({
          name: pathName,
          query: { orderNum: row.orderNum }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
  .describe-header {
    padding: 4px 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e4e4e4;
    color: #606266;
    line-height: 40px;
    font-size: 14px;
    background: #f9fafc;
  }

  .describe-table {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 1px solid #e4e4e4;
    color: #606266;
    line-height: 40px;
    font-size: 14px;

    dl {
      margin: 0;
      display: grid;
      grid-template-columns: 150px 1fr;
      min-height: 40px;

      dt {
        width: 150px;
        padding: 12px 20px;
        border-right: 1px solid #e4e4e4;
        text-align: center;
        background: #f9fafc;
        color: #909399;
        font-weight: bold;
        display: grid;
        align-items: center;
      }

      dd {
        margin: 0;
        padding: 12px 20px;
        color: #606266;
      }
    }
  }
</style>
