<template>
  <div>
    <span>{{label}}</span>
    <span>{{category0}}-{{category1}}-{{category2}}</span>
  </div>
</template>

<script>
import { findBaseCategoryById } from '@/api/baseCategory'

export default {
  name: 'CategoryShow',
  props: {
    id: String,
    label: {
      type: String,
      default: '所属分类：'
    }
  },
  data() {
    return {
      category0: '',
      category1: '',
      category2: ''
    }
  },
  watch: {
    id: {
      handler: function(newVal) {
        if (newVal) {
          const ids = newVal.split('|')
          ids.map((id, idx) => {
            findBaseCategoryById({ id })
              .then(res => {
                if (res.code === 200) {
                  let result = res.result || {}
                  this['category' + idx] = result.name
                }
              })
              .catch(() => {})
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
