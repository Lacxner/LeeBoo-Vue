<template>
    <!-- 登录面板 -->
    <div class="loginPanel">
        <!-- 标题 -->
        <h1 class="title">力朴人事管理系统</h1>
        <!-- 登录表单 -->
        <el-form :model="loginForm" status-icon :rules="rules" ref="loginForm" label-width="0px">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input type="input" v-model="loginForm.username" autocomplete="off" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" autocomplete="off" prefix-icon="el-icon-key"></el-input>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-form-item>
                <el-button type="primary" @click="login" @keypress.enter="login" class="width: 200px" :loading="loading">登 录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import * as User from '@/api/user'
import * as Message from '@/utils/message'
import { page404, resetRouter } from '@/router'

export default {
    data() {
        // 用户名和密码的正则校验规则
        let validateExp = /^\w+$/
        let validateLengthExp = /^\w{4,12}$/

        // 用户名的自定义校验器
        let validateUsername = (rule, value, callback) => {
            // 用户名的非空和长度校验
            if (value === '' || value === null) {
                callback(new Error('用户名不能为空！'))
            } else if (!validateExp.test(value)) {
                callback(new Error('用户名含有非法字符！'))
            } else if (!validateLengthExp.test(value)) {
                callback(new Error('用户名长度必须在4~12之间！'))
            } else {
                callback()
            }
        }

        // 密码的自定义校验器
        let validatePassword = (rule, value, callback) => {
            // 密码的非空和长度校验
            if (value === '' || value === null) {
                callback(new Error('密码不能为空！'))
            } else if (!validateExp.test(value)) {
                callback(new Error('密码含有非法字符！'))
            } else if (!validateLengthExp.test(value)) {
                callback(new Error('密码长度必须在4~12之间！'))
            } else {
                callback()
            }
        }

        return {
            // 用户登录信息
            loginForm: {
                username: '',
                password: ''
            },
            // 校验规则
            rules: {
                username: [
                    { validator: validateUsername, trigger: 'submit' }
                ],
                password: [
                    { validator: validatePassword, trigger: 'submit' }
                ]
            },
            // 登录中提示
            loading: false
        }
    },
    mounted() {
        // 刷新时重置路由
        resetRouter()
        this.$router.addRoutes([page404])
    },
    methods: {
        /**
         * 登录事件
         */
        login() {
            // 登录前校验用户名和密码
            this.$refs.loginForm.validate((valid) => {
                if (valid) {// 用户名和密码合格
                    this.loading = true
                    /**
                     * 构建一个FormData类型的对象来将数据编译成键值对形式
                     * FormData详解：https://zhuanlan.zhihu.com/p/131537445
                     */
                    let formData = new FormData()
                    formData.set('username', this.loginForm.username)
                    formData.set('password', this.loginForm.password)

                    // 登录方法
                    User.login(formData)
                    .then(response => {
                        Message.handle(response)
                        // 通过响应状态码来判断登录成功与否
                        if (response.code === 200) {
                            this.$store.commit('changeUser', response.data.item)
                            // 登录后存储登录信息
                            localStorage.setItem('user', JSON.stringify(response.data.item))
                            this.$router.replace({ path: '/welcome' })
                        } else {
                            this.loading = false
                        }
                    })
                } else {// 用户名或密码不合格
                    return false
                }
            })
        }
    }
}
</script>

<style scoped>
/* 登录面板 */
.loginPanel{
    border-radius: 10px;
    width: 400px;
    height: 310px;
    /* 水平和垂直居中 */
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    /* 阴影 */
    box-shadow: 0 0px 10px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
}
/* 登录面板标题 */
.title{
    text-align: center;
    margin-top: 30px;
    font-size: 35px;
}
/* 登录表单项 */
.el-form-item{
    width: 360px;
    margin: 25px auto;
}
/* 登录按钮 */
.el-button{
    width: 100%;
}
</style>