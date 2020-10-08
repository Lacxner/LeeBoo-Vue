import Axios from '@/utils/interceptor'

export function login(loginForm){
    return Axios({
        method: 'post',
        url: '/login',
        data: loginForm
    })
}

export function logout(){
    return Axios({
        method: 'get',
        url: '/logout'
    })
}