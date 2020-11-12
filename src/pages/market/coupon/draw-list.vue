<template>
  <div class="app-container">

  </div>
</template>

<script>
  // 领取详情
  export default {
    name: 'DrawList',
    components: {
      DrawList: resolve => {
        return require(['./components/data-card.vue'], resolve)
      }
    }
  }
</script>

<style scoped>

</style>
