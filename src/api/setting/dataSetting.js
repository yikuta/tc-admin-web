import request, { Method } from '@/utils/request'

// 数据字典列表
export function fetchDictionaryList(query) {
  return request({
    url: '/api/web/misc/variableConfig/query/variable',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: query
  })
}

// 添加字典
export function addDictionary(data) {
  return request({
    url: '/api/web/misc/variableConfig/insert/variableConfig',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 更新字典
export function updateDictionary(data) {
  return request({
    url: '/api/web/misc/variableConfig/update/variableConfig',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 数据字典值列表
export function fetchDictionaryFieldList(query) {
  return request({
    url: '/api/web/misc/variableConfig/find/subvariable',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: query
  })
}

// 获取某条字典值数据
export function fetchDictionaryField(id) {
  return request({
    url: '/api/web/misc/variableConfig/find/subvariable/' + id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 添加字典值
export function addDictionaryField(data) {
  return request({
    url: '/api/web/misc/variableConfig/insert/subvariable',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 编辑字典值
export function updateDictionaryField(data) {
  return request({
    url: '/api/web/misc/variableConfig/update/subVariableConfig',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}
export function fetchVariableByCodeList(params) {
  return request({
    url: '/api/web/misc/variableConfig/findVariableByCodeList',
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' },
    params
  })
}

