<template>
  <div class="app-container">
    <el-card>
      <search-card @query="handleQueryOrders" ref="search"/>
      <order-list
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
</template>
<script>
import SearchCard from './SearchCard.vue'
import OrderList from './OrderList'
import Pagination from '@/components/Pagination'
import { fetchOrderList } from '@/api/order'
// import searchTool from '@/utils/searchTool'
// import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'merchantOwned',
  components: {
    SearchCard,
    OrderList,
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
      queryForm: [],
      loading: false
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!from.name) {
      next(vm => {
        if (vm.$refs.search) {
          if (to.query.memberPhone) {
            vm.$refs.search.form.userPhone.value = to.query.memberPhone
          } else if (to.query.date) {
            vm.$refs.search.form.createTime.value = [to.query.date, to.query.date]
          }
        }
        vm.$refs.search.submitQueryForm()
      })
    } else {
      next(vm => {
        if (vm.$refs.search) {
          if (to.query.memberPhone) {
            vm.$refs.search.form.userPhone.value = to.query.memberPhone
          } else if (to.query.date) {
            vm.$refs.search.form.createTime.value = [to.query.date, to.query.date]
          }
        }
        vm.$refs.search.submitQueryForm()
      })
    }
  },
  methods: {
    /**
     * @description: 获取订单列表
     */
    handleOrderList() {
      const { pageNo, pageSize } = this.tableData
      this.loading = true
      fetchOrderList({
        pageNo,
        pageSize,
        orderby: 'createTime',
        sort: 'desc',
        searchs: JSON.stringify(this.queryForm)
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.tableData.data = res.result.itemVOs
          this.tableData.total = res.result.totalCount
        } else {
          this.tableData.data = []
          this.tableData.total = 0
        }
      }).catch(() => {
        this.loading = false
      })
    },
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
