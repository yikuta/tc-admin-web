/**
 * @description: el-table 无限滚动加载指令
 */
export default {
  name: 'table-infinite-scroll',
  inserted: function(el, binding) {
    const cb = binding.value
    const onScroll = debounce(cb)
    el[scope] = { onScroll }
    el.querySelector('.el-table__body-wrapper,.is-scrolling-none').addEventListener('scroll', onScroll)
  },
  unbind: function(el) {
    const { onScroll } = el[scope]
    el.querySelector('.el-table__body-wrapper,.is-scrolling-none').removeEventListener('scroll', onScroll)
  }
}

const scope = 'tableInfiniteScroll'
const threshold = 0 // 触发加载的距离阈值

function debounce(callback) {
  let debounceId = ''
  return function(event) {
    if (debounceId) return
    debounceId = setTimeout(() => {
      const el = event.target
      if (el.scrollHeight - el.scrollTop - el.clientHeight <= threshold) {
        callback()
      }
      debounceId = ''
    }, 300)
  }
}
