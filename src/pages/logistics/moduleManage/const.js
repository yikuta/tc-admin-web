export const policyConfig = {
  1: [{
    title: '首件数（件）',
    prop: 'minCount',
    type: 'integer'
  }, {
    title: '首费（元）',
    prop: 'minAmount',
    type: 'decimal'
  }, {
    title: '续件数（件）',
    prop: 'increaseCount',
    type: 'integer'
  }, {
    title: '续费（元）',
    prop: 'increaseAmount',
    type: 'decimal'
  }],
  2: [{
    title: '首重（kg）',
    prop: 'minCount',
    type: 'decimal'
  }, {
    title: '首费（元）',
    prop: 'minAmount',
    type: 'decimal'
  }, {
    title: '续重（kg）',
    prop: 'increaseCount',
    type: 'decimal'
  }, {
    title: '续费（元）',
    prop: 'increaseAmount',
    type: 'decimal'
  }]
}

export const rules = {
  name: [
    { required: true, message: '请输入模版名称', trigger: 'blur' },
    { min: 1, max: 20, message: '模版名称长度最大20字符', trigger: 'blur' }
  ],
  shippingFree: [{ required: true, message: '请选择是否包邮', trigger: 'blur' }],
  unitType: [{ required: true, message: '请选择计价模式', trigger: 'blur' }],
  default: [{ required: true, message: '请输入运输方式参数', trigger: 'blur' }]
}

export const freeConditionOptions = {
  1: [
    { key: '件数', value: 1 },
    { key: '金额', value: 2 },
    { key: '件数+金额', value: 3 }
  ],
  2: [
    { key: '重量', value: 1 },
    { key: '金额', value: 2 },
    { key: '重量+金额', value: 3 }
  ]
}

export const freePolicyConfig = {
  1: [{
    title: '件数',
    prop: 'minCount',
    type: 'integer'
  }, {
    title: '费用',
    prop: 'minAmount',
    type: 'decimal'
  }],
  2: [{
    title: '重量',
    prop: 'minCount',
    type: 'integer'
  }, {
    title: '费用',
    prop: 'minAmount',
    type: 'decimal'
  }]
}
