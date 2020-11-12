<template>
  <div class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="消息标题" prop="title.value">
        <el-input v-model="form.title.value" placeholder="消息标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="消息内容" prop="content.value">
        <el-input v-model="form.content.value" placeholder="消息内容" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户名" prop="memberName.value">
        <el-input v-model="form.memberName.value" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="memberPhone.value">
        <el-input v-model="form.memberPhone.value" placeholder="用户手机" clearable></el-input>
      </el-form-item>
      <el-form-item label="发送状态" prop="sendStatus.value">
        <el-select v-model="form.sendStatus.value">
          <el-option label="全部" value="" />
          <el-option v-for="item of typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间" prop="createTime.value">
        <el-date-picker
          v-model="form.createTime.value"
          align="center"
          type="daterange"
          size="small"
          style="width:100%"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="{ disabledDate (time) { return time.getTime() - 1 >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() + 86400000 - 1 }}">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'

export default {
  name: 'Search',
  data() {
    return {
      form: {
        title: { value: '', name: 'title', matchType: MatchType.CONTAIN, type: DataType.STRING },
        content: { value: '', name: 'content', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberName: { value: '', name: 'memberName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        sendStatus: { value: '', name: 'sendStatus', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      typeOptions: [
        { value: 'waitSend', label: '等待发送' },
        { value: 'fail', label: '发送失败' },
        { value: 'sendSucceed', label: '发送成功' },
        { value: 'canceled', label: '已取消' }
      ]
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
  .search-btn {
    text-align: right;
  }
}
</style>
