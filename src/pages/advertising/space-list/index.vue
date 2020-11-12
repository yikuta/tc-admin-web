<template>
  <div class="app-container">
    <search ref="search" class="search-bar" @on-search="onQuery" />
    <table-area ref="table" :tableData="dataList" @on-search="onSearch" @on-check="onCheck" />
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
    <check-view :visible.sync="isShowCheckView" :type="advertisingType" :fetchData="curDetail" />
  </div>
</template>

<script>
import Search from './templates/Search'
import TableArea from './templates/TableArea'
import CheckView from './templates/CheckView'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { reqAdvertisingSpaceList, reqAdvertisingInfoById } from '@/api/advertising'

export default {
  name: 'spaceList',
  components: { Search, TableArea, CheckView, Pagination },
  mounted() {
    this.onQuery()
  },
  activated() {
    this.onQuery()
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      reqForm: {},
      isShowCheckView: false, // 是否显示广告信息弹窗
      advertisingType: undefined, // 广告类型
      curDetail: undefined // 当前广告详情
    }
  },
  methods: {
    /**
     * @description: 显示广告信息弹窗
     */
    onCheck(row) {
      this.isShowCheckView = true
      this.advertisingType = row.positionType
      this._reqAdvertisingInfoById(row.id)
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
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.reqForm))
      this._reqAdvertisingSpaceList(searchTool(req))
    },
    onQuery() {
      this.currentPage = 1
      this.reqForm = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this.onSearch()
    },
    /**
     * @description: 广告位列表
     */
    _reqAdvertisingSpaceList(data) {
      return reqAdvertisingSpaceList({
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
        .catch(() => {})
    },
    /**
     * @description: 根据id查询广告位详情
     */
    _reqAdvertisingInfoById(id) {
      return reqAdvertisingInfoById({ positionId: id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.curDetail = result
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.search-bar {
  margin: 0 0 20px 0;
}
</style>
