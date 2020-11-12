import request, { Method } from '@/utils/request'
// 基础分类列表-- 商品发布
export function getBaseCategoryList(params) {
  return request({
    url: '/api/web/commodity/baseCategory/querySubCategories',
    method: Method.GET,
    params
  })
}
// 搜索分类
export function queryBaseCategory(data) {
  return request({
    url: '/api/web/commodity/baseCategory/queryBaseCategoryList',
    method: Method.GET,
    params: data
  })
}
// 添加基础分类
export function addBaseCategory(data) {
  return request({
    url: '/api/web/commodity/baseCategory/addBaseCategory',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 编辑基础分类
export function updateBaseCategory(data) {
  return request({
    url: '/api/web/commodity/baseCategory/updateBaseCategory',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 启、停基础分类
export function updateBaseCategoryStatus(data) {
  return request({
    url: '/api/web/commodity/baseCategory/enableCategory',
    method: Method.POST,
    data
  })
}
// 删除基础分类
export function deleteBaseCategory(id) {
  return request({
    url: `/api/web/commodity/baseCategory/deleteBaseCategory/${id}`,
    method: Method.DELETE
  })
}
// 查询基础参数列表
export function getBaseParamsList(data) {
  return request({
    url: '/api/web/commodity/baseParamOption/query',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 添加基础参数列表
export function asyncBaseParamsAdd(data) {
  return request({
    url: '/api/web/commodity/baseParamOption/addBaseParamOption',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 编辑基础参数列表
export function asyncBaseParamsUpdate(data) {
  return request({
    url: '/api/web/commodity/baseParamOption/updateBaseParamOption',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 根据id查询基础参数
export function findBaseParamsById(id) {
  return request({
    url: `/api/web/commodity/baseParamOption/findById/${id}`,
    method: Method.GET
  })
}
// 停用/启用基础参数
export function asyncBaseParamsEnable(params) {
  return request({
    url: '/api/web/commodity/baseParamOption/enable',
    method: Method.POST,
    params,
    data: {}
  })
}
// 查询分类下参数组列表
export function findBaseParamGroup(id) {
  return request({
    url: '/api/web/commodity/baseCategory/queryBaseParamGroupByCategoryId?id=' + id,
    method: Method.GET
  })
}
// 更新分类参数组
export function updateBaseParamGroupName({ id, name }) {
  return request({
    url: '/api/web/commodity/baseCategory/updateBaseParamGroupName',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: { id, name }
  })
}
// 分类添加参数组
export function addBaseParamGroup({ baseCategoryId, name, sort }) {
  return request({
    url: '/api/web/commodity/baseCategory/addBaseParamGroup',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: { baseCategoryId, name, sort }
  })
}
// 删除分类参数组
export function delBaseParamGroup(id) {
  return request({
    url: `/api/web/commodity/baseCategory/delBaseParamGroup?id=${id}`,
    method: Method.DELETE
  })
}
// 分类参数组排序
export function asyncBaseCategorySort({ id, sort, baseCategoryId }) {
  return request({
    url: '/api/web/commodity/baseCategory/sort',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    params: { id, sort, baseCategoryId }
  })
}
// 参数组添加基础参数
export function addBaseParamOptionToCategory({ baseParamGroupId, baseParamOptionIds, sorts }) {
  return request({
    url: '/api/web/commodity/baseCategory/addBaseParamOptionToCategory',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data: { baseParamGroupId, baseParamOptionIds, sorts }
  })
}
// 删除参数组的参数选项
export function deleteParamGroupOption({ paramGroupId, id }) {
  return request({
    url: '/api/web/commodity/baseCategory/deleteParamGroupOption',
    method: Method.DELETE,
    params: { paramGroupId, id }
  })
}
// 参数组参数排序
export function paramGroupOptionSort({ paramGroupId, sourceId, targetId }) {
  return request({
    url: '/api/web/commodity/baseCategory/paramGroupOptionSort',
    method: Method.GET,
    params: { paramGroupId, sourceId, targetId }
  })
}
// 查询基础规格信息列表
export function fetchBaseSpecificationList(data) {
  return request({
    url: '/api/web/commodity/baseSpecification/query',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 添加基础规格
export function asyncBaseSpecsAdd(data) {
  return request({
    url: '/api/web/commodity/baseSpecification/add',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 修改基础规格信息
export function asyncBaseSpecsUpdate(data) {
  return request({
    url: '/api/web/commodity/baseSpecification/update',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 查询指定规格组编号的信息
export function findBaseSpecsById(id) {
  return request({
    url: `/api/web/commodity/baseSpecification/findById/${id}`,
    method: Method.GET
  })
}
// 停用/启用基础规格
export function asyncBaseSpecsEnable(data) {
  return request({
    url: '/api/web/commodity/baseSpecification/enable',
    method: Method.POST,
    data
  })
}
// 根据分类id查询分类下的规格组
export function findBaseCategorySpecification(baseCategoryId) {
  return request({
    url: '/api/web/commodity/baseCategory/findBaseCategorySpecification/list',
    method: Method.GET,
    params: { baseCategoryId }
  })
}
// 分类添加规格组
export function addBaseCategorySpecification(data) {
  return request({
    url: '/api/web/commodity/baseCategory/addBaseCategorySpecification',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 分类规格组保存规格值
export function addSpecificationValue(data) {
  return request({
    url: '/api/web/commodity/baseCategory/addSpecificationValue',
    headers: { 'Content-Type': 'application/json' },
    method: Method.POST,
    data
  })
}
// 删除分类规格组
export function delCategorySpecificationById(id) {
  return request({
    url: '/api/web/commodity/baseCategory/delCategorySpecificationById?baseCategorySpecificationId=' + id,
    method: Method.DELETE
  })
}
// 分类规格组排序
export function asyncBaseSpecificationCategorySort({ baseCategoryId, sourceId, targetId }) {
  return request({
    url: '/api/web/commodity/baseCategory/categorySpecificationSort',
    method: Method.GET,
    params: { baseCategoryId, sourceId, targetId }
  })
}
// 根据分类id查询分类信息
export function findBaseCategoryById(params) {
  return request({
    url: `/api/web/commodity/baseCategory/findById/${params.id}`,
    method: Method.GET,
    params
  })
}
