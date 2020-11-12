<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="菜谱名称" prop="name.value">
        <el-input v-model="form.name.value" placeholder="菜谱名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="添加日期" prop="createTime.value">
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
      <el-form-item label="数据来源" prop="bookSource.value">
        <el-select v-model="form.bookSource.value" placeholder="请选择" clearable>
          <el-option v-for="item in bookSourceOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="auditStatus.value">
        <el-select v-model="form.auditStatus.value">
          <el-option label="全部" value="" />
          <el-option v-for="item of typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="显示状态" prop="enable.value">
        <el-select v-model="form.enable.value">
          <el-option label="全部" value="" />
          <el-option v-for="item of showOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <slot></slot>
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
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        bookSource: { value: '', name: 'bookSource', matchType: MatchType.EQUAL, type: DataType.ENUM },
        auditStatus: { value: '', name: 'auditStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
        enable: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
      },
      typeOptions: [
        { value: 'boss.CookBookAuditStatusType_10', label: '待审核' },
        { value: 'boss.CookBookAuditStatusType_11', label: '审核通过' },
        { value: 'boss.CookBookAuditStatusType_12', label: '审核不通过' }
      ],
      showOptions: [
        { value: true, label: '显示' },
        { value: false, label: '未显示' }
      ],
      bookSourceOption: [
        { value: '', label: '全部' },
        { value: 'boss.BookSourceType_1', label: '平台发布' },
        { value: 'boss.BookSourceType_2', label: '用户发布' }
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
