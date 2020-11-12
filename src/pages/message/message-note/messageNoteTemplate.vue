<template>
  <div class="app-container">
    <search-area @onSearch="handleSearch" @resetFields='handleReset'>
      <search ref="search" :hasBusiness='true'></search>
    </search-area>
    <content-area contentTitle="短信模版列表">
      <template slot="control">
        <div style="float:right">
          <el-button size="mini" type="primary" @click="handleToList" v-np='"MSG_SMS_TEMPLATE_PAGE_VIEW"'>查看无模板消息</el-button>
          <el-button size="mini" type="primary" @click="handleAddMessage" v-np='"MSG_SMS_TASK_CREATE"'>新建消息</el-button>
          <el-button size="mini" type="primary" @click="handleSetting" v-np='"MSG_SMS_TEMPLATE_CREATE"'>新建模板</el-button>
        </div>
      </template>
      <table-area ref="table" :tableData="dataList" @onEdit='handleEdit' :hasBusiness='true'/>
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
    </content-area>
    <add-dialog :visible.sync="addDialogVisible" :templateStatus='templateStatus' @update='handleDataList' :id='id'/>
  </div>
</template>

<script>
import SearchArea from '../templates/SearchArea'
import Search from '../templates/SearchCard'
import ContentArea from '../templates/ContentArea'
import TableArea from '../templates/TableArea'
import AddDialog from './templates/AddDialog'
import Pagination from '@/components/Pagination'
import { fetchMessageTemplatesList } from '@/api/message'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'messageNoteTemplate',
  components: { SearchArea, Search, TableArea, Pagination, ContentArea, AddDialog },
  activated() {
    this.handleDataList()
  },
  beforeRouteEnter(to, from, next) {
    if (!from.name) {
      next(vm => {
        vm.handleDataList()
      })
    } else {
      next()
    }
  },
  data() {
    return {
      addDialogVisible: false, // 新增 dialog visible
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      id: 0,
      templateStatus: ''
    }
  },
  methods: {
    handleDataList() {
      let obj = {
        templateType: { value: 'SM', name: 'templateType', matchType: MatchType.EQUAL, type: DataType.STRING }
      }
      const searches = searchTool(deepClone(Object.assign(this.$refs['search'].form, obj)))
      this.$refs.table.loading = true
      fetchMessageTemplatesList({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        searchs: searches.length ? JSON.stringify(searches) : null
      }).then(res => {
        this.$refs.table.loading = false
        if (res.code === 200) {
          this.dataList = res.result.itemVOs || []
          this.totalCount = res.result.totalCount
        }
      }).catch(() => {
        this.$refs.table.loading = false
      })
    },
    // 查看无模板消息
    handleToList() {
      this.$router.push({ path: 'messageNoteList', query: { templateCode: 0 }})
    },
    // 新建模板
    handleSetting() {
      this.id = 0
      this.addDialogVisible = true
    },
    handleAddMessage() {
      this.$router.push({ path: 'messageAdd', query: { type: 'SM' }})
    },
    handleEdit(row) {
      this.id = row.id
      this.addDialogVisible = true
      this.templateStatus = row.templateStatus
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
