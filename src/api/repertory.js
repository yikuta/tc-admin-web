import request, { Method } from '@/utils/request'
/**
 * @description: 获取库存列表
 * @param { pageNo, pageSize, distinct, orderby, sort, searchs }
 * @return:
 */
export function fetchStockChangeLog(data) {
  return request({
    url: '/api/web/commodity/stock/stockChangeLogList',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}
/**
 * @description: 获取库存sku列表
 * @param { commodityNo }
 * @return:
 */
export function fetchStockSku(data) {
  return request({
    url: '/api/web/commodity/stock/querySkuInfoByCommodity',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}
/**
 * @description: 库存分布管理接口
 * @param { pageNo, pageSize, distinct, orderby, sort, searchs }
 * @return:
 */
export function fetchStockList(data) {
  return request({
    url: '/api/web/commodity/stock/stockList',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}
