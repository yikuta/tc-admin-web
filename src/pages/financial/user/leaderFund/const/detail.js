import { businessTypes } from '@/constants/select'
import { transactionTypes } from '@/pages/financial/const'

// 团长资金明细 ===========================================>
const regimentalBusinessTypes = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '佣金收入',
    value: 1,
    key: 'INCOME_4_COMMISSION'
  }, {
    label: '团长补贴',
    value: 2,
    key: 'SUBSIDY_4_REGIMENTAL'
  }, {
    label: '提现支出',
    value: 3,
    key: 'CASH_OUT'
  }, {
    label: '提现手续费',
    value: 4,
    key: 'CASH_OUT_FEE'
  }
]

export const detailForm = [{
  label: '交易类型',
  prop: 'transactionType',
  type: 'select',
  options: transactionTypes
}, {
  label: '业务类型',
  prop: 'regimentalBusinessType',
  type: 'select',
  options: regimentalBusinessTypes
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
}]

export const describeHeader = [
  { title: '团长编码：', prop: 'regimentalCode' },
  { title: '团长姓名：', prop: 'name' },
  { title: '团长账号：', prop: 'phoneNumber' }
]

export const describeTable = [
  { title: '佣金收入：', prop: 'income4Commission' },
  { title: '团长补贴：', prop: 'subsidy4Regimental' }
  /* { title: '提现退款：', prop: 'cashOut' },
  { title: '提现手续费退款：', prop: 'cashOutFee' }*/
]

export const describeTable1 = [
  { title: '提现支出:', prop: 'cashOut' },
  { title: '提现手续费:', prop: 'cashOutFee' }
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
    prop: 'regimentalBusinessType',
    formatter: describe
  },
  {
    title: '交易金额',
    prop: 'amount',
    formatter: function(row) {
      return '￥' + row.amount
    }
  },
  /* { title: '团长账号', prop: 'phoneNumber' },
   { title: '团长编码', prop: 'regimentalCode' },
   { title: '团长姓名', prop: 'name' },*/
  { title: '交易时间', prop: 'createTime' },
  {
    title: '订单编码',
    prop: 'orderNum',
    slot: true
  },
  { title: '订单类型', prop: 'orderType', formatter: describe },
  { title: '下单日期', prop: 'createOrderTime' },
  { title: '交易说明', prop: 'remarks' }
]
