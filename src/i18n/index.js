// Vue-i18n插件
import Vue from 'vue'
import VueI18n from 'vue-i18n'

import ElementLocale from 'element-ui/lib/locale'
// ElementUI内置语言包
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// 自定义语言包
import langZh from "@/assets/lang/zh.js"
import langEN from "@/assets/lang/en.js"

Vue.use(VueI18n)
 
const i18n = new VueI18n({
    locale: 'zh', // 默认使用简体中文
    messages: {
        zh: {
            ...langZh,
            ...zhLocale
        },
        en: {
            ...langEN,
            ...enLocale
        }
    }
})

// ElementUI使用定制的i18n统一管理
ElementLocale.i18n((key, value) => i18n.t(key, value))

export default i18n
