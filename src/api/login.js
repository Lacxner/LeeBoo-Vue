import Axios from '@/utils/interceptor'

const BASE_URL = '/login'

export function sendShortMessage(phone) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: `/sendShortMessage/${phone}`,
        params: phone
    })
}

export function login(loginForm){
    return Axios({
        method: 'post',
        url: '/login',
        data: loginForm
    })
}

export function smsCodeLogin(smsCodeLoginForm){
    return Axios({
        method: 'post',
        url: '/smsCodeLogin',
        data: smsCodeLoginForm
    })
}

export function logout(){
    return Axios({
        method: 'get',
        url: '/logout'
    })
}