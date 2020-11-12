import request, { Method } from '@/utils/request'
// GET  消息中心配置初始化
export function fetchMessageConfigInit() {
  return request({
    url: '/api/web/misc/message/center/messageConfigInit',
    method: Method.GET
  })
}
// 保存消息中心配置
export function asyncSaveMessageConfig(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/center/saveMessageConfig',
    method: Method.POST,
    data
  })
}
// GET 初始化消息模板的查询
export function fetchInitMessageTemplate() {
  return request({
    url: '/api/web/misc/message/center/initQueryTemplate',
    method: Method.GET
  })
}
// POST  消息模板列表
export function fetchMessageTemplatesList(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/center/messageTemplatePage',
    method: Method.POST,
    data
  })
}
// POST  修改模板状态
export function asyncMessageTemplatesStatus(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/center/updateMessageTemplateStatus',
    method: Method.POST,
    data
  })
}
// POST 消息中心.消息列表
export function fetchMessageList(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/messageTaskPage',
    method: Method.POST,
    data
  })
}
// POST 消息查看操作日志
export function fetchMessageLogList(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/operatorLogPage',
    method: Method.POST,
    data
  })
}
// POST 操作消息
export function asyncMessageTaskStatus(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/sendMessageTask',
    method: Method.POST,
    data
  })
}
// POST 查询消息的发送记录/包含发送记录/发送参看列表
export function fetchMessageSendLog(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/messageSendLogPage',
    method: Method.POST,
    data
  })
}
// POST 保存消息模板
export function asyncMessageTemplateSave(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/center/saveMessageTemplate',
    method: Method.POST,
    data
  })
}
// GET 查询模板详情
export function fetchMessageTemplateById(id) {
  return request({
    url: '/api/web/misc/message/center/queryDetail?id=' + id,
    method: Method.GET
  })
}
// POST 查询已添加的目标用户
export function fetchAddMessageMembers(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/queryTempMembers',
    method: Method.POST,
    data
  })
}
// POST 添加消息目标用户
export function asyncMessageMembersAdd(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/addTempMembers',
    method: Method.POST,
    data
  })
}
// POST 查询boss用户
export function asyncMessageBossMembersAdd(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/queryBossUsers',
    method: Method.POST,
    data
  })
}
// POST 删除已添加的目标用户
export function asyncMessageMembersDelete(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/deleteTempMembers',
    method: Method.POST,
    data
  })
}
// POST 创建消息队列
export function asyncMessageCreate(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/createMessageTask',
    method: Method.POST,
    data
  })
}
// POST 查询指定用户添加到目标用户
export function asyncMessageMembersQueryAdd(data) {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/misc/message/messageTask/queryMemberToAdd',
    method: Method.POST,
    data
  })
}
// GET 消息模板校验
export function asyncMessageTemplateValidate(params) {
  return request({
    url: '/api/web/misc/message/center/templateCodeValidate',
    method: Method.GET,
    params
  })
}
// POST  上传用户
export function asyncMessageMembersUoload(data = {}, params = {}) {
  return request({
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: `/api/web/misc/message/messageTask/importMemberList/${params.templateType}/${params.channelType}/${params.identifier}`,
    method: Method.POST,
    data,
    setConfig: {
      formData: true
    }
  })
}

