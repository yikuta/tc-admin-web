<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="广告位类型" prop="type.value">
        <el-select v-model="form.type.value">
          <el-option v-for="item of typeOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属终端" prop="terminal.value">
        <el-select v-model="form.terminal.value">
          <el-option v-for="item of terminalOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status.value">
        <el-select v-model="form.status.value">
          <el-option v-for="item of statusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
      <el-button type="primary" size="mini" @click="handleAdd">添加广告位</el-button>
    </div>
  </el-card>
</template>

<script>
import { AD_TYPE, TERMINAL } from '../../constants'
import { MatchType, DataType } from '@/constants/search'
import { reqAdvertisingSpaceInit } from '@/api/advertising'

export default {
  name: 'Search',
  mounted() {
    this._reqAdvertisingSpaceInit()
  },
  data() {
    return {
      form: {
        type: { value: '', name: 'positionType', matchType: MatchType.EQUAL, type: DataType.STRING },
        terminal: { value: '', name: 'positionTerminal', matchType: MatchType.EQUAL, type: DataType.STRING },
        status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      typeOptions: [
        { key: '全部', value: '' },
        { key: '开屏', value: AD_TYPE.OPEN },
        { key: '弹屏', value: AD_TYPE.POP_UP },
        { key: 'Banner', value: AD_TYPE.BANNER },
        { key: '图片广告', value: AD_TYPE.IMAGE },
        { key: '文字广告', value: AD_TYPE.TEXT },
        { key: '浮窗广告', value: AD_TYPE.FLOAT }
      ],
      terminalOptions: [
        { key: '全部', value: '' },
        { key: '天呈生活APP', value: TERMINAL.LIFE_APP },
        { key: '天呈生活小程序', value: TERMINAL.LIFE_MP },
        { key: '天呈净菜小程序', value: TERMINAL.CLEAN_MP }
      ],
      statusOptions: [
        { key: '全部', value: '' },
        { key: '已启用', value: 'ON' },
        { key: '已停用', value: 'OFF' }
      ]
    }
  },
  methods: {
    submitQuery() {
      this.$emit('on-search')
    },
    /**
     * @description: 添加广告位
     */
    handleAdd() {
      this.$router.push({ name: 'advertisingSpaceForm' })
    },
    /**
     * @description: 重置
     */
    handleReset() {
      this.$refs['form'].resetFields()
    },
    /**
     * @description: 初始化
     */
    _reqAdvertisingSpaceInit() {
      return reqAdvertisingSpaceInit()
        .then(res => {
          if (res.code === 200) {
            const defaultItem = { key: '全部', value: '' }
            let result = res.result || {}
            let positionTypes = result.positionTypes || []
            this.typeOptions = positionTypes.map(item => {
              return { key: item.name, value: item.code }
            })
            this.typeOptions.unshift(defaultItem)
            let positionTerminalTypes = result.positionTerminalTypes || []
            this.terminalOptions = positionTerminalTypes.map(item => {
              return { key: item.name, value: item.code }
            })
            this.terminalOptions.unshift(defaultItem)
            let positionStatus = result.positionStatus || []
            this.statusOptions = positionStatus.map(item => {
              return { key: item.name, value: item.code }
            })
            this.statusOptions.unshift(defaultItem)
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.search-content {
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      .el-select {
        width: 100%;
      }
    }
  }
  .search-btn {
    text-align: right;
  }
}
</style>
