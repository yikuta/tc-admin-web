<template>
  <div class="app-container">
    <div class="detail-head">
      <span>优惠券操作日志</span>
    </div>
    <div class="container">
      <p>优惠券名称：{{$route.query.couponName}}</p>
      <p>优惠券码：{{$route.query.couponCode}}</p>
      <p>优惠规则：{{$route.query.rule}}</p>
      <p>操作日志</p>
      <base-table :columns="dColumns" :list="tableData">
        <template slot="content" slot-scope="{ row }">
          <div v-if="row.contentJson">
            {{row.contentJson.context}},从版本
            <span class='link' @click="handleLink(row.contentJson.lastVersion)">{{row.contentJson.lastVersion}}</span> 变更到版本
            <span class='link' @click="handleLink(row.contentJson.currentVersion)">{{row.contentJson.currentVersion}}</span>
          </div>
          <div v-else>{{row.content}}</div>
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
  name: 'businessCouponLog',
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
        identifier: 'coupon_' + this.$route.query.couponCode,
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
    },
    handleLink(version) {
      const { couponType, couponCode } = this.$route.query
      let routeUrl = this.$router.resolve({
        path: '/market/couponManager/form_show',
        query: {
          couponType: couponType === 1 ? 'DOORFILL' : 'DISCOUNT',
          type: 'show',
          version: version,
          couponCode
        }
      })
      window.open(routeUrl.href, '_blank')
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
.link{
  color: #409EFF;
  cursor: pointer;
}
</style>