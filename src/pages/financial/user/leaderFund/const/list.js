// 团长资金列表 ===========================================>
export const listForm = [{
  label: '团长编码',
  prop: 'regimentalCode',
  type: 'input'
}, {
  label: '所属城市',
  prop: 'address',
  type: 'address'
}, {
  label: '团长账号',
  prop: 'phoneNumber',
  type: 'input'
}, {
  label: '团长姓名',
  prop: 'name',
  type: 'input'
}]

export const tableColumns = [
  { title: '团长编码', prop: 'regimentalCode' },
  { title: '团长账号', prop: 'phoneNumber' },
  { title: '团长姓名', prop: 'name' },
  { title: '团长地址', prop: 'address' },
  { title: '累计收入', prop: 'totalIncome', slot: true },
  { title: '累计支出', prop: 'totalExpenses', slot: true },
  { title: '账户余额', prop: 'balance', slot: true },
  { title: '待结算金额', prop: 'pendingAmount', slot: true },
  { title: '可提现金额', prop: 'castOutAmount', slot: true },
  { title: '冻结金额', prop: 'frozenAmount', slot: true }
]
