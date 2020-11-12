<template>
  <div class="app-container">
    <search-form
      :buttons="['reset', 'search']"
      :formConfig="listForm"
      :form="form"
      @change="handleSearch"
    ></search-form>
    <base-table
      :list="list"
      :pagination="pagination"
      :columns="listTableColumns"
      @change="handleTableChange"
    >
      <template slot="totalIncome" slot-scope="{ row, index, column }">
        <el-link type="primary" @click="handleNavigateTo(row)">￥{{row['totalIncome']}}</el-link>
      </template>
      <template slot="totalExpenses" slot-scope="{ row, index, column }">
        <el-link type="primary" @click="handleNavigateTo(row)">￥{{row['totalExpenses']}}</el-link>
      </template>
      <template slot="balance" slot-scope="{ row, index, column }">
        <el-link type="primary" @click="handleNavigateTo(row)">￥{{row['balance']}}</el-link>
      </template>
      <template slot="pendingAmount" slot-scope="{ row, index, column }">
        <el-link type="primary" @click="handleNavigateTo(row)">￥{{row['pendingAmount']}}</el-link>
      </template>
      <template slot="castOutAmount" slot-scope="{ row, index, column }">
        <el-link type="primary" @click="handleNavigateTo(row)">￥{{row['castOutAmount']}}</el-link>
      </template>
      <template slot="frozenAmount" slot-scope="{ row, index, column }">
        <el-link type="primary" @click="handleNavigateToFrozen(row)">￥{{row['frozenAmount']}}</el-link>
      </template>
    </base-table>
    <div class="annotation">
      *标注说明：
      <ul>
        <li>1、账户余额=累计收入-累计支出；</li>
        <li>2、账户余额=待结算金额+可提现金额+冻结金额；</li>
        <li>3、待结算金额为已进入门店资金账户，但还没有过D+3提现日期的金额；</li>
        <li>4、待结算金额为已进入门店资金账户，但还没有过D+3提现日期的金额；</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { fetchFinancialShopList } from '@/api/financial/shop'
  import { mergeObject } from '@/utils/util'
  import { listForm, listTableColumns } from './const/list'
  import searchFormat from '@/utils/searchFormat'

  export default {
    name: 'ShopFund',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable')
    },
    data() {
      return {
        listForm,
        listTableColumns,
        form: {
          bossAccount: { value: '', matchType: 'EQUAL', tempType: 'String' },
          shopCode: { value: '', matchType: 'EQUAL', tempType: 'String' },
          name: { value: '', matchType: 'CONTAIN', tempType: 'String' },
          provinceId: { value: '', matchType: 'EQUAL', tempType: 'Number' },
          cityId: { value: '', matchType: 'EQUAL', tempType: 'Number' },
          districtId: { value: '', matchType: 'EQUAL', tempType: 'Number' },
          address: { value: '' }
        },
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: []
      }
    },
    mounted() {
      this.fetchTableList()
    },
    methods: {
      fetchTableList() {
        const { bossAccount, shopCode, name, provinceId, cityId, districtId, address } = this.form
        provinceId.value = address.value[0]
        cityId.value = address.value[1]
        districtId.value = address.value[2]
        const searches = searchFormat({
          bossAccount, shopCode, name, provinceId, cityId, districtId
        })
        fetchFinancialShopList({
          searchs: searches.length ? JSON.stringify(searches) : null,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
            this.pagination.total = res.result.totalCount
          }
        })
      },
      handleSearch(type) {
        if (type === 'search') {
          this.fetchTableList()
        } else if (type === 'reset') {
          this.form = {
            bossAccount: { value: '', matchType: 'EQUAL', tempType: 'String' },
            shopCode: { value: '', matchType: 'EQUAL', tempType: 'String' },
            name: { value: '', matchType: 'CONTAIN', tempType: 'String' },
            provinceId: { value: '', matchType: 'EQUAL', tempType: 'Number' },
            cityId: { value: '', matchType: 'EQUAL', tempType: 'Number' },
            districtId: { value: '', matchType: 'EQUAL', tempType: 'Number' },
            address: { value: '' }
          }
          // this.fetchTableList()
        }
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchTableList()
      },
      handleNavigateTo(row) {
        this.$router.push({
          name: 'shopFundDetail',
          query: { shopCode: row.shopCode }
        })
      },
      handleNavigateToFrozen(row) {
        this.$router.push({
          name: 'shopFundFrozenDetail',
          query: { shopCode: row.shopCode }
        })
      }
    }
  }
</script>
<style scoped lang="scss">
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
