export function deeper(val){
    // val == null会判断变量undefiend和null
    if (typeof(val) !== 'object' || val == null) {
        // console.log(1)
        return val
    }

    let res

    if (val instanceof Array) {
        res = []
    } else if (val instanceof Object){
        res = {}
    }

    for (let key in val) {
        // 保证Key不是原型属性
        if (val.hasOwnProperty(key)) {
            res[key] = deeper(val[key])
        } 
    }

    return res
}