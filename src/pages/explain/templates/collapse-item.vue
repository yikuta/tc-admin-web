<template>
  <div>
    <template v-for="(it, j) in item">
      <p v-if="!it.children">{{ it.title }}</p>
      <el-collapse-item v-else :title="it.title" :name="`${index}-${j}`" :key="j">
        <el-card>
          <div class="padding-left text-seat">{{ it.txt || '' }}</div>
          <div class="padding-left">
            <p v-if="!it.children">{{ it.title }}</p>
            <collapse-item v-else :item="it.children" :index="`${index}-${j}`"></collapse-item>
          </div>
        </el-card>
      </el-collapse-item>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'CollapseItem',
    props: {
      index: {
        type: String,
        default: 'tem'
      },
      item: {
        type: Array,
        default: () => {
          return []
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '../../../components/module/style/common';
</style>
