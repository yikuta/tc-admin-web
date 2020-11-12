<template>
  <div class="order-detail-list">
    <p class="order-text">换货商品</p>
    <el-table 
      :data="tableData"
      header-row-class-name="table-head">
      <el-table-column
        prop="goodsInfo"
        label="商品"
        width="380"
      >
        <template v-slot:default='{ row }'>
          <div style="margin-bottom:5px;overflow:hidden">
            <img
              :src="row.commodityImage"
              alt=""
              style="margin-right:5px"
              class="table-img"
            />
            <div class="table-text" style="width:calc(100% - 85px)">
              <p>名称：
                <span style="color:#409EFF;cursor:pointer">{{row.commodityName}}</span>
              </p>
              <p>编码：{{ row.commodityCode }}</p>
              <p>规格：
                <span v-if="!row.commoditySkuInfo||row.commoditySkuInfo.toString()==='[]'">-</span>
                <span v-for="(item,index) in JSON.parse(row.commoditySkuInfo.replace(/\\/g, ''))" :key="index" v-else>{{item.specName}}:{{item.name}}&nbsp;&nbsp;</span>
              </p>
            </div>
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
      <el-table-column prop="flagDelivery" label="发货状态">
        <template v-slot:default='{ row }'>
          <div>
            <span>{{row.flagDelivery ? '已发货' : '未发货'}}</span>
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
  }
}
</script>
<style lang="scss" scoped>
@import url('./index.scss');
.table-img{
  margin-right:5px;
  border: 1px solid #999;
  width: 80px;
  height: 80px;
  float: left;
}
</style>