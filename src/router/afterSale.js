import Layout from '@/pages/layout/Layout'

const afterSale = {
  path: '/afterSale',
  component: Layout,
  redirect: '/afterSale/index',
  name: 'afterSale',
  auth: 'AFTER_SALE',
  meta: { title: '售后管理', icon: 'yuan' },
  children: [
    {
      path: 'orderPlatform',
      name: 'orderPlatform',
      auth: 'AFTER_SALE_REQ_LIST_PAGE',
      component: () => import('@/pages/afterSale/order-platform'),
      meta: { title: '平台售后处理' }
    },
    {
      path: 'orderMerchant',
      name: 'orderMerchant',
      auth: 'AFTER_SALE_SHOP_LIST_PAGE',
      component: () => import('@/pages/afterSale/order-merchant'),
      meta: { title: '商家售后记录' }
    },
    {
      path: 'workOrderDetail',
      name: 'workOrderDetail',
      component: () => import('@/pages/afterSale/order-detail'),
      meta: { title: '工单详情', noCache: true },
      hidden: true
    },
    {
      path: 'workOrderDeal',
      name: 'workOrderDeal',
      component: () => import('@/pages/afterSale/deal-with'),
      meta: { title: '工单处理', noCache: true },
      hidden: true
    },
    {
      path: 'workOrderCreate',
      name: 'workOrderCreate',
      component: () => import('@/pages/afterSale/form-create'),
      meta: { title: '创建工单', noCache: true },
      hidden: true
    },
    {
      path: 'workOrderPlanDetail',
      name: 'workOrderPlanDetail',
      component: () => import('@/pages/afterSale/plan-detail'),
      meta: { title: '方案详情', noCache: true },
      hidden: true
    },
    {
      path: 'refundForm',
      name: 'refundForm',
      auth: 'AFTER_SALE_REFUND_PAGE',
      component: () => import('@/pages/afterSale/form-refund'),
      meta: { title: '退款审核' }
    },
    {
      path: 'workFormDetail',
      name: 'workFormDetail',
      component: () => import('@/pages/afterSale/form-detail'),
      meta: { title: '退款单详情', noCache: true },
      hidden: true
    },
    {
      path: 'GoodsReturnForm',
      name: 'GoodsReturnForm',
      auth: 'AFTER_SALE_RETURN_ORDER_PAGE',
      component: () => import('@/pages/afterSale/form-return-goods'),
      meta: { title: '退货退款审核' }
    },
    {
      path: 'AgainSupplyForm',
      name: 'AgainSupplyForm',
      auth: 'AFTER_SALE_COMPENSATE_ORDER_PAGE',
      component: () => import('@/pages/afterSale/form-again-supply'),
      meta: { title: '补充发货审核' }
    },
    {
      path: 'SendStampsForm',
      name: 'SendStampsForm',
      auth: 'AFTER_SALE_EXTRA_COUPON_ORDER_PAGE',
      component: () => import('@/pages/afterSale/form-send-stamps'),
      meta: { title: '发券补偿审核' }
    },
    {
      path: 'ExchangeGoodsForm',
      name: 'ExchangeGoodsForm',
      auth: 'AFTER_SALE_EXCHANGE_ORDER_PAGE',
      component: () => import('@/pages/afterSale/form-exchange-goods'),
      meta: { title: '换货审核' }
    }
  ]
}

export default afterSale
