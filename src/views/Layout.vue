<template>
    <el-container class="container">
        <!-- 头部 -->
        <el-header height="60px">
            <!-- 系统标题 -->
            <div class="title">力朴人事管理系统</div>
            <div style="display: flex; flex-direction: row; align-items: center">
                <!-- 聊天按钮 -->
                <el-button  type="text" class="chatButton" @click="chatDialogVisible = true">
                    <!-- 未读消息标记 -->
                    <el-badge :value="badge[user.username]" :max="99" :hidden="badge[user.username] > 0 ? false : true"  v-if="user">
                        <i class="fa fa-comments fa-2x" style="width: 25px"></i>
                    </el-badge>
                </el-button>

                <!-- 用户菜单 -->
                <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                        <!-- 用户头像 -->
                        <el-avatar shape="square" :src="user.avatar" style="margin-right: 8px" v-if="user"/>
                        <!-- 用户名称 -->
                        {{ user != null ? user.name : '未登录' }}
                        <i class="el-icon-arrow-down el-icon--right"/>
                    </span>
                    <el-dropdown-menu slot="dropdown" style="text-align: center" class="userDropdownMenu">
                        <el-dropdown-item command="center" style="font-size: 14px" v-if="user">
                            <i class="fa fa-user-circle-o"></i> 个人中心
                        </el-dropdown-item>
                        <el-dropdown-item divided command="logout" style="font-size: 14px" v-if="user">
                            <i class="fa fa-sign-out"></i> 注销登录
                        </el-dropdown-item>
                        <el-dropdown-item command="login"  style="font-size: 14px" v-else>
                            <i class="fa fa-sign-out"></i> 前往登录
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </el-header>
        
        <el-container>
            <!-- 
                菜单栏中只有主页是无需权限的，在未登录时可访问主页
                主页是固定的，其他菜单根据Router动态生成，而Router则根据用户权限从后台数据库获取
                属性：
                - unique-opened：是否只保持一个子菜单的展开
                - router：是否使用vue-router的模式，启用该模式会在激活导航时以index作为path进行路由跳转
                    - 如果开启了该属性，则index中必须为字符串，否则报错，所以这里使用toString方法将其转换为字符串
            -->
            <!-- 侧边栏菜单 -->
            <el-menu router unique-opened :default-active="this.$router.currentRoute.path" class="el-menu-vertical"
            style="height: 100%" :collapse="isCollapse">
                <!-- 主页 -->
                <el-menu-item index="/welcome">
                    <i class="fa fa-home oneLevelMenuIcon"></i>
                    <span>主页</span>
                </el-menu-item>

                <!-- 动态路由 -->
                <el-submenu v-for="(item, index) in routes" :key="index" :index="index.toString()" v-show="!item.hidden">
                    <template slot="title">
                        <i :class="item.icon" class="oneLevelMenuIcon"></i>
                        <span>{{ item.name }}</span>
                    </template>
                    <!-- 子菜单 -->
                    <el-menu-item v-for="(child, index) in item.children" :key="index" :index="child.path">
                        <i :class="child.icon" class="twoLevelMenuIcon"></i> {{ child.name }}
                    </el-menu-item>
                </el-submenu>
            </el-menu>

            <!-- 主体 -->
            <el-main>
                <div style="display: flex; align-items: center">
                    <!-- 菜单折叠与展开按钮 -->
                    <el-button class="collapseButton" @click="isCollapse = !isCollapse" icon="fa fa-bars fa-lg" size="mini"></el-button>

                    <!-- 垂直分割线 -->
                    <el-divider direction="vertical"></el-divider>

                    <!-- 面包屑 -->
                    <el-breadcrumb separator-class="el-icon-arrow-right">
                        <el-breadcrumb-item :to="{ path: '/' }">主页</el-breadcrumb-item>
                        <!-- 当前页 -->
                        <el-breadcrumb-item>
                            {{ this.$router.currentRoute.name }}
                        </el-breadcrumb-item>
                    </el-breadcrumb>
                </div>

                <!-- 聊天框 -->
                <el-dialog fullscreen :visible.sync="chatDialogVisible" @opened="clearBadge">
                    <Dialog/>
                </el-dialog>

                <!-- 主体路由渲染 -->
                <router-view style="margin-top: 20px"/>

                <!-- 回到顶部 -->
                <el-backtop :visibility-height="80" :bottom="80"></el-backtop>
            </el-main>
        </el-container>

        <!-- 底部 -->
        <el-footer height="60px">
            <span><i class="fa fa-copyright"></i> LeeBoo 力朴 Designed By Gzy</span>
        </el-footer>
    </el-container>
</template>

<script>
import * as Formatter from '@/utils/formatter'
import * as User from '@/api/user'
import * as Message from '@/utils/message'
import Dialog from '@/components/chat/dialog'
import { mapState } from 'vuex'
import { page404, resetRouter } from '@/router'

export default {
    data() {
        return {
            // 菜单栏是否折叠
            isCollapse: false,
            // 登录信息
            // user: null,
            // 是否打开聊天对话框
            chatDialogVisible: false
        }
    },
    components: {
        Dialog
    },
    computed: {
        routes() {
            return this.$store.state.routes
        },
        ...mapState([
            'badge'
        ]),
        user() {
            return this.$store.state.user
        }
    },
    created() {
        // 获取Hr登录状态信息
        this.$store.commit('changeUser', JSON.parse(localStorage.getItem('user')))
        if (this.user) {
            // 初始化未读消息标记
            this.$store.dispatch('initBadge')
        }
    },
    mounted() {
        /**
         * 未登录时添加404页面
         * addRoutes方法的参数必须是一个数组，否则会报错
         */
        if (!this.user) {
            resetRouter()
            this.$router.addRoutes([page404])
        } else {
            // 如何登录了就连接WebSocket
            this.$store.dispatch('connect')
        }
    },
    methods: {
        /**
         * 根据传入的不同参数处理用户菜单
         */
        handleCommand(command) {
            if (command == 'center') {
                this.$router.push({ path: '/personalCenter' }, onComplete => {}, onAbort => {})
            } else if (command == 'logout') {
                // 再次确认注销登录
                this.$confirm('是否确定要注销登录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    // 注销请求
                    User.logout()
                    .then(response => {
                        // 注销后清除本地存储登录信息
                        localStorage.removeItem('user')
                        // 清除Store中的路由数组，目的是避免其它用户登录时初次使用的是旧的路由
                        this.$store.commit('initRoutes', [])
                        // 在注销前重置路由数组
                        resetRouter()
                        Message.handle(response)
                        // 跳转登录页面
                        this.$router.replace({ path: '/login' })
                    })
                }).catch(action => { })
            } else if (command == 'login'){
                // 跳转登录页面
                this.$router.replace({ path: '/login' })
            }
        },
        /**
         * 打开聊天框时清空未读消息标记
         */
        clearBadge() {
            this.$store.commit('clearBadeg')
        }
    }
}
</script>

<style scoped>
/* 容器布局 */
.container {
    /* 占满屏幕窗口 */
    height: 100vh;
}

/* 头像 */
.el-avatar {
    margin-right: 8px;
}
/* 当前时间和登录用户的右侧Flex布局 */
.rightFlex {
    display: flex;
    flex-direction: row;
}
/* 聊天按钮 */
.chatButton {
    color: white;
    margin-right: 20px;
    width: 40px;
}
.chatButton:focus, .chatButton:hover {
    color: white;
}
/* 消息标记 */
.el-badge /deep/ .el-badge__content{
    border: 1px solid red;
}
/* 头部下拉菜单 */
.el-dropdown-link, .el-icon-arrow-down {
    cursor: pointer;
    color: white;
    font-size: 18px;
    display: flex;
    align-items: center;
}
/* 头部栏 */
.el-header {
    background-color: #000000;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
}
/* 头部标题 */
.title {
    font-size: 30px;
}
/* 折叠展开按钮 */
.collapseButton {
    color: black;
    border: 0px;
    font-size: 14px;
}
.collapseButton:focus, .collapseButton:hover {
    background-color: white;
}
/* 面包屑 */
.el-breadcrumb {
    font-size: 16px;
    width: 80%;
    margin-left: 10px;
}

/* 底部栏 */
.el-footer {
    background-color: #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: rgb(117, 117, 117);
}

/* 侧边栏菜单 */
/* 一级菜单 */
.oneLevelMenuIcon {
    margin-right: 14px;
    font-size: 20px
}
/* 二级菜单 */
.twoLevelMenuIcon {
    margin-right: 10px;
    font-size: 20px
}
.el-menu-item {
    display: flex;
    align-items: center;
}
/* 菜单栏的折叠与展开 */
.el-menu-vertical:not(.el-menu--collapse) {
    width: 200px;
    height: 100%;
}

/* 主体 */
.el-main {
    background-color: #ffffff;
    color: #000;
}
</style>