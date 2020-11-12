<template>
  <div class="app-container">
    <div class="header-info">
      <div class="title">变量信息</div>
      <el-row :gutter="20">
        <el-col :span="8">变量编码：{{$route.query.code}}</el-col>
        <el-col :span="8">变量名称：{{$route.query.name}}</el-col>
      </el-row>
    </div>
    <div class="header-info">
      <div class="title">操作日志</div>
      <base-table :list="tableData" :columns="columns"></base-table>
      <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
    </div>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import { reqLogList } from '@/api/common'
  const columns = [
    {
      title: '操作时间',
      prop: 'createTime',
      width: 200
    },
    {
      title: '操作内容',
      prop: 'content'
    },
    {
      title: '操作人',
      prop: 'operator',
      width: 200
    }
  ]
  export default {
    components: {
      BaseTable: () => import('@/components/BaseTable'),
      Pagination
    },
    data() {
      return {
        columns,
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        tableData: []
      }
    },
    mounted() {
      this.handleDataList()
    },
    methods: {
      handleDataList() {
        reqLogList({
          identifier: this.$route.query.code,
          logServerType: 'MISC_VARIABLECONFIG_LOG',
          page: this.currentPage,
          size: this.pageSize
        }).then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          }
        })
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.handleDataList()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.handleDataList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .header-info {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;

    .title {
      font-size: 16px;
      color: #666;
    }
  }
</style>
