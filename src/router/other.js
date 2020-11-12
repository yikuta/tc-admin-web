import Layout from '@/pages/layout/Layout'

const other = {
  path: '/others',
  redirect: '/others/exports',
  name: 'othersFinancial',
  component: Layout,
  meta: { title: '其他相关', icon: 'power' },
  auth: 'OTHER_MANAGE',
  children: [
    {
      path: 'exports',
      name: 'exportsFinancial',
      component: () => import('@/pages/financial/others/exports/list'),
      meta: { title: '导出下载' },
      auth: 'REPORT_FILE_DOWNLOAD_VIEW'
    }
  ]
}
export default other
