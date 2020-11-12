<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini" class>
      <el-form-item label="专题 ID">
        <el-input v-model="form.id.value" clearable placeholder="请输入专题 ID"></el-input>
      </el-form-item>
      <el-form-item label="专题名称" prop="name.value">
        <el-input v-model="form.name.value" clearable placeholder="请输入专题名称"></el-input>
      </el-form-item>
      <el-form-item label="专题状态" prop="status.value">
        <el-select v-model="form.status.value" placeholder="请选择专题状态" clearable>
          <el-option v-for="(item, index) in option.status" :label="item.label" :value="item.value" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="$router.push('/cms/form?type=SPECIAL')">新建</el-button>
      <el-button type="primary" size="mini" @click="handleSubmit">查询</el-button>
      <el-button type="default" size="mini" @click="handleClear">清空</el-button>
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
          id: { value: '', name: 'id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
          name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.STRING }
        },
        option: {
          status: [
            { id: 1, value: 'DISABLE', label: '已作废' },
            { id: 2, value: 'UNUSED', label: '已禁用' },
            { id: 3, value: 'PUSHING', label: '发布中' },
            { id: 3, value: 'WAIT_PUSH', label: '等待发布' }
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$emit('change', this.form)
      },
      // 清空
      handleClear() {
        this.form = {
          id: { value: '', name: 'id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
          name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.STRING }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
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
