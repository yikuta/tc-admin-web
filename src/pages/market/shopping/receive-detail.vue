<template>
  <div class="app-container">
    <el-card class="receiveCollect">
      <div>数据概览</div>
      <el-form label-width="100px" size="mini" class="">
        <el-form-item label="赠品情况：" class="">
          <div v-for="item in giftList" :key="item.id">
            <span v-if="item.satisfyMoney">满{{item.satisfyMoney}}元 送{{item.couponCode}} {{item.couponName}} x {{item.userSingleCount}} 总发放{{item.totalCount}} 已发放{{Number(item.receivedNum)}}</span>
            <span v-else>满{{item.satisfyPiece}}件 送{{item.couponCode}} {{item.couponName}} x {{item.userSingleCount}} 总发放{{item.totalCount}} 已发放{{Number(item.receivedNum)}}</span>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
        <el-form-item label="订单号：" class="">
          <el-input v-model="form.orderTradeNum.value" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="用户账号：">
          <el-input v-model="form.memberPhone.value" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item label="业务终端：">
          <el-select v-model="form.receivedChannelType.value" placeholder="请选择业务终端" prop="receivedChannelType.value">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="search">查询</el-button>
        <el-button type="default" size="mini" @click="reset">清空</el-button>
      </div>
    </el-card>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="memberPhone" label="用户账号"></el-table-column>
      <el-table-column prop="createTime" label="参与时间" width="150"></el-table-column>
      <el-table-column prop="receivedChannelType.describe" label="业务终端">
        <!-- <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.receivedChannelType" :key="index">
            {{ item.describe }}
          </div>
        </template> -->
      </el-table-column>
      <el-table-column prop="orderTradeNum" label="交易单号" width="180">
        <template slot-scope="scope">
          <div v-for="(item, index) in getOrderTradeNumList(scope.row.orderTradeNum)" :key="index">
            {{ item }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="orderAmount" label="订单金额"></el-table-column>
      <el-table-column prop="giftType.describe" label="优惠类型"></el-table-column>
      <el-table-column prop="orderActivityDisCountDetailList" label="优惠内容" width="300">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.orderActivityDisCountDetailList" :key="index">
            <span>{{item.couponCode}} {{item.couponName}} x {{item.couponNum}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="result.describe" label="发放结果"></el-table-column>
      <el-table-column prop="remark" label="说明"></el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { reqOrderActivityReceive, reqOrderActivityStatistics } from '@/api/coupon'
  // import option from './json/option.json'
  export default {
    name: 'couponIndex',
    components: {
      Pagination
    },
    data() {
      return {
        giftList: [],
        form: {
          code: { value: this.$route.query.orderActivityCode, name: 'orderActivity.orderActivityCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          orderTradeNum: { value: '', name: 'orderNums.orderNum', matchType: MatchType.CONTAIN, type: DataType.STRING },
          memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          receivedChannelType: { value: '', name: 'receivedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        useStatus: [
          { id: 'coupon.CouponDetailStatus_1', value: '未使用' },
          { id: 'coupon.CouponDetailStatus_2', value: '已使用' },
          { id: 'coupon.CouponDetailStatus_3', value: '已过期' }
        ],
        option: [
          // { id: 1, value: '通用' },
          { id: 'ChannelType_2', value: '天呈生活APP' },
          { id: 'ChannelType_3', value: '天呈生活小程序' },
          { id: 'ChannelType_4', value: '天呈净菜小程序' }
        ],
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        pagePhase: [10, 20, 30, 50],
        totalCount: 0,
        receiveCollect: {
          claimedNum: '',
          couponCode: '',
          deductionAmountTotal: '',
          launchNum: '',
          receivedDenominationTotal: '',
          totalAmount: '',
          usedNum: ''
        }
      }
    },
    mounted() {
      this._reqOrderActivityStatistics({ orderActivityCode: this.$route.query.orderActivityCode })
      this.search()
    },
    methods: {
      search() {
        let searchParam = searchTool(JSON.parse(JSON.stringify(this.form)))
        this._reqOrderActivityReceive(searchParam)
      },
      reset() {
        this.form = {
          code: { value: this.$route.query.orderActivityCode, name: 'orderActivity.orderActivityCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          orderTradeNum: { value: '', name: 'orderNums.orderNum', matchType: MatchType.CONTAIN, type: DataType.STRING },
          memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          receivedChannelType: { value: '', name: 'receivedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM }
        }
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.search()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.search()
      },
      getOrderTradeNumList(info) {
        let list = info.split(',')
        return list
      },
      _reqOrderActivityStatistics(data) {
        return reqOrderActivityStatistics(data).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.giftList = result
          }
        })
      },
      _reqOrderActivityReceive(data) {
        return reqOrderActivityReceive({ searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc' }).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
            this.receiveCollect = { ...this.receiveCollect, ... result }
          }
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .receiveCollect {
    margin-bottom: 10px;
    /deep/ .el-card__body {
      padding-bottom: 0;
    }
  }
  .search-content{
    // margin:20px 0;
    /deep/ .el-form{display: flex;flex-wrap: wrap;
      .el-form-item{width:33%;
        .el-select{width:100%;}
      }
    }
    .search-btn{text-align: right;}
  }
</style>
