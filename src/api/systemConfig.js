import Axios from '@/utils/interceptor'

const BASE_URL = '/system/config'

export function getSystemConfig() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getSystemConfig'
    })
}

export function updateSystemConfig(systemConfig) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateSystemConfig',
        data: systemConfig
    })
}