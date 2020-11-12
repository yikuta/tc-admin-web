import request, { Method } from '@/utils/request'
/**
* @description:  工作台统计最近七天订单数据
*/
export const workbenchCountThreeOrder = (data) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/order/workbenchCountThreeOrder',
    method: Method.POST,
    data: {
      orderType: data
    }
  })
}
/**
* @description: 工作台统计当日订单数据
*/
export const workbenchCountTodayOrder = (data = {}) => {
  return request({
    headers: { 'Content-Type': 'application/json' },
    url: '/api/web/order/workbenchCountTodayOrder',
    method: Method.POST,
    data
  })
}
/**
* @description: 查询最近15天的新注册用户数统计-中台
*/
export const registerSumBy15Day = () => {
  return request({
    url: '/api/web/member/detail/registerSumBy15Day',
    method: Method.GET
  })
}
