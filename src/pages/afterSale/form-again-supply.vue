<template>
  <div class="app-container">
    <el-card>
      <search-area 
        @resetFields="onResetFields"
        @onSearch="onSearch">
        <search ref="search" />
      </search-area>
      <table-list :tableData="tableData" :loading="loading"/>
      <pagination
        :current="tableData.pageNo"
        :total="tableData.total"
        :page-size='tableData.pageSize'
        @onPageChange='handlePageChange'
        @onSizeChange='handleSizeChange'
      />
    </el-card>
  </div>
</template>
<script>
import { Common, FormAgainSupply } from './templates'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { fetchAfterSaleListDetail } from '@/api/afterSale'
export default {
  name: 'AgainSupplyForm',
  components: {
    ...Common,
    ...FormAgainSupply,
    Pagination
  },
  data() {
    return {
      tableData: {
        pageSize: 20,
        pageNo: 1,
        total: 0,
        data: []
      },
      loading: false
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
    this.onSearch()
  },
  methods: {
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this.handleDataList(searchTool(req))
    },
    handleDataList(form) {
      this.loading = true
      fetchAfterSaleListDetail({
        searchs: JSON.stringify(form),
        pageNo: this.tableData.pageNo,
        pageSize: this.tableData.pageSize,
        distinct: true, // 去重
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.tableData.data = res.result.itemVOs || []
          this.tableData.total = res.result.totalCount
        }
      }).catch(() => {
        this.loading = false
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
    onResetFields() {
      this.$refs['search'].$refs['form'].resetFields()
    }
  }
}
</script>