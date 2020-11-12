<template>
  <div class="app-container">
    <search-form
      :buttons="['reset', 'search']"
      :formConfig="detailSearchForm"
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
          v-np="'PLATFORM_FINANCE_EXPORT'"
          @click="handleOperatesChange('export')"
        >导出查询结果</el-button>
      </template>
    </search-form>

    <div class="describe-table">
      <el-row>
        <el-col :span='18'>
          销售收入：¥ {{collection.income4Sale}}   （爆品预售：¥ {{collection.income4ExplosivePreSale}}      快递到家：¥ {{collection.income4HomeDelivery}}    商家采购：¥ {{collection.income4BusinessPurchase}}）
        </el-col>
      </el-row>
      <el-row>
        <el-col :span='6' v-for="(item, index) in describeTable" :key="index">
          {{item.title}} ¥ {{collection[item.prop]}}
        </el-col>
      </el-row>
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
  </div>
</template>
<script>
  import { mergeObject, filterEmptyParams } from '@/utils/util'
  import { detailSearchForm, detailTableColumns, describeTable } from './const/platform'
  import { fetchPlatformList, fetchPlatformCollection, fetchFinancialPlatformExportDetail } from '@/api/financial/platform'

  export default {
    name: 'PlatformDetail',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      DateRange: () => import('../../templates/DateRange')
    },
    data() {
      return {
        detailSearchForm,
        describeTable,
        detailTableColumns,
        form: {
          transactionType: { value: '' },
          businessType: { value: '' },
          orderType: { value: '' },
          orderNum: { value: '' },
          targetAccount: { value: '' },
          targetCode: { value: '' },
          targetName: { value: '' },
          createOrderBeginTime: { value: '' },
          createOrderEndTime: { value: '' },
          createBeginTime: { value: '' },
          createEndTime: { value: '' },
          accountType: { value: '' }
        },
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: [],
        collection: {}
      }
    },
    mounted() {
      const accountType = this.$route.query.accountType
      if (accountType) {
        this.form.accountType.value = Number(accountType)
      }
      this.fetchAllList()
    },
    methods: {
      getParams() {
        const {
          transactionType, businessType, orderType, orderNum, targetAccount,
          targetCode, targetName, createOrderBeginTime, createOrderEndTime,
          createBeginTime, createEndTime, accountType
        } = this.form
        return filterEmptyParams({
          transactionType: transactionType.value,
          businessType: businessType.value,
          orderType: orderType.value,
          orderNum: orderNum.value,
          targetAccount: targetAccount.value,
          targetCode: targetCode.value,
          targetName: targetName.value,
          createOrderBeginTime: createOrderBeginTime.value,
          createOrderEndTime: createOrderEndTime.value,
          createBeginTime: createBeginTime.value,
          createEndTime: createEndTime.value,
          accountType: accountType.value,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        })
      },
      fetchAllList() {
        const params = this.getParams()
        this.fetchPlatformCollection(params)
        this.fetchTableList(params)
      },
      fetchPlatformCollection(params) {
        fetchPlatformCollection(params).then(res => {
          if (res.code === 200) {
            this.collection = res.result
          }
        })
      },
      fetchTableList(params) {
        fetchPlatformList(params).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
            this.pagination.total = res.result.totalCount
          }
        })
      },
      handleSearch(type) {
        if (type === 'search') {
          this.pagination.pageNo = 1
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
      },
      handleOperatesChange(type) {
        if (type === 'export') {
          fetchFinancialPlatformExportDetail(this.getParams()).then(res => {
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
