<template>
  <div class="cmp-form padding">
    <component v-if="config" :config="config" :is="config.enName"></component>
  </div>
</template>

<script>
  export default {
    name: 'CmpForm',
    components: {
      carousel: resolve => {
        return require(['./form/carousel.vue'], resolve)
      },
      images: resolve => {
        return require(['./form/images.vue'], resolve)
      },
      vajra: resolve => {
        return require(['./form/vajra.vue'], resolve)
      },
      notice: resolve => {
        return require(['./form/notice.vue'], resolve)
      },
      pureText: resolve => {
        return require(['./form/pureText.vue'], resolve)
      },
      secKill: resolve => {
        return require(['./form/secKill.vue'], resolve)
      },
      makeGroup: resolve => {
        return require(['./form/makeGroup.vue'], resolve)
      },
      goodsList: resolve => {
        return require(['./form/goodsList.vue'], resolve)
      },
      goodsRecommend: resolve => {
        return require(['./form/goodsRecommend.vue'], resolve)
      },
      ppvShop: resolve => {
        return require(['./form/ppvShop.vue'], resolve)
      },
      positionBall: resolve => {
        return require(['./form/positionBall.vue'], resolve)
      }
    },
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
  .cmp-form{border:1px solid #E4E7ED;width:400px;}
</style>
