<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="120px" size="small" class="platform-form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="菜谱名称" prop="name.value">
            <el-input v-model="form.name.value" placeholder="菜谱名称" clearable style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
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
        </el-col>
        <el-col :span="5">
          <el-form-item label="数据来源" prop="bookSource.value">
            <el-select v-model="form.bookSource.value" placeholder="请选择" clearable>
              <el-option v-for="item in bookSourceOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="search-btn">
      <slot></slot>
    </div>
  </el-card>
</template>

<script>
// import { Cascader } from '../common'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'Search',
  data() {
    return {
      labelWidth: '120px',
      form: {
        name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
        auditStatus: { value: 'boss.CookBookAuditStatusType_10', name: 'auditStatus', matchType: MatchType.EQUAL, type: DataType.ENUM },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        bookSource: { value: '', name: 'bookSource', matchType: MatchType.EQUAL, type: DataType.ENUM }
      },
      bookSourceOption: [
        { value: '', label: '全部' },
        { value: 'boss.BookSourceType_1', label: '平台发布' },
        { value: 'boss.BookSourceType_2', label: '用户发布' }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.platform-form .el-form-item,.platform-form .el-form-item .el-select {
  display: inline-block;
  width: 100%
}

.search-btn {
  text-align: right;
}
</style>