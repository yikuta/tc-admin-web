/* Layout */
import Layout from '@/pages/layout/Layout'

const logistics = {
  path: '/logistics',
  component: Layout,
  redirect: '/logistics/moduleSetting',
  name: 'logistics',
  meta: { title: '物流设置', icon: 'logistics' },
  alwaysShow: true,
  auth: 'LOGISTICS_CENTER',
  children: [
    {
      path: 'moduleSetting',
      name: 'logisticsModuleSetting',
      component: () => import('@/pages/logistics/moduleSetting/index.vue'),
      meta: { title: '商家物流设置', noCache: true },
      auth: 'LOGISTICS_SET'
    },
    {
      path: 'moduleManage',
      name: 'logisticsModuleManage',
      component: () => import('@/pages/logistics/moduleManage/index.vue'),
      meta: { title: '用户物流设置' },
      auth: 'LOGISTICS_MANAGE'
    },
    {
      path: 'module',
      name: 'moduleForm',
      component: () => import('@/pages/logistics/moduleManage/module.vue'),
      hidden: true,
      meta: { title: '物流模版', noCache: true }
    }
  ]
}
export default logistics
