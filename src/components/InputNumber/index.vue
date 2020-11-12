<template>
  <el-input
    type="text"
    :size="size"
    v-model="value"
    :placeholder="placeholder"
    @input="handleInput"
    @blur="handleBlur"
  />
</template>
<script>
  import { notEmptyStr } from '@/utils/util'
  export default {
    name: 'InputNumber',
    props: {
      size: {
        type: String,
        default: 'mini'
      },
      value: {
        type: [String, Number],
        default: null
      },
      placeholder: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'integer'
      }
    },
    methods: {
      handleInput(newValue) {
        if (notEmptyStr(newValue) && newValue !== '0') {
          let value = newValue.toString()
          if (this.type === 'integer') {
            if (value.substr(0, 1) === '0') { // 整数不能以0开头
              value = value.substr(1)
            }
            value = value.replace(/\D/g, '')
          } else {
            if (value.substr(0, 1) === '0' && value.substr(0, 2) !== '0.') {
              value = value.substr(1)
            }
            value = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
          }
          this.value = value
        } else {
          this.value = newValue
        }
        this.$emit('input', Number(this.value))
      },
      handleBlur() {
        const value = String(this.value)
        if (notEmptyStr(value) && value.substr(-1) === '.') {
          this.value = value.substring(0, value.length - 1)
          this.$emit('input', Number(this.value))
        }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
