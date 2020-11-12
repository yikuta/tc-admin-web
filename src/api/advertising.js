import request, { Method } from '@/utils/request'

/**
 * @description: 广告位列表查询初始化接口(获取常量及其code)
 */
export const reqAdvertisingSpaceInit = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/queryAdvertPositionInit',
    method: Method.POST,
    data
  })
}

/**
 * @description: 广告位列表
 */
export const reqAdvertisingSpaceList = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/queryAdvertPositionPage',
    method: Method.POST,
    data
  })
}

/**
 * @description: 添加广告位
 */
export const reqAddAdvertisingSpace = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/saveAdvertPosition',
    method: Method.POST,
    data
  })
}

/**
 * @description: 更新广告位
 */
export const reqUpdateAdvertisingSpace = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/updateAdvertPosition',
    method: Method.POST,
    data
  })
}

/**
 * @description: 启停用广告位
 */
export const reqUpdateSpaceStatus = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/updateAdvertPositionStatus',
    method: Method.POST,
    data
  })
}

/**
 * @description: 根据id查询广告位详情
 */
export const reqAdvertisingInfoById = params => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/queryAdvertPosition',
    method: Method.GET,
    params
  })
}

/**
 * @description: 广告列表查询初始化接口(获取常量及其code)
 */
export const reqAdvertisingInit = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/queryAdvertInit',
    method: Method.POST,
    data
  })
}

/**
 * @description: 广告列表
 */
export const reqAdvertisingList = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/queryAdvertPage',
    method: Method.POST,
    data
  })
}

/**
 * @description: 更新广告排序值
 */
export const reqUpdateSort = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/updateAdvertSortNum',
    method: Method.POST,
    data
  })
}

/**
 * @description: 上下架广告
 */
export const reqUpdateStatus = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/updateAdvertStatus',
    method: Method.POST,
    data
  })
}

/**
 * @description: 根据id查询广告详情
 */
export const reqAdvertisingById = params => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/queryAdvert',
    method: Method.GET,
    params
  })
}

/**
 * @description: 发布广告
 */
export const reqPublishAdvertising = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/saveAdvert',
    method: Method.POST,
    data
  })
}

/**
 * @description: 更新广告
 */
export const reqUpdateAdvertising = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/cms/advertWeb/updateAdvert',
    method: Method.POST,
    data
  })
}
