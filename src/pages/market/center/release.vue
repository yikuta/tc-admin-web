<template>
  <div class="app-container">
    <el-card class="search-content">
			<el-form ref="form" :model="form" label-width="100px" size="mini">
				<el-form-item label="优惠券码" prop="code.value">
					<el-input v-model="form.code.value" placeholder="请输入优惠券码" clearable></el-input>
				</el-form-item>
				<el-form-item label="券码状态" prop="goodsType.value">
					<el-select v-model="form.goodsType.value" clearable>
						<el-option label="全部" value=""></el-option>
						<el-option label="可领" value="coupon.SceneStatus_2"></el-option>
						<el-option label="失效" value="coupon.SceneStatus_3"></el-option>
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
			<el-table-column label="可用时间" prop="availableTime"></el-table-column>
			<el-table-column label="状态" prop="sceneStatus.describe"></el-table-column>
			<el-table-column label="发放总数" prop="launchNum"></el-table-column>
			<el-table-column label="发放金额" prop="totalAmount"></el-table-column>
			<el-table-column label="单用户限领" prop="singleUserLimitNum"></el-table-column>
			<el-table-column label="已领数量" prop="claimedNum"></el-table-column>
			<el-table-column label="已用数量" prop="usedNum"></el-table-column>
			<el-table-column label="投放时间" prop="deliverTime"></el-table-column>
			<el-table-column label="操作">
				<template v-slot:default="{ row }">
          <el-link type="primary" @click="showDetail(row)">查看优惠券</el-link>
          <el-link type="primary" v-np="'CPN_CENTER_DEVOTE_RECORD_VIEW'" @click="$router.push({ path: '/market/couponManager/coupon/receive-detail', query: { couponCode: row.couponCode }})">发放详情</el-link>
          <el-link type="primary" v-np="'CPN_CENTER_DEVOTE_WAY_DISCARD'" @click="del(row)" v-show="row.sceneStatus.value != 3">移除</el-link>
        </template>
			</el-table-column>
		</el-table>
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { reqCollectionCenterQueryNewPeople, reqInvalid } from '@/api/coupon'
  export default {
    name: 'centerManager',
    components: {
      Pagination
    },
    data() {
      return {
        form: {
          channelType: { value: '', name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          code: { value: '', name: 'couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          goodsType: { value: '', name: 'scene.sceneStatus', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        tabledata: [],
        currentPage: 1,
        pageSize: 20,
        totalCount: 0
      }
    },
    mounted() {
      if (this.$route.query.type === 'ALL') {
        this.form.channelType.value = 'ChannelType_1'
      } else if (this.$route.query.type === 'APP_TINCERE_LIFE') {
        this.form.channelType.value = 'ChannelType_2'
      } else if (this.$route.query.type === 'MP_TINCERE_LIFE') {
        this.form.channelType.value = 'ChannelType_3'
      } else if (this.$route.query.type === 'MP_TINCERE_CLEAN_FOOD') {
        this.form.channelType.value = 'ChannelType_4'
      }
      this.submitQuery()
    },
    methods: {
      submitQuery() {
        let req = searchTool(JSON.parse(JSON.stringify(this.form)))
        this._reqCollectionCenterQueryNewPeople(req)
      },
      showDetail(item) {
        let query = {
          couponType: item.couponType.value === 1 ? 'DOORFILL' : 'DISCOUNT',
          type: 'show',
          version: item.version,
          couponCode: item.couponCode
        }
        this.$router.push({ path: '/market/couponManager/form_show', query: query })
      },
      del(row) {
        this.$confirm('是否删除该优惠券', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this._reqInvalid(row.couponCode)
        }).catch(() => {})
      },
      handleReset() {
        this.form.code = { value: '', name: 'couponCode', matchType: MatchType.EQUAL, type: DataType.STRING }
        this.form.goodsType = { value: '', name: 'scene.sceneStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      },
      _reqCollectionCenterQueryNewPeople(data) {
        return reqCollectionCenterQueryNewPeople({
          searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }).then((res) => {
          if (res.code === 200) {
            this.tabledata = res.result
            this.totalCount = res.result.length
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
              this.submitQuery()
            }
          })
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
