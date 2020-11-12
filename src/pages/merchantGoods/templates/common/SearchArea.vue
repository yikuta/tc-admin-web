<template>
  <div class="wrapper">
    <el-card class="box-card">
      <div :style="{marginBottom:'20px'}" v-if="isShowTab">
        <el-menu :default-active="activeTab" class="el-menu-demo" mode="horizontal" @select="handleChangeTab">
          <el-menu-item index="0">待审核</el-menu-item>
          <el-menu-item index="1">已审核</el-menu-item>
        </el-menu>
      </div>
      <slot></slot>
      <div class="action">
        <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
        <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
        <el-button type="primary" size="mini" @click="handleExport" v-if="isExport">导出</el-button>
        <el-button type="primary" size="mini" @click="handleAdd" v-if="isAdd">新增</el-button>
        <el-button type="primary" size="mini" @click="handleModifyBtn('1')" v-if="isModify">批量通过</el-button>
        <el-button type="primary" size="mini" @click="handleModifyBtn('0')" v-if="isModify">批量拒绝</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'SearchArea',
  props: ['activeTab', 'isShowTab', 'isModify', 'isExport', 'isAdd'],
  methods: {
    handleReset() {
      this.$emit('resetFields')
    },
    handleSearch() {
      this.$emit('onSearch')
    },
    handleChangeTab(index) {
      if (this.activeTab !== index) {
        this.$emit('on-change-tab', index)
        this.handleReset()
        this.$emit('update:activeTab', index)
        // this.activeTab = index
      }
    },
    handleExport() {
      this.$emit('onExport')
    },
    handleEditBusiness() {
      this.$emit('on-edit-business')
    },
    handleEditDevops() {
      this.$emit('on-edit-devops')
    },
    // 门店审核
    handleModifyBtn(status) {
      this.$emit('on-edit-status', status)
    },
    // 素材新增
    handleAdd() {
      this.$emit('on-edit-add')
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .title {
    border-left: 6px solid rgba(64, 158, 255, 1);
    padding-left: 10px;
  }
  .action {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
  }
}
</style>
