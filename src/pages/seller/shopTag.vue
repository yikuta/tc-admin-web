<template>
  <div class="app-container">
    <search-area 
      :isShowTab="false" 
      :isModifyTag='true'
      @resetFields="onResetFields" 
      @on-edit-tag="handleEditTags"
      @onSearch="onQuery">
      <search ref="search" />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <table-area ref="list" :tableData="tableData" @update='onSearch'/>
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
import Pagination from '@/components/Pagination'
import { Common, ShopTag } from './components'
import searchTool from '@/utils/searchTool'
import { reqShopList } from '@/api/seller'
export default {
  name: 'shopTag',
  components: { Pagination, ...Common, ...ShopTag },
  data() {
    return {
      contentTitle: '门店标签列表',
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: []
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
    onResetFields() {
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
    handleEditTags(status) {
      this.$refs['list'].handleChangeTag({
        shopTags: [],
        shopLogoTag: '',
        characteristicTag: ''
      }, status, true)
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
    // ***请求处理***
    _reqShopList(form) {
      return reqShopList({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
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
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
}
</style>
