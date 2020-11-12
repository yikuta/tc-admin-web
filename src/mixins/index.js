/* eslint-disable */
const mixin = {
  methods: {
    formatNoneValue(val) {
      return val ? val : val === 0 ? 0 : '-'
    },
    formatMoney(val) {
      return (val || val === 0) ? val.toFixed(2) : '-'
    },
    /**
     * @description: 获取图片尺寸
     */
    getImageMeasure(file) {
      return new Promise((resolve) => {
        const fileReader = new FileReader()
        fileReader.onload = e => {
          const image = new Image()
          image.onload = () => {
            resolve({
              width: image.width,
              height: image.height
            })
          }
          image.src = e.target.result
        }
        fileReader.readAsDataURL(file)
      })
    }
  }
}

export default {
  install: (Vue) => {
    Vue.mixin(mixin)
  }
}
