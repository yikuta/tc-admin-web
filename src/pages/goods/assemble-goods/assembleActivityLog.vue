<template>
  <div class="app-container">
    <log-head />
    <log-table :dataList="dataList" />
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
  </div>
</template>
<script>
import { AssembleActivityLog } from './components'
import Pagination from '@/components/Pagination'
import { reqLogList } from '@/api/common.js'
export default {
  name: 'assembleActivityLog',
  components: { ...AssembleActivityLog, Pagination },
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
  mounted() {
    const { id } = this.$route.query
    this.id = id
    this._reqLogList()
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this._reqLogList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this._reqLogList()
    },
    /**
     * @description: 请求日志
     */
    _reqLogList() {
      return reqLogList({
        identifier: this.id,
        logServerType: 13,
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
    }
  }
}
</script>
