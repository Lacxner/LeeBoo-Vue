import { Message } from 'element-ui'

/**
 * 后端消息处理，处理响应status为200时的一切消息
 *  - 400：通用的错误消息
 *  - 401：未登录时的错误消息
 *  - 402：逾期自动下线或被挤下线时的错误消息
 *  - 403：授权拒绝时的错误消息
 *  - 200：通用的成功消息
 */
export function handle(response) {
    if (response && response.message) {
        if (response.code == 400) {
            Message.error({ message: response.message })
            return 
        } else if(response.code == 401) {
            Message.error({ message: response.message })
        } else if(response.code == 402) {
            Message.error({ message: response.message })
        } else if (response.code == 403) {
            Message.error({ message: response.message })
            return
        } else {
            Message.success({ message: response.message })
        }
    }
}

/**
 * 系统消息处理，处理响应status为非200时的一切消息
 */
export function system(error) {
    if (error.response.status == 404 || error.response.status == 504) {
        Message.error({ message: '访问的页面不存在！' })
    } else if (error.response.status == 403) {
        Message.error({ message: '您权限不足！' })
    } else if (error.response.status == 401){
        Message.error({ message: '您尚未登录！' })
    } else if (error.response.status == 500){
        Message.error({ message: '服务器错误！' })
    } else {
        Message.error({ message: '未知错误！' })
    }
}