import Layout from '@/pages/layout/Layout'

const financial = {
  path: '/financial',
  component: Layout,
  redirect: '/financial/user',
  name: 'financial',
  auth: 'FINANCE_MANAGE',
  meta: { title: '财务管理', icon: 'caiwu' },
  children: [
    {
      path: '/financial/user',
      redirect: '/financial/user/shopFund',
      name: 'userFinancial',
      component: () => import('@/pages/layout/child'),
      meta: { title: '客户资金' },
      auth: 'USER_PAY_MANAGE',
      children: [
        {
          path: 'walletStatus',
          name: 'walletStatus',
          component: () => import('@/pages/financial/user/walletStatus/list'),
          meta: { title: '门店钱包状态' },
          auth: 'SHOP_PURSE_STATUS'
        },
        {
          path: 'shopFund',
          name: 'shopFund',
          component: () => import('@/pages/financial/user/shopFund/list'),
          meta: { title: '门店资金管理' },
          auth: 'SHOP_FUND_MANAGE'
        },
        {
          path: 'shopFund/detail',
          name: 'shopFundDetail',
          component: () => import('@/pages/financial/user/shopFund/detail'),
          meta: { title: '门店账户明细' },
          hidden: true
        },
        {
          path: 'shopFund/frozen',
          name: 'shopFundFrozenDetail',
          component: () => import('@/pages/financial/user/shopFund/frozenDetail'),
          meta: { title: '门店冻结明细' },
          hidden: true
        },
        {
          path: 'shopSubsidy',
          name: 'shopSubsidy',
          component: () => import('@/pages/financial/user/shopSubsidy/list'),
          meta: { title: '门店补贴审核' },
          auth: 'GPR_SUBSIDY_MANAGE'
        },
        {
          path: 'shopSubsidy/logs',
          name: 'shopSubsidyLogs',
          component: () => import('@/pages/financial/user/shopSubsidy/logs'),
          meta: { title: '门店补贴审核日志' },
          hidden: true
        },
        {
          path: 'leaderFund',
          name: 'leaderFund',
          component: () => import('@/pages/financial/user/leaderFund/list'),
          meta: { title: '团长资金管理' },
          auth: 'GFR_FUND_MANAGE'
        },
        {
          path: 'leaderFund/detail',
          name: 'leaderFundDetail',
          component: () => import('@/pages/financial/user/leaderFund/detail'),
          meta: { title: '团长资金明细' },
          hidden: true
        },
        {
          path: 'leaderFund/frozen',
          name: 'leaderFundFrozenDetail',
          component: () => import('@/pages/financial/user/leaderFund/frozenDetail'),
          meta: { title: '团长冻结明细' },
          hidden: true
        },
        {
          path: 'leaderSubsidy',
          name: 'leaderSubsidy',
          component: () => import('@/pages/financial/user/leaderSubsidy/list'),
          meta: { title: '团长补贴审核' },
          auth: 'GPR_SUBSIDY_MANAGE'
        },
        {
          path: 'leaderSubsidy/logs',
          name: 'leaderSubsidyLogs',
          component: () => import('@/pages/financial/user/leaderSubsidy/logs'),
          meta: { title: '团长补贴审核日志' },
          hidden: true
        }
      ]
    },
    {
      path: '/financial/platform',
      redirect: '/financial/platform/platformFund',
      name: 'platformFinancial',
      component: () => import('@/pages/layout/child'),
      meta: { title: '平台资金' },
      auth: 'TL_BALANCE',
      children: [
        {
          path: 'platformFund',
          name: 'platformFund',
          component: () => import('@/pages/financial/platform/platformFund/list'),
          meta: { title: '平台资金管理' },
          auth: 'TL_BALANCE_MANAGE'
        },
        {
          path: 'platformFund/platformDetail',
          name: 'platformDetail',
          component: () => import('@/pages/financial/platform/platformFund/platformDetail'),
          meta: { title: '平台账户明细' },
          hidden: true
        },
        {
          path: 'platformFund/marketDetail',
          name: 'marketDetail',
          component: () => import('@/pages/financial/platform/platformFund/marketDetail'),
          meta: { title: '营销账户明细' },
          hidden: true
        },
        /* {
          path: 'platformFund/withdraw',
          name: 'withdraw',
          component: () => import('@/pages/financial/platform/withdraw/list'),
          meta: { title: '通联提现管理' }
        },*/
        {
          path: 'statements',
          name: 'statements',
          hidden: true,
          component: () => import('@/pages/financial/platform/statements/list'),
          meta: { title: '通联对账单管理' }
        }
      ]
    },
    {
      path: '/financial/audits',
      redirect: '/financial/audits/shopWithdraw',
      name: 'auditsFinancial',
      component: () => import('@/pages/layout/child'),
      meta: { title: '提现审核' },
      auth: 'FINANCE_AUDIT_MANAGE',
      children: [
        {
          path: 'shopWithdraw',
          name: 'shopWithdraw',
          component: () => import('@/pages/financial/audits/shopWithdraw/list'),
          meta: { title: '门店提现管理' },
          auth: 'SHOP_WITHDRAW_MANAGE'
        }, {
          path: 'shopWithdraw/detail',
          name: 'shopWithdrawDetail',
          component: () => import('@/pages/financial/audits/shopWithdraw/detail'),
          meta: { title: '门店提现详情' },
          hidden: true
        }, {
          path: 'shopWithdraw/logs',
          name: 'shopWithdrawLogs',
          component: () => import('@/pages/financial/audits/shopWithdraw/logs'),
          meta: { title: '操作日志' },
          hidden: true
        }, {
          path: 'leaderWithdraw',
          name: 'leaderWithdraw',
          component: () => import('@/pages/financial/audits/leaderWithdraw/list'),
          meta: { title: '团长提现管理' },
          auth: 'GPR_WITHDRAW_MANAGE'
        }, {
          path: 'leaderWithdraw/detail',
          name: 'leaderWithdrawDetail',
          component: () => import('@/pages/financial/audits/leaderWithdraw/detail'),
          meta: { title: '团长提现详情' },
          hidden: true
        }, {
          path: 'leaderWithdraw/logs',
          name: 'leaderWithdrawLogs',
          component: () => import('@/pages/financial/audits/leaderWithdraw/logs'),
          meta: { title: '操作日志' },
          hidden: true
        }
      ]
    }
  ]
}

export default financial
