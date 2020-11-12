export const listForm = [
  {
    label: '商家账号',
    prop: 'bossAccount',
    type: 'input'
  }, {
    label: '门店名称',
    prop: 'shopName',
    type: 'input'
  }, {
    label: '门店编码',
    prop: 'shopCode',
    type: 'input'
  }
]

export const listTableColumns = [
  { title: '商家账号', prop: 'bossAccount' },
  { title: '门店编码', prop: 'shopCode' },
  { title: '门店名称', prop: 'name' },
  { title: 'bizUserId', prop: 'bizUserId' },
  { title: '认证手机号', prop: 'walletMobile' },
  {
    title: '是否实名', prop: 'balance',
    formatter: row => (row['isIdentityChecked'] ? '<span class="green-color">是</span>' : '<span class="red-color">否</span>')
  },
  {
    title: '是否绑定手机', prop: 'pendingAmount',
    formatter: row => (row['isPhoneChecked'] ? '<span class="green-color">是</span>' : '<span class="red-color">否</span>')
  },
  {
    title: '是否设置支付密码', prop: 'isSetPayPwd',
    formatter: row => (row['isSetPayPwd'] ? '<span class="green-color">是</span>' : '<span class="red-color">否</span>')
  },
  {
    title: '是否已签电子协议', prop: 'isSignContract',
    formatter: row => (row['isSignContract'] ? '<span class="green-color">是</span>' : '<span class="red-color">否</span>')
  },
  { title: '签订电子协议时间', prop: 'signContractTime' },
  { title: '电子协议编号', prop: 'contractNo' }
]
