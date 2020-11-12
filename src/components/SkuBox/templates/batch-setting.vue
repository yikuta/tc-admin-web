<template>
  <el-row class="batch-setting" v-if="effectiveSpecList.length">
    <span class="label">批量设置：</span>
    <template v-if="!isBatchSetting">
      <el-button
        plain
        v-for="item in columnsMap"
        v-if="!item.disabled && item.contentType !== 'text'"
        :key="item.value"
        @click="handleBatchSetting(item)"
        :size="size"
        :type="item.value === currentColumn.value ? 'primary' : 'default'"
      >{{item.name}}</el-button>
    </template>
    <template v-else>
      <el-input
        type="text"
        :size="size"
        style="width:200px;"
        v-model="batchValue"
        :placeholder="`输入${currentColumn.name || '批量数字'}`"
        @input="handleInput"
        @blur="handleBlur"
        @keyup.native.enter='handleConfirmBatch'
      />
      <el-button icon="el-icon-check" type="primary" :size="size" @click="handleConfirmBatch">确定</el-button>
      <el-button icon="el-icon-close" type="default" :size="size" @click="handleCancelBatch">取消</el-button>
    </template>
  </el-row>
</template>

<script>
  import { columnsMap } from '../config'
  import { notEmptyStr } from '../util'
  export default {
    name: 'batchSetting',
    props: {
      columnsMap: {
        type: Array,
        default: () => columnsMap
      },
      size: {
        type: String,
        default: 'small'
      },
      effectiveSpecList: {
        type: Array,
        default: () => []
      },
      skuList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        isBatchSetting: false,
        currentColumn: {},
        batchValue: ''
      }
    },
    methods: {
      handleBatchSetting(item) {
        this.isBatchSetting = true
        this.currentColumn = item
      },
      handleInput(value) {
        if (notEmptyStr(value) && value !== '0') {
          if (value.substr(0, 1) === '0') {
            value = value.substr(1)
          }
          if (this.currentColumn.type === 'integer') { // 整数和0类型
            this.batchValue = value.replace(/\D/g, '')
          } else {
            this.batchValue = value.replace(/^\D*(\d*(?:\.\d{0,2})?).*$/g, '$1')
          }
        }
      },
      handleBlur() {
        const value = this.batchValue
        if (notEmptyStr(value) && value !== '0' && value.substr(-1) === '.') {
          this.batchValue = value.substring(0, value.length - 1)
        }
      },
      // 确认批量编辑
      handleConfirmBatch() {
        if (notEmptyStr(this.batchValue)) {
          this.skuList.forEach(item => {
            this.$set(item, this.currentColumn.value, this.batchValue)
          })
          this.handleCancelBatch()
        } else {
          this.$message.warning('请输入批量' + this.currentColumn.name)
        }
      },
      // 取消批量编辑
      handleCancelBatch() {
        this.batchValue = ''
        this.isBatchSetting = false
        this.currentColumn = {}
      }
    }
  }
</script>

<style lang="scss" scoped>
  .batch-setting {
    padding-top: 12px
  }
</style>
