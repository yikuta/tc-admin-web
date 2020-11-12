import request, { Method } from '@/utils/request'
// import qs from 'qs'

/**
 * @description: 获取秒杀场次
 */
export const reqGetSessions = () => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckill/getSessions',
    method: Method.GET
  })
}
/**
 * @description: 设置秒杀场次配置
 */
export const reqSetSessions = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckill/setSessions',
    method: Method.POST,
    data
  })
}
/**
 * @description: 检查秒杀场次是否可以删除
 */
export const reqCheckDeleteSession = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckill/checkDeleteSession',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询场次管理列表
 */
export const reqQuerySeckill = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckill/querySeckill',
    method: Method.POST,
    data
  })
}
/**
 * @description: 场次停用启用
 */
export const reqStartOrSuspend = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckill/startOrSuspend',
    method: Method.POST,
    data
  })
}

/**
 * @description: 新增秒杀投放
 */
export const reqSeckillAddLaunch = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckillLaunch/add',
    method: Method.POST,
    data
  })
}
/**
 * @description: 编辑秒杀投放
 */
export const reqSeckillUpdateLaunch = (data = {}, code) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckillLaunch/update/' + code,
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询秒杀投放列表
 */
export const reqSeckillLaunchList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckillLaunch/query',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取秒杀投放详情
 */
export const reqGetSeckillLaunch = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckillLaunch/findByCode/' + data.seckillLaunceCode,
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 提交秒杀审核
 */
export const reqAddAudit = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckillLaunch/addAudit',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询秒杀审核列表
 */
export const reqQueryAuditList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckillLaunch/queryAudit',
    method: Method.POST,
    data
  })
}
/**
 * @description: 批量审核
 */
export const reqBatchAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckillLaunch/batchAudit',
    method: Method.POST,
    data
  })
}

/**
 * @description: 查询秒杀商品列表
 */
export const reqQuerySessionCommodity = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckill/querySessionCommodity',
    method: Method.POST,
    data
  })
}
/**
 * @description: 删除商品
 */
export function deleteCommodity(id) {
  return request({
    url: `/api/web/promote/seckill/deleteCommodity/${id}`,
    method: Method.DELETE
  })
}
/**
 * @description: 删除商品
 */
export function deleteCommoditySku(id) {
  return request({
    url: `/api/web/promote/seckill/deleteCommoditySku/${id}`,
    method: Method.DELETE
  })
}

/**
 * @description: 查询秒杀参与记录
 */
export const reqQuerySeckillRecord = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/seckill/querySeckillRecord',
    method: Method.POST,
    data
  })
}
