<template>
  <div class="app-container">
    <search-area
      :activeTab.sync="activeTab"
      @resetFields="onResetFields"
      @on-change-tab="onChangeTab"
      @on-edit-logout='onChangeLogout'
      :isShowTab='true'
      :isLogout='true'
      @onSearch="onQuery"
    >
      <Search
        ref="search"
        :activeTab="activeTab"
      />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <table-area
        :tableData="tableData"
        :activeTab="activeTab"
        ref="modifylist"
        @audit='handleAudit'
      />
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
    </content-area>
    <apply-logout :visible.sync='logoutVisible' @update="onSearch"/>
  </div>
</template>
<script>
  import { Common, ShopLogout } from './components'
  import searchTool from '@/utils/searchTool'
  import Pagination from '@/components/Pagination'
  import { fetchWithdrawShops, asyncAuditWithdrawLogout } from '@/api/seller'
  import { MatchType, DataType } from '@/constants/search'
  export default {
    name: 'shopLogout',
    components: {
      ...Common,
      ...ShopLogout,
      Pagination
    },
    data() {
      return {
        activeTab: '0',
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        tableData: [],
        selectedData: [],
        logoutVisible: false,
        contentTitle: '待审核列表'
      }
    },
    activated() {
      this.onSearch()
    },
    beforeRouteEnter(to, from, next) {
      if (!from.name) {
        next(vm => {
          vm.onSearch()
        })
      } else {
        next()
      }
    },
    methods: {
      onResetFields() {
        this.$refs['search'].$refs['form'].resetFields()
      },
      onChangeTab(activeTab) {
        this.activeTab = activeTab
        this.tableData = []
        this.currentPage = 1
        this.onSearch()
      },
      onPageChange(page) {
        this.currentPage = page
        this.onSearch()
      },
      onSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.onSearch()
      },
      onQuery() {
        this.currentPage = 1
        this.onSearch()
      },
      onSearch() {
        let obj = {}
        // 待审核
        if (this.activeTab === '0') {
          obj = {
            auditStatus: {
              value: '0',
              name: 'auditStatus',
              matchType: MatchType.EQUAL,
              type: DataType.STRING
            }
          }
        } else {
          // 已审核
          if (this.$refs['search'].form.status.value) {
            obj = {}
          } else {
            obj = {
              auditStatus: {
                value: '1,2',
                name: 'auditStatus',
                matchType: MatchType.IN,
                type: DataType.LISTLONG
              }
            }
          }
        }
        let req = {}
        if (this.$refs['search']) {
          req = Object.assign(
            JSON.parse(JSON.stringify(this.$refs['search'].form)),
            obj
          )
        } else {
          req = obj
        }
        this._reqWithdrawShopsList(searchTool(req))
      },
      // ***请求处理***
      _reqWithdrawShopsList(form) {
        return fetchWithdrawShops({
          searchs: JSON.stringify(form),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        })
          .then(res => {
            if (res.code === 200) {
              let result = res.result || {}
              this.currentPage = result.pageNo
              this.totalCount = result.totalCount
              this.tableData = result.itemVOs || []
            } else {
              this.tableData = []
              this.currentPage = 1
              this.totalCount = 0
            }
          })
          .catch(() => {
            this.currentPage = 1
            this.totalCount = 0
            this.tableData = []
          })
      },
      handleAudit(code, status, reson) {
        asyncAuditWithdrawLogout({
          auditStatus: status,
          shopCode: code,
          auditReason: reson
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '审核操作成功')
            this.onSearch()
          }
        })
      },
      onChangeLogout() {
        // 注销
        this.logoutVisible = true
      }
    }
  }
</script>
