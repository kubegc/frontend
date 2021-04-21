import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration
const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      try {
        if (store.getters.role) {
          if (to.path === '/') {
            next({ path: homepage(store.getters.add_routes) })
          } else {
            next()
            // }
          }
        } else {
          // get user info
          const { role } = await store.dispatch('user/getInfo')
          const { spec: { routes }} = await store.dispatch('user/getRoutesConfig', role)
          await store.dispatch('permission/generateRoutes', routes)
          // dynamically add accessible routes
          router.addRoutes(store.getters.add_routes)
          // hack method to ensure that addRoutes is complete
          // set the replace: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        }
      } catch (error) {
        // remove token and go to login page to re-login
        await store.dispatch('user/resetToken')
        console.log(error)
        Message.error(error || 'Has Error')
        next(`/login?redirect=${to.path}`)
        NProgress.done()
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function homepage(curr) {
  let hp = ''
  for (let i = 0; i < curr.length; i++) {
    const c = curr[i]
    if (c.component) {
      if (c.children) {
        const rtn = homepage(c.children)
        if (rtn !== '') {
          hp += (c.path + '/' + rtn)
          return hp
        }
      } else {
        hp += c.path
        return hp
      }
    } else {
      return hp
    }
  }
  return hp
}
