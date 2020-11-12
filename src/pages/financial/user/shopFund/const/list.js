export const listForm = [
  {
    label: '商家账号',
    prop: 'bossAccount',
    type: 'input'
  }, {
    label: '所属城市',
    prop: 'address',
    type: 'address',
    valueKey: 'id'
  }, {
    label: '门店编码',
    prop: 'shopCode',
    type: 'input'
  }, {
    label: '门店名称',
    prop: 'name',
    type: 'input'
  }
]

export const listTableColumns = [
  { title: '商家账号', prop: 'bossAccount' },
  { title: '门店编码', prop: 'shopCode' },
  { title: '门店名称', prop: 'shopName' },
  { title: '门店地址', prop: 'address' },
  { title: '累计收入', prop: 'totalIncome', slot: true },
  { title: '累计支出', prop: 'totalExpenses', slot: true },
  { title: '账户余额', prop: 'balance', slot: true },
  { title: '待结算金额', prop: 'pendingAmount', slot: true },
  { title: '可提现金额', prop: 'castOutAmount', slot: true },
  { title: '冻结金额', prop: 'frozenAmount', slot: true }
]
