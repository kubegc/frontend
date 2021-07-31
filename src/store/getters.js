// Copyright (2021, ) Institute of Software, Chinese Academy of Sciences
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  // avatar: state => state.user.avatar,
  name: state => state.user.name,
  role: state => state.user.role,
  add_routes: state => state.route.addRoutes,
  fixedHeader: state => state.settings.fixedHeader,
  menu_routes: state => state.route.menuRoutes,
  currentMenuPrefix: state => state.route.currMenusPrefix,
  top_menus: state => state.route.topMenus
}
export default getters
