<template>
  <transition name="fade-transform" mode="out-in">
    <div class="setting-container">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'authSettings'
  }
</script>
