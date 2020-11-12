<template>
  <div class="wrapper">
    <el-form class="form" ref="form" :model="form" label-width="120px" inline size="small">
      <el-form-item label="活动名称" prop="name">
        <el-input v-model="form.name" clearable placeholder="活动名称"></el-input>
      </el-form-item>
      <el-form-item label="用户编号" prop="code">
        <el-input v-model="form.code" clearable placeholder="用户编号"></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="phone">
        <el-input v-model="form.phone" clearable placeholder="用户手机"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nick">
        <el-input v-model="form.nick" clearable placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="收藏时间" prop="collectTime">
        <el-date-picker v-model="form.collectTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleTimeChange"></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data() {
    return {
      form: {
        name: '',
        code: '',
        phone: '',
        nick: '',
        collectTime: ''
      }
    }
  },
  methods: {
    /**
     * @description: 格式化时间
     */
    handleTimeChange(date) {
      if (date && date.length === 2) {
        date[0] += ' 00:00:00'
        date[1] += ' 23:59:59'
      }
    },
    resetFields() {
      this.$refs['form'].resetFields()
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .form {
    /deep/ .el-range-separator {
      width: 10%;
    }
  }
}
</style>
