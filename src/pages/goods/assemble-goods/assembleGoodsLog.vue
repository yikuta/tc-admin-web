<template>
  <div class="app-container">
    <log-head :fetchData="fetchData" />
    <log-table :dataList="dataList" />
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
  </div>
</template>
<script>
import { AssembleGoodsLog } from './components'
import { reqLogList } from '@/api/common.js'
import { reqMallGoodsInfoById } from '@/api/mallGoods'
import searchTool from '@/utils/searchTool'
// import { MatchType, DataType } from '@/constants/search'
import Pagination from '@/components/Pagination'

export default {
  name: 'assembleGoodsLog',
  components: { ...AssembleGoodsLog, Pagination },
  mounted() {
    const { id } = this.$route.query
    this.id = id
    this.onSearch()
    this._reqMallGoodsInfoById(this.id)
  },
  data() {
    return {
      id: 0,
      fetchData: undefined,
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
      this.onSearch()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.onSearch()
    },
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.reqForm))
      // req.id = { value: this.id, name: 'identifier', matchType: MatchType.EQUAL, type: DataType.STRING }
      // req.logServerType = { value: 'COMMODITY_LOG', name: 'logServerType', matchType: MatchType.EQUAL, type: DataType.ENUM }
      this._reqLogList(searchTool(req))
    },
    /**
     * @description: 请求日志
     */
    _reqLogList(data) {
      return reqLogList({
        searchs: JSON.stringify(data),
        identifier: this.id,
        logServerType: 3,
        page: this.currentPage,
        size: this.pageSize
        // pageNo: this.currentPage,
        // pageSize: this.pageSize,
        // orderby: 'createTime',
        // sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.dataList = result.itemVOs || []
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 获取指定编号的渠道商品完整信息
     */
    _reqMallGoodsInfoById(id) {
      return reqMallGoodsInfoById({ id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.fetchData = result
          }
        })
        .catch(() => {})
    }
  }
}
</script>
