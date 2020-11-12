/**
 * @Description: 生成唯一标志符
 * @returns {string}
 */
export function createUniqueString() {
  const timestamp = +new Date() + ''
  const randomNum = Math.floor((1 + Math.random()) * 65536)
  return (+(randomNum + timestamp)).toString(32)
}

/**
 * @Description: 简单数组去重
 * @param {Array} arr
 * @returns {Array}
 */
export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

/**
 * @Description: 深拷贝对象或数组
 * @param {Array || Object} data
 * @returns {Array || Object}
 */
export function deepClone(data) {
  const type = Object.prototype.toString.call(data)
  if (type === '[object Object]' || type === '[object Array]') {
    return JSON.parse(JSON.stringify(data))
  }
  return data
}

/**
 * @Description: 数组字符串化
 * @param {Array} data
 * @returns {String}
 */
export function flatIds(data = []) {
  let str = '';
  (data || []).forEach(item => {
    str += `|${item.id}`
  })
  return str ? str.substring(1, str.length) : str
}

/**
 * @Description: 字符串是否为空
 * @param {String} str
 * @returns {Boolean}
 */
export function notEmptyStr(str) {
  return str !== '' && str !== null && str !== undefined
}

/**
 * @Description: 递归获取数组可能存在组合
 * @param {Array, Number, Array} DimensionArray 多维数组 index 层级 currentArray 当前数组
 * @returns {Array}
 */
export function generateDimensionalCompose(DimensionArray = []) {
  if (DimensionArray.length === 0) return []
  const results = [] // 最终组合集
  const _recursive = (DimensionArray, index, currentArray) => {
    // 是否到最低层级
    if (index >= DimensionArray.length) {
      results.push({ ...DimensionArray[index], tags: deepClone(currentArray) })
    } else {
      // 循环递归
      (DimensionArray[index].tags || []).forEach(item => {
        if (item.selected) {
          // 累加当前数组
          currentArray.push({ ...item, specName: DimensionArray[index].name })
          // 递归
          _recursive(DimensionArray, index + 1, currentArray)
          currentArray.pop()
        }
      })
    }
  }
  _recursive(DimensionArray, 0, [])
  return results
}
