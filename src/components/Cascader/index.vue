<template>
  <div>
    <el-cascader
      :size="size"
      ref="cascader"
      v-model="value"
      :props="props"
      @change="handleChange"
      clearable
      :placeholder="placeholder"
    ></el-cascader>
  </div>
</template>

<script>
export default {
  name: 'Cascader',
  props: {
    receivedValue: {
      type: Array
    },
    ajax: {
      type: Function,
      required: true
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    leafLevel: {
      type: Number,
      default: 2
    },
    size: {
      type: String,
      default: 'mini'
    }
  },
  model: {
    prop: 'receivedValue',
    event: 'on-change-cascader'
  },
  watch: {
    receivedValue: {
      handler: function(newVal) {
        this.value = newVal
      },
      deep: true,
      immediate: true
    }
  },
  data() {
    const _this = this
    return {
      props: {
        checkStrictly: this.checkStrictly,
        lazy: true,
        lazyLoad(node, resolve) {
          _this
            .ajax(node.value)
            .then(res => {
              let nodes = res.result || []
              nodes = nodes.map(item => ({
                value: item.id,
                label: item.name,
                leaf: node.level >= _this.leafLevel
              }))
              resolve(nodes)
            })
            .catch(() => {
              resolve([])
            })
        }
      },
      value: ''
    }
  },
  methods: {
    handleChange(val) {
      this.$emit('on-change-cascader', val, this.$refs.cascader.getCheckedNodes())
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
