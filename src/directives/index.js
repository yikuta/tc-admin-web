import tableInfiniteScroll from './table-infinite-scroll/main'

export default {
  install(Vue) {
    Vue.directive(tableInfiniteScroll.name, tableInfiniteScroll)
  }
}
