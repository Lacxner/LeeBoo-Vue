import Axios from '@/utils/interceptor'

const BASE_URL = '/employee/basic'

export function getAllEmployees(currentPage, pageSize) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: `/getAllEmployees/${currentPage}/${pageSize}`,
        params: {
            currentPage,
            pageSize
        }
    })
}

export function searchEmployees(searchEmployee, currentPage, pageSize) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: `/searchEmployees/${currentPage}/${pageSize}`,
        data: searchEmployee,
        params: {
            currentPage,
            pageSize
        }
    })
}

export function initBasicOptions() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/initBasicOptions'
    })
}

export function getMaxWorkID() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getMaxWorkID'
    })
}

export function addEmployee(employee) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addEmployee',
        data: employee
    })
}

export function updateEmployee(employee) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateEmployee',
        data: employee
    })
}

export function deleteEmployeeById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteEmployeeById/${id}`,
        params: id
    })
}

export function deleteBatchEmployeeByIds(ids) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: '/deleteBatchEmployeeByIds',
        data: ids
    })
}