<template>
  <div class="app-container">
    <el-row class="icon-list">
      <el-col :span="4" v-for="(item, index) in svgIcons" :key="index">
        <div class="icon">
          <svg-icon :icon-class="`${item}`"></svg-icon>
        </div>
        <div class="icon-name">{{ item }}</div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import svgIcons from '@/icons/svg-icons'

  export default {
    name: 'Icon',
    data() {
      return {
        svgIcons
      }
    },
    created() {
    }
  }
</script>

<style scoped lang="scss">
  .icon-list{font-size:12px;text-align: center;
    >div{padding-bottom:10px;}
    .icon{font-size:24px;}
    .icon-name{}
  }
</style>
