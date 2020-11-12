<template>
  <div class="app-container">
    <content-area contentTitle="数据列表">
      <template slot="control">
        <div style="float:right">
          <el-button size="mini" @click="handleAddTag" v-np='"COOKBOOK_LABEL_CREATE"'>添加标签</el-button>
        </div>
      </template>
      <table-area :tableData="tableData" :loading='loading' @edit="handleEdit" @update='handleSearch'/>
      <pagination
        :current="tableData.pageNo"
        :total="totalCount"
        :pageSize="tableData.pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange"
      />
    </content-area>
    <add-dialog :visible.sync="addDialogVisible" :info='info' @close="handleClose" @update='handleDataList'/>
  </div>
</template>

<script>
import ContentArea from '../templates/ContentArea'
import TableArea from './templates/TableArea'
import AddDialog from './templates/AddDialog'
import Pagination from '@/components/Pagination'
import { fetchCookBookTagList, asyncCookBookTagByName } from '@/api/cookBook'

export default {
  name: 'cookBookTag',
  components: { TableArea, Pagination, ContentArea, AddDialog },
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
      totalCount: 0,
      tableData: {
        pageNo: 1,
        pageSize: 20,
        data: []
      },
      upGradeTerminalTypes: [],
      upGradeOsTypes: [],
      info: {},
      loading: false
    }
  },
  methods: {
    handleDataList() {
      this.loading = true
      fetchCookBookTagList({
        pageNo: this.tableData.pageNo,
        pageSize: this.tableData.pageSize,
        orderbys: ['sort', 'updateTime'],
        sorts: ['desc', 'desc']
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.tableData.data = res.result.itemVOs
          this.totalCount = res.result.totalCount
        }
      }).catch(() => {
        this.loading = false
      })
    },
    // 添加标签
    handleAddTag() {
      this.info = {}
      this.addDialogVisible = true
    },
    handleAdd(form) {
      asyncCookBookTagByName({ ...form }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '操作成功')
          this.handleDataList()
          this.handleClose()
        } else {
          this.$message.error('添加失败')
        }
      })
    },
    // 编辑
    handleEdit(row) {
      this.info = row
      this.addDialogVisible = true
    },
    onPageChange(page) {
      this.tableData.pageNo = page
      this.handleDataList()
    },
    onSizeChange(size) {
      this.tableData.pageSize = size
      this.tableData.pageNo = 1
      this.handleDataList()
    },
    handleSearch() {
      this.tableData.pageNo = 1
      this.handleDataList()
    },
    handleClose(isSuccess) {
      this.addDialogVisible = isSuccess
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
