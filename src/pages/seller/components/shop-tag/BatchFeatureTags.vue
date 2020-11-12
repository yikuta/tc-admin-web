<template>
  <div class="wrapper">
      <p>显示在门店名称后方，只能选择一个哦~</p>
      <el-radio-group v-model="characteristicTags">
        <el-radio v-for="item in dataList" :label="item.code" :key="item.code">{{item.name}}</el-radio>
      </el-radio-group>
  </div>
</template>

<script>
import { findDataListByCode } from '@/api/common'
export default {
  name: 'BatchFeatureTags',
  props: {
    characteristicTag: String
  },
  data() {
    return {
      dataList: []
    }
  },
  mounted() {
    this.handleDataList()
  },
  computed: {
    characteristicTags: {
      get() {
        return this.characteristicTag
      },
      set(val) {
        this.$emit('update:characteristicTag', val)
      }
    }
  },
  methods: {
    handleDataList() {
      findDataListByCode('characteristic_tag').then(res => {
        if (res.code === 200) {
          this.dataList = res.result || []
        } else {
          this.dataList = []
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
