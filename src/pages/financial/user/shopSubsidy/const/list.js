import { auditStatus, handleStatus2 } from '@/pages/financial/const'

function describe(row, item) {
  return row[item.prop] ? row[item.prop].describe : '--'
}

export const listForm = [
  {
    label: '商家账号',
    prop: 'bossAccount',
    type: 'input'
  }, {
    label: '门店编码',
    prop: 'shopCode',
    type: 'input'
  }, {
    label: '门店名称',
    prop: 'shopName',
    type: 'input'
  }, {
    label: '审核状态',
    prop: 'auditStatus',
    type: 'select',
    options: auditStatus
  },
  {
    label: '付款状态',
    prop: 'handleStatus',
    type: 'select',
    options: handleStatus2
  }
]

export const tableColumns = [
  { title: '商家账号', prop: 'bossAccount' },
  { title: '门店编码', prop: 'shopCode' },
  { title: '门店名称', prop: 'shopName' },
  {
    title: '补贴金额',
    prop: 'auditAmount',
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
  },
  {
    title: '付款状态',
    prop: 'handleStatus',
    formatter: describe
  }
]
