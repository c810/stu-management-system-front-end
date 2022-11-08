import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 全局守卫路由
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  // 从cookies里面获取token
  const hasToken = getToken()

  // 判断token是否存在
  if (hasToken) { // token存在
    if (to.path === '/login') { // 是否从登录来
      // if is logged in, redirect to the home page
      // 进入首页
      next({ path: '/' })
      NProgress.done()
    } else {
      // determine whether the user has obtained his permission roles through getInfo
      // 从vuex中获取用户的权限信息
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      // 判断权限信息、菜单信息是否存在
      if (hasRoles) { // 存在,直接放行
        next()
      } else {
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          // 获取用户信息、权限信息
          const { roles } = await store.dispatch('user/getInfo')

          // generate accessible routes map based on roles
          // 获取菜单信息,生成动态路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

          // dynamically add accessible routes
          // 动态添加路由
          router.addRoutes(accessRoutes)

          // hack method to ensure that addRoutes is complete
          // set the replacement: true, so the navigation will not leave a history record
          next({ ...to, replace: true })
        } catch (error) { // 如果进入异常
          // remove token and go to login page to re-login
          // 清空token
          await store.dispatch('user/resetToken')
          // Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else { // token不存在
    /* has no token*/

    // 判断to.path(即当前请求的这个页面)是否在白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      // 在白名单中直接放行
      next()
    } else { // 不在白名单中,直接跳转登录
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
