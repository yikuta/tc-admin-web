import request, { Method } from '@/utils/request'

// 组织结构
export function fetchDepartmentsList(data) {
  return request({
    url: '/api/web/account/department/loadList',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 查询组织结构
export function searchDepartmentsList(data) {
  return request({
    url: '/api/web/account/department/search',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data: data
  })
}

// 查询部门分类
export function fetchDepartmentCategories(data) {
  return request({
    url: '/api/web/account/department/findClassifyTypes',
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' },
    params: data
  })
}

// 启用部门接口
export function enableDepartment(data) {
  return request({
    url: `/api/web/account/department/enableDepartment/${data.id}`,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 禁用部门接口
export function disableDepartment(data) {
  return request({
    url: `/api/web/account/department/disableDepartment/${data.id}`,
    method: Method.GET,
    noErrorToast: true,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 添加部门
export function addDepartment(data) {
  return request({
    url: '/api/web/account/department/add',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 编辑部门
export function updateDepartment(data) {
  return request({
    url: '/api/web/account/department/update',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 删除部门
export function deleteDepartment(data) {
  return request({
    url: '/api/web/account/department/delete/' + data.id,
    noErrorToast: true,
    method: Method.DELETE
  })
}

// 查询人员
export function fetchMembersListByDepartment(data) {
  return request({
    url: '/api/web/account/user/loadPage',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 用户管理模块查询组织结构
export function fetchUserDepartment(data) {
  return request({
    url: '/api/web/account/user/loadDepartments',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 添加人员
export function addMember(data) {
  return request({
    url: '/api/web/account/user/add',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 编辑人员
export function updateMember(data) {
  return request({
    url: '/api/web/account/user/update',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 删除人员
export function deleteMember(data) {
  return request({
    url: '/api/web/account/user/delete/' + data.id,
    method: Method.DELETE,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 停用人员
export function disableMember(data) {
  return request({
    url: '/api/web/account/user/disableUser/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 启用人员
export function enableMember(data) {
  return request({
    url: '/api/web/account/user/enableUser/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 查询角色列表
export function fetchRoles(data) {
  return request({
    url: '/api/web/account/role/loadPage/',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 启用角色
export function enableRole(data) {
  return request({
    url: '/api/web/account/role/enableRole/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 禁用角色
export function disableRole(data) {
  return request({
    url: '/api/web/account/role/disableRole/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 删除角色
export function deleteRole(data) {
  return request({
    url: '/api/web/account/role/delete/' + data.id,
    method: Method.DELETE
  })
}

// 查询用户角色
export function fetchUserRoles(data) {
  return request({
    url: '/api/web/account/user/findUserRoles/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 保存用户角色配置
export function updateUserRole(data) {
  return request({
    url: '/api/web/account/user/saveUserRole',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 添加角色
export function addRole(data) {
  return request({
    url: '/api/web/account/role/add',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 编辑角色
export function updateRole(data) {
  return request({
    url: '/api/web/account/role/update',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 根据角色获取权限
export function fetchRolesAuth(data) {
  return request({
    url: '/api/web/account/role/findRoleAuths/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 编辑角色权限
export function updateRoleAuth(data) {
  return request({
    url: '/api/web/account/role/saveRoleAuth',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 获取菜单列表
export function fetchMenuList(data) {
  return request({
    url: '/api/web/account/permission/loadList',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 添加菜单
export function addPermission(data) {
  return request({
    url: '/api/web/account/permission/add',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 删除菜单
export function deletePermission(data) {
  return request({
    url: '/api/web/account/permission/delete/' + data.id,
    method: Method.DELETE,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 查询单个详情
export function fetchPermissionDetail(data) {
  return request({
    url: '/api/web/account/permission/findPermision/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 根据id查询绑定角色
export function fetchRolesByPermId(data) {
  return request({
    url: '/api/web/account/permission/findBindRoles/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 编辑菜单
export function updatePermission(data) {
  return request({
    url: '/api/web/account/permission/update',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 人员管理日志
export function fetchUserLogs(data) {
  return request({
    url: '/api/web/account/user/loadLogs',
    method: Method.POST,
    headers: { 'Content-Type': 'application/json' },
    data
  })
}

// 启用菜单权限
export function enablePermission(data) {
  return request({
    url: '/api/web/account/permission/enablePermission/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}

// 禁用菜单权限
export function disablePermission(data) {
  return request({
    url: '/api/web/account/permission/disablePermission/' + data.id,
    method: Method.GET,
    headers: { 'Content-Type': 'application/json' }
  })
}
