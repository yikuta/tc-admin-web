import request, { Method } from '@/utils/request'
/**
 * @description: 查寻所有的省份
 */
export function findAllProvince() {
  return request({
    url: '/api/web/misc/area/findAllProvince',
    method: Method.GET
  })
}
/**
 * @description:传父级的code获取下一级的数据
 */
export function findAreasByCode({ code }) {
  return request({
    url: `/api/web/misc/area/findAreas/${code}`,
    method: Method.GET
  })
}
/**
 * @description:查询所有省市区数据
 */
export function findAll() {
  return request({
    url: '/api/web/misc/area/findAll',
    method: Method.GET
  })
}
/**
 * @description:根据code查询字典值数据

 */
export function findDataListByCode(code) {
  return request({
    url: '/api/web/boss/shop/findDataListByCode?code=' + code,
    method: Method.GET
  })
}

/**
 * @description: 查询日志
 */
export const reqLogList = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/operationLog/getPageList',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询营销日志
 */
export const reqPromotionLogList = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/promotion/getLog',
    method: Method.POST,
    data
  })
}
