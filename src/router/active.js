import Layout from '../pages/layout/Layout'

const active = {
  path: '/active',
  name: 'shopActive',
  component: Layout,
  meta: { title: '活动管理', icon: 'active' },
  auth: 'ACTIVITY_MANAGE',
  children: [
    {
      path: '/active/shopping',
      name: 'activeShopping',
      redirect: '/active/shopping/group_booking',
      component: () => import('@/pages/layout/child'),
      meta: { title: '拼团活动', icon: '' },
      auth: 'PT_ACTIVITY_MANAGE',
      children: [
        {
          path: 'group_booking',
          component: () => import('@/pages/market/group-booking/index'),
          name: 'groupBooking',
          meta: { title: '拼团活动列表', icon: '' },
          auth: 'BOOK_ACTIVITY_LIST'
        },
        {
          path: 'group_booking_form',
          hidden: true,
          component: () => import('@/pages/market/group-booking/form'),
          name: 'groupBookingFormAdd',
          meta: { title: '添加拼团活动', icon: '', noCache: true },
          auth: 'ACTIVITY_FOR_GROUP_BUY_ADD'
        },
        {
          path: 'group_booking_form_show',
          hidden: true,
          component: () => import('@/pages/market/group-booking/form'),
          name: 'groupBookingFormView',
          meta: { title: '查看拼团活动', icon: '', noCache: true },
          auth: 'ACTIVITY_FOR_GROUP_BUY_VIEW'
        },
        {
          path: 'group_booking_form_edit',
          hidden: true,
          component: () => import('@/pages/market/group-booking/form'),
          name: 'groupBookingFormUpdate',
          meta: { title: '编辑拼团活动', icon: '', noCache: true },
          auth: 'ACTIVITY_FOR_GROUP_BUY_UPDATE'
        },
        {
          path: 'group_booking_form_copy',
          hidden: true,
          component: () => import('@/pages/market/group-booking/form'),
          name: 'groupBookingFormCopy',
          meta: { title: '复制拼团活动', icon: '', noCache: true }
        },
        {
          path: 'group_booking_verify',
          component: () => import('@/pages/market/group-booking/verify'),
          name: 'groupBookingVerify',
          meta: { title: '拼团活动审核', icon: '' },
          auth: 'ACTIVITY_FOR_ORDER_SUBMIT'
        },
        {
          path: 'group_booking_launch',
          hidden: true,
          component: () => import('@/pages/market/group-booking/launch'),
          name: 'groupBookingStartRecord',
          meta: { title: '发起记录', icon: '', noCache: true },
          auth: 'ACTIVITY_GROUP_BUY_START_RECORD_VIEW'
        },
        {
          path: 'group_booking_participate',
          hidden: true,
          component: () => import('@/pages/market/group-booking/participate'),
          name: 'groupBookingJoinedRecord',
          meta: { title: '参与记录', icon: '', noCache: true },
          auth: 'ACTIVITY_GROUP_BUY_JOINED_RECORD_VIEW'
        },
        {
          path: 'group_log',
          hidden: true,
          component: () => import('@/pages/market/group-booking/log'),
          name: 'groupBookingLog',
          meta: { title: '操作日志', icon: '' },
          auth: 'COMMON_OPERATE_LOG'
        }
      ]
    },
    {
      path: '/active/secondsKill',
      name: 'secondsKill',
      redirect: '/active/secondsKill/index',
      component: () => import('@/pages/layout/child'),
      meta: { title: '秒杀活动', icon: '' },
      auth: 'SEC_KILL_MANAGE',
      children: [
        {
          path: 'index',
          component: () => import('@/pages/market/seconds-kill/index'),
          name: 'secondsKillList',
          meta: { title: '秒杀列表', icon: '' },
          auth: 'SECKILL_LIST'
        },
        {
          path: 'form',
          hidden: true,
          component: () => import('@/pages/market/seconds-kill/seconds-kill-form'),
          name: 'secondsKillAdd',
          meta: { title: '新建秒杀', icon: '', noCache: true },
          auth: 'SEC_KILL_LAUNCH_ADD'
        },
        {
          path: 'edit',
          hidden: true,
          component: () => import('@/pages/market/seconds-kill/seconds-kill-form'),
          name: 'secondsKillEdit',
          meta: { title: '编辑秒杀', icon: '', noCache: true },
          auth: 'SEC_KILL_LAUNCH_UPDATE'
        },
        {
          path: 'show',
          hidden: true,
          component: () => import('@/pages/market/seconds-kill/seconds-kill-form'),
          name: 'secondsKillShow',
          meta: { title: '编辑秒杀', icon: '', noCache: true },
          auth: 'SEC_KILL_LAUNCH_UPDATE'
        },
        {
          path: 'session-log',
          hidden: true,
          component: () => import('@/pages/market/seconds-kill/log'),
          name: 'secondsKillSessionLog',
          meta: { title: '操作日志', icon: '', noCache: true },
          auth: 'COMMON_OPERATE_LOG'
        },
        {
          path: 'kill-log',
          hidden: true,
          component: () => import('@/pages/market/seconds-kill/kill-log'),
          name: 'secondsKillLog',
          meta: { title: '操作日志', icon: '', noCache: true },
          auth: 'COMMON_OPERATE_LOG'
        },
        {
          path: 'verify',
          component: () => import('@/pages/market/seconds-kill/verify'),
          name: 'secondsKillVerify',
          meta: { title: '秒杀审核', icon: '' },
          auth: 'SECKILL_VERIFY'
        },
        {
          path: 'session',
          component: () => import('@/pages/market/seconds-kill/session'),
          name: 'sessionManage',
          meta: { title: '场次管理', icon: '' },
          auth: 'SESSION_MANAGE'
        },
        {
          path: 'session_set',
          component: () => import('@/pages/market/seconds-kill/set-session'),
          name: 'sessionSet',
          meta: { title: '场次设置', icon: '' },
          auth: 'SESSION_SET'
        },
        {
          path: 'session_detail',
          hidden: true,
          component: () => import('@/pages/market/seconds-kill/session-detail'),
          name: 'sessionDetail',
          meta: { title: '场次详情', icon: '', noCache: true }
        },
        {
          path: 'participation',
          hidden: true,
          component: () => import('@/pages/market/seconds-kill/participation'),
          name: 'participation',
          meta: { title: '参与记录', icon: '', noCache: true },
          auth: 'SEC_KILL_SESSION_RECORD_VIEW'
        }
      ]
    }
  ]
}

export default active
