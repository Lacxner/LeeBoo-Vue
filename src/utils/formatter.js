/**
 * 格式化器处理日期所对应的格式
 *  - Standrad：2020-09-21 00:32:13
 *  - Human：2020年09月21日 00:32:13
 *  - Row：Mon Sep 21 2020 00:32:13 GMT+0800 (中国标准时间)
 * 
 */

 /**
  * 将日期从 Row 格式转换至 Standrad 格式
  */
export function formatDateR2S(rowDate) {
    let year = rowDate.getFullYear()
    let month = rowDate.getMonth() + 1
    let day = rowDate.getDate()

    if (month < 10) {
        month = '0' + month
    }
    if (day < 10) {
        day = '0' + day
    }
    return year + '-' + month + '-' + day
}

 /**
  * 将日期从 Standrad 格式转换至 Human 格式
  */
export function formatDateS2H(standardDate) {
    return standardDate.substr(0, 4) + '年' + standardDate.substr(5, 2) + '月' + standardDate.substr(8, 2) + '日'
}