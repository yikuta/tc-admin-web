import Layout from '@/pages/layout/Layout'

const repertory = {
  path: '/repertory',
  component: Layout,
  redirect: '/repertory/index',
  name: 'repertory',
  meta: { title: '库存查询', icon: 'shop-manage' },
  auth: 'STOCK_CENTER',
  children: [
    {
    //   path: 'saleArea',
    //   name: 'saleArea',
    //   component: () => import('@/pages/repertory/sale-area'),
    //   meta: { title: '销售区域管理' },
    //   keepAlive: true
    // }, {
      path: 'saleAreaDetail',
      name: 'saleAreaDetail',
      component: () => import('@/pages/repertory/sale-area/sale-area-detail'),
      meta: { title: '销售区域管理详情' },
      keepAlive: true,
      hidden: true
    }, {
      path: 'repertoryAlter',
      name: 'repertoryAlter',
      component: () => import('@/pages/repertory/repertory-alter'),
      meta: { title: '库存变更记录', noCache: true },
      auth: 'STOCK_CHANGE_HISTORY_PAGE',
      keepAlive: true
    }, {
      path: 'repertoryDistribution',
      name: 'repertoryDistribution',
      component: () => import('@/pages/repertory/repertory-distribution'),
      meta: { title: '商品库存查询', noCache: true },
      auth: 'STOCK_DISTRIBUTION_PAGE',
      keepAlive: true
    }
  ]
}
export default repertory
