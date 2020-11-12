<template>
  <div class="app-container">
    <search ref="search" class="search-bar" @on-search="handleSearch" @on-add="handlePublishVersion" />
    <table-area :tableData="dataList" @on-search="fetchAppsList" @refresh-list="fetchAppsList" />
    <pagination
      :current="currentPage"
      :total="totalCount"
      :pageSize="pageSize"
      @onPageChange="onPageChange"
      @onSizeChange="onSizeChange"
    />
    <add-dialog :visible.sync="addDialogVisible" @close="handleClose" />
  </div>
</template>

<script>
import Search from './templates/Search'
import TableArea from './templates/TableArea'
import AddDialog from './templates/AddDialog'
import Pagination from '@/components/Pagination'
import { fetchAppVersionList } from '@/api/setting/appVersion'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'

export default {
  name: 'appVersionManage',
  components: { Search, TableArea, AddDialog, Pagination },
  mounted() {
    this.fetchAppsList()
  },
  data() {
    return {
      addDialogVisible: false, // 新增 dialog visible
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      reqForm: {},
      upGradeTerminalTypes: [],
      upGradeOsTypes: []
    }
  },
  methods: {
    fetchAppsList() {
      const searches = searchTool(deepClone(this.$refs['search'].form))
      fetchAppVersionList({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        searchs: searches.length ? JSON.stringify(searches) : null
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs
          this.totalCount = res.result.totalCount
        }
      })
    },
    // 发布版本
    handlePublishVersion() {
      this.addDialogVisible = true
    },
    onPageChange(page) {
      this.currentPage = page
      this.fetchAppsList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchAppsList()
    },
    handleSearch() {
      this.currentPage = 1
      this.fetchAppsList()
    },
    handleClose(isSuccess) {
      if (isSuccess) {
        this.fetchAppsList()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  .search-bar {
    margin: 0 0 20px 0;
  }
}
</style>
