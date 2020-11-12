import Layout from '@/pages/layout/Layout'

const order = {
  path: '/order',
  component: Layout,
  redirect: '/order/index',
  name: 'order',
  auth: 'ORDER_CENTER',
  meta: { title: '订单管理', icon: 'order-manage' },
  children: [
    {
      path: 'expressService',
      name: 'expressService',
      component: () => import('@/pages/order/express-service'),
      meta: { title: '快递到家' },
      auth: 'ORDER_LIST',
      keepAlive: true
    }, {
      path: 'expressServiceDetail',
      name: 'expressServiceDetail',
      component: () => import('@/pages/order/express-service/express-service-detail'),
      hidden: true,
      auth: 'ORDER_FIND',
      meta: { title: '快递到家详情', noCache: true }
    }, {
      path: 'productPreSale',
      name: 'productPreSale',
      component: () => import('@/pages/order/product-pre-sale'),
      auth: 'PRODUCT_PRE_SALE',
      meta: { title: '社区团购' }
    }, {
      path: 'productPreSaleDetail',
      name: 'productPreSaleDetail',
      hidden: true,
      auth: 'ORDER_PRE_SALE_FIND',
      component: () => import('@/pages/order/product-pre-sale/express-service-detail'),
      meta: { title: '爆品预售详情', noCache: true }
    }, {
      path: 'merchantOwned',
      name: 'merchantOwned',
      component: () => import('@/pages/order/merchant-owned'),
      meta: { title: '商家自营' },
      auth: 'ORDER_OWNED'
    }, {
      path: 'merchantOwnedDetail',
      name: 'merchantOwnedDetail',
      hidden: true,
      auth: 'ORDER_OWNED_FIND',
      component: () => import('@/pages/order/merchant-owned/owned-detail'),
      meta: { title: '商家自营详情', noCache: true }
    }, {
      path: 'merchantProcurement',
      name: 'merchantProcurement',
      component: () => import('@/pages/order/merchant-procurement'),
      meta: { title: '商家采购' },
      auth: 'ORDER_PURCHASE'
    }, {
      path: 'procurementDetail',
      name: 'procurementDetail',
      hidden: true,
      auth: 'ORDER_PURCHASE_FIND',
      component: () => import('@/pages/order/merchant-procurement/procurement-detail'),
      meta: { title: '商家采购详情', noCache: true }
    }, {
      path: 'deliver',
      name: 'deliver',
      component: () => import('@/pages/order/deliver'),
      meta: { title: '第三方配送单' },
      auth: 'DELIVERY_ORDER_LIST'
    }, {
      path: 'deliverDetail',
      name: 'deliverDetail',
      hidden: true,
      auth: 'DELIVERY_ORDER_DETAIL_VIEW',
      component: () => import('@/pages/order/deliver/deliver-detail'),
      meta: { title: '配送单详情', noCache: true }
    }
  ]
}
export default order
