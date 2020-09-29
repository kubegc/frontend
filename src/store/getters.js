const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  add_routes: state => state.permission.addRoutes,
  fixedHeader: state => state.settings.fixedHeader,
  menu_routes: state => state.permission.menuRoutes
}
export default getters
