import Vue from 'vue'
import Vuex from 'vuex'
import { Notification } from 'element-ui'
import * as Chat from '@/api/chat'
import '../utils/stomp'

Vue.use(Vuex)

const now = new Date()

const store = new Vuex.Store({
    state: {
        // 当前Hr拥有的所有路由
        routes: [],
        /**
         * 存储聊天会话以及消息的对象
         * 格式：
         * sessions: {  
         *      'superAdmin#normalAdmin': [
         *          {
         *              content: '你好！',
         *              date: '2020-09-01 13:26:01',
         *              self: false
         *          }
         *      ]
         * }
         */
        sessions: {},
        // 除自己以外的所有Hr
        hrs: [],
        // 当前登录用户（我自己）
        user: JSON.parse(localStorage.getItem("user")),
        // 当前正在进行聊天的Hr（对方）
        other: null,
        // 未读消息数
        uncheckedMessageCounts: 0,
        // 未读消息标记
        badge: {},
        // STOMP协议
        stomp: null
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
        },
        /**
         * 修改当前正在聊天的Hr，即修改会话
         */
        changeSession(state, other) {
			state.other = other
        },
        /**
         * 添加消息信息
         */
		addMessage(state, message) {
            state.uncheckedMessageCounts++
            // 在sessions中初始化某个会话的消息数组
            if (!state.sessions[state.user.username + '#' + message.to]) {
                Vue.set(state.sessions, state.user.username + '#' + message.to, [])
            }
            // 添加消息信息至sessions的指定数组中
			state.sessions[state.user.username + '#' + message.to].push({
				content: message.content,
				date: new Date(),
				self: !message.notSelf
            })
        },
        /**
         * 初始化历史聊天消息，历史聊天消息均存在本地
         */
		initMessage(state) {
			let data = localStorage.getItem('vue-chat-session')
			if (data) {
				state.sessions = JSON.parse(data)
            }
        },
        /**
         * 初始化聊天框列表中的所有Hr
         */
        initHrList(state, hrs) {
            state.hrs = hrs
            if (state.hrs && state.hrs.length) {
                state.other = state.hrs[0]
            }
        },
        /**
         * 清除未读消息标记
         */
        clearBadeg(state) {
            state.badge[state.user.username] = 0
        }
    },
    actions: {
        /**
         * 连接WebSocket
         */
        connect(context) {
            context.state.stomp = Stomp.over(new SockJS('/ws/ep'))
            context.state.stomp.connect({},
            success => {
                // 接受消息
                context.state.stomp.subscribe('/user/queue/chat', message => {
                    let receiveMessage = JSON.parse(message.body)

                    /**
                     * 消息提示
                     * 只有当未打开聊天框或者未与该发送者进行聊天时才会发送消息提示
                     */
                    if (context.state.other == null || receiveMessage.from !== context.state.other.username) {
                        Notification({
                            title: '新消息',
                            message: '[' + receiveMessage.name + '] 给你发送了一条消息！',
                            type: 'warning'
                        })
                    }
                    // 每接收一条消息就将未读消息标记加一
                    context.state.badge[context.state.user.username]++

                    receiveMessage.notSelf = true
                    receiveMessage.to = receiveMessage.from
                    context.commit('addMessage', receiveMessage)
                })
            },
            error => {})
        },
        /**
         * 初始化聊天框基本数据
         */
        initData(context) {
            context.commit('initMessage')

            // 获取除自己以外的所有Hr
            Chat.getAllHrsWithoutMyself()
            .then(response => {
                context.commit('initHrList', response.data.items)
            })
        },
        /**
         * 初始化未读消息标记
         */
        initBadge(context) {
            // 先从本地获取所有标记，然后再判断是否需要初始化当前用户标记的值
            let data = localStorage.getItem('vue-chat-badge')
			if (data) {
				context.state.badge = JSON.parse(data)
            }

            if (!context.state.badge[context.state.user.username]) {
                Vue.set(context.state.badge, context.state.user.username, 0)
            }
        }
    }
})

store.watch(function(state) {
    return state.sessions
},function(val) {
    localStorage.setItem('vue-chat-session', JSON.stringify(val))
},{
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

store.watch(function(state) {
    return state.badge
},function(val) {
    localStorage.setItem('vue-chat-badge', JSON.stringify(val))
},{
    deep: true/*这个貌似是开启watch监测的判断,官方说明也比较模糊*/
})

export default store