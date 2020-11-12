<template>
  <div class="wrapper">
    <search-area @resetFields="resetFields" @onSearch="onSearch">
      <search ref="searchForm" :memberCode='memberCode'/>
    </search-area>
    <content-area contentTitle="浏览记录列表">
      <table-area :tableData="dataList" />
      <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange"  />
    </content-area>
  </div>
</template>

<script>
import { Common, ProductHistory } from './components'
import Pagination from '@/components/Pagination'
import { fetchMemberRecord } from '@/api/user'
import searchTool from '@/utils/searchTool'
export default {
  name: 'productHistory',
  components: { ...Common, ...ProductHistory, Pagination },
  data() {
    return {
      dataList: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      searchs: [],
      memberCode: ''
    }
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    resetFields() {
      if (this.$route.query.code) {
        this.$router.push('productHistory')
      }
      this.$refs['searchForm'].resetFields()
    },
    handleDataList() {
      fetchMemberRecord({
        searchs: JSON.stringify(this.searchs),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs || []
          this.currentPage = res.result.pageNo
          this.totalCount = res.result.totalCount
        } else {
          this.dataList = []
          this.currentPage = 1
          this.totalCount = 0
        }
      }).catch(() => {
        this.dataList = []
        this.currentPage = 1
        this.totalCount = 0
      })
    },
    onSearch() {
      this.currentPage = 1
      const req = JSON.parse(JSON.stringify(this.$refs['searchForm'].form))
      this.searchs = searchTool(req)
      this.handleDataList()
    },
    onPageChange(page) {
      this.currentPage = page
      this.handleDataList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleDataList()
    }
  }
}
</script>

<style lang='scss'>
.wrapper {
}
</style>