<template>
  <div class="wrapper">
    <el-dialog title="查看广告位信息" :visible="visible" @update:visible="onChange" width="25%">
      <el-row v-for="{key,value} of config[0]" :key="key">
        <el-col :span="8">{{key}}</el-col>
        <el-col :span="16">{{fetchData[value]}}</el-col>
      </el-row>
      <template v-if="type">
        <el-row v-for="({key,value},idx) of config[type]" :key="idx">
          <el-col :span="8">{{key}}</el-col>
          <el-col :span="16" v-if="type===2">
            <el-image style="width: 200px; height: 150px" :src="fetchData[value]" />
          </el-col>
          <el-col v-else :span="16">{{fetchData[value]}}</el-col>
        </el-row>
      </template>
      <el-row v-for="{key,value} of config[1]" :key="key">
        <el-col :span="8">{{key}}</el-col>
        <el-col :span="16">{{fetchData[value]}}</el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <el-button @click="onChange(false)">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'CheckView',
  props: {
    visible: Boolean,
    fetchData: { type: Object, default: () => ({}) },
    type: { type: Number | String | null }
  },
  data() {
    return {
      config: {
        // 0,1-公共字段 2-图片相关的广告 3-文字广告
        0: [
          { key: '广告名称', value: 'advertName' },
          { key: '广告位名称', value: 'positionName' },
          { key: '广告位类型', value: 'positionTypeDesc' },
          { key: '所属终端', value: 'positionTerminalDesc' },
          { key: '有效期', value: 'expiryDate' }
        ],
        1: [
          { key: '跳转类型', value: 'linkTypeDesc' },
          { key: '链接地址', value: 'linkUrl' },
          { key: 'APPID', value: 'appId' }
        ],
        2: [{ key: '广告图片', value: 'advertContentFullPath' }],
        3: [{ key: '广告文字', value: 'advertContent' }]
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
