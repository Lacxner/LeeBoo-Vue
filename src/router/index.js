import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/Layout.vue'

Vue.use(Router)

const routes = [
    {
        path: '/',
        name: '主页',
        component: Layout,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                name: '欢迎您！',
                component: () => import('@/views/Welcome.vue')
            }
        ],
        hidden: true
    },
    {
        path: '/login',
        name: '登录页',
        component: () => import('@/views/Login.vue'),
        hidden: true // 菜单栏动态生成时会根据该属性判断是否遍历生成
    },
    {
        path: '/center',
        component: Layout,
        children: [
            {
                path: '/personalCenter',
                name: '个人中心',
                component: () => import('@/views/PersonalCenter.vue')
            }
        ],
        hidden: true
    }
]

export const page404 = {
    path: '*',
    name: '404错误页面',
    component: () => import('@/views/404.vue'),
    hidden: true
}

/**
 * 创建新的Router
 */
function createRouter() {
    return new Router({
        routes
    })
}

// 初始化Router
const router = createRouter()

/**
 * 重置Router
 */
export function resetRouter() {
    // 创建一个新的Router
    const newRouter = createRouter()
    // 重置Router
    router.matcher = newRouter.matcher
}

export default router
