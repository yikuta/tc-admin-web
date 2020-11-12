<template>
  <div class="app-container">
    <search-area
      :activeTab.sync="activeTab"
      @resetFields="onResetFields"
      @on-change-tab="onChangeTab"
      @on-edit-status='onChangeStatus'
      :isShowTab="true"
      :isModify='isModify'
      @onSearch="onQuery"
    >
      <search
        ref="search"
        :activeTab="activeTab"
      />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <audit-table
        :tableData="tableData"
        :activeTab="activeTab"
        @audit='handleAudit'
        @on-preview="onShowEffect"
        ref="modifyGoodslist"
      />
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
    </content-area>
    <preview-box @on-close-preview="onCloseDetail" :previewVisible="previewVisible" :previewDetail="previewDetail"></preview-box>
  </div>
</template>

<script>
import { Common, ShopAudit } from './templates'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { fetchShopGoodsList, asyncShopGoodsAudit, asyncBatchShopGoodsAudit, asyncGetPreviewDetail } from '@/api/merchantGoods'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'goodsAuditList',
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
      tableData: [],
      isModify: true,
      previewVisible: false,
      previewDetail: {}
    }
  },
  computed: {
    contentTitle() {
      return this.activeTab === '0' ? '待审核列表' : '已审核列表'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.onSearch()
    })
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
  // activated() {
  //   this.onSearch()
  // },
  methods: {
    onResetFields() {
      this.$refs['search'].$refs['form'].resetFields()
    },
    onChangeTab(activeTab) {
      if (activeTab === '1') {
        this.isModify = false
      } else {
        this.isModify = true
      }
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
            value: 'boss.ShopGoodsAuditStaus_10',
            name: 'auditStatus',
            matchType: MatchType.EQUAL,
            type: DataType.ENUM
          }
        }
      } else {
        const { status } = this.$refs['search'].form
        // 已审核
        if (status.value) {
          obj = {}
        } else {
          obj = {
            auditStatus: {
              value: 'boss.ShopGoodsAuditStaus_11,12',
              name: 'auditStatus',
              matchType: MatchType.IN,
              type: DataType.LISTENUM
            }
          }
        }
      }
      const req = Object.assign(
        JSON.parse(JSON.stringify(this.$refs['search'].form)),
        obj
      )
      this._reqAuditList(searchTool(req))
    },
    // ***请求处理***
    _reqAuditList(form) {
      return fetchShopGoodsList({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
        // orderby: this.activeTab === '0' ? 'createTime' : 'auditTime',
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
    // 批量通过/拒绝
    onChangeStatus(status) {
      this.$refs['modifyGoodslist'].handleEditBusiness(status)
    },
    handleAudit(code, status, reson) {
      let fn, obj
      if (code instanceof Array) {
        fn = asyncBatchShopGoodsAudit
        obj = {
          ids: code,
          status: status,
          context: reson
        }
      } else {
        fn = asyncShopGoodsAudit
        obj = {
          id: code,
          status: status,
          context: reson
        }
      }
      fn(obj).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '审核操作成功')
          this.onSearch()
        }
      })
    },
    onShowEffect(row) {
      asyncGetPreviewDetail(row.id).then(res => {
        if (res.code === 200) {
          this.previewDetail = res.result || {}
          this.previewVisible = true
        }
      })
    },
    onCloseDetail() {
      this.previewVisible = false
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
}
</style>
