<template>
  <div class="app-container">
    <el-card class="search-content receiveCollect">
      <div>数据列表</div>
      <el-form label-width="100px" size="mini" class="">
        <el-form-item label="发放总数量：" class="">{{receiveCollect.launchNum}}</el-form-item>
        <el-form-item label="发放总金额：" class="">{{receiveCollect.totalAmount}}</el-form-item>
        <el-form-item label="已领数量：" class="">{{receiveCollect.claimedNum}}</el-form-item>
        <el-form-item label="已领面额：" class="">{{receiveCollect.receivedDenominationTotal}}</el-form-item>
        <el-form-item label="已使用数量：" class="">{{receiveCollect.usedNum}}</el-form-item>
        <el-form-item label="已优惠金额：" class="">{{receiveCollect.deductionAmountTotal}}</el-form-item>
      </el-form>
    </el-card>
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
        <el-form-item label="领取账号" class="" prop="memberPhone.value">
          <el-input v-model="form.memberPhone.value" placeholder="请选择领取账号"></el-input>
        </el-form-item>
        <el-form-item label="使用状态">
          <el-select v-model="form.useStatus.value" placeholder="请选择使用状态" prop="useStatus.value">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in useStatus" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取业务终端">
          <el-select v-model="form.receivedChannelType.value" placeholder="请选择业务终端" prop="receivedChannelType.value">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用业务终端">
          <el-select v-model="form.usedChannelType.value" placeholder="请选择适用业务" prop="usedChannelType.value">
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
      <el-table-column prop="couponCode" label="优惠券码"></el-table-column>
      <el-table-column prop="rule" label="优惠券规则"></el-table-column>
      <el-table-column prop="memberPhone" label="领取账号"></el-table-column>
      <el-table-column prop="receivedTime" label="领取时间"></el-table-column>
      <el-table-column prop="receivedChannelType.describe" label="领取业务终端"></el-table-column>
      <el-table-column prop="useStatus.describe" label="状态"></el-table-column>
      <el-table-column prop="usedTime" label="使用时间">
        <template slot-scope="scope">
          <span v-if="!scope.row.usedTime">——</span>
          <span v-else>{{scope.row.usedTime}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="usedChannelType.describe" label="使用业务渠道">
        <template slot-scope="scope">
          <span v-if="!scope.row.usedChannelType">——</span>
          <span v-else>{{scope.row.usedChannelType.describe}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="tradeNum" label="订单编号">
        <template slot-scope="scope">
          <span v-if="!scope.row.tradeNum">——</span>
          <span v-else>{{scope.row.tradeNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deductionAmount" label="优惠金额"> 
        <template slot-scope="scope">
          <span v-if="!scope.row.deductionAmount">——</span>
          <span v-else>{{scope.row.deductionAmount}}</span>
        </template>
      </el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { reqReceiveQuery } from '@/api/coupon'
  // import option from './json/option.json'
  export default {
    name: 'couponIndex',
    components: {
      Pagination
    },
    data() {
      return {
        form: {
          couponCode: { value: '', name: 'coupon_couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
          useStatus: { value: '', name: 'useStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
          receivedChannelType: { value: '', name: 'receivedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          usedChannelType: { value: '', name: 'usedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM }
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
    // filters: {
    //   type(value) {
    //     return option.type.filter(o => o.id === value)[0]['value']
    //   },
    //   term(value) {
    //     return option.term.filter(o => o.id === value)[0]['value']
    //   },
    //   work(value) {
    //     return option.work.filter(o => o.id === value)[0]['value']
    //   },
    //   status(value) {
    //     return option.status.filter(o => o.id === value)[0]['value']
    //   }
    // },
    mounted() {
      this.search()
    },
    methods: {
      search() {
        let searchParam = searchTool(JSON.parse(JSON.stringify(this.form)))
        this._reqReceiveQuery(searchParam, this.$route.query.couponCode)
      },
      reset() {
        this.form = {
          couponCode: { value: '', name: 'coupon_couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
          useStatus: { value: '', name: 'useStatus', matchType: MatchType.EQUAL, type: DataType.STRING },
          receivedChannelType: { value: '', name: 'receivedChannelType', matchType: MatchType.EQUAL, type: DataType.NUMBER },
          usedChannelType: { value: '', name: 'usedChannelType', matchType: MatchType.EQUAL, type: DataType.NUMBER }
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
      _reqReceiveQuery(data, query) {
        return reqReceiveQuery({ searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc' }, query).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageObj.pageNo
            this.totalCount = result.pageObj.totalCount
            this.tableData = result.pageObj.itemVOs || []
            this.receiveCollect = { ...this.receiveCollect, ... result }
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
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
