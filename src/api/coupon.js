import request, { Method } from '@/utils/request'
// import qs from 'qs'

/**
 * @description: 优惠券列表
 */
export const reqCouponList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/query',
    method: Method.POST,
    data
  })
}

/**
 * @description: 新建满减券
 */
export const reqAddFullReduction = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/fullReduction/add',
    method: Method.POST,
    data
  })
}
/**
 * @description: 更新满减券
 */
export const reqUpdateFullReduction = (data = {}, query) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/fullReduction/update/' + query,
    method: Method.POST,
    data
  })
}

/**
 * @description: 新建折扣券
 */
export const reqAddDiscount = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/discount/add',
    method: Method.POST,
    data
  })
}
/**
 * @description: 更新折扣券
 */
export const reqUpdateDiscount = (data = {}, query) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/discount/update/' + query,
    method: Method.POST,
    data
  })
}

/**
 * @description: 优惠券提交审核
 */
export const reqAddAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/addAudit',
    method: Method.POST,
    data
  })
}

/**
 * @description: 优惠券作废
 */
export const reqInvalid = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/invalid',
    method: Method.POST,
    params: data
  })
}
/**
 * @description: 优惠券删除
 */
export const reqDeleteCoupon = (data = {}) => {
  return request({
    // headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/delete/' + data.couponCode,
    method: Method.DELETE
    // params: data
  })
}

/**
 * @description: 优惠券info
 */
export const reqFindByCouponCode = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/findByCouponCode',
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 优惠券适用门店info
 */
export const reqShopSetting = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/getShopSetting',
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 优惠券适用商品info
 */
export const reqGoodsSetting = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/getCommoditySetting',
    method: Method.GET,
    params: data
  })
}

/**
 * @description: 优惠券领取详情
 */
export const reqReceiveQuery = (data = {}, query) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/receiveQuery/' + query,
    method: Method.POST,
    data
  })
}

/**
 * @description: 优惠券审核列表
 */
export const reqQueryAuditList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/queryAudit',
    method: Method.POST,
    data
  })
}
/**
 * @description: 优惠券审核操作
 */
export const reqBatchAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/batchAudit',
    method: Method.POST,
    data
  })
}

/**
 * @description: 门店类型
 */
export const reqShopTypeAll = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/boss/shop/findDataListByCode?code=shop_code_type',
    method: Method.GET,
    data
  })
}
/**
 * @description: 商品全部类型
 */
export const reqCategoryAll = (data = {}) => {
  return request({
    // headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/category/findAll',
    method: Method.POST,
    data
  })
}

/**
 * @description: 商品列表
 */
export const reqGoodsList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/commodity/channel/query/page',
    method: Method.POST,
    data
  })
}

/**
 * @description: 优惠券审核发起人模糊搜索
 */
export const reqUserList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/account/user/loadPage',
    method: Method.POST,
    data
  })
}

/**
 * @description: 人工发券列表
 */
export const reqQueueList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/query',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取队列信息
 */
export const reqQueueInfo = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/findByQueueCode',
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 获取队列信息
 */
export const reqQueueDetails = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/sendQuery',
    method: Method.POST,
    data
  })
}
/**
 * @description: 导出队列发放信息
 */
export const reqExportQueueRecord = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/exportRecord',
    method: Method.POST,
    responseType: 'arraybuffer',
    noErrorToast: true,
    data
  })
}

/**
 * @description: 人工发券提交审核
 */
export const reqAddQueueAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/addAudit',
    method: Method.POST,
    data
  })
}
/**
 * @description: 人工发券删除
 */
export const reqDeleteQueue = (data) => {
  return request({
    // headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/delete/' + data,
    method: Method.DELETE
  })
}
/**
 * @description: 人工发券执行
 */
export const reqQueueExecute = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/execute?queueCode=' + data,
    method: Method.POST,
    data: {}
  })
}
/**
 * @description: 人工发券审核列表
 */
export const reqQueueAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/queryAudit',
    method: Method.POST,
    data
  })
}
/**
 * @description: 人工发券审核列表
 */
export const reqQueueBatchAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/batchAudit',
    method: Method.POST,
    data
  })
}
/**
 * @description: 新增队列查询可用优惠券
 */
export const reqCouponOptional = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/getCouponOptional',
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 新增队列查询可用优惠券
 */
export const reqDownloadMemberTemplate = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/downloadMemberTemplate',
    method: Method.GET,
    responseType: 'arraybuffer',
    noErrorToast: true,
    params: data
  })
}
/**
 * @description: 用户范围上传接口
 */
export const reqImportMemberList = (data = {}, params = {}) => {
  return request({
    // headers: { 'Content-Type': 'application/json' },
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    url: '/api/web/promote/couponQueue/importMemberList/' + params.identifier,
    method: Method.POST,
    data,
    setConfig: {
      formData: true
    }
  })
}
/**
 * @description: 保存队列
 */
export const reqCreateCouponOptional = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/create',
    method: Method.POST,
    data
  })
}
/**
 * @description: 保存队列
 */
export const reqUpdateQueue = (data = {}, queuCode) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/update/' + queuCode,
    method: Method.POST,
    data
  })
}
/**
 * @description: 人工发券审核列表
 */
export const reqQueueAuditList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/couponQueue/queryList',
    method: Method.POST,
    data
  })
}

/**
 * @description: 领券中心统计
 */
export const reqCollectionCenterCollect = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/collectionCenter/collect',
    method: Method.GET,
    data
  })
}
/**
 * @description: 领券中心投放列表
 */
export const reqCollectionCenterQueryNewPeople = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/collectionCenter/deliverManagement',
    method: Method.POST,
    data
  })
}
/**
 * @description: 领券中心参与记录
 */
export const reqCollectionCenterReceiveQuery = (data = {}, channelType) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/collectionCenter/receiveQuery/' + channelType,
    method: Method.POST,
    data
  })
}

/**
 * @description: 新人礼统计GET /api/web/promote/orderActivity/getCouponOptional
 */
export const reqNewPeopleCouponCollect = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/newPeople/collect',
    method: Method.GET,
    data
  })
}
/**
 * @description: 新人礼投放列表
 */
export const reqNewPeopleCouponQueryNewPeople = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/newPeople/deliverManagement',
    method: Method.POST,
    data
  })
}
/**
 * @description: 新人礼投放列表
 */
export const reqNewPeopleCouponReceiveQuery = (data = {}, channelType) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/newPeople/receiveQuery/' + channelType,
    method: Method.POST,
    data
  })
}

// 购物活动相关
/**
 * @description: 活动列表
 */
export const reqActivityList = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/query',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取满赠活动优惠券列表
 */
export const reqActivityCouponOptional = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/getCouponOptional',
    method: Method.GET,
    data
  })
}
/**
 * @description: 新建满减活动
 */
export const reqActivityAdd = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/add',
    method: Method.POST,
    data
  })
}
/**
 * @description: 编辑满减活动
 */
export const reqActivityUpdate = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/update',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取活动详情
 */
export const reqActivityGetDetails = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/findById',
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 获取活动门店列表
 */
export const reqGetShopSetting = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/getShopSetting',
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 获取活动商品列表
 */
export const reqGetCommoditySetting = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/getCommoditySetting',
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 提交审核/作废
 */
export const reqSubmitAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/submitAudit',
    method: Method.POST,
    params: data
  })
}
/**
 * @description: 满赠活动列表删除
 */
export const reqOrderActivityQueue = (data) => {
  return request({
    // headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/delete?orderActivityId=' + data,
    method: Method.DELETE
  })
}
/**
 * @description: 获取活动审核列表
 */
export const reqOrderActivityAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/queryAudit',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取活动审核列表-批量审核
 */
export const reqOrderActivityBatchAudit = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/batchAudit',
    method: Method.POST,
    data
  })
}

/**
 * @description: 获取商家优惠券列表
 */
export const reqQueryShopCoupon = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/queryShopCoupon',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取活动参与列表
 */
export const reqOrderActivityReceive = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/findDetail',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取活动参与详情头部信息
 */
export const reqOrderActivityStatistics = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/orderActivity/statistics',
    method: Method.GET,
    params: data
  })
}

// 拼团活动
/**
 * @description: 获取拼团活动列表
 */
export const reqGroupBuyActivityList = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/query',
    method: Method.POST,
    data
  })
}
/**
 * @description: 拼团活动列表提交审核
 */
export const reqGroupBuyActivitySubmitAudit = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/submitAudit',
    method: Method.POST,
    params: data
  })
}
/**
 * @description: 拼团活动列表删除
 */
export const reqGroupBuyActivityQueue = (data) => {
  return request({
    // headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/delete?groupBuyActivityId=' + data,
    method: Method.DELETE
  })
}
/**
 * @description: 新增拼团活动
 */
export const reqGroupBuyActivityAdd = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/add',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取拼团活动详细信息
 */
export const reqGroupBuyActivityInfo = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/findById',
    method: Method.GET,
    params: data
  })
}
/**
 * @description: 编辑拼团活动
 */
export const reqGroupBuyActivityUpdate = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/update',
    method: Method.POST,
    data
  })
}
/**
 * @description: 拼团活动审核列表PO
 */
export const reqGroupBuyActivityAuditList = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/queryAudit',
    method: Method.POST,
    data
  })
}
/**
 * @description: 发起、参与记录
 */
export const reqGroupBuyActivityQueryRecords = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/queryRecords',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取活动参与详情头部信息
 */
export const reqGroupBuyActivityStatistics = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/groupBuyActivity/statistics',
    method: Method.GET,
    params: data
  })
}

/**
 * @description: 邀请有礼领取列表
 */
export const reqInviteRecordList = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/invite/list/inviteRecord',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取邀请有礼规则
 */
export const reqCouponRuleDetail = () => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/invite/query/couponRuleDetail',
    method: Method.GET
    // params: data
  })
}
/**
 * @description: 邀请有礼规则保存
 */
export const reqSaveCouponRule = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/invite/save/couponRule',
    method: Method.POST,
    data
  })
}
/**
 * @description: 获取邀请有礼优惠券列表
 */
export const reqInviteCouponList = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/promote/coupon/invite/query/couponList',
    method: Method.POST,
    data
  })
}
