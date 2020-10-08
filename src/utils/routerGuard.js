import Router from '@/router'
import * as RouterHandler from '@/utils/routerHandler'

Router.beforeEach(async (to, from, next) => {
    // 如果用户已经登录就阻止前往登录页的请求
    let user = localStorage.getItem('user')
    if (to.path == '/login') {
        if (user) {
            next({ path: from.path })
        } else {
            next()
        }
    } else {
        /**
         * 如果前往的不是登录页，就需要考虑是否要初始化路由表
         *  - 如果用户已登录，则先初始化路由表再跳转至主页
         *  - 如果用户未登录，则直接跳转主页（这里主页不会显示任何需要认证的信息）
         */
        if (user) {
            RouterHandler.initRoutes(Router)
            next()
        } else {
            next()
        }
    }
})