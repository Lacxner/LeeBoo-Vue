import Axios from '@/utils/interceptor'

const BASE_URL = '/salary/rewAndPuni'

export function getAllRewardsAndPunishments() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getAllRewardsAndPunishments'
    })
}

export function addReward(reward) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addReward',
        data: reward
    })
}

export function addPunishment(punishemnt) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: '/addPunishment',
        data: punishemnt
    })
}

export function addEmployeeReward(employeeId, rewardId) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: `/addEmployeeReward/${employeeId}/${rewardId}`,
        params: {
            employeeId,
            rewardId
        }
    })
}

export function addEmployeePunishment(employeeId, punishmentId) {
    return Axios({
        method: 'post',
        baseURL: BASE_URL,
        url: `/addEmployeePunishment/${employeeId}/${punishmentId}`,
        params: {
            employeeId,
            punishmentId
        }
    })
}

export function deleteRewardById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteRewardById/${id}`,
        params: id
    })
}

export function deletePunishmentById(id) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deletePunishmentById/${id}`,
        params: id
    })
}

export function deleteEmployeeReward(employeeId, rewardId) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteEmployeeReward/${employeeId}/${rewardId}`,
        params: {
            employeeId,
            rewardId
        }
    })
}

export function deleteEmployeePunishment(employeeId, punishmentId) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/deleteEmployeePunishment/${employeeId}/${punishmentId}`,
        params: {
            employeeId,
            punishmentId
        }
    })
}