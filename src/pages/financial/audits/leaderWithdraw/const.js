// 审核状态
const auditStatus = [
  { label: '全部', value: '' },
  { label: '待审核', value: 1, key: 'AUDITING' },
  { label: '通过', value: 2, key: 'AGREED' },
  { label: '拒绝', value: 3, key: 'REJECTED' }
]

// 付款状态
const handleStatus = [
  { label: '全部', value: '' },
  { label: '待付款', value: 11, key: 'WAITING' },
  { label: '付款成功', value: 12, key: 'SUCCESS' },
  { label: '银行处理中', value: 13, key: 'PENDING' },
  { label: '付款失败', value: 14, key: 'FAILED' },
  { label: '提现驳回', value: 15, key: 'REJECTED' }
]

export const listForm = [
  {
    label: '团长账号',
    prop: 'phoneNumber',
    type: 'input'
  }, {
    label: '团长编码',
    prop: 'regimentalCode',
    type: 'input'
  }, {
    label: '团长姓名',
    prop: 'name',
    type: 'input'
  }, {
    label: '审核状态',
    prop: 'auditStatus',
    type: 'select',
    options: auditStatus
  }, {
    label: '提现状态',
    prop: 'handleStatus',
    type: 'select',
    options: handleStatus
  }, {
    label: '申请时间',
    prop: 'createTime',
    slot: true
  }
]

export const listTableColumns = [
  { title: '申请编号', prop: 'auditCode' },
  { title: '团长账号', prop: 'phoneNumber' },
  { title: '团长编号', prop: 'regimentalCode' },
  { title: '团长姓名', prop: 'name' },
  { title: '申请时间', prop: 'createTime' },
  {
    title: '提现金额', prop: 'auditAmount',
    formatter: ({ auditAmount }) => '¥ ' + auditAmount
  }, {
    title: '审核状态', prop: 'auditStatus',
    formatter: ({ auditStatus }) => auditStatus && auditStatus.describe
  }, {
    title: '提现状态', prop: 'handleStatus',
    formatter: ({ handleStatus }) => handleStatus && handleStatus.describe
  }
]

// 操作日志
export const logsTableColumns = [
  { title: '操作时间', prop: 'updateTime' },
  { title: '操作内容', prop: 'content' },
  { title: '操作人', prop: 'operator' }
]
