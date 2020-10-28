const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  add_routes: state => state.permission.addRoutes,
  fixedHeader: state => state.settings.fixedHeader,
  menu_routes: state => state.permission.menuRoutes,
  currentMenuPrefix: state => state.permission.currMenusPrefix,
  top_menus: state => state.permission.topMenus
}
export default getters
