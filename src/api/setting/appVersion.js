import request, { Method } from '@/utils/request'

// APP版本列表
export function fetchAppVersionList(data) {
  return request({
    url: '/api/web/cms/upGradeWeb/queryPage',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 获取APP升级初始数据
export function fetchAppInitData() {
  return request({
    url: '/api/web/cms/upGradeWeb/upGradeInit',
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 删除APP版本
export function deleteAppVersion(data) {
  return request({
    url: '/api/web/cms/upGradeWeb/deleteUpGrade',
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' },
    params: data
  })
}

// 添加版本
export function addAppVersion(data) {
  return request({
    url: '/api/web/cms/upGradeWeb/saveUpGrade',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 编辑版本
export function updateAppVersion(data) {
  return request({
    url: '/api/web/cms/upGradeWeb/updateUpGrade',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}
