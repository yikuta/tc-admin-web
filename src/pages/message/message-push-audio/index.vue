<template>
  <div class="app-container">
    <search-area @onSearch="handleSearch" @resetFields='handleReset'>
      <search ref="search"></search>
    </search-area>
    <content-area contentTitle="Push消息（语音）模版列表">
      <template slot="control">
        <div style="float:right">
          <el-button size="mini" v-np='"MSG_AUDIO_TEMPLATE_CREATE"' type="primary" @click="handleSetting">新建模板</el-button>
        </div>
      </template>
      <table-area ref="table" :tableData="dataList" @onEdit='handleEdit' :isAudio='true'/>
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
  name: 'messagePushAudioTemplate',
  components: { SearchArea, Search, TableArea, Pagination, ContentArea, AddDialog },
  mounted() {
    this.handleDataList()
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
        templateType: { value: 'PM', name: 'templateType', matchType: MatchType.EQUAL, type: DataType.STRING },
        pushMediaType: { value: 'MEDIA_SOUND', name: 'pushMediaType', matchType: MatchType.EQUAL, type: DataType.STRING }
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
      this.$router.push('messageMailList')
    },
    // 新建模板
    handleSetting() {
      this.id = 0
      this.addDialogVisible = true
    },
    handleAddMessage() {
      this.$router.push({ path: 'messageAdd' })
    },
    handleEdit(row) {
      this.id = row.id
      this.addDialogVisible = true
      this.templateStatus = row.templateStatus
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
