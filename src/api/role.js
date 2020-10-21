import Axios from '@/utils/interceptor'

const BASE_URL = '/authority/role'

export function getAllRoles() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getAllRoles'
    })
}

export function getAllMenuIdsByRoleId(roleId) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: `/getAllMenuIdsByRoleId/${roleId}`,
        params: roleId
    })
}

export function getAllBasicMenu() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getAllBasicMenu'
    })
}

export function addRoleWithMenu(role, menuIds) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addRoleWithMenu',
        data: {
            role,
            menuIds
        }
    })
}

export function updateRoleWithMenu(role, menuIds) {
    return Axios({
        method: 'put',
        baseURL: BASE_URL,
        url: '/updateRoleWithMenu',
        data: {
            role,
            menuIds
        }
    })
}

export function deleteRoleById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteRoleById/${id}`,
        params: id
    })
}

export function deleteBatchRoleByIds(ids) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: '/deleteBatchRoleByIds',
        data: ids
    })
}