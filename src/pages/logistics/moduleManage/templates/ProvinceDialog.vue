<template>
  <div class="wrapper">
    <el-dialog
      title="选择区域"
      :visible="visible"
      @update:visible="onChange"
      :width="width"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-checkbox
        :indeterminate="isCheckAllIndeterminate"
        v-model="checkAll"
        @change="onCheckAllChange"
      >全选</el-checkbox>
      <el-checkbox-group v-model="checkedAreas" class="checkbox-group">
        <template v-for="(area, index) in areasList">
          <div class="checkbox-item" :key="area.code" :style="{ width: span }">
            <el-checkbox
              :indeterminate="area.indeterminate"
              :label="area"
              :key="area.code"
              :disabled="isDisabledCheckBox(area.code)"
              @change="val => onCheckChange(val, area)"
            >
              {{area.name}}{{area.checkedChildren && area.checkedChildren.length ? `(${area.checkedChildren.length})` : null}}
            </el-checkbox>
            <i
              v-if="isShowCheckCities(area.code)"
              class="el-icon-caret-bottom"
              :key="area.code + index"
              @click="handleCheckCities(area)"
            ></i>
          </div>
        </template>
      </el-checkbox-group>
      <span v-if="type === 'province'" slot="footer" class="dialog-footer">
        <el-button type="plain" size="mini" @click="onChange(false)">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSave">保存</el-button>
      </span>
    </el-dialog>
    <city-dialog
      v-if="this.disabledCity"
      ref="city"
      :visible.sync="cityDialogVisible"
      type="city"
      width="40%"
      span="30%"
      :disabledCity="disabledCityArray"
      :parentNode="provinceNode"
    />
  </div>
</template>

<script>
import { findAllProvince } from '@/api/common'
import CityDialog from './CityDialog'
import { deepClone } from '@/utils/util'

export default {
  name: 'AreaDialog',
  components: { CityDialog },
  props: {
    provinces: Array,
    indeterminateProvince: {
      type: Object,
      default: () => ({})
    },
    disabledProvince: Array,
    disabledCity: Object,
    visible: Boolean,
    type: { type: String, default: 'province' }, // city
    width: { type: String, default: '50%' },
    span: { type: String, default: '25%' }
  },
  data() {
    return {
      checkAll: false, // 是否全选
      isCheckAllIndeterminate: false, // 全选 模糊状态
      areasList: [], // 全部省份列表
      checkedAreas: [], // 选择的省份
      cityDialogVisible: false, // 显示城市dialog
      provinceNode: {},
      disabledCity: []
    }
  },
  computed: {
    provinceCodes: function() {
      return (this.provinces ? deepClone(this.provinces) : []).map(item => item.code)
    },
    disabledCityArray: function() {
      let disabledCities = this.disabledCity[this.provinceNode.code]
      return disabledCities ? disabledCities.checkedChildren : []
    }
  },
  methods: {
    isDisabledCheckBox(code) {
      if (this.disabledProvince.length === 0) return false
      for (let item of this.disabledProvince) {
        if (item.code === code) {
          return true
        }
      }
      if (this.disabledCity[code]) {
        return true
      }
      return false
    },
    isShowCheckCities(code) {
      if (this.disabledProvince.length === 0) return true
      for (let item of this.disabledProvince) {
        if (item.code === code) {
          return false
        }
      }
      return true
    },
    // 查询所有省份
    fetchAllProvince() {
      return findAllProvince().then(res => {
        if (res.code === 200) {
          let result = res.result || []
          this.areasList = result.sort((pre, next) => (pre.prefix > next.prefix ? 1 : -1))
        }
      })
    },
    async handleOpen() {
      if (!this.areasList.length) {
        await this.fetchAllProvince()
      }
      const checkedAreas = []
      this.areasList.forEach(item => {
        if (this.provinceCodes.includes(item.code)) {
          checkedAreas.push(item)
          item.checked = true
        } else if (this.indeterminateProvince[item.code]) {
          item.checkedChildren = this.indeterminateProvince[item.code].checkedChildren
          item.indeterminate = true
        }
      })
      this.checkedAreas = checkedAreas
    },
    // 关闭dialog
    handleClose() {
      this.areasList.forEach(item => {
        item.checked = false
        item.indeterminate = false
        item.checkedChildren = [];
        (item.children || []).forEach(city => { city.checked = false })
      })
      this.onChange(false)
    },
    // 查看城市
    handleCheckCities(node) {
      if (!this.provinceCodes.includes(node.code)) {
        this.provinceNode = node
        this.provinceNode.cities = this.provinceNode.cities || []
        this.provinceNode.checkedChildren = this.provinceNode.checkedChildren || []
        this.cityDialogVisible = true
      }
    },
    // change visible
    onChange(visible) {
      this.$emit('update:visible', visible)
    },
    // 全选
    onCheckAllChange(checked) {
      this.isCheckAllIndeterminate = false
      this.areasList.forEach(item => {
        item.checked = checked
        item.indeterminate = false
      })
      this.checkedAreas = checked ? [...this.areasList] : []
    },
    // 单个区域被勾选
    onCheckChange(checked, province) {
      province.checked = checked
      province.indeterminate = false
      this.areasList.forEach(item => {
        if (!item.checked) {
          this.checkAll = false
        }
        if (item.checked && !this.checkAll) {
          this.isCheckAllIndeterminate = true
        }
      })
    },
    // 保存
    handleSave() {
      const provinces = []
      const indeterminateProvince = {}
      this.areasList.forEach(item => {
        if (item.checked) {
          provinces.push({
            code: item.code,
            name: item.name
          })
        } else if (item.indeterminate) {
          indeterminateProvince[item.code] = {
            code: item.code,
            name: item.name,
            checkedChildren: item.checkedChildren
          }
        }
      })
      this.$emit('save', provinces, indeterminateProvince)
      this.onChange(false)
    }
  }
}
</script>

<style lang='scss' scoped>
  .wrapper {
    /deep/ .el-dialog__body {
      padding: 0 20px 10px;
    }
    .checkbox-group {
      display: flex;
      flex-wrap: wrap;

      .checkbox-item {
        margin-top: 5px;
        margin-bottom: 5px;

        i {
          font-size: 14px;
        }
      }
    }
  }
</style>
