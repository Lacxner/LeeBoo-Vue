import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const now = new Date()

const store = new Vuex.Store({
    state: {
        // 当前Hr拥有的所有路由
        routes: [],
        // 当前登录用户（我自己）
        user: null
    },
    mutations: {
        /**
         * 修改当前用户
         */
        changeUser(state, user) {
            state.user = user
        },
        /**
         * 初始化当前用户路由
         */
        initRoutes(state, routes){
            state.routes = routes
        }
    }
})
export default store