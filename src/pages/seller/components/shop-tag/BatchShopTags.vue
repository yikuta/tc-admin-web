<template>
  <div class="wrapper">
      <p>显示在首页门店LOGO上方，只能选择一个哦~</p>
      <el-radio-group v-model="shopLogoTags">
        <el-radio v-for="item in dataList" :label="item.code" :key="item.code">{{item.name}}</el-radio>
      </el-radio-group>
    <!-- <el-form ref="form" :model="form" inline size="small">
      <el-row style="margin-top:10px">
        <el-form-item label="">
          <el-radio-group v-model="form.shopLogoTag">
            <el-radio v-for="item in dataList" :label="item.code" :key="item.code">{{item.name}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-row>
    </el-form> -->
  </div>
</template>

<script>
import { findDataListByCode } from '@/api/common'
export default {
  name: 'BatchShopTags',
  props: {
    shopLogoTag: String
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
    shopLogoTags: {
      get() {
        return this.shopLogoTag
      },
      set(val) {
        this.$emit('update:shopLogoTag', val)
      }
    }
  },
  methods: {
    handleDataList() {
      findDataListByCode('shop_logo_tag').then(res => {
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
