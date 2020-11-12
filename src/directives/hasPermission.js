/*
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-29 14:06:37
 * @LastEditTime: 2020-09-15 15:12:43
 * @LastEditors: Joker
 */

import Vue from 'vue'
import store from '@/store'
// 权限指令
Vue.directive('np', {
  inserted: function(el, binding) {
    // if (el.parentNode && Vue.prototype.$_np(binding.value)) {
    //   // 从父节点删除无权限按钮
    //   el.parentNode.removeChild(el)
    // }
  }
})
// 权限检查方法
Vue.prototype.$_np = function(value) {
  let flag = true
  let role = store.state.permission.buttonPermission // 按钮权限
  // 权限列表
  if (typeof value === 'object') {
    // 如果是数组，就要循环
    value.forEach(item => {
      if (role.includes(item)) {
        // 表示有权限
        flag = false
      }
    })
  } else {
    if (role.includes(value)) {
      // 表示有权限
      flag = false
    }
  }
  return flag
}
