<template>
  <div class="app-container">
    <search ref="search" class="search-bar" @on-search="onQuery" @on-add-service="handleAddService" />
    <table-area ref="table" :tableData="dataList" @on-search="onSearch" @on-update-service="handleAddService" />
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
    <city-dialog ref="dialog" :visible.sync="visible" :fetchData="fetchData" @on-update-service="handleService" />
  </div>
</template>

<script>
import { BusinessCity } from './components'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { reqBusinessCityList, reqAddBusinessCity, reqBusinessCityById, reqUpdateBusinessCity } from '@/api/assembleGoods'

export default {
  name: 'businessCity',
  components: {
    Pagination,
    ...BusinessCity
  },
  watch: {
    visible: {
      handler: function(newVal) {
        if (!newVal) {
          this.isUpdate = false
        }
      }
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      reqForm: {},
      visible: false,
      fetchData: {},
      isUpdate: false
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
      this._reqBusinessCityList(searchTool(req))
    },
    onQuery() {
      this.currentPage = 1
      this.reqForm = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this.onSearch()
    },
    // ***请求处理***
    _reqBusinessCityList(data) {
      return reqBusinessCityList({
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
    handleAddService(row) {
      if (row) {
        this.isUpdate = true
        reqBusinessCityById({ id: row['id'] })
          .then(res => {
            if (res.code === 200) {
              let result = res.result || {}
              this.fetchData = result
            }
          })
          .catch(() => {})
      } else {
        this.fetchData = {}
      }
      this.visible = true
    },
    handleService(req) {
      let ajax
      if (this.isUpdate) {
        ajax = reqUpdateBusinessCity(req)
      } else {
        ajax = reqAddBusinessCity(req)
      }
      ajax
        .then(res => {
          if (res.code === 200) {
            this.$message.success('操作成功')
            this.$refs['dialog'].onChange(false)
            this.onSearch()
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
