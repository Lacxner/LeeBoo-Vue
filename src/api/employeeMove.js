import Axios from '@/utils/interceptor'

const BASE_URL = '/employee/move'

export function initBasicOptions() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/initBasicOptions'
    })
}

export function getEmployeeMoveByName(name) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: `/getEmployeeMoveByName/${name}`,
        params: name
    })
}

export function moveEmployee(employeeMove) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/moveEmployee',
        data: employeeMove
    })
}