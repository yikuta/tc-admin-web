import { findAll } from '@/api/common'

function filterEmptyNode(data) {
  data.forEach(item => {
    if (!item.children || !item.children.length) {
      Reflect.deleteProperty(item, 'children')
    } else {
      filterEmptyNode(item.children)
    }
  })
}

const global = {
  state: {
    areaList: [] // 地区数据，三联级
  },

  mutations: {
    SET_AREA_LIST: (state, areaList) => {
      state.areaList = areaList
    }
  },

  actions: {
    getAreaList(context) {
      findAll().then(res => {
        if (res.code === 200) {
          filterEmptyNode(res.result)
          context.commit('SET_AREA_LIST', res.result)
        }
      })
    }
  }
}

export default global
