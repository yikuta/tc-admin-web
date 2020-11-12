<template>
  <div class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="标题" prop="title.value">
        <el-input v-model="form.title.value" placeholder="标题" clearable></el-input>
      </el-form-item>
      <el-form-item label="发送状态" prop="status.value">
        <el-select v-model="form.status.value">
          <el-option label="全部" value="" />
          <el-option v-for="item of typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
        status: { value: '', name: 'status', matchType: MatchType.IN, type: DataType.LISTSTRING }
      },
      typeOptions: [
        { value: 'TASK_WAIT_SEND', label: '未发送' },
        { value: 'TASK_SENDING', label: '发送中' },
        { value: 'TASK_PART_FAIL,TASK_SUCCEED', label: '已发送' },
        { value: 'TASK_CANCELED', label: '已取消' }
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
