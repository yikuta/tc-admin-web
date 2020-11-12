<template>
  <div class="order-detail-list">
    <p class="order-text">商品信息
      <span style="color:#FF0005;margin-left:30px;font-size:14px">发货状态：{{goodsInfo.orderShipmentState | statusDescrible}}</span>
    </p>
    <el-table
      :data="tableData"
      header-row-class-name="table-head"
      default-expand-all
      row-key="key"
      :tree-props="{children: 'children'}"
    >
      <el-table-column
        prop="goodsInfo"
        label="商品"
      >
        <template slot-scope="scope">
          <div style="margin-bottom:5px;overflow:hidden" v-if="scope.row.pkgNo">
            <span class="table-img table-text-vo">套餐</span>
            <div class="table-text" style="width:calc(100% - 85px)">
              <p>{{scope.row.pkgName}}</p>
              <p>业务商品编码：{{ scope.row.pkgNo }}</p>
            </div>
          </div>
          <div style="margin-bottom:5px;overflow:hidden" v-else>
            <span style="color:#D9001B;float:left;width:36px">{{offlineFlag ? '地推&nbsp;&nbsp;' : ''}}</span>
            <img
              :src="scope.row.channelCommodityThumbnailImage"
              alt=""
              style="margin-right:5px"
              class="table-img"
            />
            <div class="table-text" style="width:calc(100% - 121px)">
              <p>名称：
                <span>{{scope.row.channelCommodityName}}</span>
              </p>
              <p>{{scope.row.ispkg?'基础商品编码':'编码'}}：{{ scope.row.channelCommodityNo }}</p>
              <p>规格：
                <span v-if="!scope.row.skuInfo||scope.row.skuInfo.toString()==='[]'">-</span>
                <!-- <span>{{JSON.parse(scope.row.skuInfo.replace(/\\/g, ''))}}</span> -->
                <span v-for="(item,index) in JSON.parse(scope.row.skuInfo.replace(/\\/g, ''))" :key="index" v-else>{{item.specName}}:{{item.name}}&nbsp;&nbsp;</span>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="singlePrice"
        label="单价（元）"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div> {{ scope.row.sellingPrice | goodsMoney(scope.row.pkgNo) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="数量"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.num }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="小计"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.numSellingPrice | goodsMoney(scope.row.pkgNo) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="discount"
        label="优惠"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <el-popover
              title=""
              width="520"
              trigger="hover"
              @show='handleGoodsGridList(scope.row)'
            >
              <el-table
                :data="gridGoodsData"
                border
              >
                <el-table-column
                  prop="type"
                  label="优惠类型"
                >
                <template slot-scope="scope">
                  <div>{{ scope.row.discountType | statusDescrible }}</div>
                </template>
                </el-table-column>
                <el-table-column
                  prop="discountMoney"
                  label="优惠金额（元）"
                ></el-table-column>
                <el-table-column
                  prop="remark"
                  label="优惠项"
                ></el-table-column>
              </el-table>
              <span
                slot="reference"
                :class="{'discount-img':!scope.row.pkgNo}"
              ></span>
            </el-popover>

            {{ scope.row.numPreferential | goodsMoney(scope.row.pkgNo) }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="pay"
        label="实际支付"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>{{ scope.row.numActualPrice | goodsMoney(scope.row.pkgNo) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="flagDelivery"
        label="商品状态"
        width="130"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.pkgNo">
            <span :style="scope.row.flagDelivery?'color:#AAAAAA':''">{{ scope.row.orderItemState ? scope.row.orderItemState.describe : '-' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderDetailDeliveryState"
        label="配送状态"
        width="130"
      >
        <template slot-scope="scope">
          <div>
            <!-- <span>{{ scope.row.pkgNo?'':(orderType.value===3?(orderState.value===50?'已自提':'-'):scope.row.orderSaleState ? changeOrderSaleState(scope.row.orderSaleState.value) : '-')}}</span> -->
            <span>{{ scope.row.pkgNo?'':orderType.value===3?(scope.row.orderBusinessState ? changeOwnOrderSaleState(scope.row.orderBusinessState) : '-'):(scope.row.orderSaleState ? changeOrderSaleState(scope.row.orderSaleState) : '-')}}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="afterSale"
        label="售后"
        width="100"
        align="center"
        v-if="orderState.value !== 10 && orderType.value !== 3"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.pkgNo">
            <el-button
              size="mini"
              style="color:#3F9CFC"
              @click="handleClick(scope.row.orderDetailId)"
              v-np='orderType.value === 2 ? "AFTER_SALE_PRESALE_REQ_CREATE" : "AFTER_SALE_OWNSALE_REQ_CREATE"'
              >添加售后</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-detail-info">
      <dl
        v-for="(item,index) in goodsInfo.totalInfo"
        :key="index"
      >
        <dt v-if="item.label=='优惠：'">
          <el-popover
            title=""
            width="520"
            trigger="hover"
            placement='left'
            @show='handleOrderGridList'
          >
            <el-table
              :data="gridData"
              border
            >
              <el-table-column
                prop="type"
                label="优惠类型"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.discountType | statusDescrible }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="discountMoney"
                label="优惠金额（元）"
              ></el-table-column>
              <el-table-column
                prop="remark"
                label="优惠项"
              ></el-table-column>
            </el-table>
            <p slot="reference">
              <span class="discount-img"></span>
              优惠：
            </p>
          </el-popover>
        </dt>
        <dt v-else>{{item.label}}</dt>
        <dd :style="item.label=='实付金额：'">{{item.value | goodsMoney}}</dd>
      </dl>
    </div>
  </div>
</template>
<script>
import { fetchDiscountDetailByGoods, fetchDiscountDetailByOrder, asyncOrderDetailToAfterSale } from '@/api/order'
function generateKey(data = []) {
  return data.map((item) => {
    item.key = (Math.random() * 100000).toString()
    if (item.children && item.children.length) {
      item.children = generateKey(item.children)
    }
    return item
  })
}
export default {
  props: {
    goodsInfo: {
      type: Object,
      default: () => {
        return {
          skuInfos: [],
          orderDetailPkgVos: []
        }
      }
    },
    orderState: {
      type: Object,
      default: () => {}
    },
    orderType: {
      type: Object,
      default: () => {}
    },
    deliveryType: {
      type: Object,
      default: () => {}
    },
    offlineFlag: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      gridGoodsData: [],
      gridData: [],
      loading: false
    }
  },
  computed: {
    tableData() {
      let arr = []
      if (this.goodsInfo.orderDetailPkgVos && this.goodsInfo.orderDetailPkgVos.length) {
        arr = this.goodsInfo.orderDetailPkgVos.map(item => {
          return {
            pkgName: item.pkgName,
            pkgImg: item.pkgImg,
            pkgNo: item.pkgNo,
            pkgNum: item.pkgNum,
            children: item.skuInfos.map(item => {
              return {
                ispkg: true,
                ...item
              }
            })
          }
        })
      }
      return generateKey(this.goodsInfo.skuInfos.concat(arr))
    }
  },
  filters: {
    // 给商品价格加补 ￥
    goodsMoney: (value, isVo) => {
      // isVo--是否是套餐
      return value || value === 0 ? '￥' + value.toFixed(2) : (isVo ? '' : '-')
    }
  },
  methods: {
    changeOrderSaleState(item) {
      if (item && item.value) {
        if (item.value === 1) return '待配送'
        if (item.value === 2) return '待送达' // "待送达-全部出库
        if (item.value === 3) return '待送达' // "待送达-部分到店"
        if (item.value === 4) return '待自提' // "待提货-全部到店"
        if (item.value === 5) return '待自提' // "待提货-部分核销"
        if (item.value === 6) return '已自提' // "已提货-全部核销"
      } else {
        return '-'
      }
    },
    changeOwnOrderSaleState(item) {
      if (item && item.value) {
        if (item.value === 1) return '待接单' // "待商家接单"
        if (item.value === 2) return '备货中' // "备货中"
        if (item.value === 3) return (this.deliveryType.value === 2 || this.deliveryType.value === 3 || this.deliveryType.value === 4) ? '待自提' : '待配送' // "待配送-待自提"
        if (item.value === 4) return '配送中' // "配送中"
        if (item.value === 5) return '配送中' // "线下配送中"
        if (item.value === 6) return '已送达' // "已送达"
        if (item.value === 7) return (this.deliveryType.value === 2 || this.deliveryType.value === 3 || this.deliveryType.value === 4) ? '已自提' : '已签收' // "已签收-已自提"
      } else {
        return '-'
      }
    },
    handleGoodsGridList(row) {
      fetchDiscountDetailByGoods(row.orderDetailId).then(res => {
        if (res.code === 200) {
          this.gridGoodsData = res.result || []
        } else {
          this.gridGoodsData = []
        }
      }).catch(() => {
        this.gridGoodsData = []
      })
    },
    handleOrderGridList() {
      const { orderNum } = this.$route.query
      fetchDiscountDetailByOrder(orderNum).then(res => {
        if (res.code === 200) {
          this.gridData = res.result || []
        } else {
          this.gridData = []
        }
      }).catch(() => {
        this.gridData = []
      })
    },
    handleClick(orderDetailId) {
      asyncOrderDetailToAfterSale({
        orderNum: this.$route.query.orderNum,
        orderDetailId
      }).then(res => {
        if (res.code === 200) {
          if (res.result.afterSaleOrderVoState) {
            if (res.result.afterSaleOrderVoState === 'APPLY_AFTER_SALE') {
              this.$router.push({ path: '/afterSale/workOrderCreate', query: { orderNum: this.$route.query.orderNum, orderDetailId: orderDetailId }})
            } else if (res.result.afterSaleOrderVoState === 'NOT_APPLY_AFTER_SALE') {
              this.$message('该商品不允许申请售后')
            } else if (res.result.afterSaleOrderVoState === 'AFTER_SALE_IN') {
              this.$message('该商品正在售后中')
            } else if (res.result.afterSaleOrderVoState === 'AFTER_SALE_SUCCESS') {
              this.$message('该商品已经售后完成')
            } else if (res.result.afterSaleOrderVoState === 'REFUND_ING') {
              this.$message('该商品正在退款中，不允许申请售后')
            } else if (res.result.afterSaleOrderVoState === 'REFUND_SUCCESS') {
              this.$message('该商品已经退款完成，不允许申请售后')
            } else if (res.result.afterSaleOrderVoState === 'SALE_REJECT') {
              this.$message('该商品售后拒绝申请')
            } else if (res.result.afterSaleOrderVoState === 'SALE_FAIL') {
              this.$message('该商品售后失败')
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
.discount-img {
  display: inline-block;
  width: 22px;
  height: 22px;
  background: url('~@/assets/images/u296.png') no-repeat center center;
  background-size: cover;
  cursor: pointer;
  vertical-align: middle;
}
.order-detail-info {
  overflow: hidden;
  float: right;
  dl {
    overflow: hidden;
    display: flex;
    dt {
      text-align: right;
      width: 100px;
    }
    dd {
      text-align: right;
      width: 100px;
    }
  }
}
.table-img{
  margin-right:5px;
  border: 1px solid #999;
  width: 80px;
  height: 80px;
  float: left;
}
.table-text-vo{
  display: inline-block;
  border: 0;
  text-align: center;
  line-height: 80px;
  color: #D9001B;
}
.table-text{
  float: left;
}
.logistics-head{
  border-bottom: 1px solid rgba(215, 215, 215, 1);
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
}
.logostocsVisible{
  /deep/ .el-dialog__body{
    padding: 0 0 30px;
  }
  /deep/ .el-dialog__header{
    border-bottom: 1px solid rgba(215, 215, 215, 1);
  }
}
.logistics-content{
  padding: 0 20px;
  dl{
    overflow: hidden;
  }
  dt,dd{
    float: left;
  }
}
.after-sale-btn{
  color:#3F9CFC;
  border:1px solid #3F9CFC;
  height: 28px;
  line-height: 28px;
  width: 80px;
  text-align: center;
  border-radius: 4px;
  display: inline-block;
}
</style>
