import Axios from '@/utils/interceptor'

const BASE_URL = '/system/log'

export function getAllSystemLogs(username, currentPage, pageSize) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: `/getAllSystemLogs/${username}/${currentPage}/${pageSize}`,
        params: {
            username,
            currentPage,
            pageSize
        }
    })
}

export function addSystemLog(systemLog) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addSystemLog',
        data: systemLog
    })
}

export function deleteAllSystemLogs() {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: 'deleteAllSystemLogs'
    })
}