let rules = {
  groupBuyActivityName: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 1, max: 20, message: '活动名称长度最大20字符', trigger: 'blur' }
  ],
  initiatorType: [
    { required: true, message: '请选择发起身份', trigger: 'blur' }
  ],
  participantType: [
    { required: true, message: '请选择参团身份', trigger: 'blur' }
  ]
}

let rulesFn = (_this) => {
  let positive_integer = /^\+?[1-9][0-9]*$/ // 非0正整数
  // let positive_number = /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/ // 有两位小数的正实数
  // let positive_flo = /^\+?(?:0|[1-9]\d*)(?:\.\d)?$/ // 有一位小数
  // const _this = this
  let groupBuyActivityTimeList = (rule, value, callback) => {
    let fixedTimeList = _this.form.groupBuyActivityTimeList
    if (fixedTimeList.length === 2) {
      callback()
    } else {
      callback(new Error('请选择可用时间'))
    }
  }
  let joinHours = (rule, value, callback) => {
    if ((value < 1 || value > 1000000) || (!positive_integer.test(value))) {
      callback(new Error('请输入1000000内的参团时限'))
      return false
    } else {
      callback()
    }
  }
  let commodityTotalNum = (rule, value, callback) => {
    if ((value < 1 || value > 1000000) || (!positive_integer.test(value))) {
      callback(new Error('请输入1000000内的拼团限量'))
      return false
    } else {
      callback()
    }
  }
  let participatorLeastNum = (rule, value, callback) => {
    if ((value < 2 || value > 1000000) || (!positive_integer.test(value))) {
      callback(new Error('请输入1000000内的成团人数'))
      return false
    } else {
      callback()
    }
  }
  let commoditySelected = (rule, value, callback) => {
    callback()
  }

  rules.groupBuyActivityTimeList = [
    { required: true, validator: groupBuyActivityTimeList }
  ]
  rules.joinHours = [
    { required: true, validator: joinHours }
  ]
  rules.commoditySelected = [
    { required: true, validator: commoditySelected }
  ]
  rules.commodityTotalNum = [
    { required: true, validator: commodityTotalNum }
  ]
  rules.participatorLeastNum = [
    { required: true, validator: participatorLeastNum }
  ]

  return rules
}

export default rulesFn
