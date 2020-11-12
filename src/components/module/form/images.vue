<template>
  <div class="images padding">
    <div class="">
      <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">多图</div>
      <div class="text-df padding-bottom-sm text-convention">排列方式</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">展示形式</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.display">
            <el-radio label="static">固定</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">每行展示</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.flex">
            <el-radio :label="1">一张</el-radio>
            <el-radio :label="2">两张</el-radio>
            <el-radio :label="3">三张</el-radio>
            <el-radio :label="4">四张</el-radio>
          </el-radio-group>
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
    name: 'Images',
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
    methods: {
      getValid() {
        return this.$refs.commonImage.getValid()
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
