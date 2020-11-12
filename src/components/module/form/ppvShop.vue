<template>
  <div class="ppvShop padding">
    <div class="">
      <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">净菜门店
        <el-switch v-model="config.systemConfig.switch" active-color="#13ce66" inactive-color="#409EFF" active-value="store" inactive-value="food">
        </el-switch>
      </div>
      <div class="text-df padding-bottom-sm text-convention">门店列表</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">标题</el-col>
        <el-col :span="16">
          <el-input type="text" size="mini" v-model="config.content.shopTitle" placeholder="请输入标题" />
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">默认排序</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.shop.sort" disabled>
            <el-radio label="sale">销量</el-radio>
            <el-radio label="distance">距离</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">展示内容</el-col>
        <el-col :span="16">
          <div>
            <el-checkbox v-model="config.config.shop.title">门店标题</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.shop.openTime">营业时间</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.shop.distribution">配送支持</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.shop.coupon">优惠券</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.shop.distance">距离</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.shop.hotTag">热卖标签</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.shop.brandTag">品牌标签</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.shop.specialTag">特色标签</el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">门店商品</el-col>
        <el-col :span="16">
          <div>
            <el-switch v-model="config.config.shop.shopGoods"></el-switch>
          </div>
          <div>
            <el-checkbox :disabled="!config.config.shop.shopGoods" v-model="config.config.shop.shopGoodsName">名称</el-checkbox>
          </div>
          <div>
            <el-checkbox :disabled="!config.config.shop.shopGoods" v-model="config.config.shop.shopGoodsSalePrice">售价</el-checkbox>
          </div>
          <div>
            <el-checkbox :disabled="!config.config.shop.shopGoods" v-model="config.config.shop.shopGoodsMarketPrice">市场价</el-checkbox>
          </div>
        </el-col>
      </el-row>
      <div class="text-df padding-bottom-sm text-convention">商品列表</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">标题</el-col>
        <el-col :span="16">
          <el-input type="text" size="mini" v-model="config.content.goodsTitle" placeholder="请输入标题" />
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">商品信息</el-col>
        <el-col :span="16">
          <div>
            <el-checkbox v-model="config.config.goods.title">商品标题</el-checkbox>
          </div>
          <div>
            <el-checkbox disabled v-model="config.config.goods.subTitle">副标题</el-checkbox>
          </div>
          <div>
            <el-checkbox disabled v-model="config.config.goods.estimateTime">预计到货时间</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.goods.salePrice">当前售价</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.goods.marketPrice">市场价</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.goods.sales">30天销量</el-checkbox>
          </div>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">门店信息</el-col>
        <el-col :span="16">
          <div>
            <el-checkbox v-model="config.config.goods.shopBanner">店招</el-checkbox>
          </div>
          <div>
            <el-checkbox :disabled="!config.config.goods.shopBanner" v-model="config.config.goods.shopName">店铺名称</el-checkbox>
          </div>
          <div>
            <el-checkbox :disabled="!config.config.goods.shopBanner" v-model="config.config.goods.openTime">营业时间</el-checkbox>
          </div>
          <div>
            <el-checkbox v-model="config.config.goods.shopRelated">相关门店</el-checkbox>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'ppvShop',
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    created() {
      if (this.$route.query.type === 'INDEX') {
        // 强制变更筛选条件为距离
        this.config.config.shop.sort = 'distance'
      }
    },
    methods: {
      getValid() {
        if (!this.config.content.shopTitle || !this.config.content.goodsTitle) {
          this.$message.error('门店标题或商品标题不能为空')
          return false
        }
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/common";
</style>
