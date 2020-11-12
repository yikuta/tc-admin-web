<template>
  <div class="wrapper">
    <el-dialog title="查看广告位信息" :visible="visible" @update:visible="onChange" width="25%">
      <el-row v-for="{key,value} of config[0]" :key="key">
        <el-col :span="8">{{key}}</el-col>
        <el-col :span="16">{{formatValue(value,fetchData[value])}}</el-col>
      </el-row>
      <template v-if="type">
        <el-row v-for="({key,value},idx) of config[type]" :key="idx">
          <el-col :span="8">{{key}}</el-col>
          <el-col :span="16">{{formatValue(value,fetchData[value])}}</el-col>
        </el-row>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onChange(false)">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { AD_TYPE } from '../../constants'

export default {
  name: 'CheckView',
  props: {
    visible: Boolean,
    fetchData: { type: Object, default: () => ({}) },
    type: { type: Number | String | null }
  },
  data() {
    // 格式化
    this.formatValue = (key, value) => {
      const getVal = {
        autoClose: () => (value ? '是' : '否'),
        advOccupy: () => (value ? '是' : '否'),
        default: () => value
      }
      return (getVal[key] || getVal.default)()
    }
    return {
      config: {
        // 0-公共字段
        0: [
          { key: '广告位编码', value: 'positionCode' },
          { key: '广告位名称', value: 'positionName' },
          { key: '广告位类型', value: 'positionType' },
          { key: '所属终端', value: 'positionTerminal' }
        ],
        [AD_TYPE.OPEN]: [
          { key: '图片宽度', value: 'advWidth' },
          { key: '图片高度', value: 'advHeight' },
          { key: '是否自动关闭', value: 'autoClose' },
          { key: '自动关闭时间', value: 'closeTime' }
        ],
        [AD_TYPE.POP_UP]: [
          { key: '图片宽度', value: 'advWidth' },
          { key: '图片高度', value: 'advHeight' },
          { key: '弹屏图片张数', value: 'totalQuantity' },
          { key: '是否自动关闭', value: 'autoClose' },
          { key: '自动关闭时间', value: 'closeTime' }
        ],
        [AD_TYPE.BANNER]: [
          { key: '轮播图片张数', value: 'totalQuantity' },
          { key: '图片宽度', value: 'advWidth' },
          { key: '图片高度', value: 'advHeight' },
          { key: '无广告时占位', value: 'advOccupy' }
        ],
        [AD_TYPE.IMAGE]: [
          { key: '图片宽度', value: 'advWidth' },
          { key: '图片高度', value: 'advHeight' },
          { key: '无广告时占位', value: 'advOccupy' }
        ],
        [AD_TYPE.TEXT]: [
          { key: '文字条数', value: 'totalQuantity' },
          { key: '无广告时占位', value: 'advOccupy' }
        ],
        [AD_TYPE.FLOAT]: [
          { key: '图片宽度', value: 'advWidth' },
          { key: '图片高度', value: 'advHeight' },
          { key: '无广告时占位', value: 'advOccupy' }
        ]
      }
    }
  },
  methods: {
    onChange(visible) {
      this.$emit('update:visible', visible)
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  /deep/ .el-col {
    margin-bottom: 20px;
  }
}
</style>
