<template>
  <div class="app-container">
    <create-card></create-card>
    <search-bar ref="search" @on-search="onSearch" class="search-bar"></search-bar>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="orderActivityCode" label="活动编码"></el-table-column>
      <el-table-column prop="orderActivityName" label="活动名称"></el-table-column>
      <el-table-column label="活动类型">
        <template slot-scope="scope">
          {{ scope.row.orderActivityType.describe }}
        </template>
      </el-table-column>
      <el-table-column prop="rule" label="优惠规则" width="180px">
        <template slot-scope="scope">
          <div v-for="(item, index) in fullGiveCouponRule(scope.row.fullGiveCouponRule)" :key="index">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="适用渠道">
        <template slot-scope="scope">
          {{ scope.row.channelType.describe }}
        </template>
      </el-table-column>
      <el-table-column prop="businessType.describe" label="适用业务">
        <!-- <template slot-scope="scope">
          {{ getBusinessTypeList(scope.row.businessTypeSet) }}
        </template> -->
      </el-table-column>
      <el-table-column prop="store" label="适用门店">
        <template slot-scope="scope">
          <span v-if="scope.row.orderActivityStore.length == 0">全部门店</span>
          <el-button v-else type="text" @click="showItemSelected('depot', scope.row)" v-np="'ACTIVITY_ORDER_APPLICABLE_SHOP_FIND'">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="goods" label="适用商品">
        <template slot-scope="scope">
          <span v-if="scope.row.orderActivityCommodity.length == 0">全部商品</span>
          <el-button v-else type="text" @click="showItemSelected('goods', scope.row)" v-np="'ACTIVITY_ORDER_APPLICABLE_PRODUCT_FIND'">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="orderActivityTimeList" label="参与时间" width="180px">
        <template slot-scope="scope">
          <div>{{scope.row.orderActivityTimeList[0]}}</div>
          <div>至</div>
          <div>{{scope.row.orderActivityTimeList[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status.describe }}
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="驳回原因"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="addAudit(row)" v-show="row.status.value == 10 || row.status.value == 40" v-np="'ACTIVITY_FOR_ORDER_SUBMIT'">提交审核</el-link>
          <el-link type="primary" @click="edit(row)" v-show="(row.status.value == 10 || row.status.value == 30 || row.status.value == 40)">编辑</el-link>
          <el-link type="primary" @click="del(row)" v-show="row.status.value == 10 || row.status.value == 20 || row.status.value == 40" v-np="'ACTIVITY_FOR_ORDER_DELETE'">删除</el-link>
          <el-link type="primary" @click="invalid(row)" v-show="row.status.value == 25 || row.status.value == 30 || row.status.value == 50 || row.status.value == 60" v-np="'ACTIVITY_FOR_ORDER_DISCARD'">作废</el-link>
          <el-link type="primary" @click="copy(row)">复制</el-link>
          <el-link type="primary" @click="showDetail(row)" v-np="'ACTIVITY_FOR_ORDER_VIEW'">查看</el-link>
          <el-link type="primary" @click="$router.push({ path: '/market/shopping/receive', query: { orderActivityCode: row.orderActivityCode, version: row.version }})" v-np="'ACTIVITY_ORDER_APPLY_DETAIL_VIEW'">参与详情</el-link>
          <el-link type="primary" v-np="'COMMON_OPERATE_LOG'" @click="log(row)">操作日志</el-link>
        </template>
      </el-table-column>
    </el-table>
    <!-- <show-selected ref="showSelected" :showType="showType" :item="clickTableItem"></show-selected> -->
    <show-selected ref="showSelected"></show-selected>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import searchTool from '@/utils/searchTool'
  import { reqActivityList, reqSubmitAudit, reqOrderActivityQueue } from '@/api/coupon'
  import option from './json/option.json'
  import CreateCard from './templates/create-card'
  import SearchBar from './templates/search'
  import ShowSelected from './templates/show-selected'
  export default {
    name: 'couponIndex',
    components: {
      CreateCard,
      SearchBar,
      Pagination,
      ShowSelected
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        pagePhase: [10, 20, 30, 50]
        // showType: '',
        // clickTableItem: {}
      }
    },
    filters: {
      type(value) {
        return option.type.filter(o => o.id === value)[0]['value']
      },
      term(value) {
        return option.term.filter(o => o.id === value)[0]['value']
      },
      work(value) {
        return option.work.filter(o => o.id === value)[0]['value']
      },
      status(value) {
        return option.status.filter(o => o.id === value)[0]['value']
      }
    },
    created() {
      this.$nextTick(() => {
        // 获取商品商品列表
        this.onSearch()
      })
    },
    methods: {
      onSearch() {
        // 查询
        let req = searchTool(JSON.parse(JSON.stringify(this.$refs['search'].form)))
        this._reqActivityList(req)
      },
      addAudit(item) {
        // 提交审核
        this.$confirm('提交审核后不能编辑活动，是否提交审核', '提交审核', {
          confirmButtonText: '提交',
          cancelButtonText: '取消'
        }).then(() => {
          // 执行提交审核请求
          this._reqSubmitAudit(item.id, 1)
        }).catch(() => {
        })
      },
      edit(item) {
        if (item.status.value === 30) { // 发布中编辑
          let query = {
            type: 'release',
            version: item.version,
            orderActivityCode: item.orderActivityCode
          }
          this.$router.push({ path: '/market/shopping/form_edit', query: query })
        } else {
          let query = {
            type: 'edit',
            version: item.version,
            orderActivityCode: item.orderActivityCode
          }
          this.$router.push({ path: '/market/shopping/form_edit', query: query })
        }
      },
      copy(item) {
        let query = {
          type: 'copy',
          version: item.version,
          orderActivityCode: item.orderActivityCode
        }
        this.$router.push({ path: '/market/shopping/form_copy', query: query })
      },
      // 操作日志
      log(row) {
        let query = {
          orderActivityName: row.orderActivityName,
          orderActivityCode: row.orderActivityCode,
          fullGiveCouponRule: row.fullGiveCouponRule
        }
        this.$router.push({ path: '/market/shopping/log', query })
      },
      showDetail(item) {
        let query = {
          type: 'show',
          version: item.version,
          orderActivityCode: item.orderActivityCode
        }
        this.$router.push({ path: '/market/shopping/form_show', query: query })
      },
      invalid(item) {
        // 作废
        this.$confirm('活动作废后，已生成的订单优惠不变，是否确认作废', '活动作废', {
          confirmButtonText: '作废',
          cancelButtonText: '取消'
          // type: 'info'
        }).then(() => {
          // 执行提交审核请求
          this._reqSubmitAudit(item.id, 2)
        }).catch(() => {
        })
      },
      del(item) {
        this.$confirm('活动删除后无法恢复，请确认是否删除', '活动删除', {
          confirmButtonText: '删除',
          cancelButtonText: '取消'
          // type: 'info'
        }).then(() => {
          this._reqOrderActivityQueue(item.id)
        })
      },
      // ***请求处理***
      _reqActivityList(data) {
        return reqActivityList({
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
              this.tableData = result.itemVOs || []
            }
          })
          .catch(() => {
          })
      },
      // 删除
      _reqOrderActivityQueue(data) {
        return reqOrderActivityQueue(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.onSearch()
          }
        })
      },
      // 提交审核请求
      _reqSubmitAudit(orderActivityId, status) {
        return reqSubmitAudit({
          orderActivityId: orderActivityId,
          status: status
        })
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: res.message,
                type: 'success'
              })
              this.onSearch()
            } else {
              // this.$message({
              //   message: res.message,
              //   type: 'error'
              // })
            }
          })
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.onSearch()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.onSearch()
      },
      showItemSelected(type, item) {
        // this.showType = type
        // this.clickTableItem = item
        // this.clickTableItemOptionalType = 'TYPE'
        this.$refs.showSelected.showDialog(type, item)
      },
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
      getBusinessTypeList(list) {
        let text = ''
        list.map((item) => {
          text += item.describe + ' '
        })
        return text
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-bar{margin:20px 0;}
</style>
