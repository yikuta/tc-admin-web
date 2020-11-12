<template>
  <div class="carousel padding">
    <div class="">
      <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">图片轮播</div>
      <div class="text-df padding-bottom-sm text-convention">轮播方式</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">轮播方向</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.direction">
            <el-radio label="horizontal">向左</el-radio>
            <el-radio label="vertical">向上</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">页标形式</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.indicatorType">
            <el-radio label="">无</el-radio>
            <el-radio label="round">圆点</el-radio>
            <el-radio label="number">数字</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">页标位置</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.indicatorPosition">
            <el-radio label="left">左</el-radio>
            <el-radio label="center">中</el-radio>
            <el-radio label="right">右</el-radio>
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
      <div class="text-sm text-seat padding-top-sm">最多添加10个图片，建议图片尺寸宽度750，高度200-1000，支持类型：jpg、png。</div>
      <div class="content-list padding-top-sm">
        <common-image :config="config" ref="commonImage"></common-image>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CarouselForm',
    components: {
      CommonImage: resolve => {
        return require(['./templates/commonImage'], resolve)
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
      return {}
    },
    created() {
    },
    methods: {
      getValid() {
        // 验证，返回 true 或者 false
        if (this.config.config.interval) {
          return this.$refs.commonImage.getValid()
        } else {
          this.config.config.interval = 3000
          return true
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/common";
  .content-list{
    .list-line{display: flex;align-items: center;
      .left-opt{flex-shrink: 0;width:20px;}
      .right-opt{display:flex;align-items: center;flex-grow:1;
        .line-image{width:50px;height:50px;flex-shrink:0;
          img{width:100%;height:100%;}
        }
        .line-content{flex:1;width:0;
          >div{
            >div{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
          }
        }
      }
    }
  }
</style>
