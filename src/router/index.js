import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import user from './user'
Vue.use(Router)

/* Layout */
import Layout from '@/pages/layout/Layout'
import goods from '@/router/goods'
import order from '@/router/order'
import setting from '@/router/setting'
import market from '@/router/market'
import repertory from '@/router/repertory'
import seller from './seller'
import leader from './leader'
import merchantGoods from './merchantGoods'
import afterSale from './afterSale'
import advertising from './advertising'
import cookBook from './cook-book'
import logistics from './logistics'

import message from './message'
import cms from './cms'
import explain from './explain'
import financial from './financial'
import other from './other'
import active from './active'

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [{
  path: '/login',
  component: () => import('@/pages/login/index'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/pages/404'),
  hidden: true
},
{
  redirect: '/dashboard',
  path: '/',
  hidden: true
},
{
  path: '',
  component: Layout,
  redirect: '/dashboard',
  children: [{
    path: 'dashboard',
    name: 'dashboard',
    component: () => import('@/pages/dashboard/index'),
    meta: {
      title: '首页',
      icon: 'dashboard'
    }
  }]
}
]

export const asyncRouterMap = [
  goods, // 商品
  order,
  setting,
  market,
  leader,
  repertory,
  user,
  message,
  seller,
  merchantGoods,
  afterSale,
  advertising,
  cookBook,
  logistics,
  cms,
  ...explain,
  financial,
  other,
  active,
  { path: '*', redirect: '/404', hidden: true }
]

const router = new Router({
  mode: 'history',
  scrollBehavior: () => ({ y: 0 }),
  routes: asyncRouterMap.concat(constantRouterMap)
})

const whiteList = ['CMSExplain'] // 不重定向白名单
let isLogin = false

router.beforeEach((to, from, next) => {
  isLogin = store.state.user.token // 是否登录
  if (whiteList.includes(to.name)) { // 路由白名单: 不重定向
    next()
  } else if (!isLogin) { // 未登录状态；跳转至login
    if (to.path === '/login') {
      next()
    } else {
      next({ path: `/login?random=${Math.random()}` })
    }
  } else if (isLogin) { // 已登录状态；当路由到login时，跳转至home
    if (to.name === 'login') {
      next({ path: '/dashboard' })
    } else {
      next()
    }
  }
})

export default router
