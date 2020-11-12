<template>
  <el-dialog
    class="dialog-form mobile-el-dialog"
    title=""
    :visible="previewVisible"
    width="600"
  >
    <div>
      <div class="mobile-bg">
        <div class="mobile-header">
          <div class="time">9:41</div>
          <div class="link">&lt; 商品详情 </div>
        </div>
        <div class="mobile-content" >
          <img :src="previewDetail.headImgs?previewDetail.headImgs[0]:''" class="show-img" />
          <div class="good-info">
            <p class="name">{{previewDetail.channelCommodityName}}</p>
            <p class="desc">{{previewDetail.introduction}}</p>
            <div class="price">
              <span class="price-new"><b>¥</b>{{previewDetail.salePrice}}</span>
              <span class="price-new-foot"></span>
              <s class="price-old">{{previewDetail.marketPrice}}</s>
            </div>
            <div class="logistics">
              <div class="icon">服务</div>
              <p class="txt">支持自提.支持配送</p>
              <div class="tag">库存{{moneyFormat(previewDetail.saleLimit)}}件</div>
            </div>
            <div class="storage">
<!--              <div class="item borderline">规格：ff</div>-->
<!--              <div class="item borderline">保质期：rr</div>-->
<!--              <div class="item">储存条件：rrr</div>-->
            </div>
          </div>
          <div class="store-info">
            <div class="deport">
              <div class="img-box">
                <img :src="previewDetail.img"/>
              </div>
              <div class="deport-name"></div>
            </div>

            <div class="link">进店看看</div>
          </div>
          <div class="goods-detail">
            <img v-for="(item, index) in previewDetail.detailImgs" :key="index" :src="item"/>
          </div>
        </div>
        <div class="phone-close" @click="handleClose"></div>
        <div class="mobile-footer-cover"></div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'PreviewBox',
    props: {
      previewDetail: {
        type: Object,
        default: {}
      },
      previewVisible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        previewVisible: true
      }
    },
    methods: {
      handleClose() {
        if (this.previewVisible) {
          this.$emit('on-close-preview')
        }
      },
      // 金额转换
      moneyFormat(money) {
        if (money) {
          // 判断是否为数字
          if (!isNaN(parseFloat(money)) && isFinite(money)) {
            money = Number(money)
            let str1 = parseInt(money % 10000)
            // 保留两位 （未处理四舍五入）
            if (str1.toString().length && str1.toString().length >= 2) {
              str1 = str1.toString().substring(0, 2)
            }
            let str2 = parseInt(money / 10000)
            if (str2) {
              str2 = str2.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',')
              return str2 + '.' + str1 + 'w'
            } else {
              return money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + ',')
            }
          }
        } else {
          return money
        }
      }
    },
    watch: {
      previewDetail() {
      }
    }
  }
</script>

<style lang="scss" scoped>
  .mobile-bg{
    width: 380px;
    height: 780px;
    margin: 20px auto 0 auto;
    background-image: url("http://b2c-integration-test-public.oss-cn-shenzhen.aliyuncs.com/a08e4732-8925-469c-8cd8-d1c53cb817b6");
    background-size: 380px auto;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
  }
  .mobile-bg .phone-close{
    width: 35px;
    height: 35px;
    background-image: url("http://b2c-integration-test-public.oss-cn-shenzhen.aliyuncs.com/9d0edc25-3264-4d23-b382-cdaf0e63bc33");
    background-size: 35px 35px;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
  }
  .mobile-footer-cover{
    width: 380px;
    height: 98px;
    background-image: url('http://b2c-integration-test-public.oss-cn-shenzhen.aliyuncs.com/92ee7db1-188c-4b23-8604-31160528297f');
    background-size: 380px 98px;
    background-repeat: no-repeat;
    /* background-color: red; */
    position: absolute;
    bottom: 0;
    left: 0;
    /*margin-left: -188px;*/
  }
  .mobile-header{
    width: 328px;
    height: 109px;
    margin: 0 auto;
    overflow: hidden;
    border-bottom: 10px solid #FFF;
  }
  .mobile-header .time{
    font-size:14px;
    color:rgba(0,0,0,1);
    line-height:17px;
    margin: 34px 0 0 26px;
  }
  .mobile-header .link{
    font-size:18px;
    font-weight:400;
    color:rgba(51,51,51,1);
    line-height:25px;
    margin: 21px 0 0 11px;
  }
  .mobile-content{
    width: 329px;
    height: 627px;
    /*border: 1px solid red;*/
    margin: 0 0 0 25px;
    overflow-y: scroll;
    /*overflow-x: hidden;*/
    background: #FFF;
  }
  .mobile-content .show-img{
    width: 100%;
    height: 263px;
    position: relative;
    z-index: 10;
  }
  .mobile-content .good-info{
    position: relative;
    width: 308px;
    /*height: 193px;*/
    padding-bottom: 10px;
    margin: -30px auto 0 auto;
    background: rgba(255,255,255,1);
    box-shadow: 0px 12px 14px 0px rgba(120,120,120,0.06);
    border-radius: 10px;
    z-index: 20;
  }
  .mobile-content .good-info .name{
    font-size:18px;
    font-weight:500;
    color:rgba(44,48,67,1);
    line-height:27px;
    padding: 8px 8px 0 8px;
    margin: 0;
  }
  .mobile-content .good-info .desc{
    font-size:14px;
    color:rgba(176,178,185,1);
    line-height:21px;
    padding: 2px 8px 8px 8px;
    margin: 0;
  }
  .mobile-content .good-info .price{
  }
  .mobile-content .good-info .price .price-new{
    font-size:22px;
    font-weight:bold;
    color:rgba(255,100,100,1);
    line-height:24px;
    padding: 0 0 0 8px;
  }
  .mobile-content .good-info .price .price-new b{
    font-size: 14px;
  }
  .mobile-content .good-info .price .price-new-foot{
    font-size:17px;
    font-weight:500;
    color:rgba(255,100,100,1);
    line-height:24px;
  }
  .mobile-content .good-info .price .price-old{
    font-size:13px;
    font-weight:400;
    color:rgba(211,213,217,1);
    line-height:18px;
    padding: 0 0 0 5px;
  }
  .mobile-content .logistics{
    padding: 0 0 0 8px;
    display: flex;
    flex-direction: row;
    height: 20px;
    width: 100%;
    align-items: center;
  }
  .mobile-content .logistics .icon{
    width:35px;
    height:19px;
    background:linear-gradient(90deg,rgba(255,198,5,1) 0%,rgba(255,176,45,1) 100%);
    border-radius:10px 0px 10px 0px;
    text-align: center;
    line-height: 19px;
    color: #FFF;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .mobile-content .logistics .txt{
    display: flex;
    justify-content: center;
    align-items: center;
    font-size:14px;
    font-weight:500;
    color:rgba(68,74,100,1);
    line-height:20px;
    margin: 0 10px 0 8px;
  }
  .mobile-content .logistics .tag{
    font-size:11px;
    border-radius:3px;
    border:1px solid rgba(211,213,217,1);
    font-size:11px;
    padding: 2px;
    color:rgba(211,213,217,1);
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 8px 0 0 ;
  }
  .mobile-content .good-info .storage{
    display: flex;
    flex-direction: row;
    font-size:11px;
    color:rgba(176,178,185,1);
    line-height:17px;
    justify-content: center;
    margin: 10px 0 0 0;
  }
  .mobile-content .good-info .storage .item{
    display: flex;
    height: 17px;
    padding: 0 8px 0 8px ;
    position: relative;
  }
  .mobile-content .good-info .storage .borderline::after{
    content: '';
    position: absolute;
    height: 9px;
    width: 1px;
    background: rgba(176,178,185,1);
    top: 4px;
    right: 0;
  }
  .mobile-content .store-info{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    width: 308px;
    background: #FFF;
    margin: 20px auto 0 auto;
  }
  .mobile-content .store-info .deport{
    display: flex;
    flex-direction: row;
  }
  .mobile-content .store-info .deport .img-box{
    display: flex;
    width:40px;
    height:40px;
    border-radius:40px;
    overflow: hidden;
  }
  .mobile-content .store-info .deport .img-box img{
    width:40px;
    height:40px;
  }
  .mobile-content .store-info .deport .deport-name{
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 5px;
  }
  .mobile-content .store-info .link{
    display: flex;
    width:82px;
    height:30px;
    border-radius:30px;
    border:1px solid rgba(176,178,185,1);
    font-size:13px;
    color:rgba(68,74,100,1);
    line-height:18px;
    justify-content: center;
    align-items: center;
  }
  .mobile-content .goods-detail{
    border-top: 10px solid rgba(245,247,249,1);
    width: 100%;
  }
  .mobile-content .goods-detail img{
    width: 100%;
  }
</style>
