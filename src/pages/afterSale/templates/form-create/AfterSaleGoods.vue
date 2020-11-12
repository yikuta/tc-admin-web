<template>
  <div class="order-detail-list">
    <p class="order-text">售后商品</p>
    <el-table 
      :data="tableData"
      header-row-class-name="table-head">
      <el-table-column
        prop="goodsInfo"
        label="商品名称"
      >
        <template v-slot:default='{ row }'>
          <div style="margin-bottom:5px;overflow:hidden">
            <span style="color:#D9001B">{{row.offlineFlag ? '地推 ' : ''}}</span>{{row.commodityName}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="commodityCode" label="商品编码"></el-table-column>
      <el-table-column prop="specs" label="规格">
        <template v-slot:default='{ row }'>
          <div>
            <span v-if="!row.commoditySkuInfo||row.commoditySkuInfo.toString()==='[]'">-</span>
            <span v-for="(item,index) in JSON.parse(row.commoditySkuInfo.replace(/\\/g, ''))" :key="index" v-else>{{index===0?'':'_'}}{{item.name}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="单价（元）*数量">
        <template v-slot:default='{ row }'>
          <div>
            <span>{{(row.commodityUnitPrice||row.commodityUnitPrice===0) ? row.commodityUnitPrice : '-'}}*{{(row.commodityNum || row.commodityNum===0) ? row.commodityNum : '-'}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="commoditySumPrice" label="商品总价（元）" :formatter="(row)=>formatNoneValue(row['commoditySumPrice'])"></el-table-column>
      <el-table-column prop="commodityActualPayment" label="实付金额（元）" :formatter="(row)=>formatNoneValue(row['commodityActualPayment'])"></el-table-column>
      <el-table-column prop="commodityDiscount" label="优惠（元）" :formatter="(row)=>formatNoneValue(row['commodityDiscount'])"></el-table-column>
      <el-table-column prop="flagDelivery" label="发货状态">
        <template v-slot:default='{ row }'>
          <div>
            <span>{{row.deliverGoodsChannel | delivery}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="storehouse" label="发货仓库" v-if="hasStore" :formatter="(row)=>formatNoneValue(row['storehouse'])"></el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    hasStore: {
      type: Boolean,
      default: () => false
    }
  },
  filters: {
    delivery(val) {
      if (val) {
        if (val === 'MIDDLE_GROUND') return '中台发货'
        if (val === 'OMS') return 'OMS发货'
        if (val === 'BUSINESS') return '商家发货'
        if (val === 'SUPPLIER') return '供应商发货'
        if (val === 'WAREHOUSE') return '仓库发货'
      } else {
        return '未发货'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../common/index.scss')
</style>