<template>
  <div class="app-container">
    <search ref="search" class="search-bar" @on-search="onQuery" />
    <table-area ref="table" :tableData="dataList" @onSearch="fetchLogisticsModuleList" />
    <pagination
      :current="currentPage"
      :total="totalCount"
      :pageSize="pageSize"
      @onPageChange="onPageChange"
      @onSizeChange="onSizeChange"
    />
  </div>
</template>

<script>
import Search from './templates/Search'
import TableArea from './templates/TableArea'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { fetchLogisticsModuleList } from '@/api/logistics'
import { deepClone } from '@/utils/util'

export default {
  name: 'logisticsModuleManage',
  components: { Search, TableArea, Pagination },
  mounted() {
    this.onQuery()
  },
  activated() {
    this.fetchLogisticsModuleList()
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      reqForm: {}
    }
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.fetchLogisticsModuleList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.fetchLogisticsModuleList()
    },
    onQuery() {
      this.currentPage = 1
      this.reqForm = deepClone(this.$refs['search'].form)
      this.fetchLogisticsModuleList()
    },
    //  物流模板列表
    fetchLogisticsModuleList() {
      const searches = searchTool(deepClone(this.reqForm))
      return fetchLogisticsModuleList({
        searchs: searches.length ? JSON.stringify(searches) : null,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          const { pageNo, totalCount, itemVOs } = res.result || {}
          this.currentPage = pageNo
          this.totalCount = totalCount
          this.dataList = itemVOs || []
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.search-bar {
  margin: 0 0 20px 0;
}
</style>
