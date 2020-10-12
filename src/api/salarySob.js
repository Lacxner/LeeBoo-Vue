import Axios from '@/utils/interceptor'

const BASE_URL_SET_OF_BOOKS = '/salary/sob'
const BASE_URL_SET_OF_BOOKS_CONFIG = '/salary/sobConfig'

/* =============== SetOfBooks =============== */

export function getAllSalarySob() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: '/getAllSalarySob'
    })
}

export function addSalarySob(salarySob) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: '/addSalarySob',
        data: salarySob
    })
}

export function updateSalarySob(salarySob) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: '/updateSalarySob',
        data: salarySob
    })
}

export function deleteSalarySobById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: `/deleteSalarySobById/${id}`,
        params: id
    })
}

export function deleteBatchSalarySobByIds(ids) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: '/deleteBatchSalarySobByIds',
        data: ids
    })
}

/* =============== SetOfBooksConfig =============== */

export function getAllEmployeeSalarySobByName(name, currentPage, pageSize) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL_SET_OF_BOOKS_CONFIG,
        url: `/getAllEmployeeSalarySobByName/${name}/${currentPage}/${pageSize}`,
        params: {
            name,
            currentPage,
            pageSize
        }
    })
}

export function getAllBasicSalarySob() {
    return Axios({
        mthod: 'get',
        baseURL: BASE_URL_SET_OF_BOOKS_CONFIG,
        url: '/getAllBasicSalarySob'
    })
}

export function updateEmployeeSalarySob(salarySobId, employeeId) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL_SET_OF_BOOKS_CONFIG,
        url: `/updateEmployeeSalarySob/${salarySobId}/${employeeId}`,
        params: {
            salarySobId,
            employeeId
        }
    })
}

export function addEmployeeSalarySob(salarySobId, employeeId) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL_SET_OF_BOOKS_CONFIG,
        url: `/addEmployeeSalarySob/${salarySobId}/${employeeId}`,
        params: {
            salarySobId,
            employeeId
        }
    })
}