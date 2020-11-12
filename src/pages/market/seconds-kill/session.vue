<template>
  <div class="app-container">
    <!-- 场次管理 -->
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
        <el-form-item label="商品编码">
          <el-input v-model="form.sourceCode.value" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item label="选择日期">
          <el-date-picker
            v-model="form.seckillTime.value"
            ref="availableTimeSetting_fixedTimeList"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="hanldeBatch">新增</el-button>
        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
        <el-button type="default" size="mini" @click="reset">清空</el-button>
      </div>
    </el-card>

    <el-table :data="tableData" size="mini" row-key="id" :tree-props="{children: 'sessionDetailList', hasChildren: 'hasChildren'}">
      <el-table-column prop="day" label="日期"></el-table-column>
      <el-table-column prop="timePeriod" label="场次">
        <template slot-scope="scope">
          <span v-if="!scope.row.timePeriod">——</span>
          <span v-else>{{scope.row.timePeriod}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="channelCommodityNum" label="参与商品数"></el-table-column>
      <el-table-column label="适用商品">
        <template slot-scope="scope">
          <span v-if="scope.row.sessionDetailList">——</span>
          <el-button v-else type="text" @click="showItemSelected(scope.row)" v-np="'SEC_KILL_SESSION_PRODUCT_QUERY'">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="record(row)" v-show="row.sessionDetailList" v-np="'SEC_KILL_SESSION_RECORD_VIEW'">参与记录</el-link>
          <el-link type="primary" @click="close(row)" v-show="row.openFlag && !row.sessionDetailList" v-np="'SEC_KILL_SESSION_SUSPEND'">停用</el-link>
          <el-link type="primary" @click="open(row)" v-show="!row.openFlag && !row.sessionDetailList" v-np="'SEC_KILL_SESSION_START'">启用</el-link>
          <el-link type="primary" v-show="!row.sessionDetailList" @click="handleLog(row)" v-np="'COMMON_OPERATE_LOG'">操作日志</el-link>
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
import { reqQuerySeckill, reqStartOrSuspend } from '@/api/seckill'
export default {
  name: 'sessionManager',
  components: {
    Pagination
  },
  data() {
    return {
      form: {
        seckillTime: { value: [], name: 'beginTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        sourceCode: { value: '', name: 'commodities.channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING }
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
    hanldeBatch() {
      this.$router.push({ path: '/active/secondsKill/form' })
    },
    onSearch() {
      // 查询
      let req = searchTool(JSON.parse(JSON.stringify(this.form)))
      this._reqQuerySeckill(req)
    },
    reset() {
      this.form = {
        seckillTime: { value: [], name: 'beginTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        sourceCode: { value: '', name: 'commodities.channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING }
      }
    },
    record(item) {
      // 参与记录
      let query = {
        day: item.day
      }
      this.$router.push({ path: '/active/secondsKill/participation', query: query })
    },
    // 操作日志
    handleLog(row) {
      let query = {
        timePeriod: row.timePeriod,
        seckillSessionCode: row.seckillSessionCode,
        channelCommodityNum: row.channelCommodityNum
      }
      this.$router.push({ path: '/active/secondsKill/session-log', query: query })
    },
    showItemSelected(item) {
      // 场次详情
      let query = {
        seckillSessionCode: item.seckillSessionCode,
        channelType: item.channelType.value
      }
      this.$router.push({ path: '/active/secondsKill/session_detail', query: query })
    },
    open(row) {
      let req = {
        seckillSessionCode: row.seckillSessionCode,
        openFlag: true
      }
      this._reqStartOrSuspend(req)
    },
    close(row) {
      let req = {
        seckillSessionCode: row.seckillSessionCode,
        openFlag: false
      }
      this._reqStartOrSuspend(req)
    },
    _reqStartOrSuspend(data) {
      return reqStartOrSuspend(data).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this.onSearch()
        }
      })
    },
    _reqQuerySeckill(data) {
      return reqQuerySeckill({
        searchs: JSON.stringify(data),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'beginTime',
        sort: 'desc'
      }).then((res) => {
        if (res.code === 200) {
          let result = res.result || {}
          this.currentPage = result.pageNo
          this.totalCount = result.totalCount
          let itemVOs = result.itemVOs || []
          itemVOs.map((item, index) => {
            item.id = 'day_' + index + '_' + item.day
            item.sessionDetailList.map((session) => {
              session.id = 'session_' + index + '_' + session.timePeriod
            })
          })
          this.tableData = itemVOs
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
