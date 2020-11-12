function describe(row, item) {
  return row[item.prop] ? row[item.prop].describe : '--'
}

// 冻结资金明细 =========================================================>

export const describeHeader = [
  { title: '团长编码：', prop: 'regimentalCode' },
  { title: '团长姓名：', prop: 'name' },
  { title: '团长账号：', prop: 'phoneNumber' }
]

const frozenTypes = [
  {
    label: '全部',
    value: ''
  }, {
    label: '提现冻结',
    value: 1,
    key: 'CASH_OUT'
  }
]

const frozenStatus = [
  {
    label: '全部',
    value: ''
  }, {
    label: '冻结',
    value: 1
  }, {
    label: '完结',
    value: 2
  }, {
    label: '解冻',
    value: 3
  }
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
    formatter: function(row) {
      return '￥' + row.amount
    }
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
