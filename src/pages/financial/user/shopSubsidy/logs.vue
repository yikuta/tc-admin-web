<template>
  <div class="app-container">
    <div class="describe-table">
      <el-row>
        <el-col :span='6' v-for="(item, index) in describeTable" :key="index">
          {{item.title}} {{item.formatter ? item.formatter(detail) : detail[item.prop]}}
        </el-col>
      </el-row>
    </div>

    <base-table
      :list="list"
      :pagination="pagination"
      :columns="detailTableColumns"
      @change="handleTableChange"
    ></base-table>
  </div>
</template>
<script>
  import { mergeObject } from '@/utils/util'
  import { detailTableColumns, describeTable } from './const/logs'
  import { fetchAuditSubsidyLogs } from '@/api/financial/shop'

  export default {
    name: 'leaderSubsidyLogs',
    components: {
      BaseTable: () => import('@/components/BaseTable')
    },
    data() {
      return {
        describeTable,
        detailTableColumns,
        id: null,
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: [],
        detail: {}
      }
    },
    mounted() {
      this.id = this.$route.query.id
      this.fetchTableList()
    },
    methods: {
      fetchTableList() {
        fetchAuditSubsidyLogs({
          id: this.id,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }).then(res => {
          if (res.code === 200) {
            const { auditAmount, bossAccount, shopCode, shopName, pageObj } = res.result
            this.detail = {
              auditAmount, bossAccount, shopCode, shopName
            }
            this.list = pageObj.itemVOs
            this.pagination.total = pageObj.totalCount
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
<style scoped lang="scss">
  .describe-table {
    padding-bottom: 12px;
    min-height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: #606266;

    dl {
      margin: 0;
      display: grid;
      grid-template-columns: 150px 1fr;

      dt {
        width: 150px;
        padding: 12px 20px;
        border-right: 1px solid #e4e4e4;
        text-align: center;
        background: #f9fafc;
        color: #909399;
        font-weight: bold;
        display: grid;
        align-items: center;
      }

      dd {
        margin: 0;
        padding: 12px 20px;
        color: #606266;
      }
    }
  }
</style>
