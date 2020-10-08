import Axios from '@/utils/interceptor'

const BASE_URL = '/system/basic'

export function getAllDepartments() {
    return Axios({
        mehtod: 'get',
        baseURL: BASE_URL,
        url: '/getAllDepartments'
    })
}

export function addDepartment(department) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addDepartment',
        data: department
    })
}

export function deleteDepartmentById(id, parentId) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteDepartmentById/${id}/${parentId}`,
        params: {
            id,
            parentId
        }
    })
}

export function deleteBatchDepartmentByIds(departmentIds, parentId) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteBatchDepartmentByIds/${parentId}`,
        params: parentId,
        data: departmentIds
    })
}