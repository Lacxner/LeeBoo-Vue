import Axios from '@/utils/interceptor'

const BASE_URL = '/salary/rewAndPuni'

export function getAllRewardsAndPunishments() {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: '/getAllRewardsAndPunishments'
    })
}

export function getRewardsAndPunishmentsByEmployeeName(name) {
    return Axios({
        method: 'get',
        baseURL: BASE_URL,
        url: `/getRewardsAndPunishmentsByEmployeeName/${name}`,
        params: name
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

export function removeEmployeeReward(employeeId, reward) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/removeEmployeeReward/${employeeId}`,
        params: employeeId,
        data: reward
    })
}

export function removeEmployeePunishment(employeeId, punishment) {
    return Axios({
        method: 'delete',
        baseURL: BASE_URL,
        url: `/removeEmployeePunishment/${employeeId}`,
        params: employeeId,
        data: punishment
    })
}