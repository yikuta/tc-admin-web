<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="版本号" prop="version.value">
        <el-input v-model="form.version.value" placeholder="请输入版本号" clearable></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="os.value">
        <el-select v-model="form.os.value">
          <el-option label="全部" value="" />
          <el-option v-for="item of typeOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端" prop="terminal.value">
        <el-select v-model="form.terminal.value">
          <el-option label="全部" value="" />
          <el-option v-for="item of terminalOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="强制升级" prop="force.value">
        <el-select v-model="form.force.value">
          <el-option v-for="item of upgradeOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
      <el-button type="primary" size="mini"  @click="submitQuery">查询</el-button>
      <el-button type="primary" size="mini" v-np="'APP_RELEASE_INFO_SAVE'" @click="handleAdd">新增</el-button>
    </div>
  </el-card>
</template>

<script>
import Cascader from '@/components/Cascader'
import { MatchType, DataType } from '@/constants/search'
import { fetchAppInitData } from '@/api/setting/appVersion'

export default {
  name: 'Search',
  components: { Cascader },
  data() {
    return {
      form: {
        version: { value: '', name: 'version', matchType: MatchType.CONTAIN, type: DataType.STRING },
        os: { value: '', name: 'os', matchType: MatchType.EQUAL, type: DataType.STRING },
        terminal: { value: '', name: 'terminal', matchType: MatchType.EQUAL, type: DataType.STRING },
        force: { value: '', name: 'force', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
      },
      typeOptions: [],
      terminalOptions: [],
      upgradeOptions: [
        { key: '不限', value: '' },
        { key: '是', value: true },
        { key: '否', value: false }
      ]
    }
  },
  mounted() {
    this.fetchAppInitData()
  },
  methods: {
    fetchAppInitData() {
      fetchAppInitData({}).then(res => {
        if (res.code === 200) {
          this.terminalOptions = res.result.upGradeTerminalTypes
          this.typeOptions = res.result.upGradeOsTypes
        }
      })
    },
    submitQuery() {
      this.$emit('on-search')
    },
    // 新增
    handleAdd() {
      this.$emit('on-add')
    },
    handleReset() {
      this.$refs['form'].resetFields()
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
      width: 33%;
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
