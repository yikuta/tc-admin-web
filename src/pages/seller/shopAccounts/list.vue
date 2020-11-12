<template>
  <div class="app-container">
    <search-form :form="searchForm" :buttons="['search']" labelWidth="40px" @change="handleSearch">
      <template slot="form">
        <el-form-item label="账号">
          <el-input v-model="searchForm.username.value" placeholder="输入门店账号"/>
        </el-form-item>
      </template>
    </search-form>
    <div class="table-wrapper">
      <base-table :columns="columns" :pagination="pagination" :list="list" @change="handlePaginationChange">
        <el-table-column slot="operates" label="操作" width="80px">
          <template slot-scope="{ row }">
            <el-button v-if="row['shopRoleVoList'] && row['shopRoleVoList'].length" type="text" @click="handleCheckShopList(row)">关联门店</el-button>
            <span v-else>-</span>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <el-dialog
      title="关联门店"
      :visible.sync="dialogVisible"
      width="620px"
      :close-on-click-modal='false'
      @close="dialogVisible = false"
    >
      <base-table :columns="dColumns" :list="currentRow['shopRoleVoList']"></base-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { fetchShopAccounts } from '@/api/seller'
  import SearchForm from '@/components/SearchForm'
  import BaseTable from '@/components/BaseTable'
  import searchFormat from '@/utils/searchFormat'
  const columns = [{
    title: '账号',
    prop: 'username'
  }, {
    title: '注册日期',
    prop: 'createTime'
  }]
  const dColumns = [{
    title: '门店名称',
    prop: 'name'
  }, {
    title: '门店编号',
    prop: 'shopCode'
  }, {
    title: '角色',
    prop: 'roleName'
  }]
  export default {
    name: 'AccountList',
    components: { SearchForm, BaseTable },
    data() {
      return {
        columns: columns,
        dColumns: dColumns,
        searchForm: {
          username: { value: '', name: 'username', matchType: 'EQUAL', tempType: 'Long' }
        },
        list: [],
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        dialogVisible: false,
        currentRow: {}
      }
    },
    mounted() {
      this.fetchShopAccounts()
    },
    methods: {
      handleSearch() {
        this.pagination.pageNo = 1
        this.fetchShopAccounts()
      },
      handlePaginationChange({ pageNo, pageSize }) {
        this.pagination.pageNo = pageNo
        this.pagination.pageSize = pageSize
        this.fetchShopAccounts()
      },
      fetchShopAccounts() {
        const searchResult = searchFormat(this.searchForm)
        fetchShopAccounts({
          orderby: 'createTime',
          sort: 'desc',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          searchs: searchResult.length ? JSON.stringify(searchResult) : null
        }).then(res => {
          if (res.code === 200) {
            const { itemVOs, pageNo, pageSize, totalCount } = res.result
            this.pagination.pageNo = pageNo
            this.pagination.pageSize = pageSize
            this.pagination.total = totalCount
            this.list = itemVOs
          }
        })
      },
      handleCheckShopList(row) {
        this.dialogVisible = true
        this.currentRow = row
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
