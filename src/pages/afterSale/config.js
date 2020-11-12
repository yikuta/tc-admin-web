// 售后问题展示
export const QUESTION_INFO = [
  {
    label: '售后原因',
    value: '',
    key: 'requestReason'
  },
  {
    label: '问题描述',
    value: '',
    key: 'requestDescription'
  },
  {
    label: '图片凭证',
    value: [],
    key: 'afterSaleImage'
  }
]
// 优惠券信息
export const STAMPS_COLUMNS = [
  {
    label: '优惠券编码',
    value: 'couponCode'
  },
  {
    label: '优惠券名称',
    value: 'couponName'
  },
  {
    label: '优惠券类型',
    value: 'couponType',
    key: 'status'
  },
  {
    label: '优惠规则',
    value: 'couponRule'
  },
  {
    label: '发放数量',
    value: 'couponNum'
  },
  {
    label: '可用时间',
    value: 'betweenDate',
    width: 170
  },
  {
    label: '优惠券状态',
    value: 'couponState',
    key: 'status'
  },
  {
    label: '发放账户',
    value: 'memberPhone'
  },
  {
    label: '发放状态',
    value: 'provideState',
    key: 'status',
    width: 120
  }
]
// 退款流水信息
export const REFUND_COLUMN = [
  {
    label: '退款流水号',
    value: 'refundFlow'
  }, {
    label: '退款方式',
    value: 'refundType',
    key: 'status'
  }, {
    label: '退款账号',
    value: 'refundPhone'
  }, {
    label: '退款时间',
    value: 'refundTime'
  }, {
    label: '退款金额',
    value: 'refundAmount',
    key: 'money'
  }
]
// 工单信息
export const BASE_INFO = [
  { label: '来源工单', value: '', key: 'afterSaleNum' },
  { label: '来源订单', value: '', key: 'orderNum' },
  { label: '申请时间', value: '', key: 'createTime' },
  { label: '售后类别', value: '', key: 'chooseTreatmentPlan' },
  { label: '客户姓名', value: '', key: 'memberName' },
  { label: '客户电话', value: '', key: 'memberPhone' }
]
// 退款工单信息
export const REFUND_BASE_INFO = [
  { label: '退款单号', value: '', key: 'generateNum' },
  { label: '来源工单', value: '', key: 'afterSaleNum' },
  { label: '来源订单', value: '', key: 'orderNum' },
  { label: '申请时间', value: '', key: 'createTime' },
  { label: '业务类型', value: '', key: 'orderType' },
  { label: '退款类别', value: '', key: 'chooseTreatmentPlan' },
  { label: '可退金额', value: '', key: 'refundableAmount' },
  { label: '实退商品金额', value: '', key: 'commodityRefundAmount' },
  { label: '实退运费', value: '', key: 'freightRefundAmount' },
  // { label: '实退金额', value: '', key: 'actualRefundAmount' },
  { label: '客户姓名', value: '', key: 'memberName' },
  { label: '客户电话', value: '', key: 'memberPhone' },
  { label: '退款状态', value: '', key: 'baseStateVo' }
]
// 退货退款工单信息
export const RETURN_BASE_INFO = [
  { label: '退货单号', value: '', key: 'generateNum' },
  ...BASE_INFO,
  { label: '退货状态', value: '', key: 'baseStateVo' }
]
// 补发工单信息--（ 快递到家、商家采购）
export const AGAIN_BASE_INFO = [
  { label: '补发单号', value: '', key: 'generateNum' },
  ...BASE_INFO,
  { label: '收货地址', value: '', key: 'orderReceiveAddress' },
  { label: '补发状态', value: '', key: 'baseStateVo' }
]
// 补发工单信息--（ 爆品预售）
export const AGAIN_BASE_INFO_PRE = [
  { label: '补发单号', value: '', key: 'generateNum' },
  ...BASE_INFO,
  { label: '补发状态', value: '', key: 'baseStateVo' }
]
// 发券工单信息
export const STAMPS_BASE_INFO = [
  { label: '发券单号', value: '', key: 'generateNum' },
  ...BASE_INFO,
  { label: '发券状态', value: '', key: 'baseStateVo' }
]
// 换货工单信息--（ 爆品预售）
export const EXCHANGE_BASE_INFO_PRE = [
  { label: '换货单号', value: '', key: 'generateNum' },
  ...BASE_INFO,
  { label: '换货状态', value: '', key: 'baseStateVo' }
]
// 换货工单信息--（ 快递到家、商家采购）
export const EXCHANGE_BASE_INFO = [
  { label: '换货单号', value: '', key: 'generateNum' },
  ...BASE_INFO,
  { label: '收货地址', value: '', key: 'orderReceiveAddress' },
  { label: '换货状态', value: '', key: 'baseStateVo' }
]
// 退款步骤条
export const REFUND_STEP = [
  { label: '方案生成', desc: '' },
  { label: '方案审核', desc: '' },
  { label: '退款成功', desc: '' }
]
// 退货退款步骤条
export const RETURN_STEP = [
  { label: '方案生成', desc: '' },
  { label: '方案审核', desc: '' },
  { label: '仓库收货', desc: '' },
  { label: '退款成功', desc: '' }
]
// 补发骤条
export const AGAIN_STEP = [
  { label: '方案生成', desc: '' },
  { label: '方案审核', desc: '' },
  { label: '补发出库', desc: '' }
]
// 发券步骤条
export const STAMPS_STEP = [
  { label: '方案生成', desc: '' },
  { label: '方案审核', desc: '' },
  { label: '发券成功', desc: '' }
]
// 换货步骤条
export const EXCHANGE_STEP = [
  { label: '方案生成', desc: '' },
  { label: '方案审核', desc: '' },
  { label: '仓库收货', desc: '' },
  { label: '换货出库', desc: '' }
]
