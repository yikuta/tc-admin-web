import {
  login,
  logoutApi,
  getInfo
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken
} from '@/utils/auth'
import {
  setCookie,
  getCookie
} from '@/utils/support'
import {
  Notification
} from 'element-ui'
import router from '@/router/index'

const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 登录
    Login({ commit, dispatch }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(res => {
          if (res.code === 200) {
            const tokenStr = `${res.result.tokenType} ${res.result.token}`
            setToken(tokenStr)
            commit('SET_TOKEN', tokenStr)
            dispatch('getPermissions')
            resolve(res)
          } else {
            reject(res)
          }
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    async GetInfo({
      commit
    }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_NAME', data.username)
          commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    logout({
      commit,
      state
    }, msg) {
      return new Promise((resolve, reject) => {
        if (router.history.current.path !== '/login') {
          msg && Notification.error(msg)
          if (!state.token) {
            location.replace(`/login?random=${Math.random()}`)
            return
          }
          // if (msg) {
          //   Message(msg)
          // }
          logoutApi(state.token).then(() => {
            resolve()
          }).catch(error => {
            reject(error)
          }).finally(() => {
            // 判断当前账号是否记住密码
            let _pwd = getCookie('password') || ''
            let _name = getCookie('username') || ''
            let _logintime = getCookie('logintime') || ''

            commit('SET_TOKEN', null)
            commit('SET_ROLES', [])
            commit('SET_ROUTER_LOAD_DONE', false)
            removeToken()
            sessionStorage.clear()
            localStorage.clear()
            if (_pwd) {
              setCookie('password', _pwd)
              setCookie('username', _name)
              setCookie('logintime', _logintime)
            }
            location.replace(`/login?random=${Math.random()}`)
          })
        } else {
          resolve()
        }
      })
    },

    // 前端 登出
    FedLogout({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
