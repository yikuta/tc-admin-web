<template>
  <div class="refund-and-return">
    <div class="item">
      <p class="table-text">退货商品</p>
      <el-table header-row-class-name="table-head" :data="goodsList">
        <el-table-column prop="commodityName" label="商品名称"></el-table-column>
        <el-table-column prop="commodityCode" label="商品编码"></el-table-column>
        <el-table-column prop="specs" label="规格">
          <template v-slot:default='{ row }'>
            <div>
              <span v-if="!row.commoditySkuInfo||row.commoditySkuInfo.toString()==='[]'">-</span>
              <span v-for="(item,index) in JSON.parse(row.commoditySkuInfo.replace(/\\/g, ''))" :key="index" v-else>{{index===0?'':'_'}}{{item.name}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="commodityNum" label="数量"></el-table-column>
        <el-table-column prop="commodityActualPayment" label="可退金额"></el-table-column>
      </el-table>
    </div>
    <div class="item" v-if="goodsList && goodsList.length && goodsList[0].deliverGoodsChannel!=='MIDDLE_GROUND'">
      <p class="table-text">退回仓库</p>
      <el-select v-model="form.repertoryCode" placeholder="请选择" size="small" style="width:500px" @change="handleChange">
        <el-option
          v-for="item in storeList"
          :key="item.repertoryCode"
          :label="item.repertoryName"
          :value="item.repertoryCode"></el-option>
      </el-select>
    </div>
    <div class="item" v-if="goodsList && goodsList.length && goodsList[0].deliverGoodsChannel!=='MIDDLE_GROUND'">
      <p class="table-text">地址</p>
      <el-input size='small' v-model="form.address" style="width:500px" readonly></el-input>
    </div>
  </div>
</template>
<script>
import { fetchAfterSaleStores } from '@/api/afterSale'
export default {
  props: {
    goodsList: Array,
    orderNum: {
      type: String,
      default: () => ''
    },
    orderType: {
      type: Object,
      default: {
        describe: '快递到家',
        value: 1
      }
    }
  },
  data() {
    return {
      form: {
        repertoryCode: '',
        repertoryName: '',
        address: ''
      },
      storeList: []
    }
  },
  mounted() {
    this.handleStores()
  },
  methods: {
    handleStores() {
      if (this.goodsList && this.goodsList.length) {
        fetchAfterSaleStores({
          // commodityNo: this.goodsList[0].commoditySku,
          // commoditySpu: this.goodsList[0].commoditySpu,
          orderDetailId: this.goodsList[0].orderDetailId,
          orderCode: this.orderNum
          // orderCode: '01733064313564038048'
        }).then(res => {
          if (res.code === 200) {
            this.storeList = res.result || []
          } else {
            this.storeList = []
          }
        })
      }
    },
    handleChange(val) {
      let arr = this.storeList.filter(item => item.repertoryCode === val)
      if (arr.length > 0) {
        this.form.repertoryName = arr[0].repertoryName
        this.form.address = arr[0].address
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.refund-and-return .item{
  display: flex;
  margin-bottom: 20px;
}
.table-text{
  font-size:14px;
  line-height: 32px;
  padding: 0;
  margin: 0 20px 0 0;
  width: 56px;
  text-align: right;
}
</style>
