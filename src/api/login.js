/*
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-13 15:43:58
 * @LastEditTime: 2020-08-28 16:58:28
 * @LastEditors: Joker
 */
import request, {
  Method
} from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/api/web/login',
    method: Method.POST,
    headers: {
      'Content-Type': 'application/json'
    },
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/web/getClientInfos',
    method: Method.GET
  })
}
export function getPermissions() {
  return request({
    url: '/api/web/getCurrentPermissions',
    method: Method.GET
  })
}

// 退出登录
export function logoutApi() {
  return request({
    url: '/api/web/logout',
    method: Method.POST
  })
}

// 获取图形验证码
export function getImgCodeApi(params) {
  return request({
    url: '/api/web/getGraphicCode',
    method: Method.GET,
    responseType: 'blob',
    noErrorToast: true,
    params
  })
}

// 获取手机验证码
export function getPhoneCodeApi(phone) {
  return request({
    url: `/api/web/sendSmCode/${phone}`,
    method: Method.GET
  })
}

// 登录页面一进入获取信息-比如是否是白名单等
export function getClientInfosApi() {
  return request({
    url: '/api/web/getClientInfos',
    method: Method.GET,
    noErrorToast: true
  })
}

export const getCurrentPermissions = (data = {}) => {
  return request({
    url: '/api/web/getCurrentPermissions',
    method: Method.GET,
    data
  })
}
