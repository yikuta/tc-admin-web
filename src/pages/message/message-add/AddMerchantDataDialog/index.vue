<template>
  <div class="app-container">
    <el-dialog title="添加用户" :visible="visible" @update:visible="onChange" width="1200px">
      <search ref="searchForm" class="search-bar" @search='handleSearch'></search>
      <table-area :tableData="dataList" @select='handleSelect' ref="table"/>
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
      <div class="btns">
        <el-button size="small" type="primary" @click="handleAddAll">一键添加所有查询结果数据</el-button>
        <el-button size="small" type="primary" @click="handleAdd">添加并关闭</el-button>
        <el-button size="small" @click="onChange(false)">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Search from './templates/SearchCard'
import TableArea from './templates/TableArea'
import Pagination from '@/components/Pagination'
import { MatchType, DataType } from '@/constants/search'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'
import { asyncMessageBossMembersAdd } from '@/api/message'
export default {
  name: 'messageNoteTemplate',
  components: { Search, TableArea, Pagination },
  props: {
    visible: Boolean
  },
  data() {
    return {
      addDialogVisible: false, // 新增 dialog visible
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      multipleSelection: [],
      searches: []
    }
  },
  mounted() {
    this.handleSearch()
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.handleDataList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleDataList()
    },
    handleSearch(form = {}) {
      this.currentPage = 1
      this.handleDataList(form)
    },
    handleDataList(form = {}) {
      let obj = {
        channelType: { value: this.channelType, name: 'channelType', matchType: MatchType.CONTAIN, type: DataType.STRING },
        identifier: { value: this.identifier, name: 'identifier', matchType: MatchType.CONTAIN, type: DataType.STRING },
        enable: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
      }
      this.searches = searchTool(deepClone(Object.assign(form, obj)))
      asyncMessageBossMembersAdd({
        searchs: this.searches.length ? JSON.stringify(this.searches) : null,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        templateType: this.$route.query.type
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs
          this.totalCount = res.result.totalCount
        }
      })
    },
    onChange(visible) {
      this.$emit('update:visible', visible)
    },
    handleAddAll() {
      this.$confirm('你确定要添加全部查询结果吗？', '确认', {}).then(() => {
        this.$emit('addAll', this.searches.length ? JSON.stringify(this.searches) : [])
      })
    },
    handleAdd() {
      if (this.multipleSelection.length) {
        this.$emit('add', this.multipleSelection)
      } else {
        this.$message('请勾选需要添加的用户')
      }
    },
    handleSelect(val) {
      this.multipleSelection = val
    },
    handleReset() {
      this.$refs['searchForm'].$refs['form'].resetFields()
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
.btns{
  text-align: center;
}
</style>
