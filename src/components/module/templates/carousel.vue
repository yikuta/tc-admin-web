<template>
  <div class="carousel-component">
    <el-carousel :interval="config.config.interval" @change="carouselChange" arrow="never" class="carousel-view" indicator-position="none" :direction="config.config.direction" height="150px">
      <el-carousel-item class="" v-for="(item, index) in config.content.list" :key="index">
        <img :src="item.image" />
      </el-carousel-item>
    </el-carousel>
    <div class="carousel-indicator" :class="[config.config.indicatorType, config.config.indicatorPosition]">
      <div class="indicator-item-number">{{ carouselIndex + 1 }}/{{ config.content.list.length }}</div>
      <div class="indicator-item-round">
        <div v-for="(item, index) in config.content.list" :key="index" class="item-round-box" :class="{active: carouselIndex === index}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Carousel',
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
        carouselIndex: 0
      }
    },
    methods: {
      carouselChange(val) {
        this.carouselIndex = val
      }
    }
  }
</script>

<style lang="scss" scoped>
  .carousel-component{
    .carousel-view{
      img{width:100%;height:100%;}
    }
    .carousel-indicator {position:absolute;bottom:10px;width:100%;left:0;z-index:9;
      .indicator-item-number{display:none;padding:5px 20px;background:rgba(0,0,0,0.3);border-radius:5px;color:#fff;
      }
      .indicator-item-round{display:none;padding:5px 20px;background:rgba(0,0,0,0.3);border-radius:5px;
        .item-round-box{width:10px;height:10px;border-radius:100px;background:#ccc;display: inline-block;
          &:first-child{
            &~.item-round-box{margin-left:5px;}
          }
          &.active{background:#fff;}
        }
      }
      &.left{text-align: left;}
      &.center{text-align: center;}
      &.right{text-align: right;}
      &.number{
        .indicator-item-number{display: inline-block;}
      }
      &.round{
        .indicator-item-round{display: inline-block;}
      }
    }
  }
</style>
