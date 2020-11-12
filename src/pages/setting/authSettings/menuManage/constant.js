/*
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-13 15:43:58
 * @LastEditTime: 2020-09-10 17:37:03
 * @LastEditors: Joker
 */
export const menuTypes = [{
  id: 1,
  name: '目录',
  value: 'CATALOG'
}, {
  id: 2,
  name: '菜单',
  value: 'MENU'
}, {
  id: 3,
  name: '页面',
  value: 'PAGE'
}, {
  id: 4,
  name: '按钮',
  value: 'BUTTON'
}]

export const folderSubsets = {
  1: [{
    id: 1,
    name: '目录',
    value: 'CATALOG'
  }, {
    id: 2,
    name: '菜单',
    value: 'MENU'
  }, {
    id: 3,
    name: '页面',
    value: 'PAGE'
  }, {
    id: 4,
    name: '按钮',
    value: 'BUTTON'
  }],
  2: [{
    id: 1,
    name: '目录',
    value: 'CATALOG'
  }, {
    id: 2,
    name: '菜单',
    value: 'MENU'
  }, {
    id: 3,
    name: '页面',
    value: 'PAGE'
  }, {
    id: 4,
    name: '按钮',
    value: 'BUTTON'
  }],
  3: [{
    id: 1,
    name: '目录',
    value: 'CATALOG'
  }, {
    id: 2,
    name: '菜单',
    value: 'MENU'
  }, {
    id: 3,
    name: '页面',
    value: 'PAGE'
  }, {
    id: 4,
    name: '按钮',
    value: 'BUTTON'
  }],
  4: []
}

export const menuTypeMap = {
  1: '目录',
  2: '菜单',
  3: '页面',
  4: '按钮'
}

export const formRules = {
  parentIds: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
  authType: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
  name: [
    { required: true, message: '请输入菜单名称', trigger: 'blur' },
    { pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{1,19}$/, message: '2～20个字符（汉字、数字、字母、下划线）', trigger: 'blur' }
  ],
  code: [
    { required: true, message: '请输入授权标识', trigger: 'blur' },
    { pattern: /^[A-Z_]{2,50}$/, message: '授权标识仅由2～50个大写字母和下划线组成', trigger: 'blur' }
  ],
  sortNum: [{ required: true, message: '请填写排序', trigger: 'blur' }],
  icon: [{ max: 200, message: '至多200个字符', trigger: 'blur' }],
  remark: [
    { max: 200, message: '至多200个字符', trigger: 'blur' }
  ]
}
