<template>
  <div class="wrapper">
    <el-form class="form" ref="form" :model="form" label-width="120px" inline size="small">
      <el-form-item label="商品名称" prop="name.value">
        <el-input v-model="form.name.value" clearable placeholder="商品名称"></el-input>
      </el-form-item>
      <el-form-item label="用户编号" prop="memberCode.value">
        <el-input v-model="form.memberCode.value" clearable placeholder="用户编号"></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="phone.value">
        <el-input v-model="form.phone.value" clearable placeholder="用户手机"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nick.value">
        <el-input v-model="form.nick.value" clearable placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="收藏时间" prop="createTime.value">
        <el-date-picker v-model="form.createTime.value" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleTimeChange"></el-date-picker>
      </el-form-item>
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
        name: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        enable: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLAEN },
        memberCode: { value: '', name: 'member.memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        phone: { value: '', name: 'member.memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        nick: { value: '', name: 'member.nickName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE }
      }
    }
  },
  mounted() {
    const { memberCode, memberPhone } = this.$route.query
    if (memberCode) this.form.memberCode.value = memberCode
    if (memberPhone) this.form.phone.value = memberPhone
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
