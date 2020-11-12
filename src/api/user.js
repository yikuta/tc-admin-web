import request, {
  Method
} from '@/utils/request'

/**
 * @description: 查询用户列表分页
 */
export const reqUserList = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/detail/list',
    method: Method.POST,
    data
  })
}

/**
 * @description: 用户详情
 */
export const reqUserDetail = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/detail/information',
    method: Method.POST,
    data
  })
}
/**
 * @description: 会员浏览记录
 */
export const fetchMemberRecord = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/productbrowsing/detail/record',
    method: Method.POST,
    data
  })
}
/**
 * @description: 会员详情地址列表
 */
export const fetchMemberAddressList = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/address/list',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询灰黑名单列表-中台
 */
export const fetchBlackList = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/blacklist/findBlackLists',
    method: Method.POST,
    data
  })
}
/**
 * @description: 添加灰黑名单-中台
 */
export const asyncBlackAdd = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/blacklist/addBlackList',
    method: Method.POST,
    data
  })
}
/**
 * @description: 移除灰黑名单-中台
 */
export const asyncBlackRemove = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/blacklist/removeBlackList',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询黑名单设置(数据回显)-中台
 */
export const fetchBlackDetail = () => {
  return request({
    url: '/api/web/member/blacklist/findBlacklisSettingInfo',
    method: Method.GET
  })
}
/**
 * @description: 查询灰名单设置(数据回显)-中台
 */
export const fetchGreyDetail = () => {
  return request({
    url: '/api/web/member/blacklist/findGreylisSettingInfo',
    method: Method.GET
  })
}
/**
 * @description: 灰黑名单设置-中台
 */
export const asyncBlacklisSetting = (data) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/blacklist/blacklisSetting',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询用户收藏商品记录列表-中台
 */
export const fetchProductCollectList = (data) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/productCollect/findProductCollectList',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询用户收藏门店列表-中台
 */
export const fetchShopCollectList = (data) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/shopCollect/findShopCollectList',
    method: Method.POST,
    data
  })
}
/**
 * @description: 查询用户收藏菜谱列表-中台
 */
export const fetchShopCollectCookBookList = (data) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/collectCookbook/getCollectCookbookList',
    method: Method.POST,
    data
  })
}
/**
 * @description: 中台回显展示用户成长值设置
 */
export const fetchGrowthInfo = () => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/grade/findGrowthInfo',
    method: Method.POST,
    data: {}
  })
}
/**
 * @description: 中台添加用户成长值设置
 */
export const asyncMemberGraderecordAdd = (data) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/grade/addMemberGraderecord',
    method: Method.POST,
    data
  })
}
/**
 * @description 获取用户积分列表
 */
export const userCreditsLog = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/promote/userIntegral/query',
    method: Method.POST,
    data
  })
}
/**
 * @description 查询用户标签配置-中台
 */
export const fetchUserLabesSetting = () => {
  return request({
    url: '/api/web/member/labelSetting/getLabelSetting',
    method: Method.GET
  })
}
/**
 * @description 查询所有的标签-中台
 */
export const fetchUserLabesList = () => {
  return request({
    url: '/api/web/member/labelSetting/getLabelList',
    method: Method.GET
  })
}
/**
 * @description  添加用户标签配置-中台
 */
export const asyncLabelSettingAdd = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/member/labelSetting/addLabelSetting',
    method: Method.POST,
    data
  })
}
/**
 * @description  查询用户可用优惠券
 */
export const fetchUserCouponList = (data = {}) => {
  return request({
    headers: {
      'Content-Type': 'application/json'
    },
    url: '/api/web/promote/coupon/couponListForC',
    method: Method.POST,
    data
  })
}

