/* Layout */
import Layout from '@/pages/layout/Layout'
const leader = {
  path: '/leader',
  component: Layout,
  redirect: '/leader/index',
  name: 'leader',
  auth: 'GPR_APPLY_MANAGE',
  meta: {
    title: '团长管理',
    icon: 'tuanzhang'
  },
  alwaysShow: true,
  children: [
    {
      path: 'reviewManage',
      name: 'reviewManage',
      component: () => import('@/pages/leader/review/index'),
      auth: 'GPR_APPLY_REVIEW_MANAGE',
      meta: {
        title: '团长入驻审核',
        icon: ''
      }
    }, {
      keepAlive: true,
      hidden: true,
      path: 'reviewManageDetail',
      component: () => import('@/pages/leader/review/detail'),
      name: 'reviewManageDetail',
      auth: 'GPR_APPLY_DETAIL_CHK',
      meta: {
        title: '团长入驻详情',
        icon: ''
      }
    }]
}

export default leader
