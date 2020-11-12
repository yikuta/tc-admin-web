<template>
  <div class="wrapper">
    <search-area @resetFields="resetFields" @onSearch="onSearch">
      <search ref="searchForm" />
    </search-area>
    <content-area contentTitle="用户列表">
      <table-area :tableData="userList" />
      <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
    </content-area>
  </div>
</template>

<script>
import { Common, InfoList } from './components'
import Pagination from '@/components/Pagination'
import { reqUserList } from '@/api/user'
import searchTool from '@/utils/searchTool'

export default {
  name: 'infoList',
  components: {
    ...Common,
    ...InfoList,
    Pagination
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      userList: [],
      form: []
    }
  },
  mounted() {
    this._reqUserList()
  },
  methods: {
    resetFields() {
      this.$refs['searchForm'].resetFields()
    },
    onPageChange(page) {
      this.currentPage = page
      this._reqUserList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this._reqUserList()
    },
    onSearch() {
      this.currentPage = 1
      const req = JSON.parse(JSON.stringify(this.$refs['searchForm'].form))
      if (req.source.value || req.source.value === 0) req.source.value = 'TerminalType_' + req.source.value
      this.form = searchTool(req)
      this._reqUserList()
    },
    // ***请求处理***
    _reqUserList() {
      return reqUserList({
        searchs: JSON.stringify(this.form),
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
            this.userList = result.itemVOs || []
          }
        })
        .catch(() => {
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
}
</style>