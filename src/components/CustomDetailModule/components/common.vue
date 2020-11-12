<template>
  <div class>
    <el-form :model="form" label-width="100px" size="mini">
      <el-form-item label="模块名称">通用模块</el-form-item>
      <el-form-item label="选择模块">
        <el-table :data="tableData" size="mini">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="名称" prop="name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="{ row }">
              <el-badge is-dot class="badge-item" :type="row.enable ? 'success' : 'danger'" />
              <span>{{row.enable ? '正常' : '停用'}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row }">
              <el-button type="primary" size="mini" @click="handleSelect(row)">选择</el-button>
              <el-button type="default" size="mini" @click="handleReview(row)">预览</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { reqModuleList, reqModuleById } from '@/api/mallGoods'
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'

export default {
  name: 'CommonModule',
  components: { Pagination },
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    },
    businessNo: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      form: {},
      moduleId: '',
      dialogTableVisible: false,
      currentSelected: '',
      query: {
        status: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
      },
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: []
    }
  },
  watch: {
    config: {
      handler() {
        this.form = this.config
      },
      deep: true
    }
  },
  created() {
    this.form = this.config
  },
  mounted() {
    this.onSearch()
  },
  methods: {
    /**
     * @description: 选择某个模块
     */
    onChange(val) {
      if (val) this._reqModuleById(val)
    },
    handleSelect(item) {
      // 判断是否已经被禁用
      if (!item.enable) {
        this.$message.error('该模块已被禁用')
        return
      }
      // 用户选择了模块
      this.$emit('set-common-config', item.value)
    },
    handleReview(item) {
      // 预览
      const routeData = this.$router.resolve({ path: '/explain/module', query: { id: item.id }})
      window.open(routeData.href, '_blank')
    },
    onPageChange(page) {
      this.currentPage = page
      this.onSearch()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.onSearch()
    },
    /**
     * @description: 查询模块列表
     */
    onSearch() {
      this.query.businessNo = { value: this.businessNo, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      this._reqModuleList(searchTool(this.query))
    },
    handleSelectModule() {
      // this.dialogTableVisible = true
      this.onSearch()
    },
    handleCurrentChange(currentRow) {
      if (currentRow) {
        this.currentSelected = currentRow
      } else {
        this.currentSelected = ''
      }
    },
    // 网络请求
    /**
     * @description: 查询模块列表
     */
    _reqModuleList(data) {
      return reqModuleList({
        searchs: JSON.stringify(data),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          }
        })
        .catch(() => {})
    },
    _reqModuleById(id) {
      return reqModuleById({ id })
        .then(res => {
          if (res.code === 200) {
            const result = res.result || {}
            this.$emit('set-common-config', result.value)
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style scoped lang="scss"></style>
