function generateForm(val) {
  let formData = new FormData()
  for (let i in val) {
    isArray(val[i], i)
  }
  function isArray(array, key) {
    if (array === undefined || typeof array === 'function' || array === null) {
      return false
    }
    if (typeof array !== 'object') {
      formData.append(key, array)
    } else if (array instanceof Array) {
      if (array.length === 0) {
        // formData.append(`${key}`, '')
      } else {
        for (let i in array) {
          if (typeof i !== 'object') {
            formData.append(`${key}[${i}]`, array[i])
          } else {
            for (let j in array[i]) {
              isArray(array[i][j], `${key}[${i}].${j}`)
            }
          }
        }
      }
    } else {
      let arr = Object.keys(array)
      if (arr.indexOf('uid') === -1) {
        for (let j in array) {
          isArray(array[j], `${key}.${j}`)
        }
      } else {
        formData.append(`${key}`, array)
      }
    }
  }
  return formData
}

export default generateForm
