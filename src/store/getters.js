const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  cachedViews: state => state.tagsView.cachedViews,
  routers: state => state.permission.routers,
  menuList: state => state.permission.menuList
}
export default getters
