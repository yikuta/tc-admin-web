<template>
  <div class="wrapper">
    <search-area @resetFields="resetFields" @onSearch="onSearch">
      <search ref="searchForm" />
    </search-area>
    <content-area contentTitle="用户菜谱收藏信息">
      <table-area :tableData="tableData.data" />
      <pagination
        :current="tableData.pageNo"
        :total="tableData.total"
        :page-size='tableData.pageSize'
        @onPageChange='handlePageChange'
        @onSizeChange='handleSizeChange'
      />
    </content-area>
  </div>
</template>

<script>
import { Common, MenuCollection } from './components'
import Pagination from '@/components/Pagination'
import { fetchShopCollectCookBookList } from '@/api/user'
import searchTool from '@/utils/searchTool'
export default {
  name: 'menuCollection',
  components: { ...Common, ...MenuCollection, Pagination },
  data() {
    return {
      tableData: {
        pageSize: 20,
        pageNo: 1,
        total: 0,
        data: []
      }
    }
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
  activated() {
    const { memberCode, memberPhone } = this.$route.query
    if (this.$refs.searchForm) {
      if (memberCode) this.$refs.searchForm.form.memberCode.value = memberCode
      if (memberPhone) this.$refs.searchForm.form.phone.value = memberPhone
    }
    this.onSearch()
  },
  methods: {
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.$refs['searchForm'].form))
      this.handleDataList(searchTool(req))
    },
    handleDataList(form) {
      fetchShopCollectCookBookList({
        searchs: JSON.stringify(form),
        pageNo: this.tableData.pageNo,
        pageSize: this.tableData.pageSize,
        distinct: true, // 去重
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          this.tableData.data = res.result.itemVOs || []
          this.tableData.total = res.result.totalCount
        }
      })
    },
    handlePageChange(page) {
      this.tableData.pageNo = page
      this.onSearch()
    },
    handleSizeChange(size) {
      this.tableData.pageNo = 1
      this.tableData.pageSize = size
      this.onSearch()
    },
    resetFields() {
      this.$refs['searchForm'].resetFields()
    }
  }
}
</script>

<style lang='scss'>
.wrapper {
}
</style>