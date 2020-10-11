import * as Menu from '@/api/menu'
import Layout from '@/views/Layout.vue'
import Store from '@/store'
import { page404, resetRouter } from '@/router'

export function initRoutes(router) {
    /**
     * 如果Vuex中的路由数组（routes）有值就无需再从后台获取
     * 当页面刷新（包括F5）或者关闭时，Vuex中的值都会初始化，所以这里判断是否要重新加载路由数组
     */
    if (Store.state.routes.length === 0) {
        // 从后台获取用户拥有的所有路由
        Menu.getAllMenus()
        .then(response => {
            // 这里做一次判断是为了解决登录过期时，响应是没有data数据的，这时如果格式化路由则会报错
            if (response.data.items) {
                // 因为实际情况中会调用两次initRoutes方法，所以会发生重复添加路由的情况
                resetRouter()
                // 对路由数组进行格式化并在末尾加上404页面
                let dynamicRoutes = formatRoutes(response.data.items).concat(page404)
                // 将格式化后的路由数组添加至Router中
                router.addRoutes(dynamicRoutes)
                // 修改Store中的状态
                Store.commit('initRoutes', dynamicRoutes)
            }
        })
    }
}

/**
 * 用于格式化路由数组，这里主要是为了处理route中的component属性
 * 默认后端传来的数据中component是一个字符串，所以需要将其转换为对应的组件
 * @param routes 要格式化的路由数组
 */
function formatRoutes(routes){
    // 这里使用的是数组过滤器进行遍历
    let finalRoutes = routes.filter(route => {
        // 根据不同的情况动态对component属性赋值
        if (route.component) {
            if (route.component === 'Layout') { // 处理一级菜单的component属性，即均为Layout
                route.component = Layout
            } else { // 处理二级菜单的component属性，需要实现动态导入组件
                const component = route.component
                route.component = (resolve) => {
                    require(['@/views' + component + '.vue'], resolve)
                }
            }
        }
        // 判断是否要对二级菜单进行格式化
        if (route.children && route.children.length) {
            route.children = formatRoutes(route.children)
        }
        return true
    })
    return finalRoutes
}