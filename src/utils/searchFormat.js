import { MatchType, DataType } from '@/constants/search'
import { dataType, isEmptyObject } from './util'

// 过滤空筛选条件
function filterEmptyData(data) {
  const results = {}
  Object.keys(data).map(key => {
    const item = data[key]
    const valueType = dataType(item.value)
    if (item.value === false || item.value === 0 || (item.value && ((valueType !== 'Array') || (valueType === 'Array' && item.value.length)))) {
      results[key] = { ...item }
    }
  })
  return results
}

function matchSearchDataType(obj) {
  let typeStr = dataType(obj).toUpperCase()
  if (!DataType[typeStr]) throw new Error(`找不到匹配类型 ${typeStr}`)
  return DataType[typeStr]
}

export default function searchFormat(data) {
  const newData = filterEmptyData(data)
  if (isEmptyObject(newData)) return []

  const results = []
  Object.keys(newData).forEach(key => {
    const item = newData[key]
    const itemObject = {
      'tempMatchType': MatchType[item.matchType],
      'propertyName': item.name || key,
      'propertyValue1': item.value
    }
    if (dataType(item.value) === 'Array') {
      item.value.forEach((value, index) => {
        itemObject[`propertyValue${++index}`] = value
      })
    }
    // 架构师要求顺序 tempMatchType > propertyName > propertyValue1 > tempType
    itemObject['tempType'] = item.tempType || matchSearchDataType(item.value)
    results.push(itemObject)
  })
  return results
}
