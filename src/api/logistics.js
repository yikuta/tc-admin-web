import request, { Method } from '@/utils/request'

/**
 * @description: 广告位列表
 */
export const reqAdvertisingSpaceList = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/tc/advertising/space/list',
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
    url: '/tc/advertising/space/updateStatus',
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
    url: '/tc/advertising/space/' + params.id,
    method: Method.GET
  })
}

/**
 * @description: 广告列表
 */
export const reqAdvertisingList = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/tc/advertising/list',
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
    url: '/tc/advertising/sort/update',
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
    url: '/tc/advertising/space/updateStatus',
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
    url: '/tc/advertising/' + params.id,
    method: Method.GET
  })
}

/**
 * @description: 保存采购配送设置
 */
export const reqSaveProcurement = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/purchase/create',
    method: Method.POST,
    data
  })
}

/**
 * @description: 获取采购配送设置
 */
export const reqProcurementSetting = () => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/purchase/load',
    method: Method.GET
  })
}

// 物流模板列表 - 分页
export const fetchLogisticsModuleList = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/page',
    method: Method.POST,
    data
  })
}

// 物流模板列表 - 不分页
export const fetchAllLogisticsModuleList = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/select',
    method: Method.POST,
    data
  })
}

// 获取模版详情
export const fetchLogisticsModuleDetail = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/' + data.id,
    method: Method.GET
  })
}

// 新增物流模版
export const addLogisticsModule = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/create',
    method: Method.POST,
    data
  })
}

// 编辑物流模版
export const updateLogisticsModule = data => {
  const id = data.id
  Reflect.deleteProperty(data, 'id')
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/update/' + id,
    method: Method.POST,
    data
  })
}

// 启用物流模版
export const enableLogisticsModule = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/enable/' + data.id,
    method: Method.GET
  })
}

// 停用物流模版
export const disableLogisticsModule = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/disable/' + data.id,
    method: Method.GET
  })
}

// 删除物流模版
export const deleteLogisticsModule = data => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/shipping/template/' + data.id,
    method: Method.DELETE
  })
}
