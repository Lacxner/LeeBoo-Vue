import Axios from '@/utils/interceptor'

const BASE_URL = '/system/log'

export function getAllLogs(username, currentPage, pageSize) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: `/getAllLogs/${username}/${currentPage}/${pageSize}`,
        params: {
            username,
            currentPage,
            pageSize
        }
    })
}

export function addLog(log) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addLog',
        data: log
    })
}

export function deleteAllLogs() {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: '/deleteAllLogs'
    })
}