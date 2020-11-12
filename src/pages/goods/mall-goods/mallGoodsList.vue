<template>
  <div class="app-container">
    <search ref="search" class="search-bar" @on-search="onQuery" />
    <table-area :tableData="dataList" @on-search="onSearch" />
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
  </div>
</template>

<script>
import { MallGoodsList } from './components'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
import { reqMallGoodsList } from '@/api/mallGoods'

export default {
  name: 'mallGoodsList',
  components: {
    Pagination,
    ...MallGoodsList
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
  mounted() {
    this.$nextTick(() => {
      // 获取商品商品列表
      this.onSearch()
    })
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.onSearch()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.onSearch()
    },
    onSearch() {
      // console.log('onSearch')
      const req = JSON.parse(JSON.stringify(this.reqForm))
      if (req.category && req.category.value && req.category.value.length) {
        const count = req.category.value.length
        if (count === 1) {
          req.category.name += '.parent'
        }
        req.category.value = req.category.value.pop()
      } else {
        delete req.category
      }
      req.businessNo = { value: 1, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      this._reqMallGoodsList(searchTool(req))
    },
    onQuery() {
      this.currentPage = 1
      this.reqForm = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this.onSearch()
    },
    // ***请求处理***
    _reqMallGoodsList(data) {
      return reqMallGoodsList({
        searchs: JSON.stringify(data),
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
            this.dataList = result.itemVOs || []
          }
        })
        .catch(() => {
          // console.log(err)
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
