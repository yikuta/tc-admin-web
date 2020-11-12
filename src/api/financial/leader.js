import request, { Method } from '@/utils/request'

// 团长资金管理列表
export function fetchFinancialLeaderList(data) {
  return request({
    url: '/api/web/finance/regimental/managementQuery',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 团长资金明细-统计数据
export function fetchFinancialLeaderDetailCollection(data) {
  return request({
    url: '/api/web/finance/regimental/collectByRegimentalCode',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 团长资金明细 - 表格数据
export function fetchFinancialLeaderDetail(data) {
  return request({
    url: '/api/web/finance/regimental/queryDetail',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 提交团长补贴
export function createLeaderSubsidy(data) {
  return request({
    url: '/api/web/finance/regimental/createSubsidy',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 团长补贴审核 - 详情
export function fetchLeaderSubsidy(data) {
  return request({
    url: '/api/web/finance/regimental/getSubsidy/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 门店资金明细 - 查询结果导出
export function exportFinancialLeaderDetail(data) {
  return request({
    url: '/api/web/finance/regimental/exportDetail',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 团长冻结明细 - 表格数据
export function fetchFinancialFrozenLeaderDetail(data) {
  return request({
    url: '/api/web/finance/regimental/queryFrozen/' + data.regimentalCode,
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 团长补贴审核列表
export function fetchFinancialLeaderAuditList(data) {
  return request({
    url: '/api/web/finance/regimental/querySubsidyAudit',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 团长补贴审核列表 - 待付款金额
export function fetchFinancialLeaderSubsidyAuditList(data) {
  return request({
    url: '/api/web/finance/regimental/collectSubsidyAuditWaitingAmount',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 团长补贴审核弹框 - 审核
export function auditLeaderSubsidy(data) {
  return request({
    url: '/api/web/finance/regimental/auditSubsidyResult',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

//  团长提现管理列表
export function fetchFinancialLeaderCashOutList(data) {
  return request({
    url: '/api/web/finance/regimental/queryCashOutAudit',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

//  提现统计
export function fetchFinancialLeaderCashOutCollection(data) {
  return request({
    url: '/api/web/finance/regimental/collectCashOutAuditWaitingAmount',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

//  单个\批量审核团长提现
export function batchAuditLeaderCashOutResult(data) {
  return request({
    url: '/api/web/finance/regimental/batchAuditCastOutResult',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

//  单个\批量审核团长提现记录提示
export function batchAuditCashoutResultTips(data) {
  return request({
    url: '/api/web/finance/regimental/batchAuditResultTips',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 获取提现审核记录详情
export function fetchAuditCashOutDetail(data) {
  return request({
    url: '/api/web/finance/regimental/getCastOut/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 获取补贴审核日志
export function fetchAuditSubsidyLogs(data) {
  return request({
    url: '/api/web/finance/regimental/getLog/' + data.id,
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 获取提现审核日志
export function fetchAuditCashOutLogs(data) {
  return request({
    url: '/api/web/finance/regimental/getLog/' + data.id,
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 提现审核驳回
export function rejectLeaderAuditCashOut(data) {
  return request({
    url: '/api/web/finance/regimental/rejectAuditPayment',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 提现审核重试
export function retryLeaderAuditCashOut(data) {
  return request({
    url: '/api/web/finance/regimental/retryAuditPayment/' + data.id,
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 提现审核提示信息
export function batchAuditResultTips(data) {
  return request({
    url: '/api/web/finance/regimental/batchAuditResultTips',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
