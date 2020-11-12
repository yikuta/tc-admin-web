<template>
  <div class="app-container">
    <div class="detail-head">
      <span>{{$route.query.title}}</span>
    </div>
    <div class="container">
      <base-table :columns="dColumns" :list="tableData">
        <template slot="content" slot-scope="{ row }">
          <div>{{row.content}}</div>
        </template>
      </base-table>
      <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
    </div>
  </div>
</template>
<script>
import BaseTable from '@/components/BaseTable'
import Pagination from '@/components/Pagination'
import { COLUMNS } from '../config'
import { reqPromotionLogList } from '@/api/common'
export default {
  name: 'secondsKillLog',
  components: { BaseTable, Pagination },
  data() {
    return {
      dColumns: COLUMNS,
      tableData: [],
      currentPage: 1,
      totalCount: 0,
      pageSize: 10
    }
  },
  mounted() {
    this.handleDataList()
  },
  methods: {
    handleDataList() {
      reqPromotionLogList({
        identifier: this.$route.query.code,
        logServerType: 'PROMOTE_LOG',
        page: this.currentPage,
        size: this.pageSize
      }).then(res => {
        if (res.code === 200) {
          let result = res.result || {}
          this.currentPage = result.pageNo
          this.totalCount = result.totalCount
          this.tableData = result.itemVOs || []
        }
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleDataList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.handleDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
.detail-head{
  display: flex;
  justify-content: space-between;
  padding: 0 0 10px;
  font-size: 14px;
  span{
    line-height: 32px;
    &::before{
      content: '';
      display: inline-block;
      width: 5px;
      height: 20px;
      background: rgba(64, 158, 255, 1);
      float: left;
      margin: 6px 8px 0 0;
    }
  }
}
</style>