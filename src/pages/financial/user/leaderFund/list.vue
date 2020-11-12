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
      :columns="tableColumns"
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
  </div>
</template>
<script>
  import { mergeObject } from '@/utils/util'
  import { listForm, tableColumns } from './const/list'
  import { fetchFinancialLeaderList } from '@/api/financial/leader'
  import searchFormat from '@/utils/searchFormat'

  export default {
    name: 'LeaderFund',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable')
    },
    data() {
      return {
        listForm,
        tableColumns,
        form: {
          regimentalCode: { value: '', name: 'regimentalCode', matchType: 'EQUAL', tempType: 'String' }, // 团长编码
          phoneNumber: { value: '', name: 'phoneNumber', matchType: 'EQUAL', tempType: 'String' }, // 团长账号
          name: { value: '', name: 'name', matchType: 'CONTAIN', tempType: 'String' }, // 团长名称
          provinceId: { value: '', name: 'regimentalLocation.provinceCode', matchType: 'EQUAL', tempType: 'Number' },
          cityId: { value: '', name: 'regimentalLocation.cityCode', matchType: 'EQUAL', tempType: 'Number' },
          districtId: { value: '', name: 'regimentalLocation.districtCode', matchType: 'EQUAL', tempType: 'Number' },
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
        const { regimentalCode, phoneNumber, name, provinceId, cityId, districtId, address } = this.form
        provinceId.value = address.value[0]
        cityId.value = address.value[1]
        districtId.value = address.value[2]
        const searches = searchFormat({
          regimentalCode, phoneNumber, name, provinceId, cityId, districtId
        })
        fetchFinancialLeaderList({
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
          for (let key in this.form) {
            this.form[key].value = ''
          }
          this.pagination.pageNo = 1
          this.form.address.value = []
          this.fetchTableList()
        }
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchTableList()
      },
      handleNavigateTo(row) {
        this.$router.push({
          name: 'leaderFundDetail',
          query: { regimentalCode: row.regimentalCode }
        })
      },
      handleNavigateToFrozen(row) {
        this.$router.push({
          name: 'leaderFundFrozenDetail',
          query: { regimentalCode: row.regimentalCode }
        })
      }
    }
  }
</script>
<style scoped lang="scss"></style>
