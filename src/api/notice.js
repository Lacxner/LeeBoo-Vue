import Axios from '@/utils/interceptor'

const BASE_URL = '/welcome/notice'

export function getNotice() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getNotice'
    })
}