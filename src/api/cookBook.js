import request, { Method } from '@/utils/request'

/**
 * @description: 菜谱标签列表
 */
export const fetchCookBookTagList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/cookBookLableApi/queryCookBookLables',
    method: Method.POST,
    data
  })
}
/**
 * @description: 添加或者修改标签
 */
export const asyncCookBookTagByName = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/cookBookLableApi/editCookBookLable',
    method: Method.POST,
    data
  })
}
/**
 * @description: 标签排序
 */
export const asyncCookBookTagBySort = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/cookBookLableApi/sortCookBooks',
    method: Method.POST,
    data
  })
}
/**
 * @description: 启用或者禁用菜谱标签
 */
export const asyncCookBookTagEnable = (id) => {
  return request({
    url: `/api/web/boss/cookBookLableApi/enableOrDisableLable/${id}`,
    method: Method.GET
  })
}
/**
 * @description: 食谱查询
 */
export const fetchCookBooks = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/cookBookApi/queryCookBooks',
    method: Method.POST,
    data
  })
}
/**
 * @description: 启用或者禁用食谱
 */
export const asyncCookBooksEnable = (id) => {
  return request({
    url: `/api/web/boss/cookBookApi/enableOrDisableBook/${id}`,
    method: Method.GET
  })
}
/**
 * @description: 食谱详情查询
 */
export const fetchCookBooksDetailById = (id) => {
  return request({
    url: `/api/web/boss/cookBookApi/getCookBookDetail/${id}`,
    method: Method.GET
  })
}
/**
 * @description: 食谱日志查询
 */
export const fetchCookBooksLogs = (data = {}, id) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/boss/cookBookApi/queryCookBookLogs/${id}`,
    method: Method.POST,
    data
  })
}
/**
 * @description: 设置食谱标签
 */
export const asyncCookBooksTagSetting = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/cookBookApi/setCookBookLable',
    method: Method.POST,
    data
  })
}
/**
 * @description: 添加或者修改食谱
 */
export const asyncCookBooksAddOrEdit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/cookBookApi/editCookBook',
    method: Method.POST,
    data
  })
}
/**
 * @description: 食谱审核
 */
export const asyncCookBooksAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/cookBookApi/auditCookBook',
    method: Method.POST,
    data
  })
}
/**
 * @description: 删除食谱
 */
export const asyncCookBooksDelete = (id) => {
  return request({
    url: `/api/web/boss/cookBookApi/delCookBookById/${id}`,
    method: Method.GET
  })
}
