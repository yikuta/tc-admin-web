<template>
  <div class="app-container">
    <search-area @onSearch="handleSearch" @resetFields='handleReset'>
      <search ref="search" :hasBusiness='true'></search>
    </search-area>
    <content-area contentTitle="短信列表">
      <template slot="control">
        <div style="float:right">
          <el-button size="mini" type="primary" @click="handleAddMessage" v-np='"MSG_SMS_LIST_TASK_CREATE"'>新建消息</el-button>
        </div>
      </template>
      <table-area :tableData="dataList" @send='handleSend' @sendSearch='handleSendSearch' type='SM'/>
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
    </content-area>
    <add-dialog :visible.sync="addDialogVisible" :id="taskId" type='SM'/>
  </div>
</template>

<script>
import SearchArea from '../templates/SearchArea'
import Search from '../templates/SearchList'
import ContentArea from '../templates/ContentArea'
import TableArea from '../templates/TableList'
import AddDialog from '../templates/send-search/index'
// import AddDialog from './templates/AddDialog'
import Pagination from '@/components/Pagination'
import { fetchMessageList, asyncMessageTaskStatus } from '@/api/message'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'messageNoteTemplate',
  components: { SearchArea, Search, TableArea, Pagination, ContentArea, AddDialog },
  data() {
    return {
      addDialogVisible: false, // 新增 dialog visible
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      reqForm: {},
      upGradeTerminalTypes: [],
      upGradeOsTypes: [],
      taskId: 0,
      templateCode: ''
    }
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.handleReset()
      if (to.query.templateCode === 0 || to.query.templateCode === '0') {
        vm.templateCode = 'code'
      } else if (to.query.templateCode && to.query.templateCode !== '0') {
        vm.templateCode = to.query.templateCode
      } else {
        vm.templateCode = ''
      }
      vm.handleDataList()
    })
  },
  methods: {
    handleDataList() {
      let obj = {
        templateCode: { value: this.templateCode, name: 'templateCode', matchType: this.templateCode === 'code' ? MatchType.NULL : MatchType.EQUAL, type: DataType.STRING }
      }
      const searches = searchTool(deepClone(Object.assign(this.$refs['search'].form, obj)))
      fetchMessageList({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        templateType: 'SM',
        searchs: searches.length ? JSON.stringify(searches) : null
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs
          this.totalCount = res.result.totalCount
        }
      })
    },
    handleAddMessage() {
      this.$router.push({ path: 'messageAdd', query: { type: 'SM' }})
    },
    onPageChange(page) {
      this.currentPage = page
      this.handleDataList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleDataList()
    },
    handleSearch() {
      this.currentPage = 1
      this.handleDataList()
    },
    handleReset() {
      this.$refs['search'].$refs['form'].resetFields()
    },
    handleSend({ id, operatorType }) {
      asyncMessageTaskStatus({
        id,
        operatorType,
        templateType: 'SM'
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('操作成功')
          this.handleDataList()
        }
      })
    },
    // 发送查看
    handleSendSearch(row) {
      this.addDialogVisible = true
      this.taskId = row.id
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  .search-bar {
    margin: 0 0 20px 0;
  }
}
</style>
