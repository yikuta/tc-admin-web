import {
  getCookie,
  removeCookie
} from '@/utils/support'
const TokenKey = 'loginToken'

export function getToken() {
  return localStorage.getItem(TokenKey)
}

export function setToken(token) {
  return localStorage.setItem(TokenKey, token)
}

export function removeToken() {
  return localStorage.removeItem(TokenKey)
}

export function clearToken() {
  return localStorage.clear()
}

// 判断用户密码是否失效
export function unInvalidPwd() {
  let _time = getCookie('logintime')
  let _nowTime = new Date().getTime()
  let _isUnInvalid = _nowTime - _time > 7 * 24 * 60 * 60 * 1000
  // 失效了默认移除密码和用户名 token
  if (_isUnInvalid) {
    removeCookie('username')
    removeCookie('password')
    removeCookie('logintime')
    removeToken()
    sessionStorage.removeItem('lastTime')
  }
  return _isUnInvalid
}
