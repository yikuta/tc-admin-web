import Layout from '../pages/layout/Layout'

const setting = {
  path: '/setting',
  component: Layout,
  name: 'setting',
  meta: { title: '系统设置', icon: 'setting-manage' },
  redirect: '/setting/authSettings',
  auth: 'SYSTEM_SETTING',
  children: [
    {
      path: '/setting/authSettings',
      component: () => import('@/pages/setting/authSettings/index'),
      name: 'authSettings',
      meta: { title: '权限管理' },
      redirect: '/setting/authSettings/organizationManage',
      auth: 'AUTH_MANAGE',
      children: [
        {
          path: 'organizationManage',
          component: () => import('@/pages/setting/authSettings/organizationManage'),
          name: 'organizationManage',
          meta: { title: '组织管理' },
          auth: 'ACCOUNT_DEPT_MANAGE'
        },
        {
          path: 'memberManage',
          component: () => import('@/pages/setting/authSettings/memberManage'),
          name: 'memberManage',
          meta: { title: '人员管理', keepAlive: true },
          auth: 'MEMBER_MANAGE'
        },
        {
          path: 'memberManage/authorizations',
          component: () => import('@/pages/setting/authSettings/memberManage/roles'),
          name: 'authorizations',
          hidden: true,
          meta: { title: '权限设置', noCache: true },
          auth: 'ACCOUNT_USER_AUTH_CONFIG'
        },
        {
          path: 'memberManage/logs',
          component: () => import('@/pages/setting/authSettings/memberManage/logs'),
          name: 'logs',
          hidden: true,
          meta: { title: '操作日志', noCache: true },
          auth: 'ACCOUNT_REPORT'
        },
        {
          path: 'roleManage',
          component: () => import('@/pages/setting/authSettings/roleManage'),
          name: 'roleManage',
          meta: { title: '角色管理' },
          auth: 'ROLE_MANAGE'
        },
        {
          path: 'roleManage/authorizations',
          component: () => import('@/pages/setting/authSettings/roleManage/authorizations'),
          name: 'authManage',
          hidden: true,
          meta: { title: '权限配置', noCache: true },
          auth: 'ACCOUNT_ROLE_AUTH_CONFIG'
        },
        {
          path: 'menuManage',
          component: () => import('@/pages/setting/authSettings/menuManage'),
          name: 'menuManage',
          meta: { title: '菜单管理' },
          auth: 'MENU_MANAGE'
        }
      ]
    },
    {
      path: '/setting/data',
      component: () => import('@/pages/setting/authSettings/index'),
      name: 'dataSettings',
      auth: 'DATA_SETTING',
      meta: { title: '基础配置' },
      redirect: '/setting/data/dictionary/list',
      children: [
        {
          path: 'dictionaryList',
          component: () => import('@/pages/setting/dataSettings/dictionary/list/index'),
          name: 'dictionaryList',
          auth: 'DATA_DICTIONARY',
          meta: { title: '数据字典' }
        },
        {
          path: 'dictionaryLogs',
          component: () => import('@/pages/setting/dataSettings/dictionary/logs/list'),
          name: 'dictionaryLogs',
          meta: { title: '操作日志' },
          hidden: true
        },
        {
          path: 'dictionaryFields',
          component: () => import('@/pages/setting/dataSettings/dictionary/fields/list'),
          name: 'dictionaryFields',
          auth: 'VARIABLE_CONF_DIC_FIND',
          meta: { title: '字典值' },
          hidden: true
        },
        {
          path: 'dictionaryFields/form',
          component: () => import('@/pages/setting/dataSettings/dictionary/fields/form'),
          name: 'fieldAdd',
          auth: 'VARIABLE_CONF_ADD',
          meta: { title: '添加字典值', icon: '', noCache: true },
          hidden: true
        },
        {
          path: 'dictionaryFields/form/edit',
          component: () => import('@/pages/setting/dataSettings/dictionary/fields/form'),
          name: 'fieldEdit',
          auth: 'VARIABLE_CONF_EDIT',
          meta: { title: '编辑字典值', noCache: true },
          hidden: true
        },
        {
          path: 'presetVariable',
          component: () => import('@/pages/setting/dataSettings/presetVariable/index'),
          name: 'presetVariable',
          auth: 'PRESET_VARIABLE',
          meta: { title: '预置变量' }
        },
        {
          path: 'presetVariableLogs',
          component: () => import('@/pages/setting/dataSettings/presetVariable/logs'),
          meta: { title: '操作日志' },
          hidden: true
        }
      ]
    },
    {
      path: 'appVersionManage',
      component: () => import('@/pages/setting/appVersionManage/index'),
      name: 'appVersionManage',
      meta: { title: 'APP版本管理' },
      auth: 'APP_VERSION_MANAGE'
    }
  ]
}
export default setting
