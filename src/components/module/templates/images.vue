<template>
  <div class="images-component">
    <div class="images-line" v-for="(item, index) in config.content.list" :style="{'flex-basis': ['', '100%', '50%', '33.33%', '25%'][config.config.flex]}">
      <img :src="item.image" />
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Images',
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style lang="scss" scoped>
  .images-component{min-height:100px;
    display: flex;flex-wrap: wrap;
    .images-line{flex-grow:1;flex-shrink:0;height:100px;
      img{width:100%;height:100%;}
    }
  }
</style>
