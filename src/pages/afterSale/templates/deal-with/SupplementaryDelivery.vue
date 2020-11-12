<template>
  <div>
    <div class="table-item">
      <p class="table-text">商品信息</p>
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
        <el-table-column prop="commodityUnitPrice" label="销售价（元）"></el-table-column>
        <el-table-column prop="commodityNum" label="购买数量"></el-table-column>
        <el-table-column prop="reshipmentNum" label="补发数量">
          <template v-slot:default='{ row }'>
            <el-input-number :min="1" :max="row.commodityNum" size="mini" v-model="reshipmentGoodsInfoDto.reshipmentNum"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column prop="discount" label="小计">
          <template v-slot:default='{ row }'>
            <span>{{row.commodityUnitPrice * reshipmentGoodsInfoDto.reshipmentNum}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table-item" v-if="orderType === 'ORDER_EXPLOSIVE_PRE_SALE'">
      <p class="table-text">配送信息</p>
      <el-table header-row-class-name="table-head" :data="tableData">
        <el-table-column prop="locationName" label="自提点名称"></el-table-column>
        <el-table-column prop="location" label="自提点地址"></el-table-column>
        <el-table-column prop="orderReceiver" label="自提人" :formatter="(row)=>formatNoneValue(row['orderReceiver'])"></el-table-column>
        <el-table-column prop="selfMentionTime" label="自提时间">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.changeDate"
              type="date"
              @change="handleDateChange"
              placeholder="选择日期"
              size="mini"
              value-format="yyyy-MM-dd"
              :picker-options="{ disabledDate (time) { return time.getTime() - 1 < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() - 1 }}">
            </el-date-picker>
          </template>
        </el-table-column>
        <el-table-column prop="contactInformation" label="手机"></el-table-column>
      </el-table>
    </div>
    <div class="table-item" v-else>
      <p class="table-text">配送信息</p>
      <el-table header-row-class-name="table-head" :data="tableData">
        <el-table-column prop="orderReceiver" label="收货人" align="center"></el-table-column>
        <el-table-column prop="receiveAddress" label="收货地址" align="center"></el-table-column>
        <el-table-column prop="contactInformation" label="收货人电话" align="center"></el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { fetchafterSaleAddress } from '@/api/afterSale'
export default {
  props: {
    goodsList: {
      type: Array,
      default: () => []
    },
    orderNum: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      orderType: '',
      reshipmentGoodsInfoDto: {
        reshipmentNum: 1,
        selfMentionTime: ''
      },
      tableData: []
    }
  },
  mounted() {
    this.handleAddress()
  },
  methods: {
    handleDate() {
      let day3 = new Date()
      day3.setTime(day3.getTime() + 24 * 60 * 60 * 1000)
      return day3.getFullYear() + '-' + (day3.getMonth() + 1) + '-' + day3.getDate()
    },
    handleAddress() {
      fetchafterSaleAddress(this.orderNum).then(res => {
        if (res.code === 200) {
          this.orderType = res.result.orderType
          this.tableData = [
            {
              orderReceiver: res.result.orderReceiver,
              contactInformation: res.result.contactInformation,
              receiveAddress: res.result.receiveAddress,
              selfMentionTime: res.result.selfMentionTime,
              locationName: res.result.locationName,
              location: res.result.location
            }
          ]
          this.reshipmentGoodsInfoDto = { ...res.result, reshipmentNum: 1, selfMentionTime: this.handleDate() }
        } else {
          this.tableData = []
        }
      })
    },
    handleDateChange(val) {
      this.reshipmentGoodsInfoDto.selfMentionTime = val
    }
  }
}
</script>
<style lang="scss" scoped>
.table-item{
  display: flex;
  margin-bottom: 20px;
}
.table-text{
  font-size:14px;
  line-height: 32px;
  padding: 0;
  margin: 0 20px 0 0;
}
</style>