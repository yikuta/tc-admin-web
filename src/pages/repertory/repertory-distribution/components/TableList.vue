<template>
  <div class="order-list">
    <!-- <div class="text">
      <p>快递到家可用库存总数由所有库存数汇总得出，当前商品可用库存总数为：{{totalCount}}</p>
      <p>爆品预售可用库存总数由配送区域所属总仓的库存数 + 虚拟库存数得出</p>
    </div> -->
    <el-table
      :data="tableData"
      stripe
      style="width: 100%"
      header-row-class-name='table-head'
      v-loading="loading"
    >
      <el-table-column prop="specs" label="规格" align='center'>
        <template v-slot:default='{ row }'>
          <div>
            <span v-if="!row.skuInfo||row.skuInfo.toString()==='[]'">-</span>
            <span v-for="(item,index) in JSON.parse(row.skuInfo.replace(/\\/g, ''))" :key="index" v-else>{{index===0?'':' '}}{{item.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="saleStock"
        label="销售库存数"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="virtualStock"
        label="虚拟库存数"
        align='center'
      >
      </el-table-column>
      <el-table-column
        prop="availableStock"
        label="可用库存数"
        align='center'
      >
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Object,
      default: () => []
    },
    loading: Boolean,
    totalCount: {
      type: Number,
      default: 0
    }
  },
  methods: {
    handleEditOrder() { // params: index, row
      this.$router.push('saleAreaDetail?id=' + 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-text {
  float: left;
}
.table-text p {
  margin: 0;
}
/deep/ .table-head th {
  background: #f9fafc !important;
}
.table-img {
  margin-right: 5px;
  border: 1px solid #999;
  width: 80px;
  height: 80px;
  float: left;
}
.table-tip {
  overflow: hidden;
  .text {
    float: left;
  }
  .tip {
    float: left;
    margin-left: 4px;
    margin-top: 3px;
  }
}
.text{
  p{
    margin: 0;
    padding-bottom: 20px;
  }
}
</style>
