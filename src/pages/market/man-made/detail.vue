<template>
  <div class="app-container">
    <!-- <create-card></create-card> -->
    <el-card class="coupon-content">
      <div class="title">发券信息</div>
      <el-form label-width="100px" size="mini" class="">
        <el-form-item label="发券信息" class="queueInfo">
          <span v-for="(item, index) in couponData" :key="index">{{ item.couponCode + ' ' + item.couponName + ' x ' + item.num }}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="search-content">
      <div class="title">用户信息</div>
      <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
        <el-form-item label="手机号" class="">
          <el-input v-model="form.tel.value" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="form.name.value" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="优惠券码">
          <el-input v-model="form.couponCode.value" placeholder="请输入优惠券码"></el-input>
        </el-form-item>
        <el-form-item label="发放状态">
          <el-select v-model="form.status.value" placeholder="请选择发放状态">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <div>
          <el-button type="primary" size="mini" @click="hanldeExport" :loading="loadingExport" v-np="'CPN_MANUAL_QUEUE_RECORD_EXPORT'">结果导出</el-button>
          <!-- <el-button type="default" size="mini">下载记录</el-button> -->
          <a ref="download" target="_blank" download="" href="" v-show="2<1"></a>
        </div>
        <div>
          <el-button type="primary" size="mini" @click="handleSubmit">查询</el-button>
          <el-button type="default" size="mini" @click="reset">清空</el-button>
        </div>
      </div>
    </el-card>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="memberPhone" label="手机号" width="150"></el-table-column>
      <el-table-column prop="nickName" label="用户名" width="150"></el-table-column>
      <el-table-column prop="" label="发放券码">
        <template slot-scope="scope">
          {{ scope.row.couponCode + ' ' + scope.row.couponName + ' x ' + scope.row.num }}
        </template>
      </el-table-column>
      <el-table-column prop="result.describe" label="发放结果" width="120"></el-table-column>
      <el-table-column prop="failedReason" label="原因说明"></el-table-column>
      <el-table-column prop="createTime" label="完成时间" width="200"></el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { reqQueueInfo, reqQueueDetails, reqExportQueueRecord } from '@/api/coupon'
  export default {
    name: 'man-made',
    components: {
      Pagination
    },
    data() {
      return {
        couponData: [],
        form: {
          code: { value: '', name: 'queueMember.couponQueue.queueCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          tel: { value: '', name: 'queueMember.memberPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
          name: { value: '', name: 'queueMember.nickName', matchType: MatchType.EQUAL, type: DataType.STRING },
          couponCode: { value: '', name: 'couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          status: { value: '', name: 'result', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        option: {
          status: [
            { id: 'MarketResult_1', value: '成功' },
            { id: 'MarketResult_2', value: '失败' }
          ]
        },
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        pagePhase: [10, 20, 30, 50],
        totalCount: 0,
        loadingExport: false
      }
    },
    mounted() {
      this.form.code.value = this.$route.query.queueCode
      let query = {
        queueCode: this.$route.query.queueCode,
        version: this.$route.query.version
      }
      this._reqQueueInfo(query)
      this.handleSubmit()
    },
    methods: {
      handleSubmit() {
        let searchParam = searchTool(JSON.parse(JSON.stringify(this.form)))
        // console.log(searchParam)
        this._reqQueueDetails(searchParam)
      },
      reset() {
        this.form = {
          code: { value: this.$route.query.queueCode, name: 'queueMember.couponQueue.queueCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          tel: { value: '', name: 'queueMember.queueMember', matchType: MatchType.EQUAL, type: DataType.STRING },
          name: { value: '', name: 'queueMember.nickName', matchType: MatchType.EQUAL, type: DataType.STRING },
          couponCode: { value: '', name: 'couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          status: { value: '', name: 'result', matchType: MatchType.EQUAL, type: DataType.ENUM }
        }
      },
      hanldeExport() {
        // console.log('导出')
        let searchParam = searchTool(JSON.parse(JSON.stringify(this.form)))
        this._reqExportQueueRecord(searchParam)
      },
      handleSizeChange(size) {
        // console.log(`每页 ${val} 条`)
        this.pageSize = size
        this.currentPage = 1
        this.handleSubmit()
      },
      handleCurrentChange(val) {
        // console.log(`当前页: ${val}`)
        this.currentPage = val
        this.handleSubmit()
      },
      _reqQueueInfo(data) {
        return reqQueueInfo(data).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.couponData = result.queueRuleDetails || []
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        })
      },
      _reqQueueDetails(data) {
        return reqQueueDetails({
          searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        })
      },
      _reqExportQueueRecord(data) {
        this.loadingExport = true
        return reqExportQueueRecord({
          searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }).then((res) => {
          if (res) {
            let url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }))
            let node = this.$refs.download
            node.download = '队列编码' + this.$route.query.queueCode + '发券详情导出导出.xlsx'
            node.href = url
            node.click()
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
          this.loadingExport = false
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .coupon-content {
    margin-bottom: 8px;
  }
  .title {
    margin-bottom: 12px;
  }
  .search-content{
    /deep/ .el-form{display: flex;flex-wrap: wrap;
      .el-form-item{width:33%;
        .el-select{width:100%;}
      }
    }
    .search-btn{
      display: flex;
      justify-content: space-between;
      padding: 0 20px;
    }
  }
  .queueInfo {
    /deep/ .el-form-item__content {
      display: flex;
      flex-flow: column;
    }
  }
</style>
