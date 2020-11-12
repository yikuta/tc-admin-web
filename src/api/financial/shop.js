import request, { Method } from '@/utils/request'

// 门店钱包状态列表
export function fetchFinancialWalletList(data) {
  return request({
    url: '/api/web/boss/shop/queryShopWalletState',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店资金管理列表
export function fetchFinancialShopList(data) {
  return request({
    url: '/api/web/finance/shop/managementQuery',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店资金明细 - 统计数据
export function fetchFinancialShopDetailCollection(data) {
  return request({
    url: '/api/web/finance/shop/collectByShopCode',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店资金明细 - 表格数据
export function fetchFinancialShopDetail(data) {
  return request({
    url: '/api/web/finance/shop/queryDetail',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店资金明细 - 查询结果导出
export function exportFinancialShopDetail(data) {
  return request({
    url: '/api/web/finance/shop/exportDetail',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店补贴 - 弹框明细
export function fetchSubsidyTips(data) {
  return request({
    url: '/api/web/finance/shop/getSubsidyTips',
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' },
    params: data
  })
}

// 门店补贴 - 创建
export function createSubsidy(data) {
  return request({
    url: '/api/web/finance/shop/createSubsidy',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店补贴审核 - 详情
export function fetchShopSubsidy(data) {
  return request({
    url: '/api/web/finance/shop/getSubsidy/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 门店冻结明细 - 表格数据
export function fetchFinancialFrozenShopDetail(data) {
  return request({
    url: '/api/web/finance/shop/queryFrozen/' + data.shopCode,
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店补贴审核列表
export function fetchFinancialShopAuditList(data) {
  return request({
    url: '/api/web/finance/shop/querySubsidyAudit',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店补贴审核列表 - 待付款金额
export function fetchFinancialShopSubsidyAuditList(data) {
  return request({
    url: '/api/web/finance/shop/collectSubsidyAuditWaitingAmount',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 门店补贴审核弹框 - 审核
export function auditShopSubsidy(data) {
  return request({
    url: '/api/web/finance/shop/auditSubsidyResult',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

//  门店提现统计
export function fetchFinancialShopCashOutCollection(data) {
  return request({
    url: '/api/web/finance/shop/collectCashOutAuditWaitingAmount',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

//  门店提现审核列表
export function fetchFinancialShopCashOutList(data) {
  return request({
    url: '/api/web/finance/shop/queryCashOutAudit',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 获取提现审核记录详情
export function fetchAuditCashOutDetail(data) {
  return request({
    url: '/api/web/finance/shop/getCastOut/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

//  单个\批量门店提现审核弹框
export function batchAuditShopCashOutResult(data) {
  return request({
    url: '/api/web/finance/shop/batchAuditCastOutResult',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 获取补贴审核日志
export function fetchAuditSubsidyLogs(data) {
  return request({
    url: '/api/web/finance/shop/getLog/' + data.id,
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 获取提现审核日志
export function fetchAuditCashOutLogs(data) {
  return request({
    url: '/api/web/finance/shop/getLog/' + data.id,
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 提现审核驳回
export function rejectShopAuditCashOut(data) {
  return request({
    url: '/api/web/finance/shop/rejectAuditPayment',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 提现审核重试
export function retryShopAuditCashOut(data) {
  return request({
    url: '/api/web/finance/shop/retryAuditPayment/' + data.id,
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 提现审核提示信息
export function batchAuditResultTips(data) {
  return request({
    url: '/api/web/finance/shop/batchAuditResultTips',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
