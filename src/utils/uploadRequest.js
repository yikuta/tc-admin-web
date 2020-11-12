/*
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-09-10 11:34:11
 * @LastEditTime: 2020-09-22 16:34:36
 * @LastEditors: Joker
 */
import axios from 'axios'
import { Notification } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import generateForm from '@/utils/form'
import router from '@/router/index'
const qs = require('qs')

let noErrorToast = false

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 3600000, // 请求超时时间
  paramsSerializer: params => qs.stringify(params, {
    arrayFormat: 'repeat'
  })
})

// 请求拦截器
service.interceptors.request.use(config => {
  console.log(config)  // eslint-disable-line
  noErrorToast = config.noErrorToast
  delete config.noErrorToast
  const isPutOrPost = ['put', 'post'].includes(config.method)
  const isJson = config.headers['Content-Type'] === 'application/json'
  if (isPutOrPost && isJson) {
    config.data = JSON.stringify(config.data)
  }
  if (getToken()) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  if (config.url.includes('uploadFileToOSS')) {
    return config
  }
  if (isPutOrPost && !isJson) {
    if (config.setConfig && config.setConfig.formData) {
      config.data = generateForm(config.data)
    } else {
      config.data = qs.stringify(config.data, { arrayFormat: 'repeat' })
    }
  }
  return config
}, error => {
  // pendingArr = []
  Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 401) {
      store.dispatch('logout', '登录凭证失效')
    } else if (res.code === 403) {
      Notification({
        message: res.message || '权限不足',
        type: 'error',
        duration: 3 * 1000
      })
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    } else if (res.code !== 200 && !noErrorToast) {
      Notification({
        message: res.message || '错误',
        type: 'error',
        duration: 3 * 1000
      })
    }
    return response.data
  }, error => {
    Notification({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export const Method = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete'
}
// export default debounce(
//   service,
//   500,
//   false
// )
export default service
