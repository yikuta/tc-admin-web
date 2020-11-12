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
import { AD_TYPE, AD_STATUS } from '../constants'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
import { reqAdvertisingList, reqAdvertisingById } from '@/api/advertising'

export default {
  name: 'advertisingList',
  components: { Search, TableArea, CheckView, Pagination },
  mounted() {
    const { id, type, spaceId } = this.$route.query
    this.id = id
    this.type = type
    this.spaceId = spaceId
    this.onQuery()
  },
  activated() {
    const { id, type, spaceId } = this.$route.query
    this.id = id
    this.type = type
    this.spaceId = spaceId
    this.onQuery()
  },
  data() {
    return {
      id: 0, // 广告位code
      spaceId: 0, // 广告位id
      type: 0, // 广告位类型
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
      if (this.type === AD_TYPE.TEXT) {
        this.advertisingType = 3
      } else {
        this.advertisingType = 2
      }
      this._reqAdvertisingById(row.id)
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
      req.spaceId = { value: this.id, name: 'positionCode', matchType: MatchType.EQUAL, type: DataType.STRING }
      if (req.status.value) {
        // const curDate = new Date()
        if (req.status.value === AD_STATUS.PENDING) {
          req.status.value = 'DETAIL_STATUS_ON'
          req.startDate = {
            value: this.getCurrentFormatDate(),
            name: 'startDate',
            matchType: MatchType.GTE,
            type: DataType.DATE
          }
        } else if (req.status.value === AD_STATUS.OVER_DUE) {
          req.status.value = 'DETAIL_STATUS_ON'
          req.endDate = {
            value: this.getCurrentFormatDate(),
            name: 'endDate',
            matchType: MatchType.LTE,
            type: DataType.DATE
          }
        } else if (req.status.value === AD_STATUS.SHELF_ON) {
          req.status.value = 'DETAIL_STATUS_ON'
          req.startDate = {
            value: this.getCurrentFormatDate(),
            name: 'startDate',
            matchType: MatchType.LTE,
            type: DataType.DATE
          }
          req.endDate = {
            value: '4001-01-01 08:00:00',
            name: 'endDate',
            matchType: MatchType.LTE,
            type: DataType.DATE
          }
        }
      }
      if (req.expire.value && req.expire.value.length) {
        req.startDate = { value: req.expire.value[0], name: 'startDate', matchType: MatchType.GTE, type: DataType.DATE }
        req.endDate = { value: req.expire.value[1], name: 'endDate', matchType: MatchType.LTE, type: DataType.DATE }
        delete req.expire
      }
      this._reqAdvertisingList(searchTool(req))
    },
    onQuery() {
      this.currentPage = 1
      this.reqForm = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this.onSearch()
    },
    /**
     * @description: 返回当前格式化时间
     */
    getCurrentFormatDate() {
      const curDate = new Date()
      return `${curDate.getFullYear()}-${curDate.getMonth() + 1 < 10 ? '0' + (curDate.getMonth() + 1) : curDate.getMonth() + 1}-${
        curDate.getDate() < 10 ? '0' + curDate.getDate() : curDate.getDate()
      } ${curDate.getHours() < 10 ? '0' + curDate.getHours() : curDate.getHours()}:${curDate.getMinutes() < 10 ? '0' + curDate.getMinutes() : curDate.getMinutes()}:${
        curDate.getSeconds() < 10 ? '0' + curDate.getSeconds() : curDate.getSeconds()
      }`
    },
    /**
     * @description: 广告列表
     */
    _reqAdvertisingList(data) {
      return reqAdvertisingList({
        searchs: JSON.stringify(data),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderbys: ['sortNum', 'createTime'],
        sorts: ['desc', 'desc']
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
     * @description: 根据id查询广告详情
     */
    _reqAdvertisingById(id) {
      return reqAdvertisingById({ id })
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
