<template>
  <div class="app-container">
<!--    <custom-detail-module ref="detail" :isShowOperationArea="false" :isEditor="false"></custom-detail-module>-->
    <div class="view-box">
      <div class="carousel-box">
        <el-carousel indicator-position="none">
          <el-carousel-item v-for="(item, index) in swipper" :key="index">
            <img :src="item.url" style="width:100%;height:300px"/>
          </el-carousel-item>
        </el-carousel>
      </div>
      <goods-view :config="goodsInfo" />
      <div style="background:#fff;margin-top:10px;padding:10px">
        <div v-for="(item, index) in moduleList" :key="index">
          <title-view v-if="item.module === 'title'" :config="item" />
          <editor-view v-if="item.module === 'editor'" :config="item" />
          <divider-view v-if="item.module === 'divider'" :config="item" />
          <blank-view v-if="item.module === 'blank'" :config="item" />
          <video-view v-if="item.module === 'video'" :config="item" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { reqMallGoodsInfoById } from '@/api/mallGoods'

  export default {
    name: 'mallGoodsPreview',
    components: {
      TitleView: resolve => {
        return require(['@/components/CustomDetailModule/views/title'], resolve)
      },
      EditorView: resolve => {
        return require(['@/components/CustomDetailModule/views/editor'], resolve)
      },
      DividerView: resolve => {
        return require(['@/components/CustomDetailModule/views/divider'], resolve)
      },
      BlankView: resolve => {
        return require(['@/components/CustomDetailModule/views/blank'], resolve)
      },
      VideoView: resolve => {
        return require(['@/components/CustomDetailModule/views/video'], resolve)
      },
      GoodsView: resolve => {
        return require(['@/components/CustomDetailModule/views/goods'], resolve)
      }
    },
    data() {
      return {
        moduleList: [], // 详情列表
        swipper: [],
        goodsInfo: {} // 商品信息
      }
    },
    mounted() {
      const { id } = this.$route.query
      this.$nextTick(() => {
        reqMallGoodsInfoById({ id })
          .then(res => {
            if (res.code === 200) {
              let result = res.result || {}
              let tempList = new Array(3).fill(0)
              if (result.channelCommodityMediaList) {
                result.channelCommodityMediaList.map(item => {
                  if (item.type && item.type.value === 3) tempList[1] = item
                  if (item.type && item.type.value === 4) tempList[0] = item
                  if (item.type && item.type.value === 5) tempList[2] = item
                  if (item.type && item.type.value === 1) {
                    // 处理 banner 图片
                    this.swipper.push({
                      id: item.id,
                      type: 'image',
                      url: item.typeValue
                    })
                  }
                  return item
                })
              }
              tempList = tempList.filter(item => {
                if (item !== 0) return true
                return false
              })
              let contentList = tempList.map(item => {
                return JSON.parse(item.typeValue)
              })
              let content = []
              contentList.map(item => {
                Array.prototype.push.apply(content, item)
                return item
              })
              this.moduleList = content
              // 商品信息
              this.goodsInfo = {
                minSalePrice: result.minSalePrice,
                maxSalePrice: result.maxSalePrice,
                minMarketPrice: result.minMarketPrice,
                maxMarketPrice: result.maxMarketPrice,
                channelCommodityName: result.channelCommodityName,
                introduction: result.introduction,
                monthSaleCount: result.monthSaleCount,
                channelCommoditySpecificationList: result.channelCommoditySpecificationList
              }
            }
          })
          .catch(() => {})
      })
    }
  }
</script>

<style lang='scss' scoped>
  .view-box{width:400px;height:922px;position:relative;overflow: hidden;border:1px solid #f1f1f1;margin:0 auto;}
  // .carousel-box{
  //   padding-bottom:20px;
  // }
</style>
