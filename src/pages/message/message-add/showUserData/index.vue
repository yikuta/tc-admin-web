<template>
  <div class="app-container">
    <div>
      <search ref="searchForm" class="search-bar" @on-search="handleSearch" ></search>
      <table-area :tableData="dataList" @delete='handleDelete'/>
      <div style="display:flex; justify-content: space-between">
        <el-button type="primary" size="mini" @click="handleDeleteAll" style="height:28px;margin:20px 0">清除全部数据</el-button>
        <pagination
          :current="currentPage"
          :total="totalCount"
          :pageSize="pageSize"
          @onPageChange="onPageChange"
          @onSizeChange="onSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Search from './templates/SearchCard'
import TableArea from './templates/TableArea'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'
import { fetchAddMessageMembers, asyncMessageMembersDelete } from '@/api/message'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'showUserData',
  components: { Search, TableArea, Pagination },
  props: {
    visible: Boolean,
    nomove: {
      type: Boolean,
      default: false
    },
    channelType: {
      type: String,
      default: ''
    },
    identifier: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      id: 0
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
      const searches = searchTool(deepClone(Object.assign(form, obj)))
      fetchAddMessageMembers({
        searchs: searches.length ? JSON.stringify(searches) : null,
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
    handleDelete(id) {
      asyncMessageMembersDelete({
        channelType: this.channelType,
        id,
        templateType: this.$route.query.type,
        identifier: this.identifier
      }).then(res => {
        if (res.code === 200) {
          this.$message.success('移除成功')
          this.handleSearch()
        }
      })
    },
    handleDeleteAll() {
      this.$emit('deleteAll')
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
