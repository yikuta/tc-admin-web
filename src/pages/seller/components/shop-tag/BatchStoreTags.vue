<template>
  <div class="wrapper">
    <p>最多选择5个</p>
    <el-checkbox-group v-model="shopTagsList">
      <el-checkbox v-for="item in dataList" :label="item.code" :key="item.code">{{item.name}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { findDataListByCode } from '@/api/common'
export default {
  name: 'BatchSoreTags',
  props: {
    shopTags: Array
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
    shopTagsList: {
      get() {
        return this.shopTags
      },
      set(val) {
        this.$emit('update:shopTags', val)
      }
    }
  },
  methods: {
    handleDataList() {
      findDataListByCode('shop_tag_type').then(res => {
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
.wrapper {
  .el-form-item {
    margin-bottom: 0px;
  }
}
</style>
