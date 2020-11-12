<template>
  <div class="notice padding">
    <div class="">
      <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">公告</div>
      <div class="padding-bottom-sm">
        <div class="text-df text-convention">公告图片</div>
        <div class="text-sm text-seat padding-top-sm padding-bottom-sm">建议图片尺寸宽度150×150，支持类型：jpg、png。</div>
        <div class="notice-image cursor" @click.stop="imageVisible = true">
          <img :src="config.content.image" v-if="config.content.image" />
          <el-button type="primary" size="mini" v-if="!config.content.image">选择图片</el-button>
        </div>
      </div>
      <div class="text-df text-convention padding-bottom-sm">公告图片</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">展示行数</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.line">
            <el-radio :label="1">一行</el-radio>
            <el-radio :label="2">两行</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
    </div>
    <div class="padding-top-sm">
      <div class="text-convention text-df">内容选择</div>
      <div class="content-list padding-top-sm">
        <common-image :config="config" ref="commonImage" :showImage="false"></common-image>
      </div>
    </div>
    <image-dialog :visible.sync="imageVisible" @success="handleSuccess"></image-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Notice',
    components: {
      ImageDialog: resolve => {
        return require(['../components/image'], resolve)
      },
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
      return {
        imageVisible: false
      }
    },
    methods: {
      getValid() {
        if (this.config.content.image) {
          return this.$refs.commonImage.getValid()
        } else {
          this.$message.error('请选择图片')
          return false
        }
      },
      handleSuccess(result) {
        this.config.content.image = result.fileUrl
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/common";
  .notice-image{width:50px;height:50px;
    img{width:100%;height:100%;}
  }
  .content-list{
    .list-line{display: flex;align-items: center;
      .left-opt{flex-shrink: 0;width:20px;}
      .right-opt{display:flex;align-items: center;flex-grow:1;
        .line-content{flex:1;width:0;
          >div{
            >div{white-space: nowrap;text-overflow: ellipsis;overflow: hidden;}
          }
        }
      }
    }
  }
</style>
