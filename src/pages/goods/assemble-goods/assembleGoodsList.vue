<template>
  <div class="app-container">
    <search ref="search" class="search-bar" @on-search="onQuery" @on-batch-put-on="onBatchPutOn" @on-batch-put-off="onBatchPutOff" />
    <table-area ref="table" :tableData="dataList" @on-search="onSearch" />
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
  </div>
</template>

<script>
import { AssembleGoodsList } from './components'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
import { reqAssembleGoodsList } from '@/api/assembleGoods'

export default {
  name: 'assembleGoodsList',
  components: {
    Pagination,
    ...AssembleGoodsList
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
      if (req.cityCategory && req.cityCategory.value && req.cityCategory.value.length) {
        req.province = { value: ((req.cityCategory || {}).value || [])[0], name: 'channelCommoditySub.provinceCode', matchType: MatchType.EQUAL, type: DataType.STRING }
        req.city = { value: ((req.cityCategory || {}).value || [])[1], name: 'channelCommoditySub.cityCode', matchType: MatchType.EQUAL, type: DataType.STRING }
      }
      delete req.cityCategory
      req.businessNo = { value: 2, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      this._reqAssembleGoodsList(searchTool(req))
    },
    onQuery() {
      this.currentPage = 1
      this.reqForm = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this.onSearch()
    },
    /**
     * @description: 批量上架
     */
    onBatchPutOn() {
      this.$refs['table'].handlePutOn(true)
    },
    /**
     * @description: 批量下架
     */
    onBatchPutOff() {
      this.$refs['table'].handlePutOff(true)
    },
    // ***请求处理***
    _reqAssembleGoodsList(data) {
      return reqAssembleGoodsList({
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
        .catch()
    }
  }
}
</script>

<style lang='scss' scoped>
.search-bar {
  margin: 0 0 20px 0;
}
</style>
