import Layout from '@/pages/layout/Layout'

const user = {
  path: '/user',
  component: Layout,
  redirect: '/user/infoList',
  name: 'user',
  meta: { title: '用户管理', icon: 'user' },
  auth: 'USER_MANAGE',
  children: [
    {
      path: 'infoList',
      name: 'infoList',
      auth: 'MEMBER_DETAIL_MANAGE',
      component: () => import('@/pages/user/infoList'),
      meta: { title: '用户列表' }
    },
    {
      path: 'detail',
      name: 'detail',
      auth: 'MEMBER_DETAIL_INFO_VIEW',
      component: () => import('@/pages/user/detail'),
      meta: { title: '详情', noCache: true },
      hidden: true
    },
    {
      path: 'creditsLog',
      name: 'creditsLog',
      component: () => import('@/pages/user/creditsLog'),
      meta: { title: '积分记录', noCache: true },
      hidden: true
    },
    {
      path: 'storeCollection',
      name: 'storeCollection',
      auth: 'MEMBER_COLLECT_SHOP_PAGE',
      component: () => import('@/pages/user/storeCollection'),
      meta: { title: '用户收藏(门店)' }
    },
    {
      path: 'productCollection',
      name: 'productCollection',
      auth: 'MEMBER_COLLECT_PRODUCT_VIEW',
      component: () => import('@/pages/user/productCollection'),
      meta: { title: '用户收藏(商品)' }
    },
    {
      path: 'menuCollection',
      name: 'menuCollection',
      auth: 'MEMBER_COLLECT_COOKBOOK_PAGE',
      component: () => import('@/pages/user/menuCollection'),
      meta: { title: '用户收藏(菜谱)' }
    },
    {
      path: 'productHistory',
      name: 'productHistory',
      auth: 'MEMBER_BROWSE_HISTORY_PAGE',
      component: () => import('@/pages/user/productHistory'),
      meta: { title: '商品浏览记录', noCache: true }
    },
    {
      path: 'creditSetting',
      name: 'creditSetting',
      auth: 'MEMBER_GROWTH_INFO_PAGE',
      component: () => import('@/pages/user/creditSetting'),
      meta: { title: '成长值设置', noCache: true }
    },
    {
      path: 'tagSetting',
      name: 'tagSetting',
      auth: 'MEMBER_LABEL_SETTINGS_PAGE',
      component: () => import('@/pages/user/tagSetting'),
      meta: { title: '标签设置' }
    },
    {
      path: 'blackList',
      name: 'blackList',
      auth: 'MEMBER_BLACK_GRAY_PAGE',
      component: () => import('@/pages/user/blackList'),
      meta: { title: '灰黑名单' }
    }
    // {
    //   path: 'activityCollection',
    //   name: 'activityCollection',
    //   component: () => import('@/pages/user/activityCollection'),
    //   meta: { title: '收藏活动' }
    // },
    // {
    //   path: 'activitySubscribe',
    //   name: 'activitySubscribe',
    //   component: () => import('@/pages/user/activitySubscribe'),
    //   meta: { title: '订阅活动' }
    // },
    // {
    //   path: 'productSubscribe',
    //   name: 'productSubscribe',
    //   component: () => import('@/pages/user/productSubscribe'),
    //   meta: { title: '订阅商品' }
    // }
  ]
}
export default user
