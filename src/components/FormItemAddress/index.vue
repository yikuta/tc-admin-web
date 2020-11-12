<template>
  <el-form-item :label="label" :prop="prop">
    <el-cascader
      v-model="value"
      :placeholder="placeholder"
      :options="areaList"
      :props="props"
      :show-all-levels="false"
      clearable
      @change="handleChange"
      popper-class="select-address"
    >
    </el-cascader>
  </el-form-item>
</template>
<script>
  import { deepClone } from '@/utils/util'
  export default {
    name: 'FormItemAddress',
    data() {
      return {
        props: {
          checkStrictly: true,
          multiple: false,
          emitPath: true,
          value: 'code',
          label: 'name'
        },
        province: {},
        city: {},
        country: {}
      }
    },
    props: {
      value: {
        type: [Array, String],
        default: () => []
      },
      label: String,
      prop: String,
      valueKey: {
        type: String,
        default: 'code' // id
      },
      deep: {
        type: Number,
        default: 3
      },
      placeholder: {
        type: String,
        default: '请选择地址'
      }
    },
    computed: {
      span: function() {
        return 24 / this.deep
      },
      areaList: function() {
        if (this.deep === 2) {
          const newList = deepClone(this.$store.state.global.areaList)
          newList.forEach(province => {
            (province.children || []).forEach(city => {
              delete city.children
            })
          })
          return newList
        }
        return this.$store.state.global.areaList
      }
    },
    mounted() {
      if (this.valueKey === 'id') {
        this.props.value = 'id'
      }
      this.fetchAreaList()
    },
    methods: {
      fetchAreaList() {
        if (!this.areaList.length) {
          this.$store.dispatch('getAreaList')
        }
      },
      handleChange(value) {
        this.$emit('input', value)
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
