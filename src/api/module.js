import request, { Method } from '@/utils/request'

/**
 * @description: 查询通用模块列表
 */
export const reqModuleList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/module/query/page',
    method: Method.POST,
    data
  })
}

/**
 * @description: 根据指定编号查询模块
 */
export const reqModuleById = (id) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/module/get/${id}`,
    method: Method.GET
  })
}

/**
 * @description: 添加通用模块
 */
export const reqAddModule = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/module/add',
    method: Method.POST,
    data
  })
}

/**
 * @description: 更新通用模块
 */
export const reqUpdateModule = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/module/update',
    method: Method.POST,
    data
  })
}

/**
 * @description: 删除通用模块
 */
export const reqDeleteModule = (id) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/module/delete/${id}`,
    method: Method.DELETE
  })
}
