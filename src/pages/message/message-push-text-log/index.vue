<template>
  <div class="app-container">
    <search-area @onSearch="handleSearch" @resetFields='handleReset'>
      <search ref="search"></search>
    </search-area>
    <content-area contentTitle="列表信息">
      <div v-if="searches.length > 1">
        <table-area :tableData="dataList"/>
        <pagination
          :current="currentPage"
          :total="totalCount"
          :pageSize="pageSize"
          @onPageChange="onPageChange"
          @onSizeChange="onSizeChange"
        />
      </div>
    </content-area>
    <!-- <add-dialog :visible.sync="addDialogVisible" @close="handleCloseDialog" /> -->
  </div>
</template>

<script>
import SearchArea from '../templates/SearchArea'
import Search from '../templates/SearchCardLog'
import ContentArea from '../templates/ContentArea'
import TableArea from '../templates/TableAreaLog'
// import AddDialog from './templates/AddDialog'
import Pagination from '@/components/Pagination'
import { fetchMessageSendLog } from '@/api/message'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'messagePushTextLog',
  components: { SearchArea, Search, TableArea, Pagination, ContentArea },
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
      searches: []
    }
  },
  methods: {
    handleDataList() {
      let obj = {
        pushMediaType: { value: 'MEDIA_TEXT', name: 'pushMediaType', matchType: MatchType.EQUAL, type: DataType.STRING }
      }
      this.searches = searchTool(deepClone(Object.assign(this.$refs['search'].form, obj)))
      if (this.searches.length === 1) {
        this.$message.info('请至少输入一项查询条件')
        this.dataList = []
        return
      }
      fetchMessageSendLog({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        templateType: 'PM',
        searchs: this.searches.length ? JSON.stringify(this.searches) : null
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs || []
          this.totalCount = res.result.totalCount
        }
      })
    },
    // 新增菜谱
    handleAddMenu() {
      this.$router.push({ path: '/cookBook/cookBookAdd' })
    },
    // 设置标签
    handleSetting() {
      this.addDialogVisible = true
    },
    handleCloseDialog() {
      this.addDialogVisible = false
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
