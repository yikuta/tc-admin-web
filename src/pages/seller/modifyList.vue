<template>
  <div class="app-container">
    <search-area
      :activeTab.sync="activeTab"
      @resetFields="onResetFields"
      @on-change-tab="onChangeTab"
      @on-edit-status='onChangeStatus'
      :isModify="activeTab==='0'"
      :isShowTab='true'
      @onSearch="onQuery"
    >
      <Search
        ref="search"
        :activeTab="activeTab"
      />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <modify-table
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
  </div>
</template>

<script>
import { Common, ModifyList } from './components'
import searchTool from '@/utils/searchTool'
import Pagination from '@/components/Pagination'
import { fetchUpdateShops, asyncAuditUpdateShop, asyncBatchAuditUpdateShop } from '@/api/seller'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'modifyList',
  components: {
    ...Common,
    ...ModifyList,
    Pagination
  },
  data() {
    return {
      activeTab: '0',
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      selectedData: []
    }
  },
  computed: {
    contentTitle() {
      return this.activeTab === '0' ? '待审核列表' : '已审核列表'
    }
  },
  activated() {
    this.activeTab = '0'
    this.currentPage = 1
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
          status: {
            value: '0',
            name: 'status',
            matchType: MatchType.EQUAL,
            type: DataType.STRING
          }
        }
      } else {
        // 已审核
        if (!this.$refs['search'].form.status.value) {
          obj = {
            status: {
              value: '1,2',
              name: 'status',
              matchType: MatchType.IN,
              type: DataType.LISTLONG
            }
          }
        }
      }
      const req = Object.assign(
        JSON.parse(JSON.stringify(this.$refs['search'].form)),
        obj
      )
      this._reqUpdateShopList(searchTool(req))
    },
    // ***请求处理***
    _reqUpdateShopList(form) {
      return fetchUpdateShops({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: this.activeTab === '0' ? 'createTime' : 'updateTime',
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
      let fn, obj
      if (code instanceof Array) {
        fn = asyncBatchAuditUpdateShop
        obj = {
          auditStatus: status,
          shopCodeList: code,
          auditReason: reson
        }
      } else {
        fn = asyncAuditUpdateShop
        obj = {
          auditStatus: status,
          shopCode: code,
          auditReason: reson
        }
      }
      fn(obj).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '审核操作成功')
          this.onSearch()
        }
      })
    },
    // 批量通过/拒绝
    onChangeStatus(status) {
      this.$refs['modifylist'].handleEditBusiness(status)
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
}
</style>
