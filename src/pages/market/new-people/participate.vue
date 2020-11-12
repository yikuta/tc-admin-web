<template>
  <div class="app-container">
    <div>
      <div>
        <span>券码总数：{{data.couponCount}}</span>
        <span>失效数量：{{data.invalidCount}}</span>
      </div>
      <div>
        <span>总发放数量：{{data.launchCount}}</span>
        <span>已发放数量：{{data.claimedCount}}</span>
        <span>已使用数量：{{data.usedCount}}</span>
      </div>
    </div>
    <el-card class="search-content">
			<el-form ref="form" :model="form" label-width="100px" size="mini">
				<el-form-item label="优惠券码" prop="code.value">
					<el-input v-model="form.code.value" placeholder="请输入优惠券码" clearable></el-input>
				</el-form-item>
				<el-form-item label="领取账号" prop="tel.value">
					<el-input v-model="form.tel.value" placeholder="请输入领取账号" clearable></el-input>
				</el-form-item>
				<el-form-item label="使用状态" prop="status.value">
					<el-select v-model="form.status.value" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="未使用" value="coupon.CouponDetailStatus_1"></el-option>
						<el-option label="已使用" value="coupon.CouponDetailStatus_2"></el-option>
						<el-option label="已过期" value="coupon.CouponDetailStatus_3"></el-option>
					</el-select>  
				</el-form-item>
				<el-form-item label="领取平台" prop="goodsType.value">
					<el-select v-model="form.goodsType.value" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="天呈生活APP" value="ChannelType_2"></el-option>
						<el-option label="天呈生活小程序" value="ChannelType_3"></el-option>
						<el-option label="天呈净菜小程序" value="ChannelType_4"></el-option>
					</el-select>  
				</el-form-item>
				<el-form-item label="使用平台" prop="use.value">
					<el-select v-model="form.use.value" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="天呈生活APP" value="ChannelType_2"></el-option>
						<el-option label="天呈生活小程序" value="ChannelType_3"></el-option>
						<el-option label="天呈净菜小程序" value="ChannelType_4"></el-option>
					</el-select>  
				</el-form-item>
			</el-form>
			<div class="search-btn">
				<el-button type="plain" size="mini" @click="handleReset">重置</el-button>
				<el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
			</div>
		</el-card>
    <el-table :data="tabledata" border>
			<el-table-column label="优惠券码" prop="couponCode"></el-table-column>
			<el-table-column label="优惠规则" prop="rule"></el-table-column>
			<el-table-column label="领取账号" prop="memberPhone"></el-table-column>
			<el-table-column label="领取时间" prop="receivedTime"></el-table-column>
			<el-table-column label="领取平台" prop="receivedChannelType.describe"></el-table-column>
			<el-table-column label="状态" prop="useStatus.describe"></el-table-column>
			<el-table-column label="使用时间" prop="usedTime"></el-table-column>
			<el-table-column label="使用平台" prop="usedChannelType.describe"></el-table-column>
			<el-table-column label="交易单号" prop="tradeNum"></el-table-column>
			<el-table-column label="优惠金额" prop="deductionAmount"></el-table-column>
		</el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { reqNewPeopleCouponReceiveQuery } from '@/api/coupon'
  export default {
    name: 'newPeopleRecord',
    components: {
      Pagination
    },
    data() {
      return {
        data: {},
        form: {
          code: { value: '', name: 'coupon.couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          tel: { value: '', name: 'memberPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          status: { value: '', name: 'useStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
          goodsType: { value: '', name: 'receivedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          use: { value: '', name: 'usedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        tabledata: [],
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      }
    },
    mounted() {
      this.submitQuery()
    },
    methods: {
      submitQuery() {
        let req = searchTool(JSON.parse(JSON.stringify(this.form)))
        this._reqQueryAuditList(req)
      },
      handleReset() {
        this.form = {
          code: { value: '', name: 'coupon.couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          tel: { value: '', name: 'memberPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          status: { value: '', name: 'useStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
          goodsType: { value: '', name: 'receivedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          use: { value: '', name: 'usedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM }
        }
      },
      _reqQueryAuditList(data) {
        return reqNewPeopleCouponReceiveQuery({
          searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }, this.$route.query.type).then((res) => {
          if (res.code === 200) {
            this.data = res.result
            this.totalCount = res.result.pageObj.totalCount
            this.tabledata = res.result.pageObj.itemVOs
          }
        })
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.submitQuery()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.submitQuery()
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-container {
    > .search-content {
      margin: 20px 0;
    }
    .title {
      font-size: 26px;
      margin-bottom: 12px;
    }
    /deep/ .el-divider {
      margin: 12px 0;
    }
    .table-title {
      margin-top: 8px;
      padding: 12px 8px;
      border: 1px solid #EBEEF5;
      display: flex;
      justify-content: space-between;
    }
    /deep/ .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 33%;
        .el-select {
          width: 100%;
        }
      }
    }
    .search-btn {
      text-align: right;
    }
  }
</style>
