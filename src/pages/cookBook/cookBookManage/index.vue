<template>
  <div class="app-container">
    <search ref="search" class="search-bar">
      <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
    </search>
    <content-area contentTitle="数据列表">
      <template slot="control">
        <div style="float:right">
          <el-button size="mini" @click="handleSetting" v-np='"COOKBOOK_LABEL_PICKUP"'>批量设置标签</el-button>
          <el-button size="mini" @click="handleAddMenu" v-np='"COOKBOOK_ADD"'>新增菜谱</el-button>
        </div>
      </template>
      <table-area :tableData="dataList" @del="handleDelete" @selection='handleSelection'/>
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
    </content-area>
    <add-dialog :visible.sync="addDialogVisible" @close="handleCloseDialog" @set='handleSetTags' :ids='ids'/>
  </div>
</template>

<script>
import Search from './templates/Search'
import ContentArea from '../templates/ContentArea'
import TableArea from './templates/TableArea'
import AddDialog from './templates/AddDialog'
import Pagination from '@/components/Pagination'
import { fetchCookBooks, asyncCookBooksTagSetting, asyncCookBooksDelete } from '@/api/cookBook'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'

export default {
  name: 'cookBookManage',
  components: { Search, TableArea, AddDialog, Pagination, ContentArea },
  beforeRouteEnter(to, from, next) {
    if (!from.name) {
      next(vm => {
        vm.handleDataList()
      })
    } else {
      next()
    }
  },
  activated() {
    this.handleDataList()
  },
  data() {
    return {
      addDialogVisible: false, // 新增 dialog visible
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: [],
      selections: [],
      ids: []
    }
  },
  methods: {
    handleDataList() {
      const searches = searchTool(deepClone(this.$refs['search'].form))
      fetchCookBooks({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        searchs: searches.length ? JSON.stringify(searches) : null
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs
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
      if (!this.selections.length) {
        this.$message('请先选择菜谱')
      } else {
        if (this.selections.length === 1) {
          this.ids = this.selections[0].cookBookLables ? this.selections[0].cookBookLables.map(item => item.id) : []
        } else {
          this.ids = []
        }
        this.addDialogVisible = true
      }
    },
    handleSetTags(tagIds) {
      let cookBookIds = this.selections.map(item => item.id)
      asyncCookBooksTagSetting({ cookBookIds, cookBookLableIds: tagIds }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '设置成功')
          this.handleCloseDialog()
          this.handleDataList()
        }
      })
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
    },
    handleSelection(val) {
      this.selections = val
    },
    handleDelete(id) {
      asyncCookBooksDelete(id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.handleDataList()
        }
      })
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
