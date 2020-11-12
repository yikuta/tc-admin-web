<template>
  <div class="app-container">
    <el-card class="receiveCollect">
      <div>数据概览</div>
      <el-form label-width="100px" size="mini" class="">
        <el-form-item label="赠品情况：" class="">
          <div>发起总数：{{giftList.initiateTotalNum}}</div>
          <div>未开始：{{giftList.notStartNum}}</div>
          <div>待成团：{{giftList.notConstituteGroupNum}}</div>
          <div>拼团成功：{{giftList.finishGroupNum}}</div>
          <div>拼团失败：{{giftList.failGroupNum}}</div>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="120px" size="mini" class="">
        <el-form-item label="发起用户账号：" class="">
          <el-input v-model="form.userAccount.value" placeholder="请输入订单号"></el-input>
        </el-form-item>
        <el-form-item label="成团结果：">
          <el-select v-model="form.receivedChannelType.value" placeholder="请选择业务终端" prop="receivedChannelType.value">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in status" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="search">查询</el-button>
        <el-button type="default" size="mini" @click="reset">清空</el-button>
      </div>
    </el-card>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="initiatorName" label="发起用户名"></el-table-column>
      <el-table-column prop="initiatorAccount" label="发起用户账号"></el-table-column>
      <el-table-column prop="transactionNum" label="交易单号"></el-table-column>
      <el-table-column prop="transactionAmount" label="交易单金额"></el-table-column>
      <el-table-column prop="createTime" label="发起时间"></el-table-column>
      <el-table-column prop="joinTotalNum" label="需助力数"></el-table-column>
      <el-table-column prop="joinNum" label="已助力数"></el-table-column>
      <el-table-column prop="accomplishGroupStatus.describe" label="成团结果"></el-table-column>
      <el-table-column prop="accomplishGroupTime" label="成团时间"></el-table-column>
      <el-table-column prop="createFailReason" label="失败原因"></el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { reqGroupBuyActivityQueryRecords, reqGroupBuyActivityStatistics } from '@/api/coupon'
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
          code: { value: Number(this.$route.query.id), name: 'groupBuyActivity', matchType: MatchType.EQUAL, type: DataType.STRING },
          joinGroupRecord: { value: '1', name: 'joinGroupRecord', matchType: MatchType.NULL, type: DataType.STRING },
          userAccount: { value: '', name: 'userAccount', matchType: MatchType.CONTAIN, type: DataType.STRING },
          receivedChannelType: { value: '', name: 'accomplishGroupStatus', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        status: [
          { id: 'groupbuyactivity.AccomplishGroupStatus_10', value: '未开始' },
          { id: 'groupbuyactivity.AccomplishGroupStatus_20', value: '待成团' },
          { id: 'groupbuyactivity.AccomplishGroupStatus_30', value: '拼团成功' },
          { id: 'groupbuyactivity.AccomplishGroupStatus_40', value: '拼团失败' },
          { id: 'groupbuyactivity.AccomplishGroupStatus_50', value: '已取消' }
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
      this._reqGroupBuyActivityStatistics({ groupBuyActivityId: this.$route.query.id })
      this.search()
    },
    methods: {
      search() {
        let searchParam = searchTool(JSON.parse(JSON.stringify(this.form)))
        this._reqGroupBuyActivityQueryRecords(searchParam)
      },
      reset() {
        this.form = {
          code: { value: Number(this.$route.query.id), name: 'groupBuyActivity', matchType: MatchType.EQUAL, type: DataType.STRING },
          joinGroupRecord: { value: '1', name: 'joinGroupRecord', matchType: MatchType.NULL, type: DataType.STRING },
          userAccount: { value: '', name: 'userAccount', matchType: MatchType.CONTAIN, type: DataType.STRING },
          receivedChannelType: { value: '', name: 'accomplishGroupStatus', matchType: MatchType.EQUAL, type: DataType.ENUM }
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
      _reqGroupBuyActivityStatistics(data) {
        return reqGroupBuyActivityStatistics(data).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.giftList = result
          }
        })
      },
      _reqGroupBuyActivityQueryRecords(data) {
        return reqGroupBuyActivityQueryRecords({ searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc' }).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
            // this.receiveCollect = { ...this.receiveCollect, ... result }
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
