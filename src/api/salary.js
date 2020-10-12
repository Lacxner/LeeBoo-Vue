import Axios from '@/utils/interceptor'

const BASE_URL_SEARCH = '/salary/search'

export function getSalaryByEmployeeName(name) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL_SEARCH,
        url: `/getSalaryByEmployeeName/${name}`,
        params: name
    })
}