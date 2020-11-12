<template>
  <div class="wrapper">
    <el-form class="form" ref="form" :model="form" label-width="120px" inline size="small">
      <el-form-item label="用户编号" prop="memberCode.value">
        <el-input v-model="form.memberCode.value" clearable placeholder="用户编号"></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="memberPhone.value">
        <el-input v-model="form.memberPhone.value" clearable placeholder="用户手机"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName.value">
        <el-input v-model="form.nickName.value" clearable placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="名单类型" prop="memberGreyBlackType.value">
        <el-select v-model="form.memberGreyBlackType.value">
          <el-option label="全部" value=""></el-option>
          <el-option 
            v-for="item in typeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="流入时间" prop="createTime.value">
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
        memberCode: { value: '', name: 'member.memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        enable: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLAEN },
        memberPhone: { value: '', name: 'member.memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        nickName: { value: '', name: 'member.nickName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberGreyBlackType: { value: '', name: 'memberGreyBlackType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE }
      },
      typeOptions: [{
        label: '黑名单',
        value: 'member.MemberGreyBlackType_2'
      }, {
        label: '灰名单',
        value: 'member.MemberGreyBlackType_1'
      }]
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
