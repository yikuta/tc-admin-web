<template>
  <div class="wrapper">
    <el-card class="box-card">
      <div slot="header">
        <span class="title">高级搜索</span>
      </div>
      <slot></slot>
      <div class="action">
        <el-button type="primary" @click="handleSearch" size="small">搜索</el-button>
        <el-button type="plain" @click="handleReset" size="small">重置</el-button>
        <el-button type="primary" v-np='"MEMBER_GRAY_LIST_CONFIG"' @click="handleSetting('1')" size="small" v-if="isBlack">灰名单设置</el-button>
        <el-button type="primary" v-np='"MEMBER_BLACK_LIST_CONFIG"' @click="handleSetting('2')" size="small" v-if="isBlack">黑名单设置</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'SearchArea',
  props: ['isBlack'],
  methods: {
    handleReset() {
      this.$emit('resetFields')
    },
    handleSearch() {
      this.$emit('onSearch')
    },
    handleSetting(type) {
      this.$emit('setting', type)
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  margin: 10px;
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