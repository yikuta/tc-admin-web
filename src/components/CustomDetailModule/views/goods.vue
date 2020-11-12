<template>
  <div>
    <div class="good-info">
      <div class="price">
        <span class="price-new">¥{{config.minSalePrice === config.maxSalePrice ? config.minSalePrice:`${config.minSalePrice}-${config.maxSalePrice}`}}</span>
        <span class="price-new-foot"></span>
        <span class="price-old">价格 ¥{{config.minMarketPrice === config.maxMarketPrice ? config.minMarketPrice:`${config.minMarketPrice}~${config.maxMarketPrice}`}}</span>
      </div>
      <p class="name" :title="config.channelCommodityName">{{config.channelCommodityName}}</p>
      <p class="desc" :title="config.introduction">{{config.introduction}}</p>
    </div>
    <div class="logistics">
      <p class="txt">配送 提货点自提 / 同城配送</p>
      <p class="txt">月销{{config.monthSaleCount || 0}}件</p>
    </div>
    <div class="sku-infos">
      <p class="txt">选择 选择规格组名</p>
      <p class="sku">
        <span>规格1</span>
        <span>规格2</span>
        <span>规格3</span>
      </p>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'GoodsModule',
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
.good-info{
    position: relative;
    width: 100%;
    /*height: 193px;*/
    padding-bottom: 10px;
    margin: 0 auto;
    border-bottom: 10px solid #f1f1f1;
    border-top: 10px solid #f1f1f1;
    background: rgba(255,255,255,1);
  }
  .good-info .name{
    font-size:18px;
    font-weight:500;
    color:rgba(44,48,67,1);
    line-height:27px;
    padding: 0 8px 0 8px;
    margin: 0;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .good-info .desc{
    font-size:14px;
    color:rgba(176,178,185,1);
    line-height:21px;
    padding: 2px 8px 8px 8px;
    margin: 0;
    overflow : hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .good-info .price .price-new{
    font-size:22px;
    font-weight:bold;
    color:rgba(255,100,100,1);
    line-height:24px;
    padding: 10px 0 0 8px;
    display: block;
  }
  .good-info .price .price-new b{
    font-size: 14px;
  }
  .good-info .price .price-new-foot{
    font-size:17px;
    font-weight:500;
    color:rgba(255,100,100,1);
    line-height:24px;
  }
  .good-info .price .price-old{
    font-size:13px;
    font-weight:400;
    color:rgba(211,213,217,1);
    line-height:18px;
    display: block;
    padding: 0 0 0 5px;
  }
  .good-info .storage{
    display: flex;
    flex-direction: row;
    font-size:11px;
    color:rgba(176,178,185,1);
    line-height:17px;
    justify-content: center;
    margin: 10px 0 0 0;
  }
  .good-info .storage .item{
    display: flex;
    height: 17px;
    padding: 0 8px 0 8px ;
    position: relative;
  }
  .good-info .storage .borderline::after{
    content: '';
    position: absolute;
    height: 9px;
    width: 1px;
    background: rgba(176,178,185,1);
    top: 4px;
    right: 0;
  }
  .logistics{
    background: #fff;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    border-bottom: 10px solid #f1f1f1;
    .txt{
      font-size: 14px;
    }
  }
  .sku-infos{
    background: #fff;
    padding: 0 10px;
    overflow: hidden;
    font-size: 14px;
    border-bottom: 10px solid #f1f1f1;
    .sku{
      margin-left: 32px;
      span{
        background: #eee8e8;
        padding: 2px 4px;
        margin-right: 10px;
        border-radius: 4px;
      }
    }
  }
</style>