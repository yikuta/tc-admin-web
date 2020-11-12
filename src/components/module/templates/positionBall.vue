<template>
  <div class="positionBall">
    <div class="ball-box">
      <template v-if="config.config.type === 'cart'">
        <svg-icon icon-class="cart"></svg-icon>
      </template>
      <template v-if="config.config.type === 'top'">
        <svg-icon icon-class="back-top"></svg-icon>
      </template>
      <template v-if="config.config.type === 'default'">
        <div class="default-box" :style="{background: `url(${config.content.image}) no-repeat`}"></div>
      </template>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'positionBall',
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

<style lang="scss" scoped>
  .positionBall{
    position: absolute;right:20px;bottom:20px;width:50px;height:50px;z-index:100;font-size:12px;line-height:50px;text-align: center;
    .ball-box{width:100%;height:100%;font-size:34px;line-height: 50px;color:#0ABF89;
      .default-box{width:100%;height:100%;background-size:cover !important;}
    }
  }
</style>
