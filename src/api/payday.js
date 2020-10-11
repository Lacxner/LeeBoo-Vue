import Axios from '@/utils/interceptor'

const BASE_URL = '/salary/payday'

export function getPayday() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getPayday'
    })
}

export function updatePayday(day) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: `/updatePayday/${day}`,
        params: day
    })
}