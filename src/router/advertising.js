/* Layout */
import Layout from '@/pages/layout/Layout'

const advertising = {
  path: '/advertising',
  component: Layout,
  redirect: '/advertising/spaceList',
  name: 'advertising',
  meta: { title: '广告管理', icon: 'advertising' },
  alwaysShow: true,
  auth: 'ADVERTISING',
  children: [
    {
      path: 'spaceList',
      name: 'spaceList',
      component: () => import('@/pages/advertising/space-list/index.vue'),
      meta: { title: '广告配置', icon: '' },
      auth: 'ADVERTISING_MANAGE'
    },
    {
      path: 'form',
      name: 'advertisingSpaceForm',
      hidden: true,
      component: () => import('@/pages/advertising/space-list/form.vue'),
      meta: { title: '添加广告位', noCache: true }
    },
    {
      path: 'advertisingList',
      name: 'advertisingList',
      hidden: true,
      component: () => import('@/pages/advertising/advertising-list/index.vue'),
      meta: { title: '配置广告', icon: '' }
    },
    {
      path: 'advertisingForm',
      name: 'advertisingForm',
      hidden: true,
      component: () => import('@/pages/advertising/advertising-list/form.vue'),
      meta: { title: '添加广告', noCache: true }
    }
  ]
}
export default advertising
