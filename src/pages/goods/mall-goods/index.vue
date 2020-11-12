<template>
  <section class="app-main">
    <transition name="fade" mode="out-in">
       <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive"></router-view>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'mallGoods',
  beforeMount() {
    // this.$store.dispatch('addVisitedViews', this.$route.matched[1])
  }
}
</script>

<style lang='scss' scoped>
</style>
