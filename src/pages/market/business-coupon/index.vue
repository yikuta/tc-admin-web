<template>
  <div class="app-container">
    <!-- <create-card></create-card> -->
    <search-bar ref="search" @on-search="onSearch" class="search-bar"></search-bar>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="couponCode" label="优惠券码"></el-table-column>
      <el-table-column prop="couponName" label="优惠券名称"></el-table-column>
      <el-table-column label="优惠券类型">
        <template slot-scope="scope">
          {{ scope.row.couponType.describe }}
        </template>
      </el-table-column>
      <el-table-column prop="rule" label="优惠券规则" width="180px"></el-table-column>
      <!-- <el-table-column label="业务终端">
        <template slot-scope="scope">
          {{ scope.row.channelType.describe }}
        </template>
      </el-table-column>
      <el-table-column prop="work" label="适用业务">
        <template slot-scope="scope">
          {{ getBusinessTypeList(scope.row.businessTypeList) }}
        </template>
      </el-table-column>
      <el-table-column prop="store" label="适用门店">
        <template slot-scope="scope">
          <span v-if="scope.row.shopUsableType.value == 1">{{scope.row.shopUsableType.describe}}</span>
          <el-button v-else type="text" @click="showItemSelected('depot', scope.row)">点击查看</el-button>
        </template>
      </el-table-column> -->
      <el-table-column prop="goods" label="适用商品">
        <template slot-scope="scope">
          <span v-if="scope.row.commodityUsableType.value == 1">{{scope.row.commodityUsableType.describe}}</span>
          <el-button v-else type="text" @click="showItemSelected('goods', scope.row)">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="已领/总发放">
        <template slot-scope="scope">
          <span v-if="scope.row.sceneType.value == 3">——</span>
          <span v-else>{{ scope.row.claimedNum }}/{{ scope.row.launchNum }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalAmount" label="发放金额">
        <template slot-scope="scope">
          <span v-if="scope.row.totalAmount">{{scope.row.totalAmount}}</span>
          <span v-else>——</span>
        </template>
      </el-table-column>
      <el-table-column prop="availableTime" label="可领时间" width="180px">
        <template slot-scope="scope">
          <div>{{scope.row.availableTime.split(' 至 ')[0]}}</div>
          <div>至</div>
          <div>{{scope.row.availableTime.split(' 至 ')[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="availableTime" label="使用时间" width="180px">
        <template slot-scope="scope">
          <div>{{scope.row.availableTime.split(' 至 ')[0]}}</div>
          <div>至</div>
          <div>{{scope.row.availableTime.split(' 至 ')[1]}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="createShopName" label="所属门店"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          {{ scope.row.status.describe }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="rejectedReason" label="驳回原因"></el-table-column> -->
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <!-- <el-link type="primary" @click="addAudit(row)" v-show="row.status.value == 10 || row.status.value == 40">提交审核</el-link>
          <el-link type="primary" @click="edit(row)" v-show="row.sceneType.value != 3 && (row.status.value == 10 || row.status.value == 30 || row.status.value == 40)">编辑</el-link>
          <el-link type="primary" @click="invalid(row)" v-show="!(row.status.value == 60 || row.status.value == 70)">作废</el-link>
          <el-link type="primary" @click="copy(row)">复制</el-link> -->
          <el-link type="primary" @click="showDetail(row)">查看</el-link>
          <el-link type="primary" @click="$router.push({ path: '/market/couponManager/coupon/receive-detail', query: { couponCode: row.couponCode }})">领取详情</el-link>
          <el-link type="primary" @click="log(row)" v-np="'COUPON_FOR_SHOP_OPERATION_LOG_VIEW'">操作日志</el-link>
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
  import { reqQueryShopCoupon, reqAddAudit, reqInvalid } from '@/api/coupon'
  import option from './json/option.json'
  // import CreateCard from './templates/create-card'
  import SearchBar from './templates/search'
  import ShowSelected from './templates/show-selected'
  export default {
    name: 'couponIndex',
    components: {
      SearchBar,
      ShowSelected,
      Pagination
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
        this._reqQueryShopCoupon(req)
      },
      addAudit(item) {
        // 提交审核
        this.$confirm('提交审核后不能编辑优惠券，是否提交审核', '提交审核', {
          confirmButtonText: '提交',
          cancelButtonText: '取消'
        }).then(() => {
          // 执行提交审核请求
          this._reqAddAudit(item.couponCode, item.version)
        }).catch(() => {
        })
      },
      edit(item) {
        if (item.status.value === 30) { // 发布中编辑
          let query = {
            couponType: item.couponType.value === 1 ? 'DOORFILL' : 'DISCOUNT',
            type: 'release',
            version: item.version,
            couponCode: item.couponCode
          }
          this.$router.push({ path: '/market/couponManager/form_edit', query: query })
        } else {
          let query = {
            couponType: item.couponType.value === 1 ? 'DOORFILL' : 'DISCOUNT',
            type: 'edit',
            version: item.version,
            couponCode: item.couponCode
          }
          this.$router.push({ path: '/market/couponManager/form_edit', query: query })
        }
      },
      copy(item) {
        let query = {
          couponType: item.couponType.value === 1 ? 'DOORFILL' : 'DISCOUNT',
          type: 'copy',
          version: item.version,
          couponCode: item.couponCode
        }
        this.$router.push({ path: '/market/couponManager/form_copy', query: query })
      },
      showDetail(item) {
        let query = {
          couponType: item.couponType.value === 1 ? 'DOORFILL' : 'DISCOUNT',
          type: 'show',
          version: item.version,
          couponCode: item.couponCode,
          business: true
        }
        this.$router.push({ path: '/market/couponManager/form_show', query: query })
      },
      // 操作日志
      log(row) {
        let query = {
          couponName: row.couponName,
          couponCode: row.couponCode,
          rule: row.rule
        }
        this.$router.push({ path: '/market/couponManager/business-log', query })
      },
      invalid(item) {
        // 作废
        this.$confirm('优惠券作废不影响已领取优惠券，是否确认作废', '优惠券作废', {
          confirmButtonText: '作废',
          cancelButtonText: '取消'
          // type: 'info'
        }).then(() => {
          // 执行提交审核请求
          this._reqInvalid(item.couponCode)
        }).catch(() => {
        })
      },
      // ***请求处理***
      _reqQueryShopCoupon(data) {
        return reqQueryShopCoupon({
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
      // 提交审核请求
      _reqAddAudit(sourceCode, version) {
        return reqAddAudit({
          sourceCode: sourceCode,
          version: version,
          sponsor: '', // 当前登录账户
          sponsorId: 1
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
      // 提交作废请求
      _reqInvalid(sourceCode) {
        return reqInvalid({
          couponCode: sourceCode
          // sponsor: '',
          // sponsorId: 0
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
      getBusinessTypeList(list) {
        let text = ''
        list.map((item) => {
          text += item.describe
        })
        return text
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-bar{margin:20px 0;}
</style>
