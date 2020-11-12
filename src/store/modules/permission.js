import { getCurrentPermissions } from '@/api/login'
import { deepClone } from '@/utils/util'
import { asyncRouterMap, constantRouterMap } from '@/router/index'
// import router from '@/router'

constantRouterPermission(constantRouterMap)
// router.addRouters(constantRouterMap)
let btnPermission = []
let pagePermission = []

/*
* 获取所有权限
* 删除没有权限的路由
* */
function reducePermission(data) {
  return data.filter((item, index) => {
    // 给路由加上一个排序序号
    item.sort = index
    // 页面层将不会再有下一级，所以在 type = 3 的时候对它进行处理
    // 这里做两手判断，同时判断是否对应的 authCode 是有值的，如果有值的就默认已经到达处理按钮权限层
    if (item.type === 3 || item.authCode.length) {
      // 判断是否有权限，如果有就返回 true
      if (item.authCode.length) {
        // 将权限放入到权限按钮列表里面去
        btnPermission = [...btnPermission, ...item.authCode]
        pagePermission[item.code] = {
          code: item.code,
          title: item.title,
          type: item.type,
          icons: item.icons
        }
        return true
      }
      return false
    } else {
      // 不在页面层需要判断当前目录或者菜单是否还有下级，并清除掉没有权限的下级
      const newRoutes = reducePermission(item.children)
      if (newRoutes.length) {
        // 如果有数据需要处理 pagePermission
        pagePermission[item.code] = {
          code: item.code,
          title: item.title,
          type: item.type,
          icons: item.icons
        }
      }
      return newRoutes && newRoutes.length
    }
  })
}

function setMetaPermission(route, hasPermission) {
  if (route.meta) {
    route.meta['hasPermission'] = hasPermission
  } else {
    route.meta = { hasPermission: hasPermission }
  }
}

// 所有constantRouter类型增加hasPermission
function constantRouterPermission(routers) {
  routers.forEach(route => {
    setMetaPermission(route, true)
    if (route.children && route.children.length) {
      constantRouterPermission(route.children)
    }
  })
}

// 判断是否有权限
function hasPermissions(routes, permissions) {
  routes.forEach((route, index) => {
    // 将排序加入到 route中
    if (route.auth && permissions[route.auth]) {
      route.sort = permissions[route.auth].sort || routes.length - index
    }
    // 如果 alwaysPermission 为 true，直接跳过。如果不是则进入判断
    if (!route.alwaysPermission) {
      // 如果有匹配的页面信息，就进行对应的设置或处理
      if (route.auth && permissions[route.auth]) {
        const routeAuth = permissions[route.auth]
        setMetaPermission(route, true)
        // 设置标题名称为用户设置的名称
        route.meta.title = routeAuth.title || route.meta.title
        // route.meta.icon = routeAuth.icons || route.meta.icon
      } else {
        setMetaPermission(route, false)
      }
    } else {
      setMetaPermission(route, true)
    }
    // 目录和菜单级别才有子级
    if (route.children && route.children.length) {
      hasPermissions(route.children, permissions)
    }
  })
  return routes
}

// 对菜单进行排序
// eslint-disable-next-line
function sortRouters(accessedRouters) {
  for (let i = 0; i < accessedRouters.length; i++) {
    let router = accessedRouters[i]
    if (router.children && router.children.length > 0) {
      router.children.sort(compare('sort'))
    }
  }
  accessedRouters.sort(compare('sort'))
}

// 降序比较函数
function compare(p) {
  return function(m, n) {
    let a = m[p]
    let b = n[p]
    return b - a
  }
}

// eslint-disable-next-line
function menusFilter(routes) {
  const newRoutes = routes.filter(item => {
    let isShow = !item.hidden && item.meta && item.meta.hasPermission
    if (item.children && item.children.length) {
      item.children = menusFilter(item.children)
    }
    if (item.redirect && item.children && !item.children.length) {
      isShow = false
    }
    return isShow
  })
  return newRoutes
}

const permission = {
  state: {
    pagePermission: {},
    buttonPermission: [],
    routers: constantRouterMap,
    addRouters: [],
    menuList: [],
    routerLoadDone: false
  },
  mutations: {
    SET_PERMISSIONS: (state) => {
      state.pagePermission = pagePermission
      state.buttonPermission = btnPermission
    },
    SET_ROUTER_LOAD_DONE: (state, routerLoadDone) => {
      state.routerLoadDone = routerLoadDone
      state.routers = constantRouterMap
      state.addRouters = []
    },
    SET_ROUTERS: (state, routers) => {
      Reflect.apply(Array.prototype.push, state.addRouters, routers)
      state.routers = constantRouterMap.concat(routers)
      state.menuList = state.routers
      // state.menuList = menusFilter(deepClone(state.routers))
      state.routerLoadDone = true
    }
  },
  actions: {
    async getPermissions({ commit }) {
      await getCurrentPermissions().then(response => {
        // 处理返回的菜单权限
        reducePermission(response.result)
        commit('SET_PERMISSIONS')
        // 合并路由处理权限
        const newAsyncRouterMap = hasPermissions(
          deepClone(asyncRouterMap),
          pagePermission
        )
        // 来个排序
        sortRouters(newAsyncRouterMap)
        commit('SET_ROUTERS', newAsyncRouterMap)
        // 释放数据
        btnPermission = null
        pagePermission = null
      })
    }
  }
}

export default permission
