<template>
  <div class="app-container">
    <el-row :gutter="20" class="desc-list">
      <el-col :span="8" class="desc-item">
        <span class="label">姓名：</span>
        <span class="content">{{$route.query.fullName}}</span>
      </el-col>

      <el-col :span="8" class="desc-item">
        <span class="label">主属部门：</span>
        <span class="content">{{$route.query.mainDept}}</span>
      </el-col>

      <el-col :span="8" class="desc-item">
        <span class="label">附属部门：</span>
        <span class="content">{{$route.query.slaveDept}}</span>
      </el-col>
    </el-row>
    <base-table :list="list" :pagination="pagination" :columns="columns" @change="handleTableChange" />
  </div>
</template>

<script>
  import BaseTable from '@/components/BaseTable'
  import { fetchUserLogs } from '@/api/setting/authSetting'
  import searchFormat from '@/utils/searchFormat'
  import { mergeObject } from '@/utils/util'
  const columns = [{
    title: '日志ID',
    prop: 'id'
  }, {
    title: '操作日期',
    prop: 'createTime'
  }, {
    title: '日志内容',
    prop: 'content'
  }, {
    title: '操作人',
    prop: 'operator'
  }]
  export default {
    data() {
      return {
        columns,
        pagination: {
          pageSize: 20,
          pageNo: 1,
          total: 0
        },
        list: []
      }
    },
    components: {
      BaseTable
    },
    mounted() {
      this.fetchTableList()
    },
    methods: {
      formatSearches() {
        const { uid } = this.$route.query
        const results = searchFormat({
          operatorId: { value: uid, matchType: 'EQUAL', tempType: 'Long' }
        })
        return results.length ? JSON.stringify(results) : null
      },
      fetchTableList() {
        fetchUserLogs({
          ...this.pagination,
          searchs: this.formatSearches()
        }).then(res => {
          if (res.code === 200) {
            this.list = res.result.items || []
            this.pagination.total = res.result.totalCount
          }
        })
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchTableList()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .table-wrapper {
    .title {
      padding-bottom: 10px;
    }
  }
</style>
