<template>
  <div>
    <module-form :businessNo="3" :detailId="detailId"></module-form>
  </div>
</template>

<script>
  export default {
    name: 'ModuleForms',
    components: {
      ModuleForm: resolve => {
        return require(['@/components/CustomModule/form.vue'], resolve)
      }
    },
    data() {
      return {
        detailId: ''
      }
    },
    mounted() {
      this.detailId = this.$route.params.id || ''
    }
  }
</script>

<style lang="scss" scoped></style>
