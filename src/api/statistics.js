import Axios from '@/utils/interceptor'

const BASE_URL = '/statistics/all'

export function getStatistics() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getStatistics'
    })
}