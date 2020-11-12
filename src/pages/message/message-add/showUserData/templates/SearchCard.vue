<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="用户编号" prop="memberCode.value">
            <el-input v-model="form.memberCode.value" placeholder="用户编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户手机" prop="memberPhone.value">
            <el-input v-model="form.memberPhone.value" placeholder="用户手机" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="昵称" prop="memberName.value">
            <el-input v-model="form.memberName.value" placeholder="昵称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <div class="search-btn" style="text-align: right;">
            <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
            <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
          </div>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'

export default {
  name: 'Search',
  data() {
    return {
      form: {
        memberCode: { value: '', name: 'memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberName: { value: '', name: 'memberName', matchType: MatchType.CONTAIN, type: DataType.STRING }
      }
    }
  },
  methods: {
    handleReset() {
      this.$refs['form'].resetFields()
    },
    submitQuery() {
      this.$emit('on-search', this.form)
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
      width: 25%;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
