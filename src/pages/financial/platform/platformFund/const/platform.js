import { transactionTypes } from '../../../const'
import { businessTypes as OrderTypes } from '@/constants/select'

const AccountTypes = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '支付宝账户',
    value: 1,
    key: 'ALIPAY'
  },
  {
    label: '微信账户',
    value: 2,
    key: 'WECHAT'
  },
  {
    label: '通联余额账户',
    value: 3,
    key: 'TONG_LIAN_BALANCE'
  }
]

export const BusinessTypes = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '销售收入',
    value: 1,
    key: 'INCOME_4_SALE'
  },
  {
    label: '运费收入',
    value: 2,
    key: 'INCOME_4_FREIGHT'
  },
  {
    label: '服务费收入',
    value: 3,
    key: 'INCOME_4_FEE'
  },
  {
    label: '充值收入',
    value: 4,
    key: 'INCOME_4_RECHARGE'
  },
  {

    label: '其他收入',
    value: 5,
    key: 'INCOME_4_OTHER'
  },
  {
    label: '销售退款',
    value: 6,
    key: 'REFUND_4_SALE'
  },
  {
    label: '运费退款',
    value: 7,
    key: 'REFUND_4_FREIGHT'
  },
  {
    label: '售后退款',
    value: 8,
    key: 'REFUND_4_AFTER_SALE'
  },
  {
    label: '提现支出',
    value: 9,
    key: 'CASH_OUT'
  },
  {
    label: '提现手续费',
    value: 10,
    key: 'CASH_OUT_FEE'
  },
  {
    label: '佣金支出',
    value: 11,
    key: 'EXPENSES_4_COMMISSION'
  },
  {
    label: '其他支出',
    value: 12,
    key: 'EXPENSES_4_OTHER'
  },
  {
    label: '团长补贴',
    value: 13,
    key: 'SUBSIDY_4_REGIMENTAL'
  }
]

export const describeTable = [
  { title: '配送费收入：', prop: 'income4Freight' },
  { title: '服务费收入：', prop: 'income4Fee' },
  { title: '销售退款：', prop: 'refund4Sale' },
  { title: '配送费退款：', prop: 'refund4Freight' },
  { title: '售后退款：', prop: 'refund4AfterSale' },
  { title: '提现支出：', prop: 'cashOut' },
  { title: '提现手续费：', prop: 'cashOutFee' },
  { title: '佣金支出：', prop: 'expenses4Commission' },
  { title: '其他支出：', prop: 'expenses4Other' },
  { title: '团长补贴：', prop: 'subsidy4Regimental' },
  { title: '充值收入：', prop: 'income4Recharge' }
]

export const detailSearchForm = [
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
  }, {
    label: '资金账户',
    prop: 'accountType',
    type: 'select',
    options: AccountTypes
  }
]

export const detailTableColumns = [
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
    title: '资金账户', prop: 'accountType',
    formatter: ({ accountType }) => accountType && accountType.describe
  },
  {
    title: '订单类型', prop: 'orderType',
    formatter: ({ orderType }) => orderType && orderType.describe
  },
  {
    title: '订单编码',
    prop: 'orderNum',
    slot: true
  },
  { title: '商家/团长账号', prop: 'targetAccount' },
  { title: '门店/团长编码', prop: 'targetCode' },
  { title: '门店/团长名称', prop: 'targetName' },
  { title: '下单日期', prop: 'createOrderTime' },
  { title: '备注说明', prop: 'remarks' }
]

