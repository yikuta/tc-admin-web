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
    ></base-table>
  </div>
</template>
<script>
  import { fetchFinancialWalletList } from '@/api/financial/shop'
  import { mergeObject } from '@/utils/util'
  import { listForm, listTableColumns } from './const'
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
          bossAccount: { value: '', name: 'shop.bossAccount', matchType: 'EQUAL', tempType: 'String' },
          shopCode: { value: '', name: 'shopCode', matchType: 'CONTAIN', tempType: 'String' },
          shopName: { value: '', name: 'shop.name', matchType: 'CONTAIN', tempType: 'String' }
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
        const searches = searchFormat(this.form)
        fetchFinancialWalletList({
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
          this.fetchTableList()
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
      }
    }
  }
</script>
<style scoped lang="scss">
  /deep/ .red-color {
    color: #F56C6C;
  }
  /deep/ .green-color {
    color: #67C23A;
  }
</style>
