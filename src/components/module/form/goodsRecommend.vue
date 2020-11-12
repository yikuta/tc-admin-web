<template>
  <div class="goodsRecommend padding">
    <div class="">
      <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">商品推荐</div>
      <div class="text-df padding-bottom-sm text-convention">标题设置</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">标题</el-col>
        <el-col :span="16">
          <el-input type="text" size="mini" v-model="config.content.title" placeholder="请输入标题" />
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">副标题</el-col>
        <el-col :span="16">
          <el-input type="text" size="mini" v-model="config.content.subTitle" placeholder="请输入副标题" />
        </el-col>
      </el-row>
      <div class="text-df padding-bottom-sm text-convention">排列方式</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">每行展示</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.flex">
            <el-radio :label="3">三列</el-radio>
            <el-radio :label="4">四列</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">轮播方向</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.direction">
<!--            <el-radio label="none">关</el-radio>-->
            <el-radio label="horizontal">向左</el-radio>
            <el-radio label="vertical">向上</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="">
        <el-col :span="8" class="text-df text-second">轮播周期</el-col>
        <el-col :span="16">
          <el-input v-model="config.config.interval" size="mini" placeholder="不填默认 3000 毫秒"><template slot="append">毫秒</template></el-input>
          <div class="text-sm text-seat padding-top-sm">请输入3000-9999之间的轮播周期（1000毫秒 = 1秒）</div>
        </el-col>
      </el-row>
    </div>
    <div class="padding-top-sm">
      <div class="text-convention text-df">添加图片</div>
      <div class="text-sm text-seat padding-top-sm">最多添加12个商品，建议选择商品数量为每行展示商品数量的整数倍</div>
      <div class="content-list padding-top-sm">
        <common-goods :config="config" ref="commonGoods"></common-goods>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'goodsRecommend',
    components: {
      CommonGoods: resolve => {
        return require(['./templates/commonGoods.vue'], resolve)
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
      }
    },
    methods: {
      getValid() {
        // 验证
        if (!this.config.content.title || !this.config.content.subTitle) {
          this.$message.error('标题或副标题不能为空')
          return false
        }
        return this.$refs.commonGoods.getValid()
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/common";
  .content-list{
  }
</style>
