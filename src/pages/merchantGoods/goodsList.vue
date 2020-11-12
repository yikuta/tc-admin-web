<template>
  <div class="app-container">
    <search-area
      :isShowTab="false"
      :isExport='true'
      @resetFields="onResetFields"
      @onSearch="onQuery"
      @onExport="onExport">
      <search ref="search" />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <table-area
        ref="list"
        :tableData="tableData"
        @on-preview="onShowEffect"/>
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange" />
    </content-area>
    <preview-box @on-close-preview="onCloseDetail" :previewVisible="previewVisible" :previewDetail="previewDetail"></preview-box>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { Common, GoodsList } from './templates'
import searchTool from '@/utils/searchTool'
import { fetchShopGoodsList, asyncGetPreviewDetail, fetchExportGoodsList } from '@/api/merchantGoods'
export default {
  name: 'merchantGoodsList',
  components: { Pagination, ...Common, ...GoodsList },
  data() {
    return {
      contentTitle: '商品列表',
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      previewVisible: false,
      previewDetail: {}
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
    },
    onResetFields() {
      let { auditStatus, isUpshelf } = this.$refs['search'].$refs['form'].model
      auditStatus.value = 'boss.ShopGoodsAuditStaus_10,11'
      isUpshelf.value = ''
      this.$refs['search'].$refs['form'].resetFields()
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
    handleEditBusiness() {
      this.$refs['list'].handleEditBusiness()
    },
    handleEditDevops() {
      this.$refs['list'].handleEditDevops()
    },
    onQuery() {
      this.currentPage = 1
      this.onSearch()
    },
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this._reqShopList(searchTool(req))
    },
    onExport() {
      const req = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this._reqExportList(searchTool(req))
    },
    // ***请求处理***
    _reqShopList(form) {
      return fetchShopGoodsList({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
        orderby: 'submitAuditTime',
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
    _reqExportList(form) {
      fetchExportGoodsList({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('导出成功！')
        } else {
          this.message.warn('导出失败！')
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
