<template>
  <div class="app-container">
    <express-detail-head :orderState='orderState' />
    <div class="express-detail-container">
      <express-detail-step
        :orderState='orderState'
        :orderStatusTime='orderStatusTime'
        :currentOrderState='currentOrderState'
        :cancelReason='cancelReason'
        :cancelRemark='cancelRemark'
        :orderCancelSource='orderCancelSource'
        :payTimeOutSecond='payTimeOutSecond'
        @update='handleOrderDetail'
        :orderShipmentState='goodsInfo.orderShipmentState'
      />
      <order-info :baseInfo='baseInfo' />
      <delivery-info
        :deliveryInfo='deliveryInfo'
        :orderState='orderState'
        :addressInfo='addressInfo'
        @update='handleOrderDetail'
        :isExpressService='false'
        title="收货信息"
        :orderShipmentState='goodsInfo.orderShipmentState'
      />
      <goods-info
        :goodsInfo='goodsInfo'
        :orderState='orderState'
        :isBuy='true'
        @update='handleOrderDetail'
        @push='handlePush'
        :orderType='orderType'
      />
      <pay-info
        :payStatus='payStatus'
        :paymentRecord='paymentRecord'
      />
      <after-sale-info :tableData='orderDetailAfters'/>
      <log-info :logData='logData' />
    </div>
  </div>
</template>
<script>
import ExpressDetailHead from '../../components/ExpressDetailHead'
import ExpressDetailStep from '../../components/ExpressDetailStep'
import OrderInfo from '../../components/OrderInfo'
import DeliveryInfo from '../../components/DeliveryInfo'
import GoodsInfo from '../../components/GoodsInfo'
import PayInfo from '../../components/PayInfo'
import AfterSaleInfo from '../../components/AfterSaleInfo'
import LogInfo from '../../components/LogInfo'
import { fetchOrderDetail, queryLoadOrderLogs, manualPushOms } from '@/api/order'
export default {
  name: 'procurementDetail',
  components: {
    ExpressDetailHead,
    ExpressDetailStep,
    OrderInfo,
    DeliveryInfo,
    GoodsInfo,
    PayInfo,
    AfterSaleInfo,
    LogInfo
  },
  data() {
    return {
      orderState: {},
      payStatus: {},
      baseInfo: [
        {
          label: '订单编号',
          key: 'orderNum',
          value: '',
          color: '#D9001B'
        },
        {
          label: '终端来源',
          key: 'terminalType',
          value: ''
        },
        {
          label: '订单状态',
          key: 'orderState',
          value: ''
        },
        {
          label: '订单类型',
          key: 'orderType',
          value: ''
        },
        {
          label: '下单时间',
          key: 'createTime',
          value: ''
        },
        {
          label: '父订单号',
          key: 'tradeNum',
          value: ''
        }
      ],
      deliveryInfo: [
        {
          label: '下单门店',
          key: 'storeName',
          value: ''
        },
        {
          label: '门店编码',
          key: 'storeCode',
          value: ''
        },
        {
          label: '收货人姓名',
          key: 'orderReceiver',
          value: ''
        },
        {
          label: '收货人电话',
          key: 'storePhone',
          value: ''
        },
        {
          label: '收货地址',
          key: 'storeAddress',
          value: ''
        },
        {
          label: '下单备注',
          key: 'orderRemark',
          value: ''
        }
      ],
      goodsInfo: {
        skuInfos: [],
        totalInfo: [
          { label: '商品总价：', value: '', key: 'totalPrice' },
          { label: '运费：', value: '', key: 'totalFreight' },
          { label: '优惠：', value: '', key: 'totalDiscountPrice' },
          { label: '实付金额：', value: '', key: 'actualPaymentPrice' }
        ],
        orderDetailPkgVos: [],
        orderDeliveryState: ''
      },
      logData: [],
      orderStatusTime: [],
      currentOrderState: '',
      addressInfo: {
        receiveProvinceCode: '',
        receiveCityCode: '',
        receiveAreaCode: '',
        receiveStreetName: '',
        houseNum: '',
        receiveProvinceName: '',
        receiveCityName: '',
        receiveAreaName: ''
      },
      paymentRecord: [],
      orderDetailAfters: [], // 售后信息
      orderType: {}, // 订单类型
      cancelReason: '', // 取消原因
      cancelRemark: '', // 取消原因
      orderCancelSource: '', // 取消类型
      payTimeOutSecond: '' // 过期时间
    }
  },
  mounted() {
    this.handleOrderDetail()
  },
  methods: {
    /**
     * @description: 获取订单详情
     */
    handleOrderDetail() {
      const { orderNum } = this.$route.query
      fetchOrderDetail(orderNum).then(res => {
        if (res.code === 200 && res.result) {
          // 订单状态对应的时间
          this.orderStatusTime = res.result.orderStatusTime
          // 当前状态
          this.currentOrderState = res.result.currentOrderState
          // 订单取消原因
          this.cancelReason = res.result.cancelReason || ''
          this.cancelRemark = res.result.cancelRemark || ''
          // 取消类型
          this.orderCancelSource = res.result.orderCancelSource || ''
          // 订单状态
          this.orderState = res.result.orderState
          // 支付状态
          this.payStatus = res.result.payStatus
          // 订单基本信息
          this.baseInfo.map(item => {
            if (
              typeof res.result[item.key] === 'object' &&
              res.result[item.key]
            ) {
              item.value = res.result[item.key].describe
            } else {
              item.value = res.result[item.key]
            }
          })
          // 订单类型
          this.orderType = res.result.orderType
          // 收货信息
          this.deliveryInfo.map(item => {
            item.value = res.result[item.key]
          })
          // 地址信息
          Object.keys(this.addressInfo).forEach(key => {
            this.addressInfo[key] = res.result[key]
          })
          // 商品信息
          this.goodsInfo.totalInfo.map(item => {
            item.value = res.result[item.key]
          })
          this.goodsInfo.skuInfos = res.result.skuInfos
          this.goodsInfo.orderShipmentState = res.result.orderShipmentState
          this.goodsInfo.orderDetailPkgVos = res.result.orderDetailPkgVos
          // 支付信息
          this.paymentRecord = res.result.paymentRecord || []
          // 售后信息
          this.orderDetailAfters = res.result.orderDetailAfters || []
          // 过期时间
          this.payTimeOutSecond = res.result.payTimeOutSecond
        }
      })
      // 操作日志
      queryLoadOrderLogs(orderNum).then(res => {
        if (res.code === 200 && res.result) {
          this.logData = res.result.itemVOs || []
        } else {
          this.logData = []
        }
      })
    },
    handlePush(ids = [], names = []) {
      manualPushOms(ids).then(res => {
        if (res.code === 200) {
          this.$message.success(names.join(',') + '商品推送OMS成功')
          this.handleOrderDetail()
        } else {
          this.$message.error('推送失败')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../../index.scss');
.express-detail-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  padding: 20px;
  overflow: hidden;
}
</style>
