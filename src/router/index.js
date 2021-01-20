import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Base from '@/layout/index'
import Layout from '@/layout/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/wizzard',
    component: () => import('@/views/wizzard/index'),
    hidden: true
  },
  {
    path: '/table',
    component: () => import('@/views/table/index'),
    hidden: true
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/progress', // deprecated
    component: () => import('@/views/progress/progress')
  },
  {
    path: '/progressBar',
    component: () => import('@/views/progressBar/index')
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/routes', // deprecated
    component: Base,
    meta: { icon: 'routes', title: '向导路由' },
    children: [
      {
        path: 'sidebar',
        component: Layout,
        children: [
          {
            path: 'guide',
            component: () => import('@/views/guide/index'),
            meta: { icon: 'tree', title: '向导' }
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: Base,
    children: [
      {
        path: 'in',
        component: Layout,
        children: [
          {
            path: 'welcome',
            name: 'Welcome',
            component: () => import('@/views/dashboard/index'),
            meta: { title: 'welcome', icon: 'dashboard' }
          }]
      }
    ]
  },
  {
    path: '/pipeline', // deprecated
    component: () => import('@/views/pipeline/pipeline'),
    meta: { icon: 'pipeline', title: '多云协作框架' }
  },
  {
    path: '/testRequest', // deprecated
    component: () => import('@/views/cloudPlatform/testRequest'),
    meta: { icon: 'cloud', title: '请求云服务' }
  },
  {
    path: '/diff', // deprecated
    component: () => import('@/views/sysConfig/diff'),
    meta: { icon: 'cloud', title: '兼容性分析' }
  },
  {
    path: '/overall', // deprecated
    component: () => import('@/views/sysConfig/overall'),
    meta: { icon: 'cloud', title: '智能服务演化' }
  },

  {
    path: '/framework-construction', // deprecated
    component: () => import('@/views/pipeline/framework-construction'),
    meta: { icon: 'pipeline', title: '多云协作框架' }

  }

]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
