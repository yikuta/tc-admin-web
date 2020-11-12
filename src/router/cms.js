import Layout from '@/pages/layout/Layout'

const cms = {
  path: '/cms',
  component: Layout,
  name: 'cms',
  redirect: '/cms/index',
  auth: 'CMS_MANAGE',
  meta: { title: 'cms 装修', icon: 'module' },
  children: [
    {
      path: 'index',
      name: 'CmsIndex',
      component: () => import('@/pages/cms/index'),
      meta: { title: '首页配置', icon: '' },
      auth: 'HOMEPAGE_DECORATION_LIST'
    },
    {
      path: 'special',
      name: 'SpecialIndex',
      component: () => import('@/pages/cms/special'),
      meta: { title: '专题活动配置', icon: '' },
      auth: 'CHANNEL_PAGE_PROMOTION_LIST'
    },
    {
      path: 'form',
      name: 'CmsForm',
      hidden: true,
      component: () => import('@/pages/cms/form'),
      meta: { title: '装修页', icon: '', noCache: true }
    },
    {
      path: 'icon',
      name: 'IconList',
      hidden: true,
      component: () => import('@/pages/cms/icon'),
      meta: { title: 'icon', icon: '' }
    },
    {
      path: 'report/:id',
      name: 'Report',
      hidden: true,
      component: () => import('@/pages/cms/report'),
      meta: { title: '操作日志', icon: '', noCache: true }
    }
  ]
}

export default cms
