<template>
  <div class="views-editor" :style="{ padding: `${config.padding}px 0`}">
    <div v-html="config.value || '请输入内容'">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'EditorModule',
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    }
  }
</script>

<style lang="scss">
  .views-editor{
    img{max-width:100%;}
  }
</style>
