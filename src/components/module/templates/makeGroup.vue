<template>
  <div class="make-group-component">
    <div class="sec-top">
      <div class="sec-top-title"></div>
      <div class="sec-top-time" v-if="goodsData.length">
        <div class="sec-t-box">
          <!--          <count-down :timestamp="3600000" :showDay="false" borderColor="" backgroundColor="#fff" runType="created" splitorColor="#FFF" color="#FF2A2A"></count-down>-->
          <div class="sec-num">{{ groupTotal }}人已参团</div>
        </div>
      </div>
    </div>
    <div class="sec-content">
      <!-- 这段代码需要自己品，显示对应区间的商品 -->
      <el-carousel :interval="config.config.interval" @change="carouselChange" arrow="never" class="carousel-view" indicator-position="none" :direction="config.config.direction" height="145px">
        <el-carousel-item class="goods-carousel" v-for="(item, index) in Math.ceil(goodsData.length / config.config.flex)" :key="index">
          <div class="goods-line" :class="[`line-${config.config.flex}`]" v-for="(goods, j) in goodsData" :key="j" v-if="j < config.config.flex * (index + 1) && j >= config.config.flex * index">
            <div class="goods-box">
              <div class="goods-image">
                <img :src="goods.thumbnailImage" />
              </div>
              <div class="goods-info">
                <div class="goods-name">{{ goods.name }}</div>
                <div class="goods-price">{{ goods.minSalePrice }}</div>
              </div>
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
          return {}
        }
      }
    },
    data() {
      return {
        carouselIndex: 0,
        goodsData: [
          { thumbnailImage: '', name: '热销商品', minSalePrice: '9.99' },
          { thumbnailImage: '', name: '热销商品', minSalePrice: '9.99' },
          { thumbnailImage: '', name: '热销商品', minSalePrice: '9.99' },
          { thumbnailImage: '', name: '热销商品', minSalePrice: '9.99' },
          { thumbnailImage: '', name: '热销商品', minSalePrice: '9.99' },
          { thumbnailImage: '', name: '热销商品', minSalePrice: '9.99' }
        ],
        groupTotal: 0
      }
    },
    created() {
    },
    methods: {
      carouselChange(val) {
        this.carouselIndex = val
      }
    }
  }
</script>

<style lang="scss" scoped>
  .make-group-component{min-height:100px;margin:0 10px;border-radius:20px;padding:50px 10px 10px 10px;position:relative;
    .sec-top{display: flex;align-items: center;background:url('../../../assets/images/shouye_pintuan_taitou.png') no-repeat;background-size: 100% 100%;position:absolute;left:0;right:0;height:70px;top:15px;margin:0 15px;
      .sec-top-title{font-size:18px;font-weight:bold;color:#E84124;}
      .sec-top-time{flex-grow: 1;padding-left:10px;margin-left:10px;text-align: center;
        .sec-t-box{text-align:left;display: inline-block;padding-left:10%;
          .sec-num{color:#fff;font-size:12px;}
        }
      }
      .sec-top-more{flex-grow: 1;font-size:12px;text-align: right;color:#E84124;cursor: pointer;}
    }
    .sec-content{background:#fff;border-radius:20px;overflow: hidden;background:url('../../../assets/images/shouye_pintuan_beijing.png') no-repeat;background-size: 100% 100%;padding:50px 10px 15px 10px;
      .goods-carousel{display: flex;justify-content: space-between;
        .goods-line{height:145px;
          &.line-3{width:30%;}
          &.line-4{width:25%;}
          .goods-box{text-align: center;border-radius:25px;background:#fff;overflow: hidden;height:100%;position:relative;
            .goods-image{width:100%;height:95px;display: inline-block;
              img{width:100%;height:100%;}
            }
            .goods-info{ background: linear-gradient(180deg, #FFF3E0 0%, #FEE2B2 100%);position:absolute;bottom:0;left:0;right:0;padding: 5px;
              .goods-name{font-size:12px;margin-top:5px;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;word-break: break-all;}
              .goods-price{color:#FF2A2A;font-size:14px;padding-top:3px;}
            }
          }
        }
      }
    }
  }
</style>
