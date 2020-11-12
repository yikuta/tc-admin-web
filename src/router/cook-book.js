import Layout from '@/pages/layout/Layout'

const CookBook = {
  path: '/cookBook',
  component: Layout,
  redirect: '/cookBook/cookBookManage/index',
  name: 'cookBook',
  auth: 'COOKBOOK_MANAGE',
  meta: { title: '菜谱管理', icon: 'product-list' },
  children: [
    {
      path: 'cookBookManage',
      name: 'cookBookManage',
      auth: 'COOKBOOK_LIST',
      component: () => import('@/pages/cookBook/cookBookManage/index'),
      meta: { title: '菜谱列表' }
    },
    {
      path: 'cookBookAdd',
      name: 'cookBookAdd',
      auth: 'COOKBOOK_ADD',
      component: () => import('@/pages/cookBook/cookBookManage/addMenu'),
      meta: { title: '菜谱操作', noCache: true },
      hidden: true
    },
    {
      path: 'cookBookDetail',
      name: 'cookBookDetail',
      auth: 'COOKBOOK_DETAIL_VIEW',
      component: () => import('@/pages/cookBook/cookBookManage/detailMenu'),
      meta: { title: '菜谱详情', noCache: true },
      hidden: true
    },
    {
      path: 'cookBookLog',
      name: 'cookBookLog',
      component: () => import('@/pages/cookBook/cookBookManage/logs'),
      meta: { title: '操作日志', noCache: true },
      hidden: true
    },
    {
      path: 'cookBookAudit',
      name: 'cookBookAudit',
      auth: 'COOKBOOK_VERIFY',
      component: () => import('@/pages/cookBook/cookBookAudit/index'),
      meta: { title: '菜谱审核' }
    },
    {
      path: 'cookBookTag',
      name: 'cookBookTag',
      auth: 'COOKBOOK_TIPS',
      component: () => import('@/pages/cookBook/cookBookTag'),
      meta: { title: '菜谱标签' }
    }
  ]
}
export default CookBook
