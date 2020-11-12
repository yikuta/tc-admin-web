<template>
  <div class="app-container">
    <search ref="search" class="search-bar">
      <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
    </search>
    <content-area contentTitle="数据列表">
      <table-area :tableData="tableData" :loading='loading'/>
      <pagination
        :current="tableData.pageNo"
        :total="totalCount"
        :pageSize="tableData.pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
    </content-area>
  </div>
</template>

<script>
import Search from './templates/SearchCard'
import ContentArea from '../templates/ContentArea'
import TableArea from './templates/TableList'
import Pagination from '@/components/Pagination'
import { fetchCookBooks } from '@/api/cookBook'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'

export default {
  name: 'cookBookAudit',
  components: { Search, TableArea, Pagination, ContentArea },
  beforeRouteEnter(to, from, next) {
    if (!from.name) {
      next(vm => {
        vm.handleDataList()
      })
    } else {
      next()
    }
  },
  activated() {
    this.handleDataList()
  },
  data() {
    return {
      totalCount: 0,
      tableData: {
        pageNo: 1,
        pageSize: 20,
        data: []
      },
      loading: false
    }
  },
  methods: {
    handleDataList() {
      const searches = searchTool(deepClone(this.$refs['search'].form))
      this.loading = true
      fetchCookBooks({
        pageNo: this.tableData.pageNo,
        pageSize: this.tableData.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        searchs: searches.length ? JSON.stringify(searches) : null
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.tableData.data = res.result.itemVOs
          this.totalCount = res.result.totalCount
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 新增菜谱
    handleAddMenu() {
      this.$router.push({ path: '/cookBook/cookBookAdd' })
    },
    onPageChange(page) {
      this.tableData.pageNo = page
      this.handleDataList()
    },
    onSizeChange(size) {
      this.tableData.pageSize = size
      this.tableData.pageNo = 1
      this.handleDataList()
    },
    handleSearch() {
      this.tableData.pageNo = 1
      this.handleDataList()
    },
    handleClose(isSuccess) {
      if (isSuccess) {
        this.handleDataList()
      }
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
