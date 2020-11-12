import Layout from '@/pages/layout/Layout'

const merchantGoods = {
  path: '/merchantGoods',
  component: Layout,
  redirect: '/merchantGoods/auditList',
  name: 'merchantGoods',
  auth: 'MERCHANT_MANAGE',
  meta: { title: '商家商品', icon: 'product-attr' },
  children: [
    {
      path: 'goodsAuditList',
      name: 'goodsAuditList',
      auth: 'MERCHANT_AUDIT_LIST',
      component: () => import('@/pages/merchantGoods/auditList'),
      meta: { title: '自营商品审核' }
    },
    {
      path: 'merchantGoodsList',
      name: 'merchantGoodsList',
      auth: 'MERCHANT_GOODS_LIST',
      component: () => import('@/pages/merchantGoods/goodsList'),
      meta: { title: '自营商品列表' }
    },
    {
      path: 'merchantGoodsDetail',
      name: 'merchantGoodsDetail',
      auth: 'MER_GOODS_DETAIL',
      component: () => import('@/pages/merchantGoods/goodsDetail'),
      meta: { title: '商品详情' },
      hidden: true
    },
    {
      path: 'merchantGoodsMaterialDetail',
      name: 'merchantGoodsMaterialDetail',
      component: () => import('@/pages/merchantGoods/materialDetail'),
      meta: { title: '素材详情' },
      hidden: true
    },
    {
      path: 'merchantGoodsLog',
      name: 'merchantGoodsLog',
      component: () => import('@/pages/merchantGoods/logInfo'),
      meta: { title: '操作日志', noCache: true },
      hidden: true
    },
    {
      path: 'merchantGoodsMaterial',
      name: 'merchantGoodsMaterial',
      auth: 'GOODS_MATERIAL',
      component: () => import('@/pages/merchantGoods/goodsMaterial'),
      meta: { title: '商品素材库' }
    },
    {
      path: 'merchantGoodsOrder',
      name: 'merchantGoodsOrder',
      auth: 'GOODS_ORDER',
      component: () => import('@/pages/merchantGoods/goodsOrder'),
      meta: { title: '素材商品排序' }
    }
  ]
}
export default merchantGoods
