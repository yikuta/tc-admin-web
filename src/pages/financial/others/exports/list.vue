<template>
  <div class="app-container">
    <search-form
      :buttons="['reset', 'search']"
      :formConfig="listForm"
      :form="form"
      @change="handleSearch"
    >
      <template slot="createTime">
        <date-range
          label="提交时间"
          prop="createTime"
          :startTime.sync="form.createBeginTime.value"
          :endTime.sync="form.createEndTime.value"
        />
      </template>
    </search-form>
    <base-table
      :list="list"
      :pagination="pagination"
      :columns="listTableColumns"
      @change="handleTableChange"
    >
      <el-table-column slot="operates" label="操作" width="80px">
        <template slot-scope="{ row }">
          <el-link v-if="row.fileUrl" :href="row.fileUrl" type="primary">下载文件</el-link>
          <el-link v-else type="primary" disabled>下载文件</el-link>
        </template>
      </el-table-column>
    </base-table>
  </div>
</template>
<script>
  import { mergeObject } from '@/utils/util'
  import { listForm, listTableColumns } from './const'
  import { fetchDownloadList } from '@/api/financial/other'
  import searchFormat from '@/utils/searchFormat'
  export default {
    name: 'Download',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      DateRange: () => import('../../templates/DateRange')
    },
    data() {
      return {
        listForm,
        listTableColumns,
        form: {
          status: { value: '', name: 'status', matchType: 'EQUAL', tempType: 'enum' },
          createBeginTime: { value: '' },
          createEndTime: { value: '' }
        },
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: []
      }
    },
    mounted() {
      this.fetchDownloadList()
    },
    methods: {
      fetchDownloadList() {
        const { createBeginTime, createEndTime } = this.form
        if (!((createBeginTime.value && createEndTime.value) || (!createBeginTime.value && !createBeginTime.value))) {
          this.$message.error('开始日期和结束日期不能只选择一个')
          return
        }
        let times = null
        if (createBeginTime.value && createEndTime.value) {
          times = [createBeginTime.value, createEndTime.value]
        }
        const searches = searchFormat({
          status: { ...this.form.status, value: this.form.status.value ? `component.DownloadQueueStatus_${this.form.status.value}` : null },
          createTime: { value: times, name: 'createTime', tempType: 'Date', matchType: 'BETWEEN' }
        })

        fetchDownloadList({
          searchs: searches.length ? JSON.stringify(searches) : null,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
            this.pagination.total = res.result.totalCount
          }
        })
      },
      handleSearch(type) {
        if (type === 'search') {
          this.fetchDownloadList()
        } else if (type === 'reset') {
          for (let key in this.form) {
            if (this.form[key]) {
              this.form[key].value = ''
            } else {
              this.form[key] = ''
            }
          }
          this.pagination.pageNo = 1
          this.fetchDownloadList()
        }
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchDownloadList()
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
