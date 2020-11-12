<template>
  <div class="wrapper">
    <el-card class="box-card">
      <div :style="{marginBottom:'20px'}" v-if="isShowTab">
        <el-menu :default-active="activeTab" class="el-menu-demo" mode="horizontal" @select="handleChangeTab">
          <el-menu-item index="2" v-if="isAudit">待入驻</el-menu-item>
          <el-menu-item index="0">待审核</el-menu-item>
          <el-menu-item index="1">已审核</el-menu-item>
        </el-menu>
      </div>
      <slot></slot>
      <div class="action">
        <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
        <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
        <el-button type="primary" size="mini" @click="handleExport" v-if="isModifyStatus">导出</el-button>
        <el-button type="primary" size="mini" @click="handleSetService" v-if="isModifyStatus">设置平台服务费</el-button>
        <el-button type="primary" size="mini" @click="handleDownloadQrCode" v-if="isModifyStatus">下载二维码</el-button>
        <el-button type="primary" size="mini" @click="handleEditBusiness" v-if="isModifyStatus">修改门店状态</el-button>
        <el-button type="primary" size="mini" @click="handleModifyBtn('1')" v-if="isModify">批量通过</el-button>
        <el-button type="primary" size="mini" @click="handleModifyBtn('0')" v-if="isModify">批量拒绝</el-button>
        <el-button type="primary" size="mini" @click="handleModifyTagBtn(0)" v-if="isModifyTag">修改门店标签</el-button>
        <el-button type="primary" size="mini" @click="handleModifyTagBtn(1)" v-if="isModifyTag">修改店招标签</el-button>
        <el-button type="primary" size="mini" @click="handleModifyTagBtn(2)" v-if="isModifyTag">修改特色标签</el-button>
        <el-button type="primary" size="mini" @click="handleLogout" v-if="isLogout">申请注销</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  name: 'SearchArea',
  props: ['activeTab', 'isShowTab', 'isModify', 'isModifyStatus', 'isModifyTag', 'isLogout', 'isAudit'],
  methods: {
    handleReset() {
      this.$emit('resetFields')
    },
    handleSearch() {
      this.$emit('onSearch')
    },
    handleExport() {
      this.$emit('onExport')
    },
    handleChangeTab(index) {
      if (this.activeTab !== index) {
        this.handleReset()
        this.$emit('on-change-tab', index)
        this.$emit('update:activeTab', index)
        // this.activeTab = index
      }
    },
    handleSetService() {
      this.$emit('on-set-service')
    },
    handleDownloadQrCode() {
      this.$emit('on-download-qr-code')
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
    // 门店标签修改
    handleModifyTagBtn(status) {
      this.$emit('on-edit-tag', status)
    },
    // 门店注销
    handleLogout() {
      this.$emit('on-edit-logout')
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
