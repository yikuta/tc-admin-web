<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </transition>
</template>

<script>
  export default {
    name: 'childLayout'
  }
</script>

<style lang='scss' scoped>
</style>
