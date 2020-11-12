// 冻结资金明细 =========================================================>

function describe(row, item) {
  return row[item.prop] ? row[item.prop].describe : '--'
}

export const describeHeader = [
  { title: '门店编码：', prop: 'shopCode' },
  { title: '门店名称：', prop: 'shopName' },
  { title: '商家账号：', prop: 'bossAccount' }
]

const frozenTypes = [
  { label: '全部', value: '' },
  { label: '提现冻结', value: 1, key: 'CASH_OUT' }
]

const frozenStatus = [
  { label: '全部', value: '' },
  { label: '冻结', value: 1 },
  { label: '完结', value: 2 },
  { label: '解冻', value: 3 }
]

export const frozenForm = [
  {
    label: '冻结类型',
    prop: 'frozenType',
    type: 'select',
    options: frozenTypes
  }, {
    label: '冻结状态',
    prop: 'frozenStatus',
    type: 'select',
    options: frozenStatus
  }, {
    label: '冻结日期',
    prop: 'createTime',
    slot: true
  }
]

export const frozenTableColumns = [
  {
    title: '冻结类型',
    prop: 'frozenType',
    formatter: describe
  },
  {
    title: '冻结金额',
    prop: 'amount',
    formatter: ({ amount }) => '¥ ' + amount
  },
  {
    title: '冻结日期',
    prop: 'createTime'
  },
  {
    title: '冻结状态',
    prop: 'frozenStatus',
    formatter: describe
  },
  {
    title: '冻结说明',
    prop: 'remarks'
  }
]
