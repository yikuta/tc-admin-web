import request, { Method } from '@/utils/request'

// 平台资金管理数据统计 - 主页面
export function fetchPlatformSummary() {
  return request({
    url: '/api/web/finance/platform/summary',
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 平台资金充值
export function addPlatformRecharge(data) {
  return request({
    url: '/api/web/finance/platform/addRecharge',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 平台资金提现 - 通联
export function platformWithdrawalTongLian(data) {
  return request({
    url: '/api/web/finance/platform/addTongLianCastOut',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 平台资金提现 - 支付宝、微信
export function platformWithdrawalOthers(data) {
  return request({
    url: '/api/web/finance/platform/addOtherCastOut',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 平台资金明细统计
export function fetchPlatformCollection(data) {
  return request({
    url: '/api/web/finance/platform/collect',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 平台资金明细列表
export function fetchPlatformList(data) {
  return request({
    url: '/api/web/finance/platform/query',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 平台营销资金管理
export function fetchPlatformMarketList(data) {
  return request({
    url: '/api/web/finance/platformMarketing/query',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 通联对账单某一天文件
export function fetchFinancialStatement(data) {
  return request({
    url: '/api/web/payment/download/orderFile/' + data.date,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 通联对账单管理列表 - 一个月
export function fetchFinancialStatementList(data) {
  return request({
    url: '/api/web/payment/queryOrderFileList/' + data.date,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 导出平台资金明细
export function fetchFinancialPlatformExportDetail(data = {}) {
  return request({
    url: '/api/web/finance/platform/exportDetail',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 导出平台营销资金明细
export function fetchFinancialPlatformMarketingExportDetail(data = {}) {
  return request({
    url: '/api/web/finance/platformMarketing/exportDetail',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}
