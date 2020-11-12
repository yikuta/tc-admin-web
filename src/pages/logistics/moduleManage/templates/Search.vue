<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="模版名称" prop="name.value">
        <el-input v-model="form.name.value" placeholder="请输入模版名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="enable.value">
        <el-select v-model="form.enable.value">
          <el-option v-for="item of statusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
      <el-button type="primary" size="mini" @click="handleAdd">新增模板</el-button>
    </div>
  </el-card>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'

export default {
  name: 'Search',
  data() {
    return {
      form: {
        name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
        enable: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
      },
      statusOptions: [
        { key: '全部', value: '' },
        { key: '使用中', value: true },
        { key: '已停用', value: false }
      ]
    }
  },
  methods: {
    submitQuery() {
      this.$emit('on-search')
    },
    // 添加模版
    handleAdd() {
      this.$router.push({
        name: 'moduleForm'
      })
    },
    // 重置
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
