// import { auditStatus } from '@/pages/financial/const'

export const auditStatus = [
  { label: '全部', value: '' },
  { label: '待审核', value: 1, key: 'AUDITING' },
  { label: '通过', value: 2, key: 'AGREED' },
  { label: '拒绝', value: 3, key: 'REJECTED' }
]

// 付款状态
export const handleStatus = [
  { label: '全部', value: '' },
  { label: '待付款', value: 11, key: 'WAITING' },
  { label: '付款成功', value: 12, key: 'SUCCESS' },
  { label: '银行处理中', value: 13, key: 'PENDING' },
  { label: '付款失败', value: 14, key: 'FAILED' },
  { label: '提现驳回', value: 15, key: 'REJECTED' }
]

function describe(row, item) {
  return row[item.prop] ? row[item.prop].describe : '--'
}

export const listForm = [{
  label: '团长编码',
  prop: 'regimentalCode',
  type: 'input'
}, {
  label: '团长账号',
  prop: 'phoneNumber',
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
}]

// 列表页表格
export const listTableColumns = [
  { title: '团长编码', prop: 'regimentalCode' },
  { title: '团长账号', prop: 'phoneNumber' },
  { title: '团长姓名', prop: 'name' },
  {
    title: '补贴金额', prop: 'auditAmount',
    formatter: function(row) {
      return '¥ ' + row.auditAmount
    }
  },
  { title: '申请原因', prop: 'applyReason' },
  { title: '申请时间', prop: 'createTime' },
  {
    title: '审核状态',
    prop: 'auditStatus',
    formatter: describe
  }
  /* {
    title: '付款状态',
    prop: 'handleStatus',
    formatter: describe
  }*/
]
