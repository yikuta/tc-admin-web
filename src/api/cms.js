import request, { Method } from '@/utils/request'

// 专题列表
export function getSpecialList(data) {
  return request({
    url: '/api/web/cms/renovationWeb/querySpecialPage',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}

// 首页
export function getConfigList(data) {
  return request({
    url: '/api/web/cms/renovationWeb/queryConfigPage',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data || {}
  })
}

// 详情
/*
* configId
* */
export function getConfigDetail(params) {
  return request({
    url: '/api/web/cms/renovationWeb/queryConfigDetail',
    method: Method.GET,
    params
  })
}

// 更新缓存
/*
* configId
* */
export function pushConfig(params) {
  return request({
    url: '/api/web/cms/renovationWeb/pushConfig',
    method: Method.GET,
    params
  })
}

// 删除
/*
* configId
* */
export function deleteSpecial(params) {
  return request({
    url: '/api/web/cms/renovationWeb/deleteSpecial',
    method: Method.GET,
    params
  })
}

// 更新专题状态
export function updateSpecial(data) {
  return request({
    url: '/api/web/cms/renovationWeb/updateSpecialStatus',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}

// 保存
export function saveConfig(data) {
  return request({
    url: '/api/web/cms/renovationWeb/saveConfig',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}

// 日志
export function getReportLog(data) {
  return request({
    url: '/api/web/cms/renovationWeb/queryOperatorLogPage',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
