<template>
  <div class="app-container">
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="120px" size="mini" class="">
        <el-form-item label="发起用户账号：" class="">
          <el-input v-model="form.joinUserAccount.value" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item label="参团用户账号：">
          <el-input v-model="form.userAccount.value" placeholder="请输入用户账号"></el-input>
        </el-form-item>
        <el-form-item label="成团结果：">
          <el-select v-model="form.receivedChannelType.value" placeholder="请选择业务终端">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in status" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="参团结果：">
          <el-select v-model="form.joinResult.value" placeholder="请选择业务终端">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in jion" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="search">查询</el-button>
        <el-button type="default" size="mini" @click="reset">清空</el-button>
      </div>
    </el-card>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="participantName" label="参团用户名"></el-table-column>
      <el-table-column prop="participantAccount" label="参团用户账号"></el-table-column>
      <el-table-column prop="joinTime" label="参团时间"></el-table-column>
      <el-table-column prop="transactionNum" label="交易单号"></el-table-column>
      <el-table-column prop="transactionAmount" label="交易单金额"></el-table-column>
      <el-table-column prop="joinResult.describe" label="结果"></el-table-column>
      <el-table-column prop="joinFailReason" label="原因说明"></el-table-column>
      <el-table-column prop="initiatorName" label="发起用户名"></el-table-column>
      <el-table-column prop="initiatorAccount" label="发起用户账号"></el-table-column>
      <el-table-column prop="createTime" label="发起时间"></el-table-column>
      <el-table-column prop="joinTotalNum" label="需助力数"></el-table-column>
      <el-table-column prop="joinNum" label="已助力数"></el-table-column>
      <el-table-column prop="accomplishGroupStatus.describe" label="成团结果"></el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { reqGroupBuyActivityQueryRecords } from '@/api/coupon'
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
          joinGroupRecord: { value: '1', name: 'joinGroupRecord', matchType: MatchType.Not_NULL, type: DataType.STRING },
          joinUserAccount: { value: '', name: 'joinGroupRecord.userAccount', matchType: MatchType.CONTAIN, type: DataType.STRING },
          userAccount: { value: '', name: 'userAccount', matchType: MatchType.CONTAIN, type: DataType.STRING },
          receivedChannelType: { value: '', name: 'joinGroupRecord.accomplishGroupStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
          joinResult: { value: '', name: 'joinResult', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        status: [
          { id: 'groupbuyactivity.AccomplishGroupStatus_10', value: '未开始' },
          { id: 'groupbuyactivity.AccomplishGroupStatus_20', value: '待成团' },
          { id: 'groupbuyactivity.AccomplishGroupStatus_30', value: '拼团成功' },
          { id: 'groupbuyactivity.AccomplishGroupStatus_40', value: '拼团失败' },
          { id: 'groupbuyactivity.AccomplishGroupStatus_50', value: '已取消' }
        ],
        jion: [
          // { id: 1, value: '通用' },
          { id: 'groupbuyactivity.JoinResult_10', value: '进行中' },
          { id: 'groupbuyactivity.JoinResult_20', value: '成功' },
          { id: 'groupbuyactivity.JoinResult_30', value: '失败' }
        ],
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        pagePhase: [10, 20, 30, 50],
        totalCount: 0
      }
    },
    mounted() {
      this.search()
    },
    methods: {
      search() {
        let searchParam = searchTool(JSON.parse(JSON.stringify(this.form)))
        this._reqGroupBuyActivityQueryRecords(searchParam)
      },
      reset() {
        this.form = {
          code: { value: Number(this.$route.query.id), name: 'groupBuyActivityId', matchType: MatchType.EQUAL, type: DataType.STRING },
          joinGroupRecord: { value: '1', name: 'joinGroupRecord', matchType: MatchType.Not_NULL, type: DataType.STRING },
          joinUserAccount: { value: '', name: 'joinGroupRecord.userAccount', matchType: MatchType.CONTAIN, type: DataType.STRING },
          userAccount: { value: '', name: 'userAccount', matchType: MatchType.CONTAIN, type: DataType.STRING },
          receivedChannelType: { value: '', name: 'joinGroupRecord.accomplishGroupStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
          joinResult: { value: '', name: 'joinResult', matchType: MatchType.EQUAL, type: DataType.ENUM }
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
