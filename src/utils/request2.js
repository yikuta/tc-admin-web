import axios from 'axios'
import { Notification } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
  // 前置处理
  // Do something before request is sent
  if (store.getters.token) {
    config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  Promise.reject(error)
})

// respone interceptor
service.interceptors.response.use(
  response => {
    if (response.data && response.data.code !== 200) {
      if (response.data.code === 401) {
        store.dispatch('logout')
      }
      Notification({
        title: ' 错误提示',
        message: response.data.message,
        type: 'error',
        duration: 2000
      })
      return
    }
    if (response.config.method !== 'get') {
      Notification({
        title: '成功提示',
        message: response.data.message,
        type: 'success',
        duration: 2000
      })
    }
    return response.data
  },
  error => {
    if (error.response && error.response.status === 404) {
      Notification({
        title: '错误提示',
        message: 'url请求地址错误',
        type: 'error',
        duration: 2000
      })
      return Promise.reject(error)
    }
    if (error.response && error.response.status === 401) {
      store.dispatch('logout')
    }
    Notification({
      title: '错误提示',
      message: error.response.data.message,
      type: 'error',
      duration: 2000
    })
    return Promise.reject(error)
  })

export default service
