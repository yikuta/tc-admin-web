<template>
  <div class="ppvShop-templates">
    <el-tabs v-model="config.systemConfig.switch" @tab-click="handleClick">
      <el-tab-pane :label="config.content.shopTitle" name="store">
        <div class="sort-list">
          <div :class="{active: config.config.shop.sort === 'sale' }">销量最高</div>
          <div :class="{active: config.config.shop.sort === 'distance' }">距离最近</div>
        </div>
        <div class="shop-list">
          <div class="shop-line" v-for="(item, index) in 3" :key="index">
            <div class="shop-image">
              <img src="">
              <div class="num-tag">1</div>
              <div class="brand-tag" v-if="config.config.shop.brandTag">品牌</div>
            </div>
            <div class="shop-info">
              <div class="shop-name" v-if="config.config.shop.title || config.config.shop.hotTag">
                <div class="name" v-if="config.config.shop.title">
                  <div>天呈生活家常菜馆(天府三街太平洋保险大厦旗舰店)</div>
                </div>
                <div class="is-hot" v-if="config.config.shop.hotTag">热门菜店</div>
              </div>
              <div class="shop-time" v-if="config.config.shop.openTime || config.config.shop.distance">
                <div class="time" v-if="config.config.shop.openTime">营业时间：9：00-17:00</div>
                <div class="distance" v-if="config.config.shop.distance">1000m</div>
              </div>
              <div class="shop-tag" v-if="config.config.shop.specialTag || config.config.shop.distribution">
                <div class="shop-ts" v-if="config.config.shop.specialTag">特色菜</div>
                <div class="shop-ts" v-if="config.config.shop.specialTag">特色小吃</div>
                <div class="shop-car-dada" v-if="config.config.shop.distribution">达达专送</div>
                <div class="shop-car-ziti" v-if="config.config.shop.distribution">支持自提</div>
              </div>
              <div class="shop-coupon" v-if="config.config.shop.coupon">
                <div class="coupon-list">
                  <div>4元券</div>
                  <div>8元券</div>
                  <div>16元券</div>
                </div>
                <div class="coupon-icon">
                  <i class="el-icon-arrow-down"></i>
                </div>
              </div>
              <div class="shop-tj" v-if="config.config.shop.shopGoods">
                <div class="goods-list" v-for="(item, index) in 3" :key="index">
                  <div class="goods-image">
                    <img src="" />
                  </div>
                  <div class="goods-name" v-if="config.config.shop.shopGoodsName">
                    <div>进口西红柿炒欧洲火鸡蛋</div>
                  </div>
                  <div class="goods-price">
                    <div class="" v-if="config.config.shop.shopGoodsSalePrice">9.99</div>
                    <div class="" v-if="config.config.shop.shopGoodsMarketPrice">￥19.99</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="config.content.goodsTitle" name="food">
        <div class="food-list">
          <div class="food-line" v-for="(item, index) in 3" :key="index">
            <div class="food-image">
              <img />
            </div>
            <div class="name" v-if="config.config.goods.title">天呈生活牛排，好生活，好品质</div>
            <div class="price"><b v-if="config.config.goods.salePrice">￥12.34</b><span v-if="config.config.goods.marketPrice">$12.44</span></div>
            <div class="sale" v-if="config.config.goods.sales">月售 1294</div>
            <div class="store-info" v-if="config.config.goods.shopBanner">
              <div class="store-header">
                <img />
              </div>
              <div class="store-txt">
                <div class="store-name" v-if="config.config.goods.shopName">天呈生活家常菜</div>
                <div class="store-time" v-if="config.config.goods.openTime">营业时间：9:00-18:00</div>
              </div>
            </div>
            <div class="store-tj" v-if="config.config.goods.shopRelated">
              <div>附近还有8家门店在售</div>
              <div>
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  export default {
    name: 'ppvShop',
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            id: 9,
            name: '净菜门店',
            enName: 'ppvShop',
            num: 1,
            related: ['goodsList'],
            type: ['index', 'special'],
            push: 'end',
            config: {
              shop: {
                /*
                * sort 参数
                * sale 销量
                * distance 距离
                * */
                sort: 'sale', // 排序 sale distance
                title: false, // 标题
                openTime: false, // 营业时间
                distribution: false, // 配送
                coupon: false, // 优惠券
                distance: false, // 距离
                hotTag: false, // 热卖标签
                brandTag: false, // 品牌标签
                specialTag: false, // 特色标签
                shopGoods: false, // 门店商品
                shopGoodsName: false, // 门店商品名称
                shopGoodsSalePrice: false, // 门店商品售价
                shopGoodsMarketPrice: false // 市场价
              },
              goods: {
                title: false, // 标题
                subTitle: false, // 副标题
                estimateTime: false, // 预计到货时间
                salePrice: false, // 当前售价
                marketPrice: false, // 市场售价
                sales: false, // 30天销量
                shopBanner: false, // 店招
                shopName: false, // 店铺名称
                openTime: false, // 营业时间
                shopRelated: false // 相关门店
              }
            },
            content: {
              shopTitle: '', // 门店标题
              goodsTitle: '' // 商品列表标题
            }
          }
        }
      }
    },
    data() {
      return {
        activeName: 'first'
      }
    },
    methods: {
      handleClick() {
      }
    }
  }
</script>

<style lang="scss" scoped>
.ppvShop-templates{
  .el-tabs{
    /deep/ .el-tabs__header{margin:0;
      .el-tabs__active-bar{background:#0ABF89;}
      .el-tabs__item{color:#666;
        &.is-active{color:#0ABF89;}
      }
    }
  }
  .sort-list{display:flex;padding:15px;
    >div{font-size:12px;color:#666;
      &:first-child{margin-right:10px;}
      &.active{color:#212121;}
    }
  }
  .shop-list{background:#fff;
    .shop-line{display: flex;margin-bottom:20px;padding:10px;
      &:first-child{
        &~.shop-line{
        }
      }
      .shop-image{width:59px;height:59px;border-radius:10px;background:#fff;position:relative;flex-shrink: 0;
        img{width:100%;height:100%;}
        .num-tag{position:absolute;right:-3px;bottom:-3px;background:#FF4747;height:13px;min-width:13px;border-radius:100px;font-size:12px;color:#fff;text-align:center;line-height: 13px;}
        .brand-tag{position:absolute;top:0px;left:0px;background:#FF4747;padding:2px 5px;font-size:12px;color:#fff;text-align:center;}
      }
      .shop-info{flex-grow:1;margin-left:8px;border-bottom:1px solid #e7e7e7;padding-bottom:20px;
        .shop-name{display: flex;width:100%;padding-bottom:10px;
          .name{flex-grow:1;width:0;font-size:16px;color:#212121;font-weight:bold;overflow: hidden;margin-right:10px;
            >div{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
          }
          .is-hot{width:60px;flex-shrink: 0;font-size:11px;background:linear-gradient(90deg,rgba(22,205,134,1) 0%,rgba(10,191,137,1) 100%);color:#fff;text-align: center;height:16px;line-height: 16px;border-radius:2px;}
        }
        .shop-time{font-size:12px;color:#666;display: flex;justify-content: space-between;padding-bottom:10px;
          .time{}
          .distance{}
        }
        .shop-tag{display: flex;align-items: stretch;padding-bottom:15px;
          >div{margin-right:3px;}
          .shop-ts{color:#0ABF89;font-size:12px;background:rgba(10,191,137,0.1);line-height: initial;padding:0 4px;}
          .shop-car-dada{border:1px solid #0077EE;color:#0077EE;border-radius:3px;font-size:12px;padding:2px 4px;}
          .shop-car-ziti{border:1px solid #0ABF89;color:#0ABF89;border-radius:3px;font-size:12px;padding:2px 4px;}
        }
        .shop-coupon{padding-bottom:10px;
          display: flex;justify-content: space-between;
          .coupon-list{display: flex;
            >div{color:#FF2A2A;border:1px solid rgba(255,33,33,0.3);border-radius:3px;font-size:12px;line-height: 16px;padding:1px 4px;}
          }
        }
        .shop-tj{display: flex;justify-content: space-between;
          .goods-list{flex:1;width:0;
            .goods-image{width:89px;height:89px;border-radius:6px;overflow: hidden;background:#ccc;
              img{}
            }
            .goods-name{font-size:12px;color:#212121;padding-bottom:7px;padding-top:7px;
              >div{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
            }
            .goods-price{display: flex;align-items: flex-end;
              >div{
                &:first-child{color:#FF6464;font-size:14px;}
                &:last-child{color:#999999;font-size:12px;text-decoration: line-through;}
              }
            }
          }
        }
      }
    }
  }

  .food-list{display: flex;flex-wrap: wrap;padding:10px;justify-content: space-between;
    .food-line{width:174px;background:#fff;margin-bottom:20px;padding:4px;;border-radius:3px;
      .food-image{height:164px;width:164px;background:#f5f5f5;border-radius:3px;overflow: hidden;
        img{width:100%;height:100%;}
      }
      .name{font-size:14px;color:#212121;font-weight:bold;padding:10px;}
      .price{font-size:16px;color:#FF4747;font-weight:bold;padding:0 10px;
        span{color:#999999;font-size:12px;font-weight:normal;margin-left:5px;text-decoration: line-through;}
      }
      .sale{font-size:12px;color:#999;padding:10px}
      .store-info{display: flex;align-items: center;padding:0 10px;
        .store-header{width:30px;height:30px;border-radius:3px;background:#ccc;overflow: hidden;flex-shrink: 0;
          img{width:100%;height:100%;}
        }
        .store-txt{padding:0 10px;
          .store-name{font-size:13px;color:#212121;}
          .store-time{font-size:12px;color:#999999;}
        }
      }
      .store-tj{padding:10px;
        display: flex;font-size:12px;color:#999;justify-content: space-between;
      }
    }
  }
}
</style>
