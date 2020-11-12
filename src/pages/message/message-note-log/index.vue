<template>
  <div class="app-container">
    <search-area @onSearch="handleSearch" @resetFields='handleReset'>
      <search ref="search"></search>
    </search-area>
    <content-area contentTitle="列表信息">
      <div v-if="searches.length">
        <table-area :tableData="dataList"/>
        <pagination
          :current="currentPage"
          :total="totalCount"
          :pageSize="pageSize"
          @onPageChange="onPageChange"
          @onSizeChange="onSizeChange"
        />
      </div>
    </content-area>
  </div>
</template>

<script>
import SearchArea from '../templates/SearchArea'
import Search from '../templates/SearchCardLog'
import ContentArea from '../templates/ContentArea'
import TableArea from '../templates/TableAreaLog'
import Pagination from '@/components/Pagination'
import { fetchMessageSendLog } from '@/api/message'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'

export default {
  name: 'messageNoteLog',
  components: { SearchArea, Search, TableArea, Pagination, ContentArea },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      reqForm: {},
      upGradeTerminalTypes: [],
      upGradeOsTypes: [],
      searches: []
    }
  },
  methods: {
    handleDataList() {
      this.searches = searchTool(deepClone(this.$refs['search'].form))
      if (this.searches.length === 0) {
        this.$message.info('请至少输入一项查询条件')
        this.dataList = []
        return
      }
      fetchMessageSendLog({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        templateType: 'SM',
        searchs: this.searches.length ? JSON.stringify(this.searches) : null
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs || []
          this.totalCount = res.result.totalCount
        }
      })
    },
    onPageChange(page) {
      this.currentPage = page
      this.handleDataList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleDataList()
    },
    handleSearch() {
      this.currentPage = 1
      this.handleDataList()
    },
    handleReset() {
      this.$refs['search'].$refs['form'].resetFields()
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
