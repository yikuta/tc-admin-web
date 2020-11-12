/* Layout */
import Layout from '../pages/layout/Layout'
const market = {
  path: '/market',
  name: 'shopMarket',
  redirect: '/market/couponManager',
  component: Layout,
  meta: { title: '营销管理', icon: 'advi' },
  auth: 'MARKET_MANAGE',
  children: [
    {
      path: '/market/couponManager',
      name: 'couponManager',
      redirect: '/market/couponManager/index',
      component: () => import('@/pages/layout/child'),
      meta: { title: '优惠券管理', icon: '' },
      auth: 'COUPON_LIST_MANAGE',
      children: [
        {
          path: 'index',
          component: () => import('@/pages/market/coupon/index'),
          name: 'couponList',
          meta: { title: '平台优惠券列表', icon: '' },
          auth: 'PLATFORM_COUPON_LIST'
        },
        {
          path: 'verify',
          component: () => import('@/pages/market/verify/index'),
          name: 'marketVerify',
          meta: { title: '平台优惠券审核', icon: '' },
          auth: 'PLATFORM_COUPON_VERIFY'
        },
        {
          path: 'form',
          hidden: true,
          component: () => import('@/pages/market/coupon/form'),
          name: 'couponForm',
          meta: { title: '平台优惠券添加', icon: '', noCache: true }
        },
        {
          path: 'form_edit',
          hidden: true,
          component: () => import('@/pages/market/coupon/form'),
          name: 'couponFormEdit',
          meta: { title: '平台优惠券编辑', icon: '', noCache: true }
        },
        {
          path: 'form_copy',
          hidden: true,
          component: () => import('@/pages/market/coupon/form'),
          name: 'couponFormCopy',
          meta: { title: '优惠券复制', icon: '', noCache: true },
          auth: 'COUPON_MANAGER_COPY_PAGE'
        },
        {
          path: 'form_show',
          hidden: true,
          component: () => import('@/pages/market/coupon/form'),
          name: 'couponFormShow',
          meta: { title: '优惠券查看', icon: '', noCache: true },
          auth: 'COUPON_RULE_CONTENT_VIEW'
        },
        {
          path: 'coupon/receive-detail',
          hidden: true,
          component: () => import('@/pages/market/coupon/receive-detail'),
          name: 'receiveDetail',
          meta: { title: '领取详情', icon: '', noCache: true },
          auth: 'COUPON_INSTANCE_RECEIVED_VIEW'
        },
        {
          path: 'business-coupon',
          component: () => import('@/pages/market/business-coupon/index'),
          name: 'businessCoupon',
          meta: { title: '商家优惠券列表', icon: '' },
          auth: 'SHOP_COUPON_LIST'
        },
        {
          path: 'business-log',
          hidden: true,
          component: () => import('@/pages/market/business-coupon/log'),
          name: 'businessCouponLog',
          meta: { title: '操作日志', icon: '' },
          auth: 'COUPON_FOR_SHOP_OPERATION_LOG_VIEW'
        }
      ]
    },
    {
      path: '/market/manMade',
      name: 'manMade',
      redirect: '/market/manMade/index',
      component: () => import('@/pages/layout/child'),
      meta: { title: '人工发券管理', icon: '' },
      auth: 'CPN_MANUAL_MANAGE',
      children: [
        {
          path: 'index',
          component: () => import('@/pages/market/man-made/index'),
          name: 'manMadeCoupon',
          meta: { title: '人工发券申请', icon: '' },
          auth: 'CPN_MANUAL_LIST'
        },
        {
          path: 'add',
          hidden: true,
          component: () => import('@/pages/market/man-made/add'),
          name: 'manMadeCouponAdd',
          meta: { title: '新建队列', icon: '', noCache: true },
          auth: 'CPN_MANUAL_QUEUE_CREATE'
        },
        {
          path: 'show',
          hidden: true,
          component: () => import('@/pages/market/man-made/add'),
          name: 'manMadeCouponShow',
          meta: { title: '查看队列', icon: '', noCache: true },
          auth: 'CPN_MANUAL_QUEUE_DETAIL_VIEW'
        },
        {
          path: 'detail',
          hidden: true,
          component: () => import('@/pages/market/man-made/detail'),
          name: 'manMadeCouponDetail',
          meta: { title: '发券详情', icon: '', noCache: true }
        },
        {
          path: 'verify',
          component: () => import('@/pages/market/man-made/verify'),
          name: 'manMadeCouponVerify',
          meta: { title: '人工发券审核', icon: '' },
          auth: 'CPN_MANUAL_VERIFY'
        }
      ]
    },
    {
      path: '/market/scene',
      name: 'scene',
      redirect: '/market/scene/center',
      component: () => import('@/pages/layout/child'),
      meta: { title: '场景管理', icon: '' },
      auth: 'SCENARIO_MANAGE',
      children: [
        {
          path: 'center',
          component: () => import('@/pages/market/center/index'),
          name: 'getCouponCenter',
          meta: { title: '领券中心', icon: '' },
          auth: 'COUPON_CENTER'
        },
        {
          path: 'center/release',
          hidden: true,
          component: () => import('@/pages/market/center/release'),
          name: 'centerRelease',
          meta: { title: '投放管理', icon: '', noCache: true },
          auth: 'CPN_CENTER_DEVOTE_RECORD_VIEW'
        },
        {
          path: 'center/participate',
          hidden: true,
          component: () => import('@/pages/market/center/participate'),
          name: 'centerParticipate',
          meta: { title: '参与记录', icon: '', noCache: true }
        },
        {
          path: 'new-people',
          component: () => import('@/pages/market/new-people/index'),
          name: 'newPeople',
          meta: { title: '新人礼', icon: '' },
          auth: 'NEW_PEOPLE'
        },
        {
          path: 'new-people/release',
          hidden: true,
          component: () => import('@/pages/market/new-people/release'),
          name: 'newPeopleRelease',
          meta: { title: '投放管理', icon: '', noCache: true },
          auth: 'SCENARIO_COUPON_DEVOTE_RECORD_VIEW'
        },
        {
          path: 'new-people/participate',
          hidden: true,
          component: () => import('@/pages/market/new-people/participate'),
          name: 'newPeopleParticipate',
          meta: { title: '参与记录', icon: '', noCache: true },
          auth: 'SCENARIO_RECRUIT_GIFT_COUPON_RECORD_VIEW'
        },
        {
          path: 'invitation',
          component: () => import('@/pages/market/invitation/index'),
          name: 'invitation',
          meta: { title: '邀请有礼', icon: '' },
          auth: 'INVITATION'
        }
      ]
    },
    {
      path: '/market/shopping',
      name: 'shopping',
      redirect: '/market/shopping/index',
      component: () => import('@/pages/layout/child'),
      meta: { title: '购物送券', icon: '' },
      auth: 'BUY_COUPON_MANAGE',
      children: [
        {
          path: 'index',
          component: () => import('@/pages/market/shopping/index'),
          name: 'shoppingManage',
          meta: { title: '购物送券申请', icon: '' },
          auth: 'ORDER_ACTIVITY_LIST'
        },
        {
          path: 'form',
          hidden: true,
          component: () => import('@/pages/market/shopping/full-gift-form'),
          name: 'shoppingForm',
          meta: { title: '添加满赠活动', icon: '', noCache: true },
          auth: 'ACTIVITY_FOR_ORDER_ADD'
        },
        {
          path: 'form_edit',
          hidden: true,
          component: () => import('@/pages/market/shopping/full-gift-form'),
          name: 'shoppingFormEdit',
          meta: { title: '编辑满赠活动', icon: '', noCache: true },
          auth: 'ACTIVITY_FOR_ORDER_UPDATE'
        },
        {
          path: 'form_copy',
          hidden: true,
          component: () => import('@/pages/market/shopping/full-gift-form'),
          name: 'shoppingFormCopy',
          meta: { title: '复制满赠活动', icon: '', noCache: true }
        },
        {
          path: 'form_show',
          hidden: true,
          component: () => import('@/pages/market/shopping/full-gift-form'),
          name: 'shoppingFormShow',
          meta: { title: '查看满赠活动', icon: '', noCache: true },
          auth: 'ACTIVITY_FOR_ORDER_VIEW'
        },
        {
          path: 'verify',
          component: () => import('@/pages/market/shopping/verify'),
          name: 'shoppingVerify',
          meta: { title: '购物送券审核', icon: '' },
          auth: 'ORDER_ACTIVITY_VERIFY'
        },
        {
          path: 'receive',
          hidden: true,
          component: () => import('@/pages/market/shopping/receive-detail'),
          name: 'shoppingReceive',
          meta: { title: '参与详情', icon: '', noCache: true }
        },
        {
          path: 'log',
          hidden: true,
          component: () => import('@/pages/market/shopping/log'),
          name: 'shoppingLog',
          meta: { title: '操作日志', icon: '', noCache: true }
        }
        // {
        //   path: 'group_booking',
        //   component: () => import('@/pages/market/group-booking/index'),
        //   name: 'groupBooking',
        //   meta: { title: '拼团活动列表', icon: '' },
        //   auth: 'BOOK_ACTIVITY_LIST'
        // },
        // {
        //   path: 'group_booking_form',
        //   hidden: true,
        //   component: () => import('@/pages/market/group-booking/form'),
        //   name: 'groupBookingForm',
        //   meta: { title: '添加拼团活动', icon: '', noCache: true },
        //   auth: 'ACTIVITY_FOR_GROUP_BUY_ADD'
        // },
        // {
        //   path: 'group_booking_form_show',
        //   hidden: true,
        //   component: () => import('@/pages/market/group-booking/form'),
        //   name: 'groupBookingForm',
        //   meta: { title: '查看拼团活动', icon: '', noCache: true },
        //   auth: 'ACTIVITY_FOR_GROUP_BUY_VIEW'
        // },
        // {
        //   path: 'group_booking_form_edit',
        //   hidden: true,
        //   component: () => import('@/pages/market/group-booking/form'),
        //   name: 'groupBookingForm',
        //   meta: { title: '编辑拼团活动', icon: '', noCache: true },
        //   auth: 'ACTIVITY_FOR_GROUP_BUY_UPDATE'
        // },
        // {
        //   path: 'group_booking_form_copy',
        //   hidden: true,
        //   component: () => import('@/pages/market/group-booking/form'),
        //   name: 'groupBookingForm',
        //   meta: { title: '复制拼团活动', icon: '', noCache: true }
        // },
        // {
        //   path: 'group_booking_verify',
        //   component: () => import('@/pages/market/group-booking/verify'),
        //   name: 'groupBookingVerify',
        //   meta: { title: '拼团活动审核', icon: '' },
        //   auth: 'ACTIVITY_FOR_ORDER_SUBMIT'
        // },
        // {
        //   path: 'group_booking_launch',
        //   hidden: true,
        //   component: () => import('@/pages/market/group-booking/launch'),
        //   name: 'groupBookingVerify',
        //   meta: { title: '发起记录', icon: '', noCache: true },
        //   auth: 'ACTIVITY_GROUP_BUY_START_RECORD_VIEW'
        // },
        // {
        //   path: 'group_booking_participate',
        //   hidden: true,
        //   component: () => import('@/pages/market/group-booking/participate'),
        //   name: 'groupBookingVerify',
        //   meta: { title: '参与记录', icon: '', noCache: true },
        //   auth: 'ACTIVITY_GROUP_BUY_JOINED_RECORD_VIEW'
        // }
      ]
    },
    // {
    //   path: '/market/secondsKill',
    //   name: 'secondsKill',
    //   redirect: '/market/secondsKill/index',
    //   component: () => import('@/pages/layout/child'),
    //   meta: { title: '营销价管理', icon: '' },
    //   auth: 'SEC_KILL_MANAGE',
    //   children: [
    //     {
    //       path: 'index',
    //       component: () => import('@/pages/market/seconds-kill/index'),
    //       name: 'secondsKillList',
    //       meta: { title: '秒杀列表', icon: '' },
    //       auth: 'SECKILL_LIST'
    //     },
    //     {
    //       path: 'form',
    //       hidden: true,
    //       component: () => import('@/pages/market/seconds-kill/seconds-kill-form'),
    //       name: 'secondsKillAdd',
    //       meta: { title: '新建秒杀', icon: '', noCache: true },
    //       auth: 'SEC_KILL_LAUNCH_ADD'
    //     },
    //     {
    //       path: 'edit',
    //       hidden: true,
    //       component: () => import('@/pages/market/seconds-kill/seconds-kill-form'),
    //       name: 'secondsKillEdit',
    //       meta: { title: '编辑秒杀', icon: '', noCache: true },
    //       auth: 'SEC_KILL_LAUNCH_UPDATE'
    //     },
    //     {
    //       path: 'show',
    //       hidden: true,
    //       component: () => import('@/pages/market/seconds-kill/seconds-kill-form'),
    //       name: 'secondsKillShow',
    //       meta: { title: '编辑秒杀', icon: '', noCache: true },
    //       auth: 'SEC_KILL_LAUNCH_UPDATE'
    //     },
    //     {
    //       path: 'session-log',
    //       hidden: true,
    //       component: () => import('@/pages/market/seconds-kill/log'),
    //       name: 'secondsKillSessionLog',
    //       meta: { title: '操作日志', icon: '', noCache: true },
    //       auth: 'SEC_KILL_SESSION_OPERATION_HISTORY_VIEW'
    //     },
    //     {
    //       path: 'kill-log',
    //       hidden: true,
    //       component: () => import('@/pages/market/seconds-kill/kill-log'),
    //       name: 'secondsKillLog',
    //       meta: { title: '操作日志', icon: '', noCache: true },
    //       auth: 'SEC_KILL_LAUNCH_OPERATION_HISTORY_VIEW'
    //     },
    //     {
    //       path: 'verify',
    //       component: () => import('@/pages/market/seconds-kill/verify'),
    //       name: 'secondsKillVerify',
    //       meta: { title: '秒杀审核', icon: '' },
    //       auth: 'SECKILL_VERIFY'
    //     },
    //     {
    //       path: 'session',
    //       component: () => import('@/pages/market/seconds-kill/session'),
    //       name: 'sessionManage',
    //       meta: { title: '场次管理', icon: '' },
    //       auth: 'SESSION_MANAGE'
    //     },
    //     {
    //       path: 'session_set',
    //       component: () => import('@/pages/market/seconds-kill/set-session'),
    //       name: 'sessionSet',
    //       meta: { title: '场次设置', icon: '' },
    //       auth: 'SESSION_SET'
    //     },
    //     {
    //       path: 'session_detail',
    //       hidden: true,
    //       component: () => import('@/pages/market/seconds-kill/session-detail'),
    //       name: 'sessionDetail',
    //       meta: { title: '场次详情', icon: '', noCache: true }
    //     },
    //     {
    //       path: 'participation',
    //       hidden: true,
    //       component: () => import('@/pages/market/seconds-kill/participation'),
    //       name: 'participation',
    //       meta: { title: '参与记录', icon: '', noCache: true },
    //       auth: 'SEC_KILL_SESSION_RECORD_VIEW'
    //     }
    //   ]
    // },
    {
      path: 'log',
      hidden: true,
      component: () => import('@/pages/market/templates/log'),
      name: 'markerLog',
      meta: { title: '操作日志', icon: '', noCache: true }
    }
  ]
}

export default market
