// 提现账户
const withdrawAccounts = [
  { label: '全部', value: '' },
  { label: '通联余额账户', value: 1, key: 'AUDITING' },
  { label: '通联营销账户', value: 2, key: 'AGREED' }
]

// 提现状态
const withdrawStatus = [
  { label: '全部', value: '' },
  { label: '提现成功', value: 1, key: 'WAITING' },
  { label: '处理中', value: 2, key: 'SUCCESS' },
  { label: '提现失败', value: 3, key: 'PENDING' }
]

export const listSearchForm = [
  {
    label: '提现单号',
    prop: 'phoneNumber',
    type: 'select',
    options: withdrawAccounts
  }, {
    label: '提现状态',
    prop: 'regimentalCode',
    type: 'select',
    options: withdrawStatus
  }, {
    label: '提现日期',
    prop: 'createTime',
    slot: true
  }
]

export const listTableColumns = [
  { title: '提现单号', prop: 'auditCode' },
  { title: '提现金额', prop: 'auditAmount' },
  { title: '提现账户', prop: 'regimentalCode' },
  { title: '经办人', prop: 'name' },
  { title: '提现说明', prop: 'createTime' },
  {
    title: '提现状态', prop: 'amount',
    formatter: ({ amount }) => '¥ ' + amount
  }, {
    title: '备注说明', prop: 'auditStatus',
    formatter: ({ auditStatus }) => auditStatus.describe
  }
]
