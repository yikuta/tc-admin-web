<template>
  <div class="app-main">
    <div class="wrapper">
      <el-card>
        <search-card @query="handleQueryOrders" />
      </el-card>
    </div>
    <div class="wrapper">
      <el-card>
        <table-list
          :tableData='tableData'
          :loading='loading'
        />
        <pagination
          :current="tableData.pageNo"
          :total="tableData.total"
          :page-size='tableData.pageSize'
          @onPageChange='handlePageChange'
          @onSizeChange='handleSizeChange'
        />
      </el-card>
    </div>
  </div>
</template>
<script>
import SearchCard from './components/SearchCard.vue'
import TableList from './components/TableList'
import Pagination from '@/components/Pagination'
// import { fetchOrderList } from '@/api/order'
export default {
  name: 'saleArea',
  components: {
    SearchCard,
    TableList,
    Pagination
  },
  data() {
    return {
      tableData: {
        pageSize: 20,
        pageNo: 1,
        total: 0,
        data: [{
          id: '001',
          name: '成都01仓',
          area: '四川省/重庆市/贵州市'
        }]
      },
      queryForm: [],
      loading: false
    }
  },
  mounted() {
    // this.handleOrderList()
  },
  methods: {
    /**
     * @description: 获取库存列表
     */
    // handleOrderList() {
    //   const { pageNo, pageSize } = this.tableData
    //   this.loading = true
    //   fetchOrderList({
    //     pageNo,
    //     pageSize,
    //     distinct: true, // 去重
    //     orderby: 'createTime',
    //     sort: 'desc',
    //     searchs: JSON.stringify(this.queryForm)
    //   }).then(res => {
    //     this.loading = false
    //     if (res.code === 200) {
    //       this.tableData.data = res.result.itemVOs
    //       this.tableData.total = res.result.totalCount
    //     } else {
    //       this.tableData.data = []
    //       this.tableData.total = 0
    //     }
    //   })
    // },
    handleQueryOrders(form) {
      this.tableData.pageNo = 1
      this.queryForm = form
      this.handleOrderList()
    },
    handlePageChange(page) {
      this.tableData.pageNo = page
      this.handleOrderList()
    },
    handleSizeChange(size) {
      this.tableData.pageNo = 1
      this.tableData.pageSize = size
      this.handleOrderList()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
    margin: 10px;
}
</style>