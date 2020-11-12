import request, { Method } from '@/utils/request'
// import request2 from '@/utils/request2'

export function getBaseGoodsList(data) {
  return request({
    url: '/api/web/commodity/baseCommodity/query',
    method: Method.POST,
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export function addBaseGoodsListByFast(data) {
  return request({
    url: '/api/web/commodity/baseCommodity/add',
    method: Method.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

/**
 * @description: 启用/停用
 */
export function updateBaseGoodsListById(data) {
  return request({
    url: '/api/web/commodity/baseCommodity/enableBatch',
    method: Method.POST,
    data
  })
}

export function getCategoryById(id) {
  return request({
    url: '/api/web/commodity/baseCategory/findById/' + id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function getBaseGood(id) {
  return request({
    url: '/api/web/commodity/baseCommodity/findById/' + id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

export function publishBaseGood(data) {
  return request({
    url: '/api/web/commodity/baseCommodity/add',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

/**
 * @description: 查询价格设置的基础信息
 */
// export const reqQueryPrice = (params = {}) => {
//   return request({
//     headers: { 'Content-Type': 'application/json' },
//     url: `/${params.id}`,
//     method: Method.GET,
//     params
//   })
// }

/**
 * @description: 更新价格设置
 */
export const reqUpdatePrice = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/baseCommodity/savePriceSetting',
    method: Method.POST,
    data
  })
}

/**
 * @description: 基础商品操作日志
 */
export const reqLog = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/operationLog/getPageList',
    method: Method.POST,
    data
  })
}

/**
 * @description: 查询指定编号的基础商品
 */
export const reqBaseGoodsById = (id) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/baseCommodity/findById/${id}`,
    method: Method.GET
  })
}

/**
 * @description: 更新基础商品
 */
export const reqUpdateBaseCommodity = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/baseCommodity/update',
    method: Method.POST,
    data
  })
}

export function updateBaseGood(data) {
  return request({
    url: '/api/web/commodity/baseCommodity/update',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 根据分类id查询商品规格和商品参数
export function querySpecAndParmasById(id) {
  return request({
    url: `/api/web/commodity/baseCommodity/findSkuAndParamByCategoryId?baseCategoryId=${id}`,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * @description: 基础商品保存虚拟库存
 */
export const reqUpdateInventory = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/baseCommodity/baseCommoditySaveStock',
    method: Method.POST,
    data
  })
}

/**
 * @description: 基础商品库存设置详情
 */
export const reqBaseInventory = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/baseCommodity/stockSettingInfo/' + params.id,
    method: Method.GET
  })
}
/**
 * @description: 获取指定基础商品的供应商相关信息
 */
export const fetchBaseCommoditySupplier = (id) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/baseCommodity/supplier/' + id,
    method: Method.GET
  })
}
