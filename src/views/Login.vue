<template>
    <!-- 登录面板 -->
    <div class="loginPanel">
        <!-- 标题 -->
        <h1 class="title">{{ $t('loginPage.title') }}</h1>
        <!-- 用户名密码登录表单 -->
        <el-form :model="loginForm" status-icon :rules="loginFormRules" ref="loginForm" label-width="0px" v-show="activePanel === 1">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input type="input" v-model="loginForm.username" autocomplete="off" prefix-icon="el-icon-user-solid"></el-input>
            </el-form-item>
            <!-- 密码 -->
            <el-form-item prop="password">
                <el-input type="password" v-model="loginForm.password" autocomplete="off" prefix-icon="el-icon-key"></el-input>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-form-item style="margin-bottom: 0px">
                <el-button type="primary" @click="login" @keypress.enter="login" class="width: 200px" :loading="loading">{{ $t('loginPage.login') }}</el-button>
            </el-form-item>
            <!-- 底部按钮 -->
            <el-form-item style="margin: 10px auto">
                <div style="display: flex; justify-content: space-between">
                    <el-checkbox v-model="loginForm.rememberMe" true-label="remember-me" false-label="not-remember-me" checked>{{ $t('loginPage.rememberMe') }}</el-checkbox>
                    <div style="display: flex; justify-content: flex-end">
                        <!-- 手机登录按钮 -->
                        <el-button type="text" class="patternButton" @click="toggleToSMSCodePanel" v-show="activePanel === 1">
                            <i class="fa fa-mobile" style="font-size: 30px"></i>
                        </el-button>
                        <!-- 国际化按钮 -->
                        <el-dropdown @command="toggleLanguage" trigger="click" size="medium" class="i18nButton">
                            <el-button type="text">
                                <i class="fa fa-language" style="font-size: 25px"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="zh" style="font-size: 14px">简体中文</el-dropdown-item>
                                <el-dropdown-item command="en" style="font-size: 14px">English</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-form-item>
        </el-form>

        <!-- 短信验证码登录表单 -->
        <el-form :model="smsCodeLoginForm" status-icon :rules="smsCodeLoginFormRules" ref="smsCodeLoginForm" label-width="0px" v-show="activePanel === 2">
            <!-- 手机号 -->
            <el-form-item prop="phone">
                <el-input type="input" v-model="smsCodeLoginForm.phone" autocomplete="off" prefix-icon="fa fa-mobile fa-lg"></el-input>
            </el-form-item>
            <!-- 短信验证码 -->
            <el-form-item prop="smsCode">
                <div style="display: flex; justify-content: flex-start">
                    <el-input type="input" v-model="smsCodeLoginForm.smsCode" autocomplete="off" style="width: 1200px; margin-right: 10px"></el-input>
                    <!-- 发送验证码按钮 -->
                    <el-button type="primary" :disabled="isSend" @click="sendShortMessage">
                        <span class="timer" v-show="time !== 0">{{ time }}</span> {{ $t(sendButtonText) }}
                    </el-button>
                </div>
            </el-form-item>
            <!-- 登录按钮 -->
            <el-form-item style="margin-bottom: 0px">
                <el-button type="primary" @click="smsCodeLogin" @keypress.enter="smsCodeLogin" class="width: 200px" :loading="loading">{{ $t('loginPage.login') }}</el-button>
            </el-form-item>
            <!-- 底部按钮 -->
            <el-form-item style="margin: 10px auto">
                <div style="display: flex; justify-content: space-between">
                    <el-checkbox v-model="smsCodeLoginForm.rememberMe" true-label="remember-me" false-label="not-remember-me" checked>{{ $t('loginPage.rememberMe') }}</el-checkbox>
                    <div style="display: flex; justify-content: flex-end">
                         <!-- 用户名密码登录按钮 -->
                        <el-button type="text" class="patternButton" @click="toggleToMainPanel" v-show="activePanel === 2 ">
                            <i class="fa fa-hand-o-left" style="font-size: 24px"></i>
                        </el-button>
                        <!-- 国际化按钮 -->
                        <el-dropdown @command="toggleLanguage" trigger="click" size="medium" class="i18nButton">
                            <el-button type="text">
                                <i class="fa fa-language" style="font-size: 25px"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item command="zh" style="font-size: 14px">简体中文</el-dropdown-item>
                                <el-dropdown-item command="en" style="font-size: 14px">English</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                </div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import * as Login from '@/api/login'
import * as Message from '@/utils/message'
import { page404, resetRouter } from '@/router'

export default {
    data() {
        return {
            // 激活显示的登录面板
            activePanel: 1,
            // 用户名密码登录表单数据
            loginForm: {
                username: null,
                password: null,
                rememberMe: 'rememberMe'
            },
            // 用户名密码校验规则
            loginFormRules: {
                username: [
                    { required: true, message: this.$t('loginPage.loginFormRules.username.notNull'), trigger: 'submmit' },
                    { min: 4, max: 12, message: this.$t('loginPage.loginFormRules.username.length'),  trigger: 'submmit' },
                    { pattern: /^\w{4,12}$/, message: this.$t('loginPage.loginFormRules.username.illegal'), trigger: 'submmit' }
                ],
                password: [
                    { required: true, message: this.$t('loginPage.loginFormRules.password.notNull'), trigger: 'submmit' },
                    { min: 4, max: 12, message: this.$t('loginPage.loginFormRules.password.length'),  trigger: 'submmit' },
                    { pattern: /^\w{4,12}$/, message: this.$t('loginPage.loginFormRules.password.illegal'), trigger: 'submmit' }
                ]
            },
            // 短信验证码登录表单数据
            smsCodeLoginForm: {
                phone: null,
                smsCode: null,
                rememberMe: 'rememberMe'
            },
            // 用户名密码校验规则
            smsCodeLoginFormRules: {
                phone: [
                    { required: true, message: this.$t('loginPage.smsCodeLoginFormRules.phone.notNull'), trigger: 'submmit' },
                    { min: 11, max: 11, message: this.$t('loginPage.smsCodeLoginFormRules.phone.length'),  trigger: 'submmit' },
                    { pattern: /^\d{11,11}$/, message: this.$t('loginPage.smsCodeLoginFormRules.phone.illegal'), trigger: 'submmit' }
                ],
                smsCode: [
                    { required: true, message: this.$t('loginPage.smsCodeLoginFormRules.smsCode.notNull'), trigger: 'submmit' },
                    { min: 6, max: 6, message: this.$t('loginPage.smsCodeLoginFormRules.smsCode.length'),  trigger: 'submmit' },
                    { pattern: /^\d{6,6}$/, message: this.$t('loginPage.smsCodeLoginFormRules.smsCode.illegal'), trigger: 'submmit' }
                ]
            },
            // 登录中提示
            loading: false,
            // 发送验证码按钮文本
            sendButtonText: 'loginPage.sendText',
            // 是否发送了短信验证码
            isSend: false,
            // 验证码倒计时计时器
            timer: null,
            // 倒计时秒数
            time: 0
        }
    },
    created() {
        let lang = localStorage.getItem('lang')
        if (lang != null) {
            this.$i18n.locale = lang
        }
    },
    mounted() {
        // 刷新时重置路由
        resetRouter()
        this.$router.addRoutes([page404])
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        /**
         * 用户名密码登录
         */
        login() {
            // 登录前校验用户名和密码
            this.$refs.loginForm.validate((valid) => {
                if (valid) { // 用户名和密码合格
                    this.loading = true
                    /**
                     * 构建一个FormData类型的对象来将数据编译成键值对形式
                     * FormData详解：https://zhuanlan.zhihu.com/p/131537445
                     */
                    let formData = new FormData()
                    formData.set('username', this.loginForm.username)
                    formData.set('password', this.loginForm.password)
                    formData.set('remember-me', this.loginForm.rememberMe)

                    // 登录方法
                    Login.login(formData)
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
                } else { // 用户名或密码不合格
                    return false
                }
            })
        },
        /**
         * 短信验证码登录
         */
        smsCodeLogin() {
            // 登录前校验用户名和密码
            this.$refs.smsCodeLoginForm.validate((valid) => {
                if (valid) { // 用户名和密码合格
                    this.loading = true
                    /**
                     * 构建一个FormData类型的对象来将数据编译成键值对形式
                     * FormData详解：https://zhuanlan.zhihu.com/p/131537445
                     */
                    let formData = new FormData()
                    formData.set('phone', this.smsCodeLoginForm.phone)
                    formData.set('smsCode', this.smsCodeLoginForm.smsCode)
                    formData.set('remember-me', this.smsCodeLoginForm.rememberMe)

                    // 登录方法
                    Login.smsCodeLogin(formData)
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
                } else { // 用户名或密码不合格
                    return false
                }
            })
        },
        /**
         * 发送短信验证码
         */
        sendShortMessage() {
            this.$refs.smsCodeLoginForm.validateField('phone', (errorMessage) => {
                // errorMessage是错误信息，当errorMessage为空时才发送短信验证码
                if(!errorMessage) {
                    this.isSend = true
                    // 验证码倒计时
                    this.time = 60
                    this.sendButtonText = 'loginPage.tryAgain'
                    this.timer = setInterval(() => {
                        // 倒计时到底后清除定时器
                        if (this.time === 1) {
                            this.time = 0
                            this.sendButtonText = 'loginPage.sendText'
                            clearInterval(this.timer)
                            this.isSend = false
                        } else {
                            this.time--
                        }
                    }, 1000)

                    // 发送短信验证码
                    Login.sendShortMessage(this.smsCodeLoginForm.phone)
                    .then(response => {
                        Message.handle(response)
                    })
                } else {
                    return false
                }
            })
        },
        /**
         * 切换至手机登录界面
         */
        toggleToSMSCodePanel() {
            this.activePanel = 2
            this.$refs.loginForm.resetFields()
        },
        /**
         * 切换至用户名密码登录界面
         */
        toggleToMainPanel() {
            this.activePanel = 1
            this.$refs.smsCodeLoginForm.resetFields()
        },
        /**
         * 切换语言
         */
        toggleLanguage(command) {
            this.$i18n.locale = command
            localStorage.setItem('lang', command)
        }
    }
}
</script>

<style scoped>
/* 登录面板 */
.loginPanel{
    border-radius: 10px;
    width: 400px;
    height: 350px;
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
/* 登录方式按钮 */
.patternButton {
    color: black;
    width: 30px;
    height: 30px;
    margin: auto 0px;
    padding: 0px;
}
.patternButton:focus, .patternButton:hover {
    color: black;
}
/* 国际化按钮 */
.el-dropdown {
    height: 30px;
    margin: auto 0px;
    margin-left: 5px;
    padding: 0px;
}
.el-dropdown /deep/ .el-dropdown-selfdefine {
    padding: 0px;
}
</style>