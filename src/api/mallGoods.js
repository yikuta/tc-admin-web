import request, { Method } from '@/utils/request'
// import qs from 'qs'

// 根据ID获取套餐商品
export const fetchGoodMealById = (id) => {
  return request({
    url: '/api/web/commodity/channel/get/' + id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

/**
 * @description: 查询渠道商品列表分页
 */
export const reqMallGoodsList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/query/page',
    method: Method.POST,
    data
  })
}

/**
 * @description: 查询价格设置的基础信息
 */
export const reqQueryPrice = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/channel/queryPrice/${params.id}`,
    method: Method.GET,
    params
  })
}

/**
 * @description: 更新价格设置
 */
export const reqUpdatePrice = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/updateSalePrice',
    method: Method.POST,
    data
  })
}

/**
 * @description: 查询库存设置
 */
export const reqQueryInventory = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/channel/queryInventory/${params.id}`,
    method: Method.GET,
    params
  })
}

/**
 * @description: 更新库存设置
 */
export const reqUpdateInventory = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/updateInventory',
    method: Method.POST,
    data
  })
}

/**
 * @description: 上下架商品
 */
export const reqShelfOnOrOff = (data = {}) => {
  return request({
    // headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/shelfOnOrOff',
    method: Method.POST,
    data
    // setConfig: {
    //   formData: true
    // }
  })
}

/**
 * @description: 删除指定编号的商品
 */
export const reqDeleteGoodsById = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/channel/delete/${params.id}`,
    method: Method.DELETE,
    params
  })
}

/**
 * @description: 查询指定编号的基础商品
 */
export const reqMallGoodsById = (id) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/baseCommodity/findById/${id}`,
    method: Method.GET
  })
}

/**
 * @description: 获取指定编号的渠道商品完整信息
 */
export const reqMallGoodsInfoById = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/channel/get/${params.id}`,
    method: Method.GET
  })
}

/**
 * @description: 添加渠道商品
 */
export const reqAddMallGoods = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/addCommodity',
    method: Method.POST,
    data
    // setConfig: {
    //   formData: true
    // }
  })
}

/**
 * @description: 更新渠道商品
 */
export const reqUpdateMallGoods = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/updateCommodity',
    method: Method.POST,
    data
    // setConfig: {
    //   formData: true
    // }
  })
}

/**
 * @description: 获取指定pid的渠道分类列表
 */
export const reqCategorySub = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/category/findSub',
    method: Method.GET,
    params
  })
}

/**
 * @description: 查询基础商品列表
 */
export const reqBaseGoodsList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/baseCommodity/query',
    method: Method.POST,
    data
  })
}

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
export const reqModuleById = (params = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/commodity/module/get/${params.id}`,
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

/**
 * @description: 附件上传
 */
export const reqUpload = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    // headers: { 'Content-Type': 'multipart/form-data' },
    url: '/api/web/component/attachment/uploadFile',
    method: Method.POST,
    data
  })
}

/**
 * @description: 附件删除
 */
export const reqDeleteFile = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: '/api/web/component/attachment/deleteFile',
    method: Method.POST,
    data
  })
}

/**
 * @description: 查询对应渠道商品详情
 */
export const cmsCommodity = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/query/cmsCommodity',
    method: Method.POST,
    data
  })
}

/*
* 验证基础商品重复校验
* baseCommodityId 基础商品的主键 id
* businessNo 业务渠道类型,1-商城商品,2-拼团商品,3-供应商品,4-商家商品['SHOPPING_COMMODITY', 'GROUP_COMMODITY', 'SUPPLIER_COMMODITY', 'MERCHANT_COMMODITY']
* channelCommodityId 渠道商品数据库主键id
* cityCode
* commodityType 商品类型,1-普通商品,2-套餐商品 = ['COMMODITY', 'PACKAGE']
* */
export function checkCommodityHasRepeat(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/checkCommodityHasRepeat',
    method: Method.POST,
    data
  })
}
//  以下接口仅用作联调前的测试
const testBaseUrl = 'https://www.easy-mock.com/mock/5e982a173c3c6e2c478c3e5a/admin'
export const publishMallGoods = (goods) => {
  return request({
    url: `${testBaseUrl}/submitMallGoodsInfo`,
    method: Method.POST,
    data: goods
  })
}

