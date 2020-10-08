import Axios from '@/utils/interceptor'

const BASE_URL = '/system/basic'

export function getAllPositions() {
    return Axios({
        mehtod: 'get',
        baseURL: BASE_URL,
        url: '/getAllPositions'
        
    })
}

export function deletePositionById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deletePositionById/${id}`,
        params: id
    })
}

export function deleteBatchPositionByIds(ids) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: '/deleteBatchPositionByIds',
        data: ids
    })
}

export function addPosition(position) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addPosition',
        data: position
    })
}

export function updatePositionEnabled(position) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updatePositionEnabled',
        data: position
    })
}

export function updatePositionName(position) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updatePositionName',
        data: position
    })
}