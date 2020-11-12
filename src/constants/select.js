export const units = {
  1: {
    value: 'BOXFUL',
    label: '箱'
  },
  2: {
    value: 'PIECE',
    label: '件'
  },
  3: {
    value: 'EACH',
    label: '个'
  }
}

// 业务类型
export const businessTypes = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '快递到家',
    value: 1,
    key: 'ORDER_HOME_DELIVERY'
  },
  {
    label: '爆品预售',
    value: 2,
    key: 'ORDER_EXPLOSIVE_PRE_SALE'
  },
  {
    label: '商家自营',
    value: 3,
    key: 'ORDER_MERCHANT_OWNED'
  },
  {
    label: '商家采购',
    value: 4,
    key: 'ORDER_BUSINESS_PURCHASE'
  }
]
