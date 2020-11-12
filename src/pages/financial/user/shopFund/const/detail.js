// 资金明细 =========================================================>
import { businessTypes } from '@/constants/select'
import { transactionTypes } from '@/pages/financial/const'

export const shopBusinessTypes = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '门店补贴',
    value: 1,
    key: 'SUBSIDY_4_SHOP'
  },
  {
    label: '营销活动补贴',
    value: 2,
    key: 'SUBSIDY_4_ACTIVITY'
  },
  {
    label: '优惠券补贴',
    value: 3,
    key: 'SUBSIDY_4_COUPON'
  },
  {
    label: '自营商品收入',
    value: 4,
    key: 'INCOME_4_SELF'
  },
  {

    label: '配送费收入',
    value: 5,
    key: 'INCOME_4_FREIGHT'
  },
  {
    label: '采购退款',
    value: 6,
    key: 'REFUND_4_PURCHASE'
  },
  {
    label: '采购运费退款',
    value: 7,
    key: 'REFUND_4_PURCHASE_FREIGHT'
  },
  {
    label: '采购支出',
    value: 8,
    key: 'EXPENSES_4_PURCHASE'
  },
  {
    label: '采购运费支出',
    value: 9,
    key: 'EXPENSES_4_PURCHASE_FREIGHT'
  },
  {
    label: '平台服务费',
    value: 10,
    key: 'EXPENSES_4_SERVICE_CHARGE'
  },
  {
    label: '提现支出',
    value: 11,
    key: 'CASH_OUT'
  },
  {
    label: '提现手续费',
    value: 12,
    key: 'CASH_OUT_FEE'
  }
]

export const describeHeader = [
  { title: '门店编码：', prop: 'shopCode' },
  { title: '门店名称：', prop: 'shopName' },
  { title: '商家账号：', prop: 'bossAccount' }
]

export const detailForm = [
  {
    label: '交易类型',
    prop: 'transactionType',
    type: 'select',
    options: transactionTypes
  }, {
    label: '业务类型',
    prop: 'shopBusinessType',
    type: 'select',
    options: shopBusinessTypes
  }, {
    label: '订单类型',
    prop: 'orderType',
    type: 'select',
    options: businessTypes
  }, {
    label: '订单编号',
    prop: 'orderNum',
    type: 'input'
  }, {
    label: '交易日期',
    prop: 'createDate',
    slot: true
  }, {
    label: '下单日期',
    prop: 'orderDate',
    slot: true
  }
]

export const describeTable = [
  { title: '门店补贴：', prop: 'subsidy4Shop' },
  { title: '营销活动补贴：', prop: 'subsidy4Activity' },
  { title: '优惠券补贴：', prop: 'subsidy4Coupon' },
  { title: '自营商品收入：', prop: 'income4Self' },
  { title: '采购退款：', prop: 'refund4Purchase' },
  { title: '采购运费退款：', prop: 'refund4PurchaseFreight' }
]

export const describeTable1 = [
  { title: '配送费收入：', prop: 'income4Freight' },
  { title: '采购支出：', prop: 'expenses4Purchase' },
  { title: '采购运费支出：', prop: 'expenses4PurchaseFreight' },
  { title: '提现支出：', prop: 'cashOut' },
  { title: '提现手续费：', prop: 'cashOutFee' }
]

function describe(row, item) {
  return row[item.prop] ? row[item.prop].describe : '--'
}

export const detailTableColumns = [
  {
    title: '交易类型',
    prop: 'transactionType',
    formatter: describe
  },
  {
    title: '业务类型',
    prop: 'shopBusinessType',
    formatter: describe
  },
  {
    title: '交易金额',
    prop: 'amount',
    formatter: function(row) {
      return '￥' + row.amount
    }
  },
  { title: '交易时间', prop: 'createTime' },
  {
    title: '订单编码',
    prop: 'orderNum',
    slot: true
  },
  {
    title: '订单类型',
    prop: 'orderType',
    formatter: describe
  },
  { title: '下单日期', prop: 'createOrderTime' },
  { title: '交易说明', prop: 'remarks' }
]
