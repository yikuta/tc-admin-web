import VueAMap from 'vue-amap'

export default {
  install: (Vue) => {
    Vue.use(VueAMap)
    VueAMap.initAMapApiLoader({
      key: '90b1f9a4e2fbe0542373f5e548fd5e56', // 中台高德key
      plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.Geolocation', 'AMap.Geocoder', 'AMap.AMapManager', 'AMap.Marker', 'AMap.PositionPicker'],
      uiVersion: '1.1', // ui组件库版本
      v: '1.4.15' // 高德地图JavaScript API的版本
    })
  }
}
