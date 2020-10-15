import Axios from '@/utils/interceptor'

const BASE_URL = '/statistics/chart'

export function getSalaryChartInfo() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getSalaryChartInfo'
    })
}

export function getEmployeeChartInfo() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getEmployeeChartInfo'
    })
}