import request, { Method } from '@/utils/request'
/**
 * @description: 获取订单列表
 * @param { pageNo, pageSize, distinct, orderby, sort, searchs }
 * @return:
 */
export function fetchAfterSaleOrderDetail({ orderNum, orderDetailId }) {
  return request({
    url: '/api/web/after/sale/add/from/all',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: {
      orderDetailIds: [orderDetailId],
      orderNum
    }
  })
}
/**
 * @description: 创建售后工单
 * @return:
 */
export function asyncAfterSaleCreate(data) {
  return request({
    url: '/api/web/after/sale/confirm/create',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 创建售后工单--平台
 * @return:
 */
export function fetchAfterSaleWeb(data) {
  return request({
    url: '/api/web/after/sale/list',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 工单详情
 * @return:
 */
export function fetchAfterSaleDetailByAfterSaleNum(afterSaleNum) {
  return request({
    url: `/api/web/after/sale/find/after/sale/${afterSaleNum}`,
    method: Method.GET
  })
}
/**
 * @description: 查看售后详情--退款-工单详情
 * @return:
 */
export function fetchAfterSaleRefundDetail(afterSaleNum, generateNum) {
  return request({
    url: `/api/web/after/sale/find/after/sale/detail/${afterSaleNum}/${generateNum}`,
    method: Method.GET
  })
}
/**
 * @description: 查看售后详情--换货-工单详情
 * @return:
 */
export function fetchAfterSaleExchangeGoodsDetail(afterSaleNum, generateNum) {
  return request({
    url: `/api/web/after/sale/find/after/sale/exchange/goods/${afterSaleNum}/${generateNum}`,
    method: Method.GET
  })
}
/**
 * @description: 查看售后详情--发券-工单详情
 * @return:
 */
export function fetchAfterSaleSendStampsDetail(afterSaleNum, generateNum) {
  return request({
    url: `/api/web/after/sale/find/after/sale/re/coupon/${afterSaleNum}/${generateNum}`,
    method: Method.GET
  })
}
/**
 * @description: 查看售后详情--补充发货-工单详情
 * @return:
 */
export function fetchAfterSaleAgainSupplyDetail(afterSaleNum, generateNum) {
  return request({
    url: `/api/web/after/sale/find/after/sale/reshipment/${afterSaleNum}/${generateNum}`,
    method: Method.GET
  })
}
/**
 * @description: 查看售后详情--退货-工单详情
 * @return:
 */
export function fetchAfterSaleReturnGoodsDetail(afterSaleNum, generateNum) {
  return request({
    url: `/api/web/after/sale/find/after/sale/return/of/goods/detail/${afterSaleNum}/${generateNum}`,
    method: Method.GET
  })
}
/**
 * @description: 各类工单列表
 * @return:
 */
export function fetchAfterSaleListDetail(data) {
  return request({
    url: '/api/web/after/sale/list/detail',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 审核详情工单
 * @return:
 */
export function asyncAfterSaleListGenerate(data) {
  return request({
    url: '/api/web/after/sale/audit/after/sale/detail/generate',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 退货的收货接口
 * @return:
 */
export function asyncAfterSaleReceiveGoods(data) {
  return request({
    url: '/api/web/after/sale/receive/from/goods',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 退货详情单的退款接口
 * @return:
 */
export function asyncAfterSaleRefund(data) {
  return request({
    url: '/api/web/after/sale/goods/return/refund',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 审核----平台 或者商家售后工单
 * @return:
 */
export function asyncAfterSaleControlPlatform(data) {
  return request({
    url: '/api/web/after/sale/audit/after/sale/platform',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取指定的退换货商品
 * @return:
 */
export function fetchReturnCommodity(data) {
  return request({
    url: '/api/web/commodity/channel/get/returnCommodity',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 根据订单号获取自提信息
 * @return:
 */
export function fetchafterSaleAddress(orderNum) {
  return request({
    url: `/api/web/after/sale/find/address/from/order/info/${orderNum}`,
    method: Method.GET
  })
}
/**
 * @description: 中台换货-的发货接口
 * @return:
 */
export function asyncAfterSaleShipGoods(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/after/sale/exchange/ship/goods',
    method: Method.POST,
    data
  })
}
/**
 * @description: 退款单-重新发起退款
 * @return:
 */
export function asyncAfterSaleRefundAgain(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/after/sale/execute/reissue/refund/again',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查看物流公司快递信息
 * @return:
 */
export function asyncAfterSaleLogistics(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/after/sale/find/logistics/info',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查看oms发货仓库
 * @return:
 */
export function fetchAfterSaleStores(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/after/sale/find/oms/storehouse',
    method: Method.POST,
    data
  })
}
