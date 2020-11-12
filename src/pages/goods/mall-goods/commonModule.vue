<template>
  <div>
    <common-modules :businessNo="1"></common-modules>
  </div>
</template>

<script>
  export default {
    name: 'CommonModule',
    components: {
      CommonModules: resolve => {
        return require(['@/components/CustomModule/index.vue'], resolve)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
