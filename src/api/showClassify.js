import request, { Method } from '@/utils/request'
/**
 * @description: 获取指定父级编号的渠道分类列表
 * @param {parentId}
 * @return:
 */
export function getChannelCategoryList({ parentId, businessNo, disabled }) {
  return request({
    url: '/api/web/commodity/channel/category/findSub',
    method: Method.GET,
    params: { parentId, businessNo, disabled }
  })
}
// 添加渠道分类
export function addChannelCategory(data) {
  return request({
    url: '/api/web/commodity/channel/category/add',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 编辑渠道分类
export function updateChannelCategory(data) {
  return request({
    url: '/api/web/commodity/channel/category/update',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 启 / 停渠道分类
export function updateChannelCategoryStatus(data) {
  return request({
    url: '/api/web/commodity/channel/category/changeStatus',
    method: Method.POST,
    data
  })
}
// 删除渠道分类
export function deleteChannelCategory(id) {
  return request({
    url: `/api/web/commodity/channel/category/delete/${id}`,
    method: Method.DELETE
  })
}

