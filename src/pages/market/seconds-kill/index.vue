<template>
  <div class="app-container">
    <!-- 投放管理 -->
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
        <el-form-item label="投放终端">
          <el-select v-model="form.channelType.value" placeholder="请选择投放终端">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option.channelType" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放业务">
          <el-select v-model="form.bussinessType.value" placeholder="请选择投放业务">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option.work" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="投放状态">
          <el-select v-model="form.status.value" placeholder="请选择投放状态">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="form.sourceCode.value" placeholder="请输入商品编码"></el-input>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="hanldeAdd">新增</el-button>
        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
        <el-button type="default" size="mini" @click="reset">清空</el-button>
      </div>
    </el-card>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="id" label="投放ID"></el-table-column>
      <el-table-column prop="channelType.describe" label="投放终端"></el-table-column>
      <el-table-column prop="businessType.describe" label="投放业务">
        <!-- <template slot-scope="scope">
          <div v-for="(item, index) in scope.row.businessTypeList" :key="index">
            {{ item.describe }}
          </div>
        </template> -->
      </el-table-column>
      <el-table-column prop="channelCommodityNum" label="投放商品数（SPU）"></el-table-column>
      <el-table-column prop="launchStatus.describe" label="状态"></el-table-column>
      <el-table-column prop="rejectedReason" label="原因说明"></el-table-column>
      <el-table-column prop="createtime" label="发起时间"></el-table-column>
      <el-table-column prop="operator" label="发起人"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="addAudit(row)" v-show="row.launchStatus.value == 10 || row.launchStatus.value == 30" v-np="'SEC_KILL_LAUNCH_AUDIT'">提交审核</el-link>
          <el-link type="primary" @click="edit(row)" v-show="row.launchStatus.value == 10 || row.launchStatus.value == 30" v-np="'SEC_KILL_LAUNCH_UPDATE'">编辑</el-link>
          <el-link type="primary" @click="show(row)" v-np="'SEC_KILL_LAUNCH_PRODUCT_VIEW'">查看</el-link>
          <el-link type="primary" @click="log(row)" v-np="'COMMON_OPERATE_LOG'">操作日志</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>
<script>
import searchTool from '@/utils/searchTool'
import Pagination from '@/components/Pagination'
import { MatchType, DataType } from '@/constants/search'
import { reqSeckillLaunchList, reqAddAudit } from '@/api/seckill'
export default {
  name: 'releaseManager',
  components: {
    Pagination
  },
  data() {
    return {
      form: {
        channelType: { value: '', name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        bussinessType: { value: '', name: 'businessType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        status: { value: '', name: 'launchStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
        sourceCode: { value: '', name: 'launchCommodities.channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      option: {
        type: [
          { id: 'CouponType_1', value: '满减券' },
          { id: 'CouponType_2', value: '折扣券' }
        ],
        status: [
          { id: 'seckill.SeckillLaunchStatus_10', value: '待审核' },
          { id: 'seckill.SeckillLaunchStatus_20', value: '审核中' },
          { id: 'seckill.SeckillLaunchStatus_30', value: '已驳回' },
          { id: 'seckill.SeckillLaunchStatus_40', value: '已投放' }
        ],
        channelType: [
          // { id: 'ChannelType_1', value: '通用' },
          { id: 'ChannelType_2', value: '天呈生活APP' },
          { id: 'ChannelType_3', value: '天呈生活小程序' }
          // { id: 'ChannelType_4', value: '天呈净菜小程序' }
        ],
        work: [
          // { id: 'BusinessType_1', value: '通用' },
          { id: 'BusinessType_2', value: '快递到家' },
          // { id: 'BusinessType_3', value: '净菜' },
          { id: 'BusinessType_4', value: '爆款预售' }
          // { id: 'BusinessType_5', value: '社区超市' }
        ]
      },
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取商品商品列表
      this.onSearch()
    })
  },
  methods: {
    hanldeAdd() {
      this.$router.push({ path: '/active/secondsKill/form' })
    },
    onSearch() {
      // 查询
      let req = searchTool(JSON.parse(JSON.stringify(this.form)))
      this._reqSeckillLaunchList(req)
    },
    reset() {
      this.form = {
        channelType: { value: '', name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        bussinessType: { value: '', name: 'businessType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        status: { value: '', name: 'launchStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
        sourceCode: { value: '', name: 'launchCommodities.channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING }
      }
    },
    addAudit(item) {
      let query = {
        version: item.version,
        sourceCode: item.seckillLaunceCode
      }
      this._reqAddAudit(query)
    },
    edit(item) {
      let query = {
        type: 'edit',
        version: item.version,
        seckillLaunceCode: item.seckillLaunceCode
      }
      this.$router.push({ path: '/active/secondsKill/edit', query: query })
    },
    show(item) {
      let query = {
        type: 'show',
        version: item.version,
        seckillLaunceCode: item.seckillLaunceCode
      }
      this.$router.push({ path: '/active/secondsKill/show', query: query })
    },
    // 操作日志
    log(row) {
      let query = {
        timePeriod: row.timePeriod,
        seckillLaunceCode: row.seckillLaunceCode,
        channelCommodityNum: row.channelCommodityNum
      }
      this.$router.push({ path: '/active/secondsKill/kill-log', query: query })
    },
    _reqSeckillLaunchList(data) {
      return reqSeckillLaunchList({
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
        }
      })
    },
    _reqAddAudit(data) {
      return reqAddAudit(data).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.onSearch()
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
    }
  }
}
</script>
<style scoped lang="scss">
.search-content{
  /deep/ .el-form{display: flex;flex-wrap: wrap;
    .el-form-item{width:33%;
      .el-select{width:100%;}
    }
  }
  .search-btn{text-align: right;}
}
</style>
