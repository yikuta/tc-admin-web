<template>
  <div class="app-container">
    <div class="header-info">
      <div class="title">{{$route.query.type==='list'?'字典':'字典值'}}信息</div>
      <el-row :gutter="20">
        <el-col :span="8">{{$route.query.type==='list'?'字典':'值'}}编码：{{$route.query.code}}</el-col>
        <el-col :span="8">{{$route.query.type==='list'?'字典':'值'}}名称：{{$route.query.name}}</el-col>
      </el-row>
    </div>
    <div class="table-wrapper">
      <div class="title" style="margin-bottom:20px">操作日志</div>
      <base-table :columns="dColumns" :list="tableData"></base-table>
      <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
    </div>
  </div>
</template>

<script>
  import BaseTable from '@/components/BaseTable'
  import Pagination from '@/components/Pagination'
  import { reqLogList } from '@/api/common'
  export default {
    components: { BaseTable, Pagination },
    data() {
      return {
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        list: [{
          id: 1,
          name: '',
          enable: true
        }],
        dColumns: [
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
        ],
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
    }
  }
</style>
