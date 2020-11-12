<template>
  <div class="secKill-component">
    <div class="sec-top">
      <div class="sec-top-title"></div>
      <div class="sec-top-time" v-if="config.config.countDown">
        <count-down :timestamp="3600000" :showDay="false" borderColor="" backgroundColor="#fff" runType="created"></count-down>
      </div>
      <div class="sec-top-more">更多></div>
    </div>
    <div class="sec-content">
      <!-- 这段代码需要自己品，显示对应区间的商品 -->
      <el-carousel :interval="config.config.interval" @change="carouselChange" arrow="never" class="carousel-view" indicator-position="none" :direction="config.config.direction" height="100px">
        <el-carousel-item class="goods-carousel" v-for="(item, index) in Math.ceil(goodsData.length / config.config.flex)" :key="index">
          <div class="goods-line" v-for="(goods, j) in goodsData" :key="j" v-if="j < config.config.flex * (index + 1) && j >= config.config.flex * index">
            <div class="goods-box">
              <div class="goods-image">
                <img :src="goods.image" />
              </div>
              <div class="goods-name">{{ goods.name }}</div>
            </div>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'secKill',
    components: {
      CountDown: resolve => {
        return require(['@/components/countdown/index2.vue'], resolve)
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            id: 6,
            name: '秒杀',
            enName: 'secKill',
            num: 10,
            related: [],
            type: ['index', 'special'],
            push: 'start',
            config: {
              countDown: false, // 倒计时
              flex: 3, // 每行展示数量
              direction: 'horizontal', // 轮播方向 none/horizontal/vertical
              interval: 3000 // 轮播周期
            }
          }
        }
      }
    },
    data() {
      return {
        carouselIndex: 0,
        goodsData: [
          { id: 1, name: '商品' },
          { id: 2, name: '商品' },
          { id: 3, name: '商品' },
          { id: 4, name: '商品' },
          { id: 5, name: '商品' },
          { id: 6, name: '商品' },
          { id: 7, name: '商品' },
          { id: 8, name: '商品' },
          { id: 9, name: '商品' },
          { id: 10, name: '商品' }
        ]
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
  .secKill-component{min-height:150px;background:url('../../../assets/images/shouye_xianshiqianggou@3x.png') no-repeat;background-size: 100% 100%;
    .sec-top{display: flex;height:40px;align-items: center;padding:0 10px;
      .sec-top-title{font-size:16px;}
      .sec-top-time{flex-grow: 1;margin-left:100px;}
      .sec-top-more{flex-grow: 1;font-size:12px;text-align: right;color:#fff;}
    }
    .sec-content{background:#fff;margin:0 10px 10px 10px;border-radius:10px;
      .goods-carousel{display: flex;
        .goods-line{width:33.33%;
          .goods-box{text-align: center;margin-top:15px;
            .goods-image{
              width:50px;height:50px;display: inline-block;
              img{width:100%;height:100%;}
            }
            .goods-name{font-size:12px;margin-top:5px;color:#FF4747;}
          }
        }
      }
    }
  }
</style>
