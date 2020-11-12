// 业务类型
export const businessTypes = [
  { label: '全部', value: '' },
  { label: '快递到家', value: 1, key: 'ORDER_HOME_DELIVERY' },
  { label: '爆品预售', value: 2, key: 'ORDER_EXPLOSIVE_PRE_SALE' },
  { label: '商家自营', value: 3, key: 'ORDER_MERCHANT_OWNED' },
  { label: '商家采购', value: 4, key: 'ORDER_BUSINESS_PURCHASE' }
]
// 交易类型
export const transactionTypes = [
  { label: '全部', value: '' },
  { label: '收入', value: 1, key: 'INCOME' },
  { label: '支出', value: 2, key: 'EXPENSES' }
]
// 审核状态
export const auditStatus = [
  { label: '全部', value: '' },
  { label: '待审核', value: 'AUDITING' },
  { label: '通过', value: 'AGREED' },
  { label: '拒绝', value: 'REJECTED' }
]
// 提现状态
export const handleStatus = [
  { label: '全部', value: '' },
  { label: '待付款', value: 1 },
  { label: '付款成功', value: 2 },
  { label: '银行处理中', value: 3 },
  { label: '付款失败', value: 4 },
  { label: '提现驳回', value: 5 }
]

// 付款状态
export const handleStatus2 = [
  { label: '全部', value: '' },
  { label: '待付款', value: 11, key: 'WAITING' },
  { label: '付款成功', value: 12, key: 'SUCCESS' },
  { label: '银行处理中', value: 13, key: 'PENDING' },
  { label: '付款失败', value: 14, key: 'FAILED' },
  { label: '提现驳回', value: 15, key: 'REJECTED' }
]
// 付款状态
export const handleStatus3 = [
  { label: '全部', value: '' },
  { label: '待付款', value: 'WAITING', key: 'WAITING' },
  { label: '付款成功', value: 'SUCCESS', key: 'SUCCESS' },
  { label: '银行处理中', value: 'PENDING', key: 'PENDING' },
  { label: '付款失败', value: 'FAILED', key: 'FAILED' },
  { label: '提现驳回', value: 'REJECTED', key: 'REJECTED' }
]
