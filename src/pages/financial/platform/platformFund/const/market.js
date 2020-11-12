import { transactionTypes } from '../../../const'
import { businessTypes as OrderTypes } from '@/constants/select'

export const describeTable = [
  { title: '配送费收入：', prop: 'income4Freight' },
  { title: '服务费收入：', prop: 'income4Fee' },
  { title: '销售退款：', prop: 'refund4Sale' },
  { title: '配送费退款：', prop: 'refund4Freight' },
  { title: '售后退款：', prop: 'refund4AfterSale' },
  { title: '提现支出：', prop: 'cashOut' },
  { title: '提现手续费：', prop: 'cashOutFee' },
  { title: '佣金支出：', prop: 'expenses4Commission' },
  { title: '其他支出：', prop: 'expenses4Other' }
]

const BusinessTypes = [
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
    label: '充值收入',
    value: 4,
    key: ' INCOME_4_RECHARGE'
  },
  {
    label: '提现支出',
    value: 5,
    key: ' CASH_OUT'
  },
  {
    label: '提现手续费',
    value: 6,
    key: 'CASH_OUT_FEE'
  }
]

export const marketSearchForm = [
  {
    label: '交易类型',
    prop: 'transactionType',
    type: 'select',
    options: transactionTypes
  }, {
    label: '业务类型',
    prop: 'businessType',
    type: 'select',
    options: BusinessTypes
  }, {
    label: '订单类型',
    prop: 'orderType',
    type: 'select',
    options: OrderTypes
  }, {
    label: '订单编号',
    prop: 'orderNum',
    type: 'input'
  }, {
    label: '商家账号',
    prop: 'targetAccount',
    type: 'input'
  }, {
    label: '门店编码',
    prop: 'targetCode',
    type: 'input'
  }, {
    label: '门店名称',
    prop: 'targetName',
    type: 'input'
  }, {
    label: '交易日期',
    prop: 'createTime',
    slot: true
  }, {
    label: '下单日期',
    prop: 'createOrderTime',
    slot: true
  }
]

export const marketTableColumns = [
  {
    title: '交易类型', prop: 'transactionType',
    formatter: ({ transactionType }) => transactionType && transactionType.describe
  },
  {
    title: '业务类型', prop: 'businessType',
    formatter: ({ businessType }) => businessType && businessType.describe
  },
  {
    title: '交易金额', prop: 'amount',
    formatter: row => `¥ ${row.amount}`
  },
  { title: '交易时间', prop: 'createTime' },
  {
    title: '订单类型', prop: 'orderType',
    formatter: ({ orderType }) => orderType && orderType.describe
  },
  {
    title: '订单编码',
    prop: 'orderNum',
    slot: true
  },
  { title: '商家账号', prop: 'targetAccount' },
  { title: '门店编码', prop: 'targetCode' },
  { title: '门店名称', prop: 'targetName' },
  { title: '下单日期', prop: 'createOrderTime' },
  { title: '交易说明', prop: 'remarks' }
]
