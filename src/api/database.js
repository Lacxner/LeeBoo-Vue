import Axios from '@/utils/interceptor'

const BASE_URL = '/system/database'

export function getDatabase() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getDatabase'
    })
}

export function backupDatabase() {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/backupDatabase'
    })
}

export function restoreDatabase() {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/restoreDatabase'
    })
}