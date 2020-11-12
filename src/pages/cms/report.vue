<template>
  <div class="app-container">
    <div class="padding-bottom-sm border-bottom-seat text-second margin-bottom-sm">
      名称：{{ configName }}
    </div>
    <div class="padding-bottom-sm border-bottom-seat text-second">操作日志</div>
    <el-table :data="tableData" size="mini">
      <el-table-column label="操作时间" prop="createTime"></el-table-column>
      <el-table-column label="操作内容" prop="operatorType"></el-table-column>
      <el-table-column label="操作人" prop="operator"></el-table-column>
    </el-table>
    <pagination :pageSize="listQuery.pageSize" :total="listQuery.totalCount" :current="listQuery.pageNo" @onSizeChange="handleSizeChange" @onPageChange="handleCurrentChange"></pagination>
  </div>
</template>

<script>
  import { getReportLog } from '@/api/cms'
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  export default {
    name: 'Report',
    components: {
      Pagination: resolve => {
        return require(['@/components/Pagination/index'], resolve)
      }
    },
    data() {
      return {
        tableData: [],
        configName: '',
        form: {
          configId: { value: '1', name: 'configId', matchType: MatchType.EQUAL, type: DataType.STRING }
        },
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          totalCount: 0,
          totalPage: 0
        }
      }
    },
    created() {
      this.form.configId.value = this.$route.params.id
      this.configName = this.$route.query.name
      this.getList()
    },
    methods: {
      getList() {
        getReportLog({
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          searchs: JSON.stringify(searchTool(this.form)),
          orderby: 'createTime'
        }).then(res => {
          if (res.code === 200) {
            this.tableData = res.result.itemVOs
            this.listQuery = {
              pageNo: res.result.pageNo,
              pageSize: res.result.pageSize,
              totalCount: res.result.totalCount,
              totalPage: res.result.totalPageCount
            }
          }
        })
      },
      // 分页变化
      handleSizeChange(val) {
        this.listQuery.pageNo = 1
        this.listQuery.pageSize = val
        this.getList()
      },
      // 分页变化
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/components/module/style/common.scss'
</style>
