import { constantRoutes } from '@/router'
import Layout from '@/layout/layout'
import Base from '@/layout/index'

function generateRoutesHelper(data) {
  const res = data.filter(item => {
    if (item.component) {
      if (item.component === 'Base') {
        item.component = Base
      } else if (item.component === 'Layout') {
        item.component = Layout
      } else {
        item.component = require('@/views' + item.component + '.vue').default
      }
      if (item.children && item.children.length) {
        item.children = generateRoutesHelper(item.children)
      }
    }
    return true
  })
  return res
}

const state = {
  routes: [],
  addRoutes: [],
  menuRoutes: [],
  topMenus: [],
  currMenusPrefix: ''
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    const page_404 = { path: '*', redirect: '/404', hidden: true }
    routes.push(page_404)
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
    state.menuRoutes = routes[0].children
  },
  RESET_ROUTES: () => {
    state.addRoutes = []
    state.routes = []
    state.menuRoutes = []
    state.topMenus = []
    state.currMenusPrefix = ''
  },
  SET_TOPMENUS: (state, topMenus) => {
    state.topMenus = topMenus
  },
  SET_CURRMENUPREFIX: (state, curr) => {
    state.currMenusPrefix = curr
  },
  RESET_MENUROUTES: (state, index) => {
    state.menuRoutes = state.addRoutes[index].children
    state.currMenusPrefix = state.addRoutes[index].path
  }
}

const actions = {
  generateRoutes({ state, commit }, data) {
    const accessedRoutes = generateRoutesHelper(data)
    if (accessedRoutes) {
      const topmenus = []
      let index = 0
      for (const item of accessedRoutes) {
        topmenus.push({
          key: '' + index++,
          title: item.meta.title,
          icon: item.meta.icon,
          path: item.path
        })
      }
      commit('SET_ROUTES', accessedRoutes)
      commit('SET_TOPMENUS', topmenus)
      commit('SET_CURRMENUPREFIX', topmenus[0].path)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
