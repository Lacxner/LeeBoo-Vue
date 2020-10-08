import Axios from '@/utils/interceptor'

/**
 * 这里无需传入用户Id值，获取菜单的用户Id在由后端中自己获得
 */
export function getAllMenus() {
    return Axios({
        method: 'get',
        url: '/getAllMenus'
    })
}