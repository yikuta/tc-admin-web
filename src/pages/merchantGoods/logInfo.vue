<template>
  <div class="app-container">
    <el-row class="second-title">基本信息</el-row>
    <el-row class="content-text" :style="{marginBottom:'40px'}">
      <el-col :span="23" :offset="1">
        <el-row>
          <el-col :span="24">商品名称：{{ logInfo.productName }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">店铺分类：{{ logInfo.category }}</el-col>
          <el-col :span="16">基础分类：{{ logInfo.baseCategory }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="8">门店编码：{{ logInfo.shopCode }}</el-col>
          <el-col :span="16">门店名称：{{ logInfo.name }}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="second-title">操作日志</el-row>
    <el-row>
      <el-col :span="23" :offset="1">
        <el-table :data="tableData" border :header-cell-style="{ textAlign:'center' }" header-row-class-name='table-head'>
          <el-table-column prop="updateTime" label="操作时间" width="180" align="center"></el-table-column>
          <el-table-column prop="content" label="操作内容"></el-table-column>
          <el-table-column prop="operator" label="操作人" width="240" align="center"></el-table-column>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { fetchGoodsLogById } from '@/api/merchantGoods'
export default {
  name: 'merchantGoodsLog',
  data() {
    return {
      logInfo: {
        productName: '',
        category: '',
        baseCategory: '',
        shopCode: '',
        name: ''
      },
      tableData: []
    }
  },
  mounted() {
    const { query } = this.$route
    this.logInfo = query
    this.getLogs(query.id)
  },
  methods: {
    getLogs(code) {
      // let data = { "identifier": code }
      fetchGoodsLogById(code).then(res => {
        if (res.code === 200) {
          if (res.result && res.result.itemVOs) {
            this.tableData = res.result.itemVOs || []
          }
        } else {
          this.tableData = []
        }
      }).catch(() => {
        this.tableData = []
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@mixin title {
  border-left: 6px solid rgba(64, 158, 255, 1);
  padding-left: 10px;
  color: rgba(64, 158, 255, 1);
}
.app-container{
  .second-title {
    @include title();
    margin-bottom: 20px;
  }
  .el-row {
    margin-top: 20px;
  }
  /deep/ .table-head th {
    background: #f9fafc !important;
  }
}
</style>
