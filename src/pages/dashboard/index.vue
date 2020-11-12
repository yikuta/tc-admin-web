<template>
  <div class="app-container">
   <order-info></order-info>
   <user-info></user-info>
  </div>
</template>

<script>
  import OrderInfo from './templates/OrderInfo'
  import UserInfo from './templates/UserInfo'
  export default {
    name: 'dashboard',
    components: {
      OrderInfo,
      UserInfo
    },
    data() {
      return {
      }
    },
    created() {
    },
    methods: {
    }
  }
</script>

<style type="text/scss" scoped>
</style>
