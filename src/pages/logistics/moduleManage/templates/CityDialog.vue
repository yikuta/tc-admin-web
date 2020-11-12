<template>
  <div class="wrapper">
    <el-dialog
      title="选择城市"
      :visible="visible"
      @update:visible="onChange"
      :width="width"
      @close="handleClose"
      @open="handleOpen"
    >
      <el-checkbox-group
        class="checkbox-group"
        v-model="checkedChildren"
        @change="handleCheckedCitiesChange"
      >
        <div
          class="checkbox-item"
          v-for="city in parentNode.children"
          :key="city.code"
          :style="{ width: span }"
        >
          <el-checkbox
            :label="city"
            :key="city.code"
            v-model="city.checked"
            :disabled="isDisabledCheckBox(city.code)"
            @change="value => onCheckChange(value, city)"
          >{{city.name}}</el-checkbox>
        </div>
      </el-checkbox-group>
    </el-dialog>
  </div>
</template>

<script>
  import { findAreasByCode } from '@/api/common'
  import { deepClone } from '@/utils/util'

  export default {
    name: 'AreaDialog',
    props: {
      visible: Boolean,
      type: { type: String, default: 'province' }, // city
      width: { type: String, default: '33%' },
      span: { type: String, default: '20%' },
      parentNode: {
        type: Object,
        default: () => ({})
      },
      disabledCity: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        checkedChildren: []
      }
    },
    methods: {
      isDisabledCheckBox(code) {
        if (this.disabledCity.length === 0) return false
        for (let item of this.disabledCity) {
          if (item.code === code) {
            return true
          }
        }
        return false
      },
      async handleOpen() {
        if (!this.parentNode.children || !this.parentNode.children.length) {
          await this.fetchCitiesByProvinceCode()
        }
        const childrenNodes = this.parentNode.children
        const checkedCodes = (deepClone(this.parentNode.checkedChildren) || []).map(item => item.code)
        if (this.parentNode.checked) { // 全选
          this.checkedChildren = [...childrenNodes]
          childrenNodes.forEach(item => { item.checked = true })
        } else if (this.parentNode.indeterminate) { // 部分选中
          childrenNodes.forEach(item => {
            if (checkedCodes.includes(item.code)) {
              this.checkedChildren.push(item)
              item.checked = true
            } else {
              item.checked = false
            }
          })
        } else { // 一个没选中
          this.checkedChildren = []
          childrenNodes.forEach(item => { item.checked = false })
        }
      },
      handleClose() {
        this.onChange(false)
      },
      onChange(visible) {
        this.$emit('update:visible', visible)
      },
      // 查省份下的城市
      fetchCitiesByProvinceCode() {
        return findAreasByCode({ code: this.parentNode.code }).then(res => {
          if (res.code === 200) {
            this.parentNode.children = res.result || []
          }
        })
      },
      handleCheckedCitiesChange(value) {
        let checkedCount = value.length
        let childrenLength = this.parentNode.children.length
        this.parentNode.checked = checkedCount === childrenLength
        this.parentNode.indeterminate = checkedCount > 0 && checkedCount < childrenLength
        this.parentNode.checkedChildren = deepClone(this.checkedChildren).map(item => ({
          code: item.code,
          name: item.name
        }))
      },
      onCheckChange(checked, city) {
        city.checked = checked
      }
    }
  }
</script>

<style lang='scss' scoped>
  .wrapper {
    /deep/ .el-dialog__body {
      padding: 0 20px 20px;
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
