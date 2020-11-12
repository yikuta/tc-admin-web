import request, { Method } from '@/utils/request'
/**
 * @description: 获取订单列表
 * @param { pageNo, pageSize, distinct, orderby, sort, searchs }
 * @return:
 */
export function fetchOrderList(data) {
  return request({
    url: '/api/web/order/list',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}
/**
 * @description: 获取订单详情
 * @param orderNum
 * @return:
 */
export function fetchOrderDetail(orderNum) {
  return request({
    url: `/api/web/order/find/${orderNum}`,
    method: Method.GET
  })
}
/**
 * @description: 取消订单
 * @param {orderNum,cancelRemark}
 * @return:
 */
export function asyncOrderCancel({ orderNum, cancelRemark }) {
  return request({
    url: '/api/web/order/cancel/order',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: { orderNum, cancelRemark }
  })
}
/**
 * @description: 发货
 * @param {code, logisticsMerchantsName, logisticsNum, orderDetailId, orderLogisticsType, orderNum, logisticsMerchantsName}
 * @return:
 */
export function asyncOrderShip({
  code, logisticsMerchantsName, logisticsNum, orderDetailId, orderLogisticsType, orderNum
}) {
  return request({
    url: '/api/web/order/ship/order',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: { code, logisticsMerchantsName, logisticsNum, orderDetailId, orderLogisticsType, orderNum }
  })
}
/**
 * @description: 修改地址订单
 * @param {orderNum, orderReceiver, receiveAddress, contactInformation}
 * @return:
 */
export function asyncOrderInfoUpdate({
  orderNum,
  orderReceiver,
  receiveAddress,
  contactInformation,
  receiveProvinceCode,
  receiveCityCode,
  receiveAreaCode,
  houseNum,
  receiveStreetName,
  receiveProvinceName,
  receiveCityName,
  receiveAreaName
}) {
  return request({
    url: '/api/web/order/update/orderInfo',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: {
      orderNum,
      orderReceiver,
      receiveAddress,
      contactInformation,
      receiveProvinceCode,
      receiveCityCode,
      receiveAreaCode,
      houseNum,
      receiveStreetName,
      receiveProvinceName,
      receiveCityName,
      receiveAreaName
    }
  })
}
/**
 * @description: 根据详情ID获取物流信息
 * @param orderDetailId
 * @return:
 */
export function fetchLogisticsDetail(orderDetailId) {
  return request({
    url: `/api/web/order/find/order/logistics/${orderDetailId}`,
    method: Method.GET
  })
}
/**
 * @description: 根据详情ID获取商品优惠
 * @param orderDetailId
 * @return:
 */
export function fetchDiscountDetailByGoods(orderDetailId) {
  return request({
    url: `/api/web/order/find/order/detail/discount/${orderDetailId}`,
    method: Method.GET
  })
}
/**
 * @description: 根据订单号获取订单优惠
 * @param orderDetailId
 * @return:
 */
export function fetchDiscountDetailByOrder(orderNum) {
  return request({
    url: `/api/web/order/find/order/discount/${orderNum}`,
    method: Method.GET
  })
}
/**
 * @description: 根据订单号获取订单佣金记录
 * @param orderNum
 * @return:
 */
export function fetchCommissionByOrder(orderNum) {
  return request({
    url: `/api/web/order/find/order/detail/commission/${orderNum}`,
    method: Method.GET
  })
}

/**
 * @description: 获取配送单列表
 * @param { pageNo, pageSize, distinct, orderby, sort, searchs }
 * @return:
 */
export function queryShopOrderDeliverys(data) {
  return request({
    url: '/api/web/boss/shoporderdelivery/queryShopOrderDeliverys',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}
/**
 * @description:  手动推送oms消息
 * @param ids
 * @return:
 */
export function manualPushOms(data) {
  return request({
    url: '/api/web/order/manualPushOms',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}
/**
 * @description:  分页查询订单操作日志列表
 * @return:
 */
export function queryLoadOrderLogs(data) {
  return request({
    url: '/api/web/order/loadOrderLogs/' + data,
    headers: { 'Content-Type': 'application/json' },
    method: Method.GET
  })
}
/**
 * @description: 根据配送单获取详情
 * @param id
 * @return:
 */
export function getShopOrderDeliveryDetail(data) {
  return request({
    url: `/api/web/boss/shoporderdelivery/getOrderDeliveryDetail/${data.id}`,
    method: Method.GET,
    data
  })
}
/**
 * @description: 根据订单查看返回状态Vo , 查看这个订单Id 是否能进行售后
 * @param {orderNum, orderDetailId}
 * @return:
 */
export function asyncOrderDetailToAfterSale({ orderNum, orderDetailId }) {
  return request({
    url: `/api/web/after/sale/find/order/detail/${orderNum}/${orderDetailId}`,
    method: Method.GET
  })
}
