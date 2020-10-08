import Axios from 'axios'
import Router from '@/router'
import Store from '@/store'
import * as Message from '@/utils/message'

/**
 * 响应拦截器
 */
Axios.interceptors.response.use(
response => {
    /**
     * 响应处理
     *  - 401：未登录，跳转至登录页。
     *  - 402：登录已过期，跳转至登录，跳转前清除本地存储用户信息和Vuex中的路由信息。
     */
    if (response.data.code == 401) {
        Message.handle(response.data)
        Router.replace({ path: '/login' })
    } else if (response.data.code == 402){
        // 逾期下线清除清除相关登录信息
        localStorage.removeItem('user')
        Store.commit('initRoutes', [])
        Message.handle(response.data)
        Router.replace({ path: '/login' })
    }
    return response.data
}, 
error => {
    Message.system(error)
    return
})

export default Axios