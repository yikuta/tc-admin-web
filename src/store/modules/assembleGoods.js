const state = {
  curBaseGoods: '', // 关联的基础商品
  curAssembleGoods: '', // 当前拼团商品
  curForm: '', // 当前需要提交的表单信息
  curSkuTable: '', // 当前需要提交的sku信息
  curGoodsDetail: '', // 当前需要提交的商品信息
  bundleMainGoods: '', // 当前套餐主商品
  bundleRetinueGoods: [], // 当前套餐搭配
  curBundleDetail: '', // 当前需要提交的套餐信息（编辑时获得）
  bundleMainGoods_Copy: '', // 当前套餐主商品（副本）
  bundleRetinueGoods_Copy: [] // 当前套餐搭配（副本）
}

const mutations = {
  // 拼团单品
  setBaseGoods(state, goods) {
    state.curBaseGoods = goods
  },
  getBaseGoods(state) {
    return state.curBaseGoods
  },
  clearBaseGoods(state) {
    state.curBaseGoods = ''
  },
  setAssembleGoods(state, goods) {
    state.curAssembleGoods = goods
  },
  getAssembleGoods(state) {
    return state.curAssembleGoods
  },
  clearAssembleGoods(state) {
    state.curAssembleGoods = ''
  },
  setSingleItemData(state, { form, skuTable, goodsDetail }) {
    state.curForm = form
    state.curSkuTable = skuTable
    state.curGoodsDetail = goodsDetail
  },
  clearSingleItemData(state) {
    state.curForm = ''
    state.curSkuTable = ''
    state.curGoodsDetail = ''
  },
  // 拼团套餐
  setBundleMainGoods(state, goods) {
    state.bundleMainGoods = goods
  },
  getBundleMainGoods(state) {
    return state.bundleMainGoods
  },
  clearBundleMainGoods(state) {
    state.bundleMainGoods = ''
  },
  setBundleMainGoods_Copy(state, goods) {
    state.bundleMainGoods_Copy = goods
  },
  getBundleMainGoods_Copy(state) {
    return state.bundleMainGoods_Copy
  },
  clearBundleMainGoods_Copy(state) {
    state.bundleMainGoods_Copy = ''
  },
  setBundleRetinueGoods(state, goods) {
    const repeatList = state.bundleRetinueGoods.filter(item => {
      for (let i of goods) {
        if ((item.baseCommodityId ? item.baseCommodityId : item.id) === i.id) {
          return true
        }
      }
      return false
    })
    repeatList.map(item => {
      state.bundleRetinueGoods.splice(state.bundleRetinueGoods.indexOf(item), 1)
    })
    state.bundleRetinueGoods = [...state.bundleRetinueGoods, ...goods]
  },
  getBundleRetinueGoods(state) {
    return state.bundleRetinueGoods
  },
  clearBundleRetinueGoods(state) {
    state.bundleRetinueGoods = []
  },
  setBundleRetinueGoods_Copy(state, goods) {
    state.bundleRetinueGoods_Copy = [...goods]
  },
  getBundleRetinueGoods_Copy(state) {
    return state.bundleRetinueGoods_Copy
  },
  clearBundleRetinueGoods_Copy(state) {
    state.bundleRetinueGoods_Copy = []
  },
  rmSingleRetinueGoods(state, goods) {
    const list = state.bundleRetinueGoods.filter(item => {
      if ((item.baseCommodityId ? item.baseCommodityId : item.id) === (goods.baseCommodityId ? goods.baseCommodityId : goods.id)) {
        return true
      }
      return false
    })
    state.bundleRetinueGoods.splice(state.bundleRetinueGoods.indexOf(list[0]), 1)
  },
  setBundleFormData(state, { form }) {
    state.curForm = form
  },
  clearBundleFormData(state) {
    state.curForm = ''
  },
  setCurBundleDetail(state, bundle) {
    state.curBundleDetail = bundle
  },
  clearCurBundleDetail(state) {
    state.curBundleDetail = ''
  }
}

const actions = {
  // 拼团单品
  setBaseGoods({ commit }, goods) {
    commit('setBaseGoods', goods)
  },
  getBaseGoods({ commit }) {
    commit('getBaseGoods')
  },
  clearBaseGoods({ commit }) {
    commit('clearBaseGoods')
  },
  setAssembleGoods({ commit }, goods) {
    commit('setAssembleGoods', goods)
  },
  getAssembleGoods({ commit }) {
    commit('getAssembleGoods')
  },
  clearAssembleGoods({ commit }) {
    commit('clearAssembleGoods')
  },
  setSingleItemData({ commit }, data) {
    commit('setSingleItemData', data)
  },
  clearSingleItemData({ commit }) {
    commit('clearSingleItemData')
  },
  // 拼团套餐
  setBundleMainGoods({ commit }, goods) {
    commit('setBundleMainGoods', goods)
  },
  getBundleMainGoods({ commit }) {
    commit('getBundleMainGoods')
  },
  clearBundleMainGoods({ commit }) {
    commit('clearBundleMainGoods')
  },
  setBundleMainGoods_Copy({ commit }, goods) {
    commit('setBundleMainGoods_Copy', goods)
  },
  getBundleMainGoods_Copy({ commit }) {
    commit('getBundleMainGoods_Copy')
  },
  clearBundleMainGoods_Copy({ commit }) {
    commit('clearBundleMainGoods_Copy')
  },
  setBundleRetinueGoods({ commit }, goods) {
    commit('setBundleRetinueGoods', goods)
  },
  getBundleRetinueGoods({ commit }) {
    commit('getBundleRetinueGoods')
  },
  clearBundleRetinueGoods({ commit }) {
    commit('clearBundleRetinueGoods')
  },
  rmSingleRetinueGoods({ commit }, goods) {
    commit('rmSingleRetinueGoods', goods)
  },
  setBundleRetinueGoods_Copy({ commit }, goods) {
    commit('setBundleRetinueGoods_Copy', goods)
  },
  getBundleRetinueGoods_Copy({ commit }) {
    commit('getBundleRetinueGoods_Copy')
  },
  clearBundleRetinueGoods_Copy({ commit }) {
    commit('clearBundleRetinueGoods_Copy')
  },
  setBundleFormData({ commit }, data) {
    commit('setBundleFormData', data)
  },
  clearBundleFormData({ commit }) {
    commit('clearBundleFormData')
  },
  setCurBundleDetail({ commit }, bundle) {
    commit('setCurBundleDetail', bundle)
  },
  clearCurBundleDetail({ commit }) {
    commit('clearCurBundleDetail')
  }
}

export default { state, mutations, actions, namespaced: true }
