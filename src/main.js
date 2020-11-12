/*
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-31 10:30:08
 * @LastEditTime: 2020-09-16 11:30:30
 * @LastEditors: Joker
 */
import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'

import 'font-awesome/css/font-awesome.min.css'
import '@/styles/index.scss' // global css

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon, FontAwesomeLayers, FontAwesomeLayersText } from '@fortawesome/vue-fontawesome'
library.add(fas, far)
Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('font-awesome-layers', FontAwesomeLayers)
Vue.component('font-awesome-layers-text', FontAwesomeLayersText)

Vue.config.productionTip = false

import App from './App'
import store from './store'
// require('./mock/mock')
// require('./mock/test')

import directives from './directives'
import '@/icons' // icon
import filters from './filters' // 添加全局过滤器
import mixins from './mixins'
import Map from './components/Map'
import router from './router'
import '@/directives/hasPermission'

Vue.use(Map)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.use(directives)
Vue.use(mixins)

Vue.use(Element, { locale })
Vue.use(VCharts)

Vue.config.productionTip = false
Vue.config.warnHandler = (msg) => {
  if (!msg.includes('Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders.')) {
    return console.warn && console.warn(msg)  // eslint-disable-line
  }
}

console.warn({// eslint-disable-line
  mabu: '1.0.3',
  zhu: '1.0.0'
})
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
