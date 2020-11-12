<template>
  <div class="wrapper">
    <el-form class="form" ref="form" :model="form" label-width="120px" inline size="small">
      <el-form-item label="商品名称" prop="channelCommodityName.value">
        <el-input v-model="form.channelCommodityName.value" clearable placeholder="商品名称" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="用户编号" prop="memberCode.value">
        <el-input v-model="form.memberCode.value" clearable placeholder="用户编号" maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="memberPhone.value">
        <el-input v-model="form.memberPhone.value" clearable placeholder="用户手机" @input='handlePhone'></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName.value">
        <el-input v-model="form.nickName.value" clearable placeholder="昵称" maxlength="20"></el-input>
      </el-form-item>
      <el-form-item label="浏览时间" prop="createTime.value">
        <el-date-picker v-model="form.createTime.value" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleTimeChange"></el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'Search',
  props: {
    memberCode: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      form: {
        channelCommodityName: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        enable: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLAEN },
        memberPhone: { value: '', name: 'member.memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberCode: { value: '', name: 'member.memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        nickName: { value: '', name: 'member.nickName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE }
      }
    }
  },
  created() {
    this.form.memberCode.value = this.$route.query.code || ''
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
      this.form.memberCode.value = ''
    },
    handlePhone(val) {
      let reg = /^[0-9]{1,11}$/
      if (reg.test(val)) {
        this.form.memberPhone.value = val
      } else {
        if (isNaN(parseInt(val))) {
          this.form.memberPhone.value = ''
        } else {
          this.form.memberPhone.value = parseInt(val)
        }
      }
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
