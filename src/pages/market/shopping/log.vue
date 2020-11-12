<template>
  <div class="app-container">
    <div class="detail-head">
      <span>场次操作日志</span>
    </div>
    <div class="container">
      <p>活动名称：{{$route.query.orderActivityName}}</p>
      <p>活动ID：{{$route.query.orderActivityCode}}</p>
      <div>优惠规则：
        <p v-for="(item, index) in fullGiveCouponRule($route.query.fullGiveCouponRule)" :key="index">
          {{ item }}
        </p>
      </div>
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
  name: 'shoppingLog',
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
    fullGiveCouponRule(rule) {
      let arr = []
      rule.fullGiveItemForDisCountList.map((item) => {
        if (rule.deductionUnitType.value === 1) {
          arr.push('满' + item.satisfyMoney + '元 赠' + item.couponCode + item.couponName + rule.giftType.describe + ' x ' + item.userSingleCount)
        } else {
          arr.push('满' + item.satisfyPiece + '件 赠' + item.couponCode + item.couponName + rule.giftType.describe + ' x ' + item.userSingleCount)
        }
      })
      return arr
    },
    handleDataList() {
      reqPromotionLogList({
        identifier: 'order_activity_' + this.$route.query.orderActivityCode,
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
      const { orderActivityCode } = this.$route.query
      let routeUrl = this.$router.resolve({
        path: '/market/shopping/form_show',
        query: {
          type: 'show',
          version: version,
          orderActivityCode
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
