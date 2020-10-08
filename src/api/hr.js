import Axios from '@/utils/interceptor'

const BASE_URL = '/system/hr'

export function getAllHrs() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getAllHrs'
    })
}

export function getAllRoles() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getAllRoles'
    })
}

export function addHr(authenticateHr) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addHr',
        data: authenticateHr 
    })
}

export function updateHrRole(updateHrRole) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateHrRole',
        data: updateHrRole
    })
}

export function updateHr(hr) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateHr',
        data: hr 
    })
}

export function updateHrPasswordByAdmin(resetPassword) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateHrPasswordByAdmin',
        data: resetPassword
    })
}

export function updateHrEnabled(basicHr) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateHrEnabled',
        data: basicHr
    })
}

export function deleteHrById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteHrById/${id}`,
        params: id
    })
}