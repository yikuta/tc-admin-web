<template>
  <div class="" :style="{ padding: `${config.padding}px 0`}">
    <video width="100%" height="400" :poster="config.imageSrc" controls ref="moduleVideo">
      <source :src="config.videoSrc" type="video/mp4">
      <source :src="config.videoSrc" type="video/ogg">
    </video>
  </div>
</template>

<script>
  export default {
    name: 'VideoModule',
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    watch: {
      config: {
        handler() {
          this.$refs.moduleVideo.load()
        },
        deep: true
      }
    }
  }
</script>

<style scoped lang="scss"></style>
