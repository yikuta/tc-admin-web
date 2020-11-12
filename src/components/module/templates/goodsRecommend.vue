<template>
  <div class="goodsRecommend-templates">
    <div class="top">
      <div class="title">{{ config.content.title }}</div>
      <div class="sub-title">{{ config.content.subTitle }}</div>
    </div>
    <div class="goods-list">
      <el-carousel :interval="config.config.interval" @change="carouselChange" arrow="never" class="carousel-view" indicator-position="none" :direction="config.config.direction" height="150px">
        <el-carousel-item class="goods-carousel" v-for="(item, index) in Math.ceil(config.content.list.length / config.config.flex)" :key="index">
          <div class="goods-line" v-for="(goods, j) in config.content.list" :key="j" v-if="j < config.config.flex * (index + 1) && j >= config.config.flex * index">
            <div class="goods-box">
              <div class="goods-image">
                <img :src="goods.image" />
              </div>
              <div class="goods-price">
                <span>￥{{ goods.marketPrice || '0.00' }}</span>
                <span>￥{{ goods.salePrice || '0.00' }}</span>
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
    name: 'goodsRecommend',
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
      carouselChange() {}
    }
  }
</script>

<style lang="scss" scoped>
  .goodsRecommend-templates{overflow: hidden;background:#fff;background: linear-gradient(177deg, #FFEFD5 0%, #FE7335 100%);
    .top{display: flex;padding:10px 10px;align-items: baseline;
      .title{font-size:18px;font-weight:bold;margin-right:5px;color:#E84124;}
      .sub-title{font-size:12px;color:#E84124;border-left:1px solid #E84124;padding-left:10px;margin-left:10px;}
    }
    .goods-list{background:#fff;margin:0 10px 10px 10px;border-radius:10px;
      .goods-carousel{display: flex;
        .goods-line{width:33.33%;margin:15px 10px;
          .goods-box{text-align: center;
            .goods-image{background:#f4f4f4;
              width:100px;height:100px;display: inline-block;
              img{width:100%;height:100%;}
            }
            .goods-price{font-size:12px;margin-top:5px;
              span{
                &:first-child{color:#FF2A2A;text-decoration:line-through;}
                &:last-child{color:#999;}
              }
            }
          }
        }
      }
    }
  }
</style>
