<template>
  <div class="app-container">
    <el-row class="content">
      <el-row>
        <el-col :span="12">
          <span class="label">门店编码：{{shopCode}}&emsp;&emsp;&emsp;</span>
          <span>门店名称: {{shopName}}</span>
        </el-col>
      </el-row>
    </el-row>
    <el-table
      v-if="tableData.length"
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="createTime"
        label="操作时间"
        width="">
      </el-table-column>
      <el-table-column
        prop="content"
        label="操作内容"
        width="">
      </el-table-column>
      <el-table-column
        prop="operator"
        label="操作人"
        width="">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { reqOperationLogList } from '@/api/seller.js'
  export default {
    name: 'operationLog',
    components: {
      UploadFile: resolve => {
        return require(['@/components/UploadFile/index'], resolve)
      }
    },
    data() {
      return {
        tableData: [],
        loading: false
      }
    },
    mounted() {
      const { code, name } = this.$route.query
      if (code) {
        this.shopCode = code
        this.shopName = name
        this.handleDetail()
      }
    },
    methods: {
      handleDetail() {
        const { code } = this.$route.query
        reqOperationLogList(code).then(res => {
          if (parseInt(res.code) === 200) {
            this.tableData = res.result.itemVOs
          }
        })
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import './style/index.scss';
  .app-container {
    font-size: 14px;
    .content {
      color: #606266;
      padding: 10px 0 20px 10px;
    }
  }

</style>
