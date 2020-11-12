import request, { Method } from '@/utils/request'
import {
  reqMallGoodsList,
  reqCategorySub as categorySub,
  reqShelfOnOrOff as shelfOnOrOff,
  reqDeleteGoodsById as deleteGoodsById,
  reqQueryPrice as queryPrice,
  reqUpdatePrice as updatePrice,
  reqQueryInventory as queryInventory,
  reqUpdateInventory as updateInventory
} from './mallGoods'

/**
 * @description: 拼团商品管理列表
 */
export const reqAssembleGoodsList = reqMallGoodsList

/**
 * @description: 上下架商品
 */
export const reqShelfOnOrOff = shelfOnOrOff

/**
 * @description: 删除商品
 */
export const reqDeleteGoodsById = deleteGoodsById

/**
 * @description: 查询价格设置的基础信息
 */
export const reqQueryPrice = queryPrice

/**
 * @description: 更新价格设置
 */
export const reqUpdatePrice = updatePrice

/**
 * @description: 查询库存设置
 */
export const reqQueryInventory = queryInventory

/**
 * @description: 更新库存设置
 */
export const reqUpdateInventory = updateInventory

/**
 * @description: 查询佣金配置
 */
export const reqQueryCommission = (data = {}) => {
  return request({
    url: '/api/web/commodity/channel/queryCommission',
    method: Method.POST,
    data
  })
}

/**
 * @description: 更新佣金配置
 */
export const reqUpdateCommission = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/updateCommission',
    method: Method.POST,
    data
  })
}

/**
 * @description: 获取指定pid的拼团分类列表
 */
export const reqCategorySub = categorySub

/**
 * @description: 查询拼团城市分类
 */
export const reqCityCategorySub = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/assemble/categorySub',
    method: Method.GET,
    params
  })
}

/**
 * @description: 拼团商品业务城市
 */
export const reqBusinessCityList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/group/businessCity/query',
    method: Method.POST,
    data
  })
}

/**
 * @description: 启/停用业务城市
 */
export const reqUpdateBusinessCityStatus = (data = {}) => {
  return request({
    url: '/api/web/commodity/group/businessCity/updateStatus',
    method: Method.POST,
    data
  })
}

/**
 * @description: 添加业务城市
 */
export const reqAddBusinessCity = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/group/businessCity/add',
    method: Method.POST,
    data
  })
}

/**
 * @description: 更新业务城市
 */
export const reqUpdateBusinessCity = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/group/businessCity/update',
    method: Method.POST,
    data
  })
}

/**
 * @description: 根据id查询业务城市详情
 */
export const reqBusinessCityById = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/group/businessCity/findById/${params.id}`,
    method: Method.GET
  })
}

/**
 * @description: 根据省份code码查询所启用的二级城市
 */
export const reqBusinessCityByCode = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/group/businessCity/queryByBusinessProvinceCode',
    method: Method.GET,
    params
  })
}

/**
 * @description: 拼团活动管理列表
 */
export const reqAssembleActivityList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    // url: '/api/web/assemble/activity/list',
    url: '/api/web/commodity/groupActivity/query',
    method: Method.POST,
    data
  })
}

/**
 * @description: 拼团活动详情
 */
export const reqAssembleActivityById = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/groupActivity/findById/' + params.id,
    method: Method.GET
  })
}

/**
 * @description: 获取指定编号的拼团商品完整信息
 */
export const reqAssembleGoodsInfoById = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/channel/get/${params.id}`,
    method: Method.GET,
    params
  })
}

/**
 * @description: 添加活动
 */
export const reqAddActivity = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/groupActivity/add',
    method: Method.POST,
    data
  })
}

/**
 * @description: 更新活动
 */
export const reqUpdateActivity = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/groupActivity/update',
    method: Method.POST,
    data
  })
}

/**
 * @description: 更新活动状态
 */
export const reqUpdateActivityStatus = (data = {}) => {
  return request({
    url: '/api/web/commodity/groupActivity/updateStatus',
    method: Method.POST,
    data
  })
}

/**
 * @description: 获取可选团长
 */
export const reqColonelList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/member/regimental/findInfoPage',
    method: Method.POST,
    data
  })
}

/**
 * @description: 获取可选拼团商品
 */
export const reqAssembleGoodsEnabledList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/groupActivity/queryAvailableCommodity',
    method: Method.POST,
    data
  })
}

export const updateAssembleGoodSort = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/update/sort',
    method: Method.GET,
    params: data
  })
}
