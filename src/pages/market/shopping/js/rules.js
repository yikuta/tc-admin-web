let rules = {
  orderActivityName: [
    { required: true, message: '请输入活动名称', trigger: 'blur' },
    { min: 1, max: 20, message: '活动名称长度最大20字符', trigger: 'blur' }
  ],
  channelType: [
    { required: true }
  ],
  // businessTypeSet: [
  //   { type: 'array', required: true, message: '至少选择一个业务适用范围', trigger: 'blur' }
  // ],
  deductionUnitType: [
    { required: true, message: '请选择满额条件', trigger: 'blur' }
  ],
  giftType: [
    { required: true, message: '请选择赠品内容', trigger: 'blur' }
  ],
  userRangeType: [
    { required: true, message: '请选择可享用户', trigger: 'blur' }
  ],
  singleUserTime: [
    { required: true, message: '请输入用户可参与次数', trigger: 'blur' }
  ]
}

let rulesFn = (_this) => {
  let positive_integer = /^\+?[1-9][0-9]*$/ // 非0正整数
  let positive_number = /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/ // 有两位小数的正实数
  // let positive_flo = /^\+?(?:0|[1-9]\d*)(?:\.\d)?$/ // 有一位小数
  // const _this = this
  let businessType = (rule, value, callback) => {
    // debugger
    if (_this.form.channelType === 'ALL') {
      callback()
    } else {
      if (value.length) {
        callback()
      } else {
        callback(new Error('请选择业务适用范围'))
      }
    }
  }
  let orderActivityTimeList = (rule, value, callback) => {
    let fixedTimeList = _this.form.orderActivityTimeList
    if (fixedTimeList.length === 2) {
      callback()
    } else {
      callback(new Error('请选择可用时间'))
    }
  }
  let shopSetlected = (rule, value, callback) => {
    callback()
  }
  let commoditySelected = (rule, value, callback) => {
    callback()
  }
  let singleUserLimitNums = (rule, value, callback) => {
    // debugger
    // 根据满额类型校验满额条件
    // 校验优惠券
    // 校验总限量
    // 校验单用户单次
    if (_this.form.fullGiveCouponRule.deductionUnitType === 'MONEY') {
      // debugger
      let list = _this.form.fullGiveCouponRule.fullGiveItemForDisCountList
      for (let i = 0; i < list.length; i++) {
        if ((list[i].satisfyMoney < 0.01 || list[i].satisfyMoney > 1000000) || (!positive_number.test(list[i].satisfyMoney))) {
          callback(new Error('请输入发放1000000内的满额条件'))
          return false
        }
        if (list[i].couponCode === '') {
          callback(new Error('请选择发放优惠券'))
          return false
        }
        if (_this.$route.query.type === 'release') { // 发布编辑，验证数量只增不减
          if ((Number(list[i].totalCount) < 1 || Number(list[i].totalCount) > 1000000) || (!positive_integer.test(list[i].totalCount))) {
            callback(new Error('请输入发放1000000内的发放总量'))
            return false
          } else if (_this.releaseForm.fullGiveCouponRule.fullGiveItemForDisCountList[i].totalCount > list[i].totalCount) {
            callback(new Error('发放数量不能减少，请重新输入'))
            return false
          }
        } else {
          if ((Number(list[i].totalCount) < 1 || Number(list[i].totalCount) > 1000000) || (!positive_integer.test(list[i].totalCount))) {
            callback(new Error('请输入发放1000000内的发放总量'))
            return false
          }
        }
        if ((Number(list[i].userSingleCount) < 1 || Number(list[i].userSingleCount) > 1000000) || (!positive_integer.test(list[i].userSingleCount))) {
          callback(new Error('请输入发放1000000内的单用户单次赠送量'))
          return false
        } else if (Number(list[i].totalCount) < Number(list[i].userSingleCount)) {
          callback(new Error('单用户单次赠送量要小于等于发放总量'))
          return false
        }
        callback()
      }
    } else {
      let list = _this.form.fullGiveCouponRule.fullGiveItemForDisCountList
      for (let i = 0; i < list.length; i++) {
        if ((list[i].satisfyPiece < 1 || list[i].satisfyPiece > 1000000) || (!positive_integer.test(list[i].satisfyPiece))) {
          callback(new Error('请输入发放1000000内的满额条件'))
          return false
        }
        if (list[i].couponCode === '') {
          callback(new Error('请选择发放优惠券'))
          return false
        }
        if (_this.$route.query.type === 'release') { // 发布编辑，验证数量只增不减
          if ((Number(list[i].totalCount) < 1 || Number(list[i].totalCount) > 1000000) || (!positive_integer.test(list[i].totalCount))) {
            callback(new Error('请输入发放1000000内的发放总量'))
            return false
          } else if (_this.releaseForm.fullGiveCouponRule.fullGiveItemForDisCountList[i].totalCount > list[i].totalCount) {
            callback(new Error('发放数量不能减少，请重新输入'))
            return false
          }
        } else {
          if ((Number(list[i].totalCount) < 1 || Number(list[i].totalCount) > 1000000) || (!positive_integer.test(list[i].totalCount))) {
            callback(new Error('请输入发放1000000内的发放总量'))
            return false
          }
        }
        if ((Number(list[i].userSingleCount) < 1 || Number(list[i].userSingleCount) > 1000000) || (!positive_integer.test(list[i].userSingleCount))) {
          callback(new Error('请输入发放1000000内的单用户单次赠送量'))
          return false
        } else if (Number(list[i].totalCount) < Number(list[i].userSingleCount)) {
          callback(new Error('单用户单次赠送量要小于等于发放总量'))
          return false
        }
        callback()
      }
    }
  }

  rules.businessType = [
    { required: true, validator: businessType }
  ]
  rules.orderActivityTimeList = [
    { required: true, validator: orderActivityTimeList }
  ]
  rules.shopSetlected = [
    { required: true, validator: shopSetlected }
  ]
  rules.commoditySelected = [
    { required: true, validator: commoditySelected }
  ]
  rules.singleUserLimitNums = [
    { required: true, validator: singleUserLimitNums }
  ]

  return rules
}

export default rulesFn
