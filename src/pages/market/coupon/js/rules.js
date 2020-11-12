let rules = {
  couponName: [
    { required: true, message: '请输入优惠券名称', trigger: 'blur' },
    { min: 1, max: 20, message: '优惠券名称长度最大20字符', trigger: 'blur' }
  ],
  channelType: [
    { required: true }
  ],
  // businessTypeSet: [
  //   { type: 'array', required: true, message: '至少选择一个业务适用范围', trigger: 'blur' }
  // ],
  // sceneType: [
  //   { required: true, message: '请选择投放目标', trigger: 'change' }
  // ],
  // channelTypeSet: [
  //   { type: 'array', required: true, message: '至少选择一个投放范围', trigger: 'blur' }
  // ],
  // "sceneSetting.launchNum": [
  //   { required: true, message: '请输入优惠券发放总数', trigger: 'blur' }
  // ],
  // singleUserLimitNum: [
  //   { required: true, message: '请输入优惠券单用户可领', trigger: 'blur' }
  // ],
  // userRangeType: [
  //   { required: true, message: '请选择可领用户', trigger: 'blur' }
  // ],
  // time: [
  //   { type: 'array', required: true, message: '请选择领券时间', trigger: 'blur' }
  // ],
  // availableTimeType: [
  //   { required: true, message: '请选择可用时间', trigger: 'blur' }
  // ],
  instructions: [
    { required: false, message: '请输入优惠券说明', trigger: 'blur' },
    { min: 0, max: 200, message: '优惠券说明长度最大200字符', trigger: 'blur' }
  ]
}

let rulesFn = (_this) => {
  let positive_bai = /^([0-9]{1,2}|100)$/
  let positive_integer = /^\+?[1-9][0-9]*$/ // 非0正整数
  let positive_number = /^([1-9]\d{0,5})([.]\d{1,2})?$|^0[.]([1-9]\d{0,1}|[0-9][1-9])$/ // 有两位小数的正实数
  let positive_flo = /^\+?(?:0|[1-9]\d*)(?:\.\d)?$/ // 有一位小数
  // const _this = this
  let businessTypeSet = (rule, value, callback) => {
    // debugger
    if (_this.form.channelType === 'ALL') {
      callback()
    } else {
      if (value.length) {
        callback()
      } else {
        callback(new Error('至少选择一个业务适用范围'))
      }
    }
  }
  let deductionType_money = (rule, value, callback) => {
    if (value === 'DIRECT_DEDUCTION') {
      if (_this.$route.query.couponType === 'DOORFILL') {
        let money = Number(_this.$refs.directDeductionRule_money.value)
        if ((money < 1 || money > 10000) || (!positive_integer.test(money))) {
          callback(new Error('请输入10000以内的正整数'))
        } else {
          callback()
        }
      } else {
        let deduction = Number(_this.$refs.directDeductionRule_deduction.value)
        let upperLimitMoney = Number(_this.$refs.directDeductionRule_upperLimitMoney.value)
        if ((deduction < 1 || deduction >= 10) || (!positive_flo.test(deduction))) {
          callback(new Error('折扣请输入1-9.9之间的正数'))
        } else if ((upperLimitMoney < 1 || upperLimitMoney > 10000) || (!positive_integer.test(upperLimitMoney))) {
          callback(new Error('优惠上限请输入10000以内的正整数'))
        } else {
          callback()
        }
      }
    }
    if (value === 'SATISFY_DEDUCTION') {
      // 满减
      if (_this.$route.query.couponType === 'DOORFILL') {
        if (_this.form.satisfyDeductionRule.unitType === 'MONEY') {
          const money = Number(_this.$refs.satisfyDeductionRule_satisfyMoney[0].value)
          const deduction = Number(_this.$refs.satisfyDeductionRule_deduction[0].value)
          if ((money < 0.01 || money > 10000) || (!positive_number.test(money))) {
            callback(new Error('满额条件请输入10000以内的正数'))
          } else if ((deduction < 1 || deduction > 10000) || (!positive_integer.test(deduction))) {
            callback(new Error('优惠金额请输入10000以内的正整数'))
          } else if (money <= deduction) {
            callback(new Error('优惠金额应小于满额条件，请重新输入'))
          } else {
            callback()
          }
        } else {
          const piece = Number(_this.$refs.satisfyDeductionRule_satisfyPiece[0].value)
          const deduction = Number(_this.$refs.satisfyDeductionRule_deduction[0].value)
          if ((piece < 1 || piece > 10000) || (!positive_integer.test(piece))) {
            callback(new Error('满额条件请输入10000以内的正整数'))
          } else if ((deduction < 1 || deduction > 10000) || (!positive_integer.test(deduction))) {
            callback(new Error('优惠金额请输入10000以内的正整数'))
          } else {
            callback()
          }
        }
      } else {
        if (_this.form.satisfyDeductionRule.unitType === 'MONEY') {
          const money = Number(_this.$refs.satisfyDeductionRule_satisfyMoney[0].value)
          const deduction = Number(_this.$refs.satisfyDeductionRule_deduction[0].value)
          const upperLimitMoney = Number(_this.$refs.satisfyDeductionRule_upperLimitMoney[0].value)
          if ((money < 0.01 || money > 10000) || (!positive_number.test(money))) {
            callback(new Error('满额条件请输入10000以内的正数'))
          } else if ((deduction < 1 || deduction >= 10) || (!positive_flo.test(deduction))) {
            callback(new Error('折扣请输入1-9.9之间的正数'))
          } else if ((upperLimitMoney < 1 || upperLimitMoney > 10000) || (!positive_integer.test(upperLimitMoney))) {
            callback(new Error('优惠请输入10000以内的正整数'))
          // } else if (money <= upperLimitMoney) {
          //   callback(new Error('满额条件必须大于优惠金额'))
          } else {
            callback()
          }
        } else {
          const piece = Number(_this.$refs.satisfyDeductionRule_satisfyPiece[0].value)
          const deduction = Number(_this.$refs.satisfyDeductionRule_deduction[0].value)
          const upperLimitMoney = Number(_this.$refs.satisfyDeductionRule_upperLimitMoney[0].value)
          if ((piece < 1 || piece > 10000) || (!positive_integer.test(piece))) {
            callback(new Error('满额条件请输入10000以内的正整数'))
          } else if ((deduction < 1 || deduction >= 10) || (!positive_flo.test(deduction))) {
            callback(new Error('折扣请输入1-9.9之间的正数'))
          } else if ((upperLimitMoney < 1 || upperLimitMoney > 10000) || (!positive_integer.test(upperLimitMoney))) {
            callback(new Error('优惠请输入10000以内的正整数'))
          } else {
            callback()
          }
        }
      }
    }
    if (value === 'STEP_DEDUCTION') {
      // 每满减
      // stepDeductionRule_stepForPiece;stepDeductionRule_stepForMoney;stepDeductionRule_money;stepDeductionRule_upperLimitMoney
      if (_this.form.stepDeductionRule.unitType === 'MONEY') {
        let stepForMoney = Number(_this.$refs.stepDeductionRule_stepForMoney.value)
        let money = Number(_this.$refs.stepDeductionRule_money.value)
        let upperLimitMoney = Number(_this.$refs.stepDeductionRule_upperLimitMoney.value)
        if ((stepForMoney < 0.01 || stepForMoney > 10000) || (!positive_number.test(stepForMoney))) {
          callback(new Error('满金额请输入10000以内的正数'))
        } else if ((money < 1 || money > 10000) || (!positive_integer.test(money))) {
          callback(new Error('优惠请输入10000以内的正整数'))
        } else if (stepForMoney <= money) {
          callback(new Error('优惠金额应小于满额条件，请重新输入'))
        } else if ((upperLimitMoney < 1 || upperLimitMoney > 10000) || (!positive_integer.test(upperLimitMoney))) {
          callback(new Error('优惠上限请输入10000以内的正整数'))
        } else if (money > upperLimitMoney) {
          callback(new Error('优惠上限应大于等于优惠金额，请重新输入'))
        } else {
          callback()
        }
      } else {
        let stepForPiece = Number(_this.$refs.stepDeductionRule_stepForPiece.value)
        let money = Number(_this.$refs.stepDeductionRule_money.value)
        let upperLimitMoney = Number(_this.$refs.stepDeductionRule_upperLimitMoney.value)
        if ((stepForPiece < 0.01 || stepForPiece > 10000) || (!positive_integer.test(stepForPiece))) {
          callback(new Error('满件数请输入10000以内的正整数'))
        } else if ((money < 1 || money > 10000) || (!positive_integer.test(money))) {
          callback(new Error('优惠请输入10000以内的正整数'))
        } else if ((upperLimitMoney < 1 || upperLimitMoney > 10000) || (!positive_integer.test(upperLimitMoney))) {
          callback(new Error('优惠上限请输入10000以内的正整数'))
        } else if (money > upperLimitMoney) {
          callback(new Error('优惠上限应大于等于优惠金额，请重新输入'))
        } else {
          callback()
        }
      }
    }
  }
  let availableTimeType = (rule, value, callback) => {
    if (_this.form.availableTimeSetting.availableTimeType === 'FIXED_TIME_PERIOD') {
      let fixedTimeList = _this.$refs.availableTimeSetting_fixedTimeList.value
      if (!(fixedTimeList[0] && fixedTimeList[1])) {
        callback(new Error('请选择固定时间段'))
      } else {
        callback()
      }
    } else if (_this.form.availableTimeSetting.availableTimeType === 'FIXED_DURATION') {
      let fixedDurationNum = Number(_this.$refs.availableTimeSetting_fixedDurationNum.value)
      if ((fixedDurationNum < 1 || fixedDurationNum > 999999) || (!positive_integer.test(fixedDurationNum))) {
        callback(new Error('请输入1-999999之间的正整数'))
      } else {
        callback()
      }
    } else {
      let timeUnit = _this.$refs.availableTimeSetting_timeUnit.value
      if (!timeUnit) {
        callback(new Error('请选择固定周期'))
      } else {
        callback()
      }
    }
  }
  let ratioForPlatform = (rule, value, callback) => {
    if ((value < 0 || value > 100) || (!positive_bai.test(value))) {
      callback(new Error('请输入0-100之间的正整数'))
    } else {
      callback()
    }
  }
  let sceneSetting = (rule, value, callback) => {
    if (!value.sceneType) {
      callback(new Error('请选择投放目标'))
    } else {
      callback()
    }
  }
  let shopSetlected = (rule, value, callback) => {
    if (value.usableType === 'ALL') {
      callback()
    } else if (value.usableType === 'USABLE' || value.usableType === 'UNUSABLE') {
      if (value.shopTypeList.length > 0 || value.areaList.length > 0 || value.shopCodeList.length > 0) {
        callback()
      } else {
        callback(new Error('请选择适用门店'))
      }
    } else {
      callback(new Error('请选择适用门店'))
    }
  }
  let commoditySelected = (rule, value, callback) => {
    if (value.usableType === 'ALL') {
      callback()
    } else if (value.usableType === 'USABLE' || value.usableType === 'UNUSABLE') {
      if (value.categoryIdList.length > 0 || value.commodityNoList.length > 0) {
        callback()
      } else {
        callback(new Error('请选择适用商品'))
      }
    } else {
      callback(new Error('请选择适用商品'))
    }
  }
  let channelTypeSet = (rule, value, callback) => {
    if (_this.form.sceneSetting.sceneType === 'COLLECTION_CENTER') {
      if (!value.length > 0) {
        callback(new Error('请选择投放范围'))
      } else {
        callback()
      }
    } else {
      callback()
    }
  }
  let launchNum = (rule, value, callback) => {
    if (_this.$route.query.type === 'release') { // 发布编辑，验证数量只增不减
      if ((value < 1 || value > 1000000) || (!positive_integer.test(value))) {
        callback(new Error('请输入发放1000000内的发放总数'))
      } else if (_this.releaseForm.sceneSetting.launchNum > value) {
        callback(new Error('发放数量不能减少，请重新输入'))
      } else {
        callback()
      }
    } else {
      if ((value < 1 || value > 1000000) || (!positive_integer.test(value))) {
        callback(new Error('请输入发放1000000内的发放总数'))
      } else {
        callback()
      }
    }
  }
  let singleUserLimitNum = (rule, value, callback) => {
    if (_this.$route.query.type === 'release') { // 发布编辑，验证数量只增不减
      if ((value < 1 || value > 1000000) || (!positive_integer.test(value))) {
        callback(new Error('请输入发放1000000内的单用户可领数量'))
      } else if (_this.releaseForm.sceneSetting.singleUserLimitNum > value) {
        callback(new Error('单用户可领取数量不能减少，请重新输入'))
      } else {
        callback()
      }
    } else {
      if ((value < 1 || value > 1000000) || (!positive_integer.test(value))) {
        callback(new Error('请输入发放1000000内的单用户可领数量'))
      } else {
        if (Number(_this.form.sceneSetting.launchNum) < Number(value)) {
          callback(new Error('单用户可领数量必须小于发放总数'))
        } else {
          callback()
        }
      }
    }
  }
  let receiveTimeList = (rule, value, callback) => {
    if (_this.form.availableTimeSetting.availableTimeType === 'FIXED_TIME_PERIOD') {
      if (new Date(value[1]).getTime() <= new Date(_this.form.availableTimeSetting.fixedTimeList[1])) {
        callback()
      } else {
        callback(new Error('领券时间必须早于优惠券可用时间'))
      }
    } else {
      callback()
    }
  }

  rules.businessTypeSet = [
    { required: true, validator: businessTypeSet }
  ]
  rules.deductionType = [
    { required: true, validator: deductionType_money }
  ]
  rules.availableTimeType = [
    { required: true, validator: availableTimeType }
  ]
  rules.ratioForPlatform = [
    { required: true, validator: ratioForPlatform }
  ]
  rules.sceneSetting = [
    { required: true, validator: sceneSetting }
  ]
  rules.shopSetlected = [
    { required: true, validator: shopSetlected }
  ]
  rules.commoditySelected = [
    { required: true, validator: commoditySelected }
  ]
  rules.channelTypeSet = [
    { required: true, validator: channelTypeSet }
  ]
  rules.launchNum = [
    { required: true, validator: launchNum }
  ]
  rules.singleUserLimitNum = [
    { required: true, validator: singleUserLimitNum }
  ]
  rules.receiveTimeList = [
    { type: 'array', required: true, message: '请选择领券时间', trigger: 'blur' },
    { validator: receiveTimeList }
  ]

  return rules
}

export default rulesFn
