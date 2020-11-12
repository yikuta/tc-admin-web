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
        label="配送单信息"
        width="240"
      >
        <template slot-scope="scope">
          <div class="table-text">
            <p>配送单号：{{scope.row.deliveryUuid}}</p>
            <p>生单时间：{{scope.row.createTime}}</p>
            <p>订单编号：{{scope.row.orderNo}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="goodsInfo"
        label="配送信息"
      >
        <template slot-scope="scope">
          <div class="table-text">
            <p>配送员：{{scope.row.transporterName}}</p>
            <p>手机：{{scope.row.transporterPhone}}</p>
            <p>接单时间：{{scope.row.fetchTime}}</p>
            <p>送达时间：{{scope.row.finishTime}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="buyerInfo"
        label="门店信息"
      >
        <template slot-scope="scope">
          <div class="table-text">
            <p>下单门店：{{scope.row.name}}</p>
            <p>门店编码：{{scope.row.shopCode}}</p>
            <p>门店地址：{{scope.row.shopAddress}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="buyerInfo"
        label="收货信息"
      >
        <template slot-scope="scope">
          <div class="table-text">
            <p>收货人姓名：{{scope.row.orderReceiver}}</p>
            <p>收货人手机：{{scope.row.contactInformation}}</p>
            <p>收货地址：{{scope.row.receiveAddress}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="status"
        label="配送状态"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <p>{{scope.row.deliveryStatus | statusDescrible}}</p>
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
            v-np='"DELIVERY_ORDER_DETAIL_VIEW"'
            @click="handleEditOrder(scope.$index, scope.row)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
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
  filters: {
    statusDescrible: (val) => {
      switch (val) {
        case 10:
          return '待配送'
          // break
        case 20:
          return '配送中'
          // break
        case 30:
          return '已送达'
          // break
        case 40:
          return '已取消(配送员取消)'
          // break
        case 50:
          return '已取消(超时未抢单)'
          // break
        case 60:
          return '妥投异常'
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      goodsList: []
    }
  },
  methods: {
    handleEditOrder(index, row) {
      this.$router.push('deliverDetail?id=' + row.id)
    // },
    // handleListGoods(list) {
    //   this.dialogVisible = true
    //   this.goodsList = list
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