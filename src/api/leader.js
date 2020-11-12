import request, {
  Method
} from '@/utils/request'

// 查询团长列表
export function fetchLeaderList(data = {}) {
  return request({
    url: '/api/web/member/regimental/findList',
    headers: {
      'Content-Type': 'application/json'
    },
    method: Method.POST,
    data: data
  })
}

// 审核
export function updateAuditRegimental_api(data = {}) {
  return request({
    url: '/api/web/member/regimental/updateAuditRegimental',
    method: Method.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}
// 团长自提点是否隐藏-中台
export function asyncRegimentalLocationConcealUpdate(params = {}) {
  return request({
    url: '/api/web/member/regimental/updateRegimentalLocationConceal',
    method: Method.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    data: {},
    params
  })
}
// 查询详情
export function regimental_findInfo_api(params = {}) {
  return request({
    url: '/api/web/member/regimental/findByIdInfo',
    method: Method.GET,
    params
  })
}
// 根据昵称或手机查询用户列表
export function regimental_findUsers_api(nickOrPhone) {
  return request({
    url: `/api/web/account/user/findUsers/${nickOrPhone}`,
    method: Method.GET
  })
}
