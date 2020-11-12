<template>
  <div class="refund-and-return">
    <div class="item">
      <p class="table-text">换货商品信息</p>
      <div class="exchange-table">
        <el-row>
          <el-col :span="8">商品名称：{{goodsList && goodsList.length ? goodsList[0].commodityName : ''}}</el-col>
          <el-col :span="8">商品编码：{{goodsList && goodsList.length ? goodsList[0].commodityCode : ''}}</el-col>
          <el-col :span="8">购买数量：{{goodsList && goodsList.length ? goodsList[0].commodityNum : ''}}</el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <sku-table ref="skuTable" :tableData="tableData" :colsMap="skuTableConfig" @change='handleChange'/>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="item" v-if="goodsList && goodsList.length && goodsList[0].deliverGoodsChannel!=='MIDDLE_GROUND'">
      <p class="table-text">退回仓库</p>
      <el-select v-model="form.repertoryCode" placeholder="请选择" size="small" style="width:500px" @change="handleChangeStore">
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
import { fetchReturnCommodity, fetchAfterSaleStores } from '@/api/afterSale'
import SkuTable from '@/components/SkuTable/index'
export default {
  components: {
    SkuTable
  },
  props: {
    goodsList: {
      type: Array,
      default: () => []
    },
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
      tableData: [],
      skuTableConfig: [
        { prop: 'salePrice', label: '销售价' },
        { prop: 'total', label: '小计（元）' },
        { prop: 'select', useComponent: 'radio' }
      ],
      baseExchangeCommodityInfo: {},
      form: {
        repertoryCode: '',
        repertoryName: '',
        address: ''
      },
      storeList: []
    }
  },
  mounted() {
    this.handleDataList()
    this.handleStores()
  },
  methods: {
    handleDataList() {
      let arr = this.goodsList.map(item => {
        return {
          baseCommodityNo: item.baseCommodityNo,
          channelCommodityNo: item.commodityCode
        }
      })
      fetchReturnCommodity(arr).then(res => {
        if (res.code === 200 && res.result && res.result.length) {
          this.unitStr = res.result[0].unitStr
          this.tableData = res.result[0].channelCommoditySpecificationList.map(item => {
            return {
              id: item.id,
              skuInfo: item.skuInfo,
              skuNo: item.skuNo,
              salePrice: item.salePrice,
              total: item.salePrice * this.goodsList[0].commodityNum,
              baseSkuNo: item.baseSkuNo
            }
          })
          this.baseExchangeCommodityInfo = {
            commodityCode: this.goodsList[0] ? this.goodsList[0].commodityCode : '',
            commodityImage: this.goodsList[0] ? this.goodsList[0].commodityImage : '',
            commodityName: res.result[0].channelCommodityName,
            commodityNum: this.goodsList[0] ? this.goodsList[0].commodityNum : '',
            commoditySkuInfo: this.tableData[0].skuInfo,
            commoditySumPrice: this.tableData[0].total,
            commodityUnitPrice: this.tableData[0].salePrice,
            commoditySpu: res.result[0].baseCommodityNo,
            commoditySku: this.tableData[0] ? this.tableData[0].baseSkuNo : '',
            commodityUnit: this.unitStr
          }
        } else {
          this.tableData = []
        }
      })
    },
    handleChange(data) {
      this.baseExchangeCommodityInfo.commoditySkuInfo = data.skuInfo
      this.baseExchangeCommodityInfo.commoditySumPrice = data.total
      this.baseExchangeCommodityInfo.commodityUnitPrice = data.commodityUnitPrice
      this.baseExchangeCommodityInfo.commoditySku = data.baseSkuNo
    },
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
    handleChangeStore(val) {
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
.refund-and-return{
  overflow: hidden;
}
.exchange-table{
  float: left;
  width: calc(100% - 140px);
  line-height: 32px;
  font-size:14px;
}
.table-text{
  float: left;
  font-size:14px;
  line-height: 32px;
  padding: 0;
  margin: 0 20px 0 0;
  width: 120px;
}
.item{
  display: flex;
  margin-bottom: 20px;
}
</style>
