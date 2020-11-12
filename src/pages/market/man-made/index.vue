<template>
  <div class="app-container">
    <!-- <create-card></create-card> -->
    <search-bar ref="search" @on-search="onSearch" class="search-bar"></search-bar>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="queueCode" label="队列编码"></el-table-column>
      <el-table-column prop="queueName" label="队列名称"></el-table-column>
      <el-table-column label="队列状态">
        <template slot-scope="scope">
          {{ scope.row.status.describe }}
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="原因说明">
        <template slot-scope="scope">
          <span v-show="scope.row.reason">{{scope.row.reason}}</span>
          <span v-show="!scope.row.reason">——</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间"></el-table-column>
      <el-table-column prop="name" label="发券结果">
        <template slot-scope="scope">
          <span v-if="scope.row.successfulNum || scope.row.failedNum">{{ '成功：' + Number(scope.row.successfulNum) + '失败：' + Number(scope.row.failedNum) }}</span>
          <span v-else>——</span>
        </template>
      </el-table-column>
      <el-table-column label="发券详情">
        <template slot-scope="scope">
          <el-button type="text" v-np="'CPN_MANUAL_QUEUE_LIST_VIEW'" :disabled="!(scope.row.status.value == 60)" @click="$router.push({ path: '/market/manMade/detail', query: { queueCode: scope.row.queueCode, version: scope.row.version }})">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="optioner" label="创建人">
        <template slot-scope="scope">
          <span v-show="scope.row.operator">{{scope.row.operator}}</span>
          <span v-show="!scope.row.operator">——</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" v-show="row.status.value == 10 || row.status.value == 40" :disabled="submitBtn" @click="submit(row)" v-np="'CPN_MANUAL_QUEUE_ADD'">提交审核</el-link>
          <el-link type="primary" v-show="row.status.value == 10 || row.status.value == 30 || row.status.value == 40" @click="$router.push({ path: '/market/manMade/add', query: { type: 'edit', queueCode: row.queueCode, version: row.version }})">编辑</el-link>
          <el-link type="primary" @click="$router.push({ path: '/market/manMade/add', query: { type: 'show', queueCode: row.queueCode, version: row.version }})" v-np="'CPN_MANUAL_QUEUE_DETAIL_VIEW'">查看</el-link>
          <el-link type="primary" v-show="row.status.value == 30" :disabled="executeBtn" @click="execute(row)" v-np="'CPN_MANUAL_QUEUE_EXECUTE'">执行</el-link>
          <el-link type="primary" v-show="row.status.value == 10 || row.status.value == 20 || row.status.value == 30 || row.status.value == 40" @click="del(row)" v-np="'CPN_MANUAL_QUEUE_DELETE'">删除</el-link>
          <el-link type="primary" @click="log(row)" v-np="'COMMON_OPERATE_LOG'">操作日志</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import SearchBar from './templates/search'
  import Pagination from '@/components/Pagination'
  import { reqQueueList, reqAddQueueAudit, reqDeleteQueue, reqQueueExecute } from '@/api/coupon'
  export default {
    name: 'man-made',
    components: {
      Pagination,
      SearchBar
    },
    data() {
      return {
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        pagePhase: [10, 20, 30, 50],
        totalCount: 0,
        submitBtn: false,
        executeBtn: false
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
      this.$nextTick(() => {
        // 获取商品商品列表
        this.onSearch()
      })
    },
    methods: {
      onSearch() {
        let req = searchTool(JSON.parse(JSON.stringify(this.$refs['search'].form)))
        this._reqQueueList(req)
      },
      submit(item) {
        // 提交审核
        this.$confirm('提交审核后不能再进行编辑，是否提交审核', '提交审核', {
          confirmButtonText: '提交',
          cancelButtonText: '取消'
          // type: 'info'
        }).then(() => {
          // 执行提交审核请求
          this._reqAddQueueAudit(item.queueCode, item.version)
        }).catch(() => {
        })
      },
      execute(item) {
        // 执行
        this.$confirm('队列一旦开始执行不能终止，请谨慎操作', '执行队列', {
          confirmButtonText: '执行',
          cancelButtonText: '取消'
          // type: 'info'
        }).then(() => {
          this._reqQueueExecute(item.queueCode)
        }).catch(() => {
        })
      },
      del(item) {
        // 删除
        this.$confirm('删除队列不可逆，请确认是否删除', '删除队列', {
          confirmButtonText: '删除',
          cancelButtonText: '取消'
          // type: 'info'
        }).then(() => {
          this._reqDeleteQueue(item.queueCode)
        }).catch(() => {
        })
      },
      // 操作日志
      log(row) {
        this.$router.push({ path: '/market/log', query: { title: '人工发券操作日志', code: 'coupon_queue_' + row.queueCode }})
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.onSearch()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.onSearch()
      },
      _reqQueueList(data) {
        return reqQueueList({
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
      _reqAddQueueAudit(sourceCode, version) {
        this.submitBtn = true
        return reqAddQueueAudit({
          sourceCode: sourceCode,
          version: version,
          sponsor: '', // 当前登录账户
          sponsorId: 1
        }).then((res) => {
          if (res.code === 200) {
            this.onSearch()
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
          this.submitBtn = false
        })
      },
      _reqDeleteQueue(data) {
        return reqDeleteQueue(data).then((res) => {
          if (res.code === 200) {
            this.onSearch()
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        })
      },
      _reqQueueExecute(data) {
        this.executeBtn = true
        return reqQueueExecute(data).then((res) => {
          if (res.code === 200) {
            this.onSearch()
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
          this.executeBtn = false
        })
      }
    }
  }
</script>

<style scoped lang="scss">
  .search-bar{margin:20px 0;}
</style>
