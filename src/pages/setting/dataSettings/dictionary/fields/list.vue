<template>
  <!--数据字典-->
  <div class="app-container">
    <search-form :form="searches" @change="handleSearchChange"/>
    <el-table :data="list">
      <el-table-column prop="id" label="序号"></el-table-column>
      <el-table-column prop="code" label="值编码"></el-table-column>
      <el-table-column prop="name" label="值名称"></el-table-column>
      <el-table-column prop="value" label="预留1"></el-table-column>
      <el-table-column prop="value2" label="预留2"></el-table-column>
      <el-table-column prop="value3" label="预留3"></el-table-column>
      <el-table-column prop="sortNum" label="排序"></el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <el-badge is-dot class="badge-item" :type="scope.row.enable ? 'success' : 'danger'"></el-badge>
          <span>{{scope.row.enable ? '正常' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="224px">
        <template slot-scope="scope">
          <el-button type="text" @click="handleCheckDetail(scope.row)" v-np="'VARIABLE_CONF_DIC_FIND'">详情</el-button>
          <el-button type="text" @click="$router.push({ name: 'fieldEdit', query: { id: scope.row.id, pid } })" v-np="'VARIABLE_CONF_DIC_EDIT'">编辑</el-button>
          <el-button type="text" @click="updateFieldStatus(scope.row)" v-np="scope.row.enable?'VARIABLE_CONF_DIC_DISABLE':'VARIABLE_CONF_DIC_ENABLE'">{{ scope.row.enable ? '停用' : '启用' }}</el-button>
          <el-button type="text" v-np="'COMMON_OPERATE_LOG'">
            <router-link :to="{ path: 'dictionaryLogs', query: { code: scope.row.code, name: scope.row.name, type: 'field' }}">操作日志</router-link>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <dialog-detail :item="checkCurrentItem" :visible="dialogVisible" @close="handleToggle" />
  </div>
</template>
<script>
  import Pagination from '@/components/Pagination/index'
  import searchTool from '@/utils/searchTool'
  import { fetchDictionaryFieldList, updateDictionaryField } from '@/api/setting/dataSetting'
  import { MatchType } from '@/constants/search'
  import { filterEmptyParams } from '@/utils/util'
  const initSearch = {
    code: '',
    name: '',
    enable: ''
  }

  const initQuery = {
    orderby: 'sortNum',
    sort: 'desc'
  }

  export default {
    name: 'dataDictionary',
    components: {
      DialogDetail: resolve => require(['./templates/dialogDetail.vue'], resolve),
      SearchForm: resolve => require(['./templates/searchForm.vue'], resolve),
      Pagination
    },
    data() {
      return {
        query: { ...initQuery },
        pid: null,
        searches: { ...initSearch },
        list: [],
        checkCurrentItem: {},
        dialogVisible: false,
        currentRow: undefined
      }
    },
    mounted() { // activated
      this.pid = this.$route.query.pid
      if (this.pid) {
        this.fetchList()
      }
    },
    methods: {
      formatSearches(searches) {
        if (searches && !Object.keys(searches).length) return null
        const { code, name, enable } = searches
        const results = searchTool({
          code: { value: code, name: 'code', matchType: MatchType.CONTAIN },
          name: { value: name, name: 'name', matchType: MatchType.CONTAIN },
          enable: { value: enable === '' ? enable : enable === 1, name: 'enable', matchType: MatchType.EQUAL },
          variableConfig: { value: Number(this.pid), name: 'variableConfig', matchType: MatchType.EQUAL }
        })
        return results.length ? JSON.stringify(results) : null
      },
      fetchList() {
        const postData = {
          ...this.query,
          searchs: this.formatSearches(this.searches)
        }
        fetchDictionaryFieldList(filterEmptyParams(postData)).then(res => {
          if (res.code === 200) {
            this.list = res.result
          }
        })
      },
      handleSearchChange(type) {
        if (type === 'add') {
          this.$router.push({ name: 'fieldAdd', query: { pid: this.pid }})
        } else if (type === 'search') {
          this.fetchList()
        } else {
          this.searches = { ...initSearch }
          this.fetchList()
        }
      },
      handleCheckDetail(item) {
        this.checkCurrentItem = item
        this.dialogVisible = true
      },
      // 切换dialog隐藏还是显示
      handleToggle(flag) {
        this.dialogVisible = flag
      },
      updateFieldStatus(row) {
        const message = row.enable ? '字典值停用后将不能在各地方使用，确定要停用吗？' : '字典值只有启用后才能正常使用，确定要启用吗？'
        this.$confirm(message, '提示', {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showClose: false
        }).then(() => {
          updateDictionaryField({
            id: row.id,
            pid: this.pid,
            enable: !row.enable
          }).then((res) => {
            if (res.code === 200) {
              this.$message.success(row.enable ? '数据字典值停用成功~' : '数据字典值启用成功~')
              this.fetchList()
            } else {
              this.$message.error(row.enable ? '数据字典值停用失败~' : '数据字典值启用失败~')
            }
          })
        })
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
