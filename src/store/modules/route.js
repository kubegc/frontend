// Copyright (2021, ) Institute of Software, Chinese Academy of Sciences
import { constantRoutes } from '@/router'
import Layout from '@/layout/layout'
import Base from '@/layout/index'
import { getResource } from '@/api/kubernetes'

const state = {
  routes: [],
  addRoutes: [],
  menuRoutes: [],
  topMenus: [],
  currMenusPrefix: ''
}

function createRoute(data) {
  console.log(JSON.stringify(data))
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
        item.children = createRoute(item.children)
      }
    }
    return true
  })
  return res
}

/**
 *
 * @param data
 * @returns [{
	"children": [{
		"children": [{
			"component": "/table/index",
			"meta": {
				"icon": "resources",
				"title": "路侧节点"
			},
			"name": "Node",
			"path": "node"
		}, {
			"component": "/dashboard/index",
			"meta": {
				"icon": "resources",
				"source": "http://133.133.135.32:31002/d/xfpJB9FGz/prometheus-dashboard?orgId=1&kiosk",
				"title": "系统概览"
			},
			"path": "index"
		}],
		"component": "Layout",
		"meta": {
			"icon": "routes",
			"title": "平台信息"
		},
		"path": "basicInfo"
	}],
	"component": "Base",
	"meta": {
		"icon": "routes",
		"title": "环境信息"
	},
	"path": "/envInfo"
}, {
	"children": [{
		"children": [{
			"component": "/table/index",
			"meta": {
				"icon": "resources",
				"title": "Pod"
			},
			"name": "Pod",
			"path": "pod"
		}],
		"component": "Layout",
		"meta": {
			"icon": "routes",
			"title": "工作负载"
		},
		"path": "workload"
	}],
	"component": "Base",
	"meta": {
		"icon": "routes",
		"title": "应用管理"
	},
	"path": "/appMgr"
}]
 */
function toVueRoute(data) {
  const json = []
  // catalogs
  for (const c of data.spec.catalogs) {
    // groups
    const gcg = []
    for (const g of data.spec.groups) {
      if (g.path.indexOf(c.path + '/') !== -1) {
        // item
        const icg = []
        for (const i of data.spec.items) {
          if (i.path.indexOf(g.path + '/') !== -1) {
            const ici = {
              'component': i.component,
              'meta': {
                'icon': i.icon,
                'source': i.source ? i.source : '',
                'title': i.name
              },
              'name': i.kind ? i.kind : '',
              'path': i.path
            }
            icg.push(ici)
          }
        }
        if (icg.length !== 0) {
          const gci = {
            'children': icg,
            'component': 'Layout',
            'meta': {
              'icon': 'routes',
              'title': g.name
            },
            'path': g.path
          }
          gcg.push(gci)
        }
      }
    }
    if (gcg.length !== 0) {
      const cci = {
        'children': gcg,
        'component': 'Base',
        'meta': {
          'icon': 'routes',
          'title': c.name
        },
        'path': c.path
      }
      json.push(cci)
    }
  }
  return json
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
  getRoute({ state }, role) {
    return new Promise(resolve => {
      getResource({
        token: state.token,
        kind: 'FrontendRoute',
        namespace: 'default',
        name: 'routes-' + role
      }).then(response => {
        resolve(response.data)
      })
    })
  },
  parseRoute({ state, commit }, data) {
    toVueRoute(data)
    const routes = createRoute(toVueRoute(data))
    if (routes) {
      const catalogs = []
      let index = 0
      for (const item of routes) {
        catalogs.push({
          key: '' + index++,
          title: item.meta.title,
          icon: item.meta.icon,
          path: item.path
        })
      }
      commit('SET_ROUTES', routes)
      commit('SET_TOPMENUS', catalogs)
      commit('SET_CURRMENUPREFIX', catalogs[0].path)
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
