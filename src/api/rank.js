import Axios from '@/utils/interceptor'

const BASE_URL = '/system/basic'

export function getAllRanks() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getAllRanks'
    })
}

export function deleteRankById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteRankById/${id}`,
        params: id
    })
}

export function deleteBatchRankByIds(ids) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: '/deleteBatchRankByIds',
        data: ids
    })
}

export function addRank(rank) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addRank',
        data: rank
    })
}

export function updateRank(rank) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateRank',
        data: rank
    })
}

export function updateRankEnabled(rank) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateRankEnabled',
        data: rank
    })
}