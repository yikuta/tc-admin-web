import request, { Method } from '@/utils/request'

// const baseUrl = 'http://192.168.255.149:8080'
// const baseUrl = 'http://dev.webapi.com'

/**
 * @description: 门店入驻审核列表分页
 */
export const reqAuditList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shop/queryShops',
    method: Method.POST,
    data
  })
}

/**
 * @description: 门店列表分页
 */
export const reqShopList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shop/queryShops',
    method: Method.POST,
    data
  })
}
/**
 * @description: 导出门店列表
 */
export const reqExportShopList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shop/exportShop',
    method: Method.POST,
    data
  })
}
/**
 * @description: 门店列表详情
 */
export const reqAuditDetail = (code) => {
  return request({
    url: `/api/web/boss/shop/findByShopCode/${code}`,
    method: Method.GET
  })
}
/**
 * @description: 门店操作日志
 */
export const reqOperationLogList = (code) => {
  return request({
    url: `/api/web/boss/shop/findLogByShopCode/${code}`,
    method: Method.GET
  })
}
/**
 * @description: 设置门店服务费
 */
export const asyncSetShopFee = (data) => {
  return request({
    url: '/api/web/boss/shop/setShopFee',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}
/**
 * @description: 下载二维码
 */
export const asyncDownloadQrCode = (data) => {
  return request({
    url: '/api/web/boss/shop/getShopQrCode',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: data
  })
}
/**
 * @description: 门店审核
 */
export const asyncShopAudit = ({ auditDesc, auditStatus, shopCode, businessType }) => {
  return request({
    url: '/api/web/boss/shop/auditShop',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: { auditDesc, auditStatus, shopCode, businessType }
  })
}
/**
 * @description: 新增门店
 */
export const asyncAddShop = (data) => {
  return request({
    url: '/api/web/boss/shop/addShopFromServer',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 中台继续入驻门店
 */
export const asyncAgainAddShop = (data) => {
  return request({
    url: '/api/web/boss/shop/continueAddShopFromServer',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 新增门店草稿
 */
export const asyncAddShopDraf = (data) => {
  return request({
    url: '/api/web/boss/shop/addShopDraft',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 新增门店草稿列表
 */
export const fetchShopDraf = (data) => {
  return request({
    url: '/api/web/boss/shop/queryShopDrafts',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 删除草稿
 */
export const asyncDelShopDraf = (id) => {
  return request({
    url: `/api/web/boss/shop/deletehopDraft/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: Method.GET
  })
}
/**
 * @description: 获取草稿详情
 */
export const fetchShopDrafById = (id) => {
  return request({
    url: `/api/web/boss/shop/getShopDraft/${id}`,
    headers: { 'Content-Type': 'application/json' },
    method: Method.GET
  })
}
/**
 * @description: 门店注销审核列表
 */
export const fetchWithdrawShops = (data) => {
  return request({
    url: '/api/web/boss/shopSetting/queryWithdrawShops',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 申请撤店
 */
export const asyncWithdrawShopsLogout = (data) => {
  return request({
    url: '/api/web/boss/shopSetting/applyWithdraw',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 审核撤店
 */
export const asyncAuditWithdrawLogout = (data) => {
  return request({
    url: '/api/web/boss/shopSetting/auditWithdraw',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 修改店名店招
 */
export const asyncNameAndSignUpdate = (data) => {
  return request({
    url: '/api/web/boss/shopSetting/updateNameAndSign',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 门店信息修改审核列表
 */
export const fetchUpdateShops = (data) => {
  return request({
    url: '/api/web/boss/shopSetting/queryUpdateShops',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 更新门店标签
 */
export const asyncUpdateShopTags = (data) => {
  return request({
    url: '/api/web/boss/shop/updateShopTags',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 批量更新门店标签
 */
export const asyncBatchUpdateShopTags = (data) => {
  return request({
    url: '/api/web/boss/shop/batchUpdateShopTags',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 修改门店信息POST
 */
export const asyncShopInfoUpdate = (data) => {
  return request({
    url: '/api/web/boss/shopSetting/updateShopInfo',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 启用门店
 */
export const asyncShopEnable = (shopCode) => {
  return request({
    url: `/api/web/boss/shop/enable/${shopCode}`,
    headers: { 'Content-Type': 'application/json' },
    method: Method.GET
  })
}
/**
 * @description: 禁用门店
 */
export const asyncShopDisable = (shopCode) => {
  return request({
    url: `/api/web/boss/shop/disable/${shopCode}`,
    headers: { 'Content-Type': 'application/json' },
    method: Method.GET
  })
}
/**
 * @description: 批量启用门店
 */
export const asyncBatchShopEnable = (shopCodeList) => {
  return request({
    url: '/api/web/boss/shop/batchEnable',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: {
      shopCodeList
    }
  })
}
/**
 * @description: 批量禁用门店
 */
export const asyncBatchShopDisable = (shopCodeList) => {
  return request({
    url: '/api/web/boss/shop/batchDisable',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: {
      shopCodeList
    }
  })
}
/**
 * @description: 修改审核列表审核状态修改
 */
export const asyncAuditUpdateShop = (data) => {
  return request({
    url: '/api/web/boss/shopSetting/auditUpdateShop',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 批量审核店招店名修改
 */
export const asyncBatchAuditUpdateShop = (data) => {
  return request({
    url: '/api/web/boss/shopSetting/batchAuditUpdateShop',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
/**
 * @description: 登录账号是否注册
 */
export const asyncRegistered = (data) => {
  return request({
    url: '/api/web/boss/shop/registered',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}

// 查询账号列表
export function fetchShopAccounts(data) {
  return request({
    url: '/api/web/account/user/queryBossAccount',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}

// 查询打印机终端列表
export function fetchShopPrinter(data) {
  return request({
    url: '/api/web/boss/shopSetting/queryShopTerminalList',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}

// 取消绑定打印机
export function cancelBindPrinter(id) {
  return request({
    url: '/api/web/boss/shopSetting/cancelBinding/' + id,
    headers: { 'Content-Type': 'application/json' },
    method: Method.GET
  })
}

// 绑定打印机
export function bindTerminal(data) {
  return request({
    url: '/api/web/boss/shopSetting/bindTerminal',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}

// 获取打印机状态
export function fetchPrintStatus(shopCode) {
  return request({
    url: '/api/web/boss/shopPrinter/getPrintStatus/' + shopCode,
    headers: { 'Content-Type': 'application/json' },
    method: Method.GET
  })
}
// 预览 根据code获取店铺二维码
export function fetchShopCode(shopCode) {
  return request({
    url: '/api/web/boss/shop/getShopQrCode/' + shopCode,
    headers: { 'Content-Type': 'application/json' },
    method: Method.GET
  })
}

