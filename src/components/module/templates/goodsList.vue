<template>
  <div class="goodsList-templates">
    <div class="top">
      <div class="title">{{ config.content.title }}</div>
      <div class="sub-title">{{ config.content.subTitle }}</div>
    </div>
    <div class="">
      <div class="goods-list-box">
        <div class="goods-line" v-for="(item, index) in goodsData" :key="index">
          <div class="top">
            <div class="goods-image">
              <img :src="config.config.image" />
            </div>
            <div class="goods-service-tag" v-if="config.config.tags.service">爆品预售</div>
            <div class="goods-type-tag" v-if="config.config.tags.group">拼团</div>
          </div>
          <div class="bottom">
            <div class="goods-name" v-if="config.config.goods.title">德国进口牛奶和奶牛啊，真的，很嫩，很白。</div>
            <div class="arrive-time" v-if="config.config.goods.estimateTime">预计到货日期</div>
            <div class="goods-price">
              <span v-if="config.config.goods.salePrice">￥19.22</span>
              <span v-if="config.config.goods.marketPrice">$20/22</span>
            </div>
            <div class="goods-sale" v-if="config.config.goods.sales">月售1291</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'goodsList',
    props: {
      config: {
        type: Object,
        default: () => {
          return {
            id: 7,
            name: '商品列表',
            enName: 'goodsList',
            num: 1,
            related: ['ppvShop'],
            type: ['index', 'special'],
            push: 'end',
            config: {
              /*
              * 参数
              *   flex 平铺
              *   block 列表
              * */
              display: 'flex', // 展示形式
              displayButton: false, // 展示形式切换按钮
              /*
              * sort 参数
              * 默认为空
              * sale 销量
              * price 价格
              * */
              sort: '', // 排列方式
              sortButton: false, // 排列方式切换按钮
              // 商品信息
              goods: {
                title: false, // 标题
                subTitle: false, // 副标题
                estimateTime: false, // 预计到货时间
                salePrice: false, // 当前售价
                marketPrice: false, // 市场售价
                sales: false // 30天销量
              },
              // 展示标签
              tags: {
                service: false, // 业务
                group: false, // 拼团
                coupon: false, // 领券
                secKill: false // 秒杀
              }
            },
            content: {
              title: '', // 标题
              subTitle: '' // 副标题
            }
          }
        }
      }
    },
    data() {
      return {
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
    }
  }
</script>

<style lang="scss" scoped>
  .goodsList-templates { background: #F2F6FC;
    &>.top {
      display: flex;
      padding: 10px 10px;
      background: #F2F6FC;
      align-items: baseline;

      .title {
        font-size: 18px;
        font-weight: bold;
        margin-right: 5px;
      }

      .sub-title {
        font-size: 12px;
        color: #C0C4CC;
      }
    }
    .goods-list-box{display: flex;flex-wrap: wrap;padding:10px;
      .goods-line{width:163px;border-radius:5px;overflow: hidden;margin-bottom:10px;background:#fff;
        &:nth-child(2n) {margin-left:10px;}
        .top{position:relative;height:163px;
          .goods-image{position:absolute;width:100%;height:100%;
            img{width:100%;height:100%;}
          }
          .goods-service-tag{position:absolute;left:0;bottom:0;font-size:12px;background:#67C23A;color:#fff;padding:5px 10px;border-top-right-radius: 5px;}
          .goods-type-tag{position:absolute;right:0;top:0;font-size:12px;background:#F56C6C;color:#fff;padding:5px 10px;border-bottom-left-radius: 5px;}
        }
        .bottom{padding:10px;
          .goods-name{color:#303133;font-size:14px;font-weight:bold;white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
          .arrive-time{font-size:12px;color:#E6A23C;padding-top:10px;}
          .goods-price{padding-top:10px;
            span{
              &:first-child{color:#F56C6C;font-weight:bold;}
              &:last-child{font-size:12px;color:#C0C4CC;margin-left:5px;text-decoration: line-through;}
            }
          }
          .goods-sale{font-size:12px;color:#C0C4CC;padding-top:10px;}
        }
      }
    }
  }
</style>
