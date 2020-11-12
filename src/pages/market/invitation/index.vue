<template>
  <div class="app-container">
    <Rules />
    <el-card class="search-content">
			<el-form ref="form" :model="form" label-width="150px" size="mini">
				<el-form-item label="邀请人账号" prop="invitorPhone.value">
					<el-input v-model="form.invitorPhone.value" placeholder="请输入邀请人账号" clearable></el-input>
				</el-form-item>
				<el-form-item label="被邀请人账号" prop="beInvitedPhone.value">
					<el-input v-model="form.beInvitedPhone.value" placeholder="请输入被邀请人账号" clearable></el-input>
				</el-form-item>
				<el-form-item label="邀请奖励是否发放" prop="inviteIsGrant.value">
					<el-select v-model="form.inviteIsGrant.value" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="已发放" value="coupon.CouponGrantType_1"></el-option>
						<el-option label="未发放" value="coupon.CouponGrantType_2"></el-option>
					</el-select>  
				</el-form-item>
				<el-form-item label="被邀请奖励是否发放" prop="beInvitedIsGrant.value">
					<el-select v-model="form.beInvitedIsGrant.value" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="已发放" value="coupon.CouponGrantType_1"></el-option>
						<el-option label="未发放" value="coupon.CouponGrantType_2"></el-option>
					</el-select>  
				</el-form-item>
			</el-form>
			<div class="search-btn">
				<el-button type="plain" size="mini" @click="handleReset">重置</el-button>
				<el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
			</div>
		</el-card>
    <el-table :data="tabledata">
			<el-table-column label="被邀请用户名" prop="beInvitor"></el-table-column>
			<el-table-column label="被邀请用户账号" prop="beInvitedAccount"></el-table-column>
			<el-table-column label="参与时间" prop="createTime"></el-table-column>
			<el-table-column label="参与奖励" prop="beInvitedAward">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.beInvitedAward" :key="index">{{item}} x 1</div>
        </template>
      </el-table-column>
			<el-table-column label="奖励是否发放" prop="inviteIsGrant.describe"></el-table-column>
			<el-table-column label="原因说明" prop="beInvitedRemark"></el-table-column>
			<el-table-column label="邀请用户名" prop="invitor"></el-table-column>
			<el-table-column label="邀请用户账号" prop="inviteAccount"></el-table-column>
			<el-table-column label="奖励内容" prop="inviteAward">
        <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.inviteAward" :key="index">{{item}} x 1</div>
        </template>
      </el-table-column>
			<el-table-column label="奖励是否发放" prop="beInvitedGrant.describe"></el-table-column>
			<el-table-column label="原因说明" prop="inviteRemark"></el-table-column>
		</el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import Rules from './template/rules'
  import { reqInviteRecordList } from '@/api/coupon'
  export default {
    name: 'centerRecord',
    components: {
      Rules,
      Pagination
    },
    data() {
      return {
        data: {},
        form: {
          invitorPhone: { value: '', name: 'invitorPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          beInvitedPhone: { value: '', name: 'beInvitedPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          inviteIsGrant: { value: '', name: 'inviteIsGrant', matchType: MatchType.EQUAL, type: DataType.ENUM },
          beInvitedIsGrant: { value: '', name: 'beInvitedIsGrant', matchType: MatchType.EQUAL, type: DataType.ENUM },
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
        this._reqInviteRecordList(req)
      },
      handleReset() {
        this.form = {
          invitorPhone: { value: '', name: 'invitorPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          beInvitedPhone: { value: '', name: 'beInvitedPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          inviteIsGrant: { value: '', name: 'inviteIsGrant', matchType: MatchType.EQUAL, type: DataType.ENUM },
          beInvitedIsGrant: { value: '', name: 'beInvitedIsGrant', matchType: MatchType.EQUAL, type: DataType.ENUM },
          use: { value: '', name: 'usedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM }
        }
      },
      Jion(list) {
        return list.join(',')
      },
      _reqInviteRecordList(data) {
        return reqInviteRecordList({
          searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'inviteTime',
          sort: 'desc'
        }, this.$route.query.type).then((res) => {
          if (res.code === 200) {
            this.data = res.result
            this.totalCount = res.result.totalCount
            this.tabledata = res.result.itemVOs
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
    .search-btn {
      text-align: right;
    }
  }
</style>
