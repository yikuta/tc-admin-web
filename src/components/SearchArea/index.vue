<template>
  <!-- 地址筛选 -->
  <div class="area-box">
    <el-select v-model="provinceId"
               placeholder="请选择"
               @change='val=>handleChange(val,"city")'
               :style="{width}"
               clearable>
      <el-option v-for="item in provinceList"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
      </el-option>
    </el-select>
    <el-select v-model="cityId"
               :style="{width}"
               placeholder="请选择"
               clearable
               @change='val=>handleChange(val, "area")'>
      <el-option v-for="item in cityList"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
      </el-option>
    </el-select>
    <el-select v-model="districtId"
               :style="{width}"
               clearable
               placeholder="请选择"
               @change='val=>handleChange(val,"")'>
      <el-option v-for="item in areaList"
                 :key="item.code"
                 :label="item.name"
                 :value="item.code">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import { findAllProvince, findAreasByCode } from '@/api/common'
export default {
  props: {
    width: { type: String },
    provinceId: { type: [Number, String], default: '' },
    cityId: { type: [Number, String], default: '' },
    districtId: { type: [Number, String], default: '' }
  },
  data() {
    return {
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  methods: {
    handleReceiveProvinceList() {
      findAllProvince().then(res => {
        if (res.code === 200) {
          this.provinceList = res.result || []
        }
      })
    },
    handleChange(code, name) {
      if (code && name) {
        findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []

            if (name === 'city') {
              this.cityId = ''
              this.districtId = ''
            } else {
              this.districtId = ''
            }
          } else {
            this[`${name}List`] = []
          }
        })
      }
      this.$emit('update:provinceId', this.provinceId)
      this.$emit('update:cityId', this.cityId)
      this.$emit('update:districtId', this.districtId)
    },
    reset() {
      this.cityList = []
      this.areaList = []
    }
  },
  created() {
    this.handleReceiveProvinceList()
  }
}
</script>

<style lang="scss" scoped>
.area-box {
}
</style>