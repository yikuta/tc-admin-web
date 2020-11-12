<template>
  <div class="app-container">
    <search-area 
      :activeTab.sync="activeTab" 
      @resetFields="onResetFields" 
      @on-change-tab="onChangeTab" 
      :isShowTab="true" 
      :isAudit="true" 
      @onSearch="onQuery">
      <search ref="search" :activeTab="activeTab" />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <audit-table :tableData="tableData" :activeTab="activeTab" @audit='handleAudit' @detail='handleDetail'/>
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange" />
    </content-area>
  </div>
</template>

<script>
import { Common, ShopAudit } from './components'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { reqAuditList, asyncShopAudit } from '@/api/seller'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'auditList',
  components: {
    ...Common,
    ...ShopAudit,
    Pagination
  },
  data() {
    return {
      activeTab: '0',
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: []
    }
  },
  watch: {
    '$route.name'(newVal, oldVal) {
      if (newVal === 'auditList' && oldVal !== 'shopDetail') {
        this.currentPage = 1
        this.activeTab = '0'
        this.onSearch()
      }
    }
  },
  computed: {
    contentTitle() {
      return this.activeTab === '0' ? '待审核列表' : (this.activeTab === '2' ? '待入驻列表' : '已审核列表')
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch()
    })
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
          enterStatus: { value: '5', name: 'enterStatus', matchType: MatchType.EQUAL, type: DataType.STRING }
        }
      } else if (this.activeTab === '2') {
        obj = {
          enterStatus: { value: '0,6,2,3,4', name: 'enterStatus', matchType: MatchType.IN, type: DataType.LISTLONG }
        }
      } else {
        const { status } = this.$refs['search'].form
        // 已审核
        if (status.value) {
          obj = {}
        } else {
          obj = {
            enterStatus: { value: '1,6', name: 'enterStatus', matchType: MatchType.IN, type: DataType.LISTLONG }
          }
        }
      }
      const req = Object.assign(JSON.parse(JSON.stringify(this.$refs['search'].form)), obj)
      if (this.activeTab === '0') {
        delete req.status
      }
      this._reqAuditList(searchTool(req))
    },
    // ***请求处理***
    _reqAuditList(form) {
      return reqAuditList({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        // distinct: true, // 去重
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
          this.tableData = []
          this.currentPage = 1
          this.totalCount = 0
        })
    },
    handleAudit(code, status, data) {
      asyncShopAudit({
        auditStatus: status,
        shopCode: code,
        businessType: status === 1 ? data : null,
        auditDesc: status === 6 ? data : null
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '审核操作成功')
          this.onSearch()
        }
      })
    },
    handleDetail(code, status) {
      this.$router.push({
        path: 'shopDetail?code=' + code,
        query: {
          code,
          isAudit: status
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
}
</style>
