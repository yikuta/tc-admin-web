import Layout from '@/pages/layout/Layout'

const seller = {
  path: '/seller',
  component: Layout,
  redirect: '/seller/auditList',
  name: 'seller',
  meta: { title: '商家管理', icon: 'seller' },
  auth: 'SHOP_MANAGE',
  children: [
    {
      path: 'auditList',
      name: 'auditList',
      auth: 'AUDIT_LIST',
      component: () => import('@/pages/seller/auditList'),
      meta: { title: '门店入驻审核', icon: '' }
    },
    {
      path: 'modifyList',
      name: 'modifyList',
      auth: 'MODIFY_LIST',
      component: () => import('@/pages/seller/modifyList'),
      meta: { title: '信息修改审核', icon: '' }
    },
    {
      path: 'shopList',
      name: 'shopList',
      auth: 'SHOP_LIST',
      component: () => import('@/pages/seller/shopList'),
      meta: { title: '门店列表', icon: '' }
    },
    {
      path: 'shopDetail',
      name: 'shopDetail',
      auth: 'SHOP_DETAIL',
      component: () => import('@/pages/seller/shopDetail'),
      meta: { title: '门店详情', icon: '', noCache: true },
      hidden: true
    },
    {
      path: 'shopAgain',
      name: 'shopAgain',
      auth: 'SHOP_AGAIN',
      component: () => import('@/pages/seller/againAddShop'),
      meta: { title: '继续入驻', icon: '', noCache: true },
      hidden: true
    },
    {
      path: 'modifyShop',
      name: 'modifyShop',
      component: () => import('@/pages/seller/modifyShop'),
      meta: { title: '修改门店信息', icon: '' },
      hidden: true
    },
    {
      path: 'modifyShopName',
      name: 'modifyShopName',
      component: () => import('@/pages/seller/modifyShopName'),
      meta: { title: '修改门店名称', icon: '' },
      hidden: true
    },
    {
      path: 'operationLog',
      name: 'operationLog',
      component: () => import('@/pages/seller/operationLog'),
      meta: { title: '操作日志', icon: '' },
      hidden: true
    },
    {
      path: 'addShop',
      name: 'addShop',
      auth: 'ADD_SHOP',
      component: () => import('@/pages/seller/addShop'),
      meta: { title: '新增门店', icon: '' }
    },
    {
      path: 'shopTag',
      name: 'shopTag',
      auth: 'SHOP_TAG',
      component: () => import('@/pages/seller/shopTag'),
      meta: { title: '门店标签', icon: '' }
    },
    {
      path: 'shopLogout',
      name: 'shopLogout',
      auth: 'SHOP_LOGOUT',
      component: () => import('@/pages/seller/shopLogout'),
      meta: { title: '门店注销', icon: '' }
    },
    {
      path: 'shopPrinter',
      name: 'shopPrinter',
      auth: 'SHOP_PRINTER',
      component: () => import('@/pages/seller/shopPrinter/list'),
      meta: { title: '打印机管理', icon: '' }
    },
    {
      path: 'shopAccount',
      name: 'shopAccount',
      auth: 'SHOP_ACCOUNT',
      component: () => import('@/pages/seller/shopAccounts/list'),
      meta: { title: '账号管理', icon: '' }
    }
  ]
}
export default seller
