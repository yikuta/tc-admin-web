<template>
  <el-card class="search-bar">
    <el-form class="search-form" :model="params" ref="queryForm" size="small" inline>
      <el-form-item label-width="80px" label="模块名称" prop="name.value" style="margin-bottom:0">
        <el-input v-model="params.name.value" placeholder="请输入模块名称" size="small" clearable></el-input>
      </el-form-item>
      <el-form-item label="模块状态" prop="status.value">
        <el-select v-model="params.status.value" :style="{width:'150px'}">
          <el-option v-for="item of statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom:0">
        <div style="margin-left:20px">
          <el-button type="primary" size="small" @click="submitQueryForm">查询</el-button>
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom:0">
        <div class="search-form-btn">
          <el-button type="primary" size="small" @click="handleAddModule" v-np="['MODULE_GOODS_ADD', 'PT_MODULE_GOODS_ADD', 'GYS_MODULE_GOODS_ADD']">添加模块</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
export default {
  name: 'search-card',
  props: {
    params: Object,
    NewMember: Function
  },
  data() {
    return {
      labelWidth: '90px',
      name: '',
      statusOption: [
        { label: '全部', value: '' },
        { label: '启用', value: true },
        { label: '停用', value: false }
      ]
    }
  },
  methods: {
    submitQueryForm() {
      // this.$emit('update:query', this.params)
      this.$emit('query')
    },
    handleAddModule() {
      this.$router.push('moduleForm')
    }
  }
}
</script>

<style lang="scss" scoped>
.search-bar {
  margin: 0 0 20px 0;
  .search-form {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
