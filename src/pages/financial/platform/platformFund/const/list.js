// 资金类型
export const BusinessTypes = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '销售收入',
    value: 1,
    key: 'INCOME_4_SALE'
  },
  {
    label: '运费收入',
    value: 2,
    key: 'INCOME_4_FREIGHT'
  },
  {
    label: '服务费收入',
    value: 3,
    key: 'INCOME_4_FEE'
  },
  {
    label: '充值收入',
    value: 4,
    key: 'INCOME_4_RECHARGE'
  },
  {

    label: '其他收入',
    value: 5,
    key: 'INCOME_4_OTHER'
  },
  {
    label: '销售退款',
    value: 6,
    key: 'REFUND_4_SALE'
  },
  {
    label: '运费退款',
    value: 7,
    key: 'REFUND_4_FREIGHT'
  },
  {
    label: '售后退款',
    value: 8,
    key: 'REFUND_4_AFTER_SALE'
  },
  {
    label: '提现支出',
    value: 9,
    key: 'CASH_OUT'
  },
  {
    label: '提现手续费',
    value: 10,
    key: 'CASH_OUT_FEE'
  },
  {
    label: '佣金支出',
    value: 11,
    key: 'EXPENSES_4_COMMISSION'
  },
  {
    label: '其他支出',
    value: 12,
    key: 'EXPENSES_4_OTHER'
  }
]

// 账户类型
export const AccountTypes = [
  {
    label: '全部',
    value: ''
  },
  {
    label: '支付宝账户',
    value: 1,
    key: 'ALIPAY'
  },
  {
    label: '微信账户',
    value: 2,
    key: 'WECHAT'
  },
  {
    label: '通联余额账户',
    value: 3,
    key: 'TONG_LIAN_BALANCE'
  },
  {
    label: '通联营销账户',
    value: 4,
    key: 'TONG_LIAN_MARKETING'
  }
]

//
export const cardList = [
  {
    title: '通联余额账户',
    type: 3,
    prop: 'tongLianStandardAccount',
    descList: [
      {
        label: '可用余额',
        prop: 'canUseBalance'
      }, {
        label: '通联余额',
        prop: 'tongLianBalance'
      }, {
        label: '今日收入',
        prop: 'todayIncome'
      }, {
        label: '今日支出',
        prop: 'todayExpenses'
      }, {
        label: '累计收入',
        prop: 'totalIncome'
      }, {
        label: '累计支出',
        prop: 'totalExpenses'
      }
    ]
  }, {
    title: '通联营销账户',
    type: 4,
    prop: 'tongLianMarketingAccount',
    descList: [{
      label: '可用余额',
      prop: 'canUseBalance'
    }, {
      label: '通联余额',
      prop: 'tongLianBalance'
    }, {
      label: '今日收入',
      prop: 'todayIncome'
    }, {
      label: '今日支出',
      prop: 'todayExpenses'
    }, {
      label: '累计收入',
      prop: 'totalIncome'
    }, {
      label: '累计支出',
      prop: 'totalExpenses'
    }
    ]
  }, {
    title: '微信账户',
    type: 2,
    prop: 'weChatAccount',
    descList: [{
      label: '可用余额',
      prop: 'canUseBalance'
    }, {
      label: '待提现佣金',
      prop: 'waitingPayCastOutAmount'
    }, {
      label: '待付佣金',
      prop: 'waitingPayCommission'
    }, {
      label: '今日收入',
      prop: 'todayIncome'
    }, {
      label: '今日支出',
      prop: 'todayExpenses'
    }, {
      label: '累计收入',
      prop: 'totalIncome'
    }, {
      label: '累计支出',
      prop: 'totalExpenses'
    }
    ]
  }, {
    title: '支付宝账户',
    type: 1,
    prop: 'aliPayAccount',
    descList: [{
      label: '可用余额',
      prop: 'canUseBalance'
    }, {
      label: '今日收入',
      prop: 'todayIncome'
    }, {
      label: '今日支出',
      prop: 'todayExpenses'
    }, {
      label: '累计收入',
      prop: 'totalIncome'
    }, {
      label: '累计支出',
      prop: 'totalExpenses'
    }
    ]
  }
]
