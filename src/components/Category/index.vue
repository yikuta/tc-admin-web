<template>
  <div>
    <el-cascader :props="props" @change="handleChange" ref="cascader"></el-cascader>
  </div>
</template>

<script>
  import { getBaseCategoryList } from '@/api/baseCategory'
  export default {
    name: 'Category',
    data() {
      return {
        props: {
          lazy: true,
          lazyLoad(node, resolve) {
            let id = null
            if (node.level !== 0) {
              id = node.data.value
            }
            getBaseCategoryList({
              parentId: id
            }).then(res => {
              if (res.result && res.code === 200) {
                const nodes = res.result.map(item => ({
                  value: item.id,
                  label: item.name,
                  leaf: node.level >= 2
                }))
                resolve(nodes)
              }
            }).catch()
          }
        }
      }
    },
    methods: {
      handleChange(val) {
        // this.$emit('change', value)
        const obj = {
          value: val,
          label: []
        }
        const node = this.$refs.cascader.getCheckedNodes()
        const fn = (item) => {
          obj.label.unshift(item.data.label)
          if (item.parent) {
            fn(item.parent)
          }
        }
        fn(node[0])
        this.$emit('change', obj)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
