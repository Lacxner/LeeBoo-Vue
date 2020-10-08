import Axios from '@/utils/interceptor'


export function getAllHrsWithoutMyself() {
    return Axios({
        method: 'get',
        url: '/getAllHrsWithoutMyself'
    })
}