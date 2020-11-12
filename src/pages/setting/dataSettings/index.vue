<template>
  <transition name="fade-transform" mode="out-in">
    <keep-alive v-if="$route.meta.keepAlive">
      <router-view></router-view>
    </keep-alive>
  </transition>
</template>

<script>
  export default {
    name: 'dataSetting'
  }
</script>
