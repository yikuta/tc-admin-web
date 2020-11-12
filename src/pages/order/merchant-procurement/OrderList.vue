<template>
  <div class="order-list">
    <el-table
      :data="tableData.data"
      stripe
      style="width: 100%"
      header-row-class-name='table-head'
       v-loading="loading"
    >
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align='center'
      >
        <template slot-scope="scope">
          <span v-show="!loading">{{(tableData.pageNo - 1) * tableData.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderInfo"
        label="订单信息"
        width="240"
      >
        <template slot-scope="scope">
          <div class="table-text">
            <p>订单编号：{{scope.row.orderNum}}</p>
            <p>订单状态：<span style="color:#FF0005">{{scope.row.orderState | statusDescrible}}</span></p>
            <p>下单时间：{{scope.row.createTime}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsInfo"
        label="商品信息"
      >
        <template slot-scope="scope">
          <div>
            <div
              style="margin-bottom:5px;overflow:hidden"
              v-for="(item,index) in scope.row.skuInfos"
              :key="index"
              v-if="index < 2"
            >
              <img
                :src="item.channelCommodityThumbnailImage"
                alt=""
                class="table-img"
              >
              <div class="table-text" style="width:calc(100% - 85px)">
                <p style="color:#409EFF;cursor:pointer">{{item.channelCommodityName}}</p>
                <p>单价：{{item.sellingPrice | money}}</p>
                <p>数量：{{item.num}}</p>
              </div>
            </div>
            <div 
              style="color:#409EFF;cursor:pointer;text-align:center" 
              v-show="scope.row.skuInfos.length>2"
              @click="handleListGoods(scope.row.skuInfos)">查看全部</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="storeInfo"
        label="门店信息"
      >
        <template slot-scope="scope">
          <div class="table-text">
            <p>下单门店：{{scope.row.storeName}}</p>
            <p>门店编码：{{scope.row.storeCode}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="payInfo"
        label="支付信息"
        width="160"
      >
        <template slot-scope="scope">
          <div class="table-text">
            <p>付款状态：{{scope.row.payStatus | statusDescrible}}</p>
            <p>商品总价：{{scope.row.totalPrice | money}}</p>
            <p>实付金额：{{scope.row.actualPaymentPrice | money}}</p>
            <p>支付渠道：{{scope.row.paymentTradeType | statusDescrible}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="发货状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <p>{{scope.row.orderShipmentState | statusDescrible}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100"
        align='center'
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            v-np='"ORDER_PURCHASE_FIND"'
            @click="handleEditOrder(scope.$index, scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="商品信息"
      :visible.sync="dialogVisible"
      width="980px"
      :close-on-click-modal='false'
      :footer='null'>
      <el-table
        :data="goodsList"
        stripe
        style="width: 100%"
        header-row-class-name='table-head'
      >
        <el-table-column
          prop="goods"
          label="商品信息"
        >
          <template slot-scope="scope">
            <div
              style="display:flex;margin-bottom:5px;align-items:center"
            >
              <img
                :src="scope.row.channelCommodityThumbnailImage"
                alt=""
                class="table-img"
              >
              <div class="table-text" style="width: calc(100% - 80px)">
                <p style="color:#409EFF;cursor:pointer">{{scope.row.channelCommodityName}}</p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="costPrice"
          label="单价"
          align='center'
          width='160'
        >
          <template slot-scope="scope">
            {{scope.row.sellingPrice | money}}
          </template>
        </el-table-column>
        <el-table-column
          prop="num"
          label="数量"
          align='center'
          width='160'
        >
        </el-table-column>
      </el-table>
     
    </el-dialog>
  </div>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Object,
      default: () => {
        return {
          data: [],
          pageNo: 1,
          pageSize: 20
        }
      }
    },
    loading: Boolean
  },
  data() {
    return {
      dialogVisible: false,
      goodsList: []
    }
  },
  methods: {
    handleEditOrder(index, row) {
      this.$router.push('procurementDetail?orderNum=' + row.orderNum)
    },
    handleListGoods(list) {
      this.dialogVisible = true
      this.goodsList = list
    }
  }
}
</script>
<style lang="scss" scoped>
.table-text{
  float: left;
}
.table-text p {
  margin: 0;
}
/deep/ .table-head th {
  background: #f9fafc !important;
}
.table-img{
  margin-right:5px;
  border: 1px solid #999;
  width: 80px;
  height: 80px;
  float: left;
}
</style>