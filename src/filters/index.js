// 给商品价格加补 ￥
const money = (value) => {
  value = value ? Number(value) : ''
  return value || value === 0 ? '￥' + value.toFixed(2) : '-'
}
// 提取状态的describle
const statusDescrible = (value) => {
  return value || value === 0 ? value.describe : '-'
}
// 时间转换
export const format = function(time, format) {
  if (!time) return '-'
  let t = new Date(time)
  let tf = function(i) { return (i < 10 ? '0' : '') + i }
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear())
      case 'MM':
        return tf(t.getMonth() + 1)
      case 'mm':
        return tf(t.getMinutes())
      case 'dd':
        return tf(t.getDate())
      case 'HH':
        return tf(t.getHours())
      case 'ss':
        return tf(t.getSeconds())
    }
  })
}
export default { money, statusDescrible, format }
