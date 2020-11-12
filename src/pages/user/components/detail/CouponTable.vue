<template>
  <div class="wrapper">
    <el-table 
      :data="tableData" 
      style="width: 100%" 
      :cell-style="{ textAlign:'center' }" 
      :header-cell-style="{ textAlign:'center' }" 
      size="mini" 
      max-height="500"
      v-loading='loading'>
      <el-table-column prop="couponName" label="优惠券名称"></el-table-column>
      <el-table-column prop="useEndTime" label="到期时间"></el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { fetchUserCouponList } from '@/api/user'
export default {
  name: 'CouponTable',
  components: { Pagination },
  props: {
    id: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      loading: false
    }
  },
  mounted() {
    this.handleCouponList()
  },
  methods: {
    handleCouponList() {
      this.loading = true
      fetchUserCouponList({
        memberId: this.id,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        status: 'NOT_USE'
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.tableData = res.result.itemVOs || []
          this.totalCount = res.result.totalCount
        } else {
          this.tableData = []
          this.totalCount = 0
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    },
    onPageChange(page) {
      this.currentPage = page
      this.handleCouponList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleCouponList()
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
