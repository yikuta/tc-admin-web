import request, { Method } from '@/utils/request'
// POST 商品列表信息
export function fetchShopGoodsList(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shopGoods/queryShopGoods',
    method: Method.POST,
    data
  })
}
// POST 导出商品列表
export function fetchExportGoodsList(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shopGoods/exportShopGoods',
    method: Method.POST,
    data
  })
}
// POST 获取商品预览信息
export function asyncGetPreviewDetail(id) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/boss/shopGoods/shopGoodsWebDetail/${id}`,
    method: Method.GET
  })
}
// POST 商品审核
export function asyncShopGoodsAudit({ id, status, context }) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shopGoods/auditGoods',
    method: Method.POST,
    data: { id, status, context }
  })
}
// POST 商品批量审核
export function asyncBatchShopGoodsAudit({ ids, status, context }) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shopGoods/batchAuditGoods',
    method: Method.POST,
    data: { ids, status, context }
  })
}
// 根据商品ID查询日志商品日志
export function fetchGoodsLogById(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shopGoods/findLogById/' + data,
    method: Method.GET
  })
}
// POST 查询商品素材库
export function fetchGoodsSourceMaterial(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/goodsSourceMaterial/querymateriaList',
    method: Method.POST,
    data
  })
}
// GET 启用禁用商品素材库
export function asyncGoodsSourceMaterialEnable(id) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/boss/goodsSourceMaterial/enabledMaterial/${id}`,
    method: Method.GET
  })
}
// GET 删除素材
export function asyncGoodsSourceMaterialDelete(id) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/boss/goodsSourceMaterial/deleteById/${id}`,
    method: Method.GET
  })
}
// POST 商品素材库排序
export function asyncGoodsSourceMaterialSort(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/goodsSourceMaterial/sortMaterial',
    method: Method.POST,
    data
  })
}
// GET 自营商品详情
export function fetchMerchantGoodsById(id) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/boss/shopGoods/shopGoodsWebDetail/${id}`,
    method: Method.GET
  })
}
// POST 自营商品编辑
export function asyncMerchantGoodsEdit(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shopGoods/editGoods',
    method: Method.POST,
    data
  })
}
// POST 添加商品素材库
export function asyncMerchantGoodsAdd(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/goodsSourceMaterial/add',
    method: Method.POST,
    data
  })
}
// 商品素材详情
export function fetchGoodsDetailById(id) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/boss/goodsSourceMaterial/materialDetail/${id}`,
    method: Method.GET
  })
}
// GET 查询门店所有分类(店铺分类)
export function fetchGoodsCategoryByCode(shopCode) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: `/api/web/boss/shopGoodsCategory/findAllByShopCode/${shopCode}`,
    method: Method.GET
  })
}
