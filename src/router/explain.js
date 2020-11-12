
const explain = [
  { path: '/explain', redirect: '/explain/cms', name: 'Explain', meta: { title: '说明文档', icon: 'module' }},
  { path: '/explain/cms', name: 'CMSExplain', component: () => import('@/pages/explain/cms'), meta: { title: 'CMS 说明文档', icon: '' }},
  { path: '/explain/module', name: 'ModuleView', component: () => import('@/pages/explain/moduleView'), meta: { title: '模块预览', icon: '' }},
  { path: '/explain/preview', name: 'GoodsView', component: () => import('@/pages/explain/goodsView'), meta: { title: '商品预览', icon: '' }}
]

export default explain
