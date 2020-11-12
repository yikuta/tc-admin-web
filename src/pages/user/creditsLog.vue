<template>
  <div class="app-container">
    <el-card class="search-content">
			<el-form ref="form" :model="form" label-width="100px" size="mini">
				<el-form-item label="变动标识" prop="code.value">
					<el-input v-model="form.code.value" placeholder="请输入变动标识" clearable></el-input>
				</el-form-item>
        <el-form-item label="变动时间">
          <el-date-picker
            v-model="form.time.value"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
			</el-form>
			<div class="search-btn">
				<el-button type="plain" size="mini" @click="handleReset">清空</el-button>
				<el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
			</div>
		</el-card>
    <el-table :data="tabledata" size="mini">
			<el-table-column label="变动时间" prop="updateTime"></el-table-column>
			<el-table-column label="标识" prop="tagCode"></el-table-column>
			<el-table-column label="积分变动数" prop="changeNum"></el-table-column>
			<el-table-column label="变动后积分数" prop="lastNum"></el-table-column>
			<el-table-column label="事项说明" prop="sourceType.describe"></el-table-column>
			<el-table-column label="来源" prop="sourceChannel.describe"></el-table-column>
		</el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { userCreditsLog } from '@/api/user'
  export default {
    name: 'newPeopleManager',
    components: {
      Pagination
    },
    data() {
      return {
        form: {
          time: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
          code: { value: '', name: 'tagCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          user: { value: this.$route.query.memberCode, name: 'userIntegral.memberCode', matchType: MatchType.EQUAL, type: DataType.STRING }
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
        this._userCreditsLog(req)
      },
      handleReset() {
        this.form = {
          time: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
          code: { value: '', name: 'tagCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          user: { value: this.$route.query.memberCode, name: 'userIntegral.memberCode', matchType: MatchType.EQUAL, type: DataType.STRING }
        }
      },
      _userCreditsLog(data) {
        return userCreditsLog({
          searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }).then((res) => {
          if (res.code === 200) {
            this.tabledata = res.result.itemVOs
            this.totalCount = res.result.totalCount
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
