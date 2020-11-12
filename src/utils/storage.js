import store from 'store2'

const baseKey = 'public'

/**
 * 添加
 * 传入一个参数，默认存储在baseKey中;
 * 传多个参数，
 * 若第一个参数是string：
 *      则作为键，且只保存最后一个参数的值
 * 不为string:
 *      则默认保存在baseKey中，只保存最后一个参数的值
 * @return 前一个值
 */
export const add = (...arg) => {
  if (arg.length === 1) {
    return store(baseKey, arg[0])
  }
  if (arg.length !== 0) {
    if (typeof arg[0] === 'string') {
      return store(arg[0], arg[arg.length - 1])
    }
    return store(baseKey, arg[arg.length - 1])
  }
  return ['请至少设置一个入参']
}

/**
 * 追加
 * keys格式: 'xxxx.xxxx.xxxxx' 例如：'public.test.inner'
 * 在localStorage中就会存储成如下格式
 * public:{
 *    test:{
 *      inner:value
 *    }
 * }
 * 如果keys只有一层 例如 'public' 那么不会覆盖原有的值
 * 如果keys第一层取得的值不是一个对象，那么不会追加成功
 */
export const alter = (keys, value) => {
  if (!keys) {
    return
  }
  const keyList = keys.split('.')
  store.transact(keyList[0], (obj) => {
    if (!obj) obj = {}
    if (typeof obj !== 'object') return
    keyList.reduce((pre, key, idx) => {
      if (idx === 0) return pre
      if (idx === keyList.length - 1) {
        pre[key] = value
        return pre[key]
      }
      if (!pre[key] || typeof pre[key] !== 'object') {
        pre[key] = {}
      }
      return pre[key]
    }, obj)
    return obj
  })
}

/**
 * 删除
 * 参数为string直接删除；
 * 参数为数组和对象则遍历key删除；
 * @return 返回删除后的值
 */
export const remove = (keys) => {
  if (!keys) {
    return ['请至少设置一个入参']
  }
  switch (getType(keys)) {
    case 'String': {
      return store.remove(keys)
    }
    case 'Array': {
      let res = []
      keys.forEach(key => {
        res.push(store.remove(key))
      })
      return res
    }
    case 'Object': {
      let res = []
      Object.keys(keys).forEach(key => {
        res.push(store.remove(key))
      })
      return res
    }
    default: return ['key只支持string，array，object']
  }
}

export const rmAll = () => {
  store.clearAll()
}

/**
 * @param key
 * @param callback 回调函数，接收key，和value
 */
export const get = (key, callback) => {
  if (!key) {
    return store(callback)
  }
  return store.get(key, callback)
}

/**
 * @description: 内部工具 获取数据类型
 * @param data
 * @return: 数据类型
 */
const getType = (data) => {
  return /\s([A-Za-z]+)\]$/.exec(Object.prototype.toString.apply(data, null))[1]
}

export default {
  add,
  remove,
  rmAll,
  get,
  alter
}
