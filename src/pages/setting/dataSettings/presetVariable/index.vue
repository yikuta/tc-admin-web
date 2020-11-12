<template>
  <!--数据变量-->
  <div class="app-container">
    <search-form ref="searchForm" :form="searches" @reset="handleReset" @search="handleSearch" />
    <el-table :data="list">
      <el-table-column prop="code" label="变量编码"></el-table-column>
      <el-table-column prop="name" label="变量名称"></el-table-column>
      <el-table-column prop="value" label="变量值"></el-table-column>
      <el-table-column prop="remark" label="备注说明"></el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <el-badge is-dot class="badge-item" :type="scope.row.enable ? 'success' : 'danger'"></el-badge>
          <span>{{scope.row.enable ? '正常' : '停用'}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="operator" label="操作人"></el-table-column>-->
      <el-table-column label="操作" width="224px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleEditDictionary(scope.row)" v-np="'VARIABLE_CONF_VALUE_EDIT'">编辑</el-button>
          <el-button type="text" @click="updateFieldStatus(scope.row)" v-np="scope.row.enable?'VARIABLE_CONF_VALUE_DISABLE':'VARIABLE_CONF_VALUE_ENABLE'">{{ scope.row.enable ? '停用' : '启用' }}</el-button>
           <el-button type="text" v-np="'COMMON_OPERATE_LOG'">
             <router-link :to="{ path: 'presetVariableLogs', query: { code: scope.row.code, name: scope.row.name }}">操作日志</router-link>
           </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      :pageSize="query.pageSize"
      :total="temp.totalCount"
      :current="query.pageNo"
      @onSizeChange="handlePageSizeChange"
      @onPageChange="handlePageNoChange"
    ></pagination>
    <diaLog-form ref="dialogForm" :visible="dialogVisible" :form="currentRow" @close="handleCloseDialog" />
  </div>
</template>
<script>
  import searchTool from '@/utils/searchTool'
  import Pagination from '@/components/Pagination/index'
  import { fetchDictionaryList, updateDictionary } from '@/api/setting/dataSetting'
  import { MatchType } from '@/constants/search'
  import { filterEmptyParams } from '@/utils/util'
  const initQuery = {
    pageNo: 1,
    pageSize: 20,
    orderby: 'id',
    sort: 'desc' // 降序  asc 升序
  }
  const initSearches = {
    code: '',
    name: '',
    enable: '',
    isOneToMany: '0'
  }
  export default {
    name: 'dataDictionary',
    components: {
      DiaLogForm: resolve => require(['./templates/dialogForm.vue'], resolve),
      SearchForm: resolve => require(['./templates/searchForm.vue'], resolve),
      Pagination
    },
    data() {
      return {
        temp: {
          totalCount: 0,
          totalPage: 0
        },
        query: { ...initQuery },
        searches: { ...initSearches },
        list: [],
        dialogVisible: false,
        currentRow: {
          code: '',
          name: '',
          remark: ''
        }
      }
    },
    mounted() {
      this.fetchList()
    },
    methods: {
      formatSearches(searches) {
        const { code, name, enable, isOneToMany } = searches
        const results = searchTool({
          code: { value: code, name: 'code', matchType: MatchType.CONTAIN },
          name: { value: name, name: 'name', matchType: MatchType.CONTAIN },
          enable: { value: enable === '' ? enable : enable === 1, name: 'enable', matchType: MatchType.EQUAL },
          isOneToMany: { value: isOneToMany, name: 'isOneToMany', matchType: MatchType.EQUAL }
        })
        return results.length ? JSON.stringify(results) : null
      },
      fetchList() {
        const postData = {
          ...this.query,
          searchs: this.formatSearches(this.searches)
        }
        fetchDictionaryList(filterEmptyParams(postData)).then(res => {
          if (res.code === 200) {
            const { itemVOs, pageNo, pageSize, totalCount, totalPageCount } = res.result
            this.temp = { totalCount, totalPage: totalPageCount }
            this.query.pageNo = pageNo
            this.query.pageSize = pageSize
            this.list = itemVOs
          }
        })
      },
      handleReset() {
        this.searches = { ...initSearches }
        this.fetchList()
      },
      handleSearch() {
        this.fetchList()
      },
      handlePageSizeChange(val) {
        this.query.pageNo = 1
        this.query.pageSize = val
        this.fetchList()
      },
      handlePageNoChange(val) {
        this.query.pageNo = val
        this.fetchList()
      },
      updateFieldStatus(row) {
        const message = row.enable ? '数据变量停用后将不能在各地方使用，确定要停用吗' : '数据变量启用后有调用的位置才能正常使用，确定要启用吗？'
        this.$confirm(message, '提示', {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showClose: false
        }).then(() => {
          updateDictionary({ id: row.id, enable: !row.enable }).then((res) => {
            if (res.code === 200) {
              this.$message.success(row.enable ? '停用数据变量成功～' : '启用数据变量成功~')
              this.fetchList()
            } else {
              this.$message.error('操作失败')
            }
          })
        })
      },
      // 显示或隐藏dialog
      handleToggleDialog(flag) {
        this.dialogVisible = flag
      },
      handleCloseDialog(isSuccess) {
        if (isSuccess) {
          this.fetchList()
        }
        this.dialogVisible = false
      },
      handleEditDictionary(row) {
        this.currentRow = { ...row }
        this.handleToggleDialog(true)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
