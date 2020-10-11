import Axios from '@/utils/interceptor'

const BASE_URL_SET_OF_BOOKS = '/salary/setOfBooks'
const BASE_URL_SET_OF_BOOKS_CONFIG = '/salary/setOfBooksConfig'
const BASE_URL_SEARCH = '/salary/search'

/* =============== SetOfBooks =============== */

export function getAllSalary() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: '/getAllSalary'
    })
}

export function addSalary(salary) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: '/addSalary',
        data: salary
    })
}

export function updateSalary(salary) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: '/updateSalary',
        data: salary
    })
}

export function deleteSalaryById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: `/deleteSalaryById/${id}`,
        params: id
    })
}

export function deleteBatchSalaryByIds(ids) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL_SET_OF_BOOKS,
        url: '/deleteBatchSalaryByIds',
        data: ids
    })
}

/* =============== SetOfBooksConfig =============== */

export function getAllEmployeeSalaryByName(name, currentPage, pageSize) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL_SET_OF_BOOKS_CONFIG,
        url: `/getAllEmployeeSalaryByName/${name}/${currentPage}/${pageSize}`,
        params: {
            name,
            currentPage,
            pageSize
        }
    })
}

export function getAllBasicSalary() {
    return Axios({
        mthod: 'get',
        baseURL: BASE_URL_SET_OF_BOOKS_CONFIG,
        url: '/getAllBasicSalary'
    })
}

export function updateEmployeeSalary(salaryId, employeeId) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL_SET_OF_BOOKS_CONFIG,
        url: `/updateEmployeeSalary/${salaryId}/${employeeId}`,
        params: {
            salaryId,
            employeeId
        }
    })
}

export function addEmployeeSalary(salaryId, employeeId) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL_SET_OF_BOOKS_CONFIG,
        url: `/addEmployeeSalary/${salaryId}/${employeeId}`,
        params: {
            salaryId,
            employeeId
        }
    })
}

/* =============== Search =============== */

export function getSalaryByName(name) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL_SEARCH,
        url: `/getSalaryByName/${name}`,
        params: name
    })
}