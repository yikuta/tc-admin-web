<template>
  <div class="app-container">
    <section>
      <el-row class="title-main"><span class="red-required">*</span>套餐图片</el-row>
      <upload-file :fileList="goodImages" :limit="10" type="image" />
    </section>
    <section>
      <el-row class="title-main">套餐视频</el-row>
      <upload-file :fileList="videoImages" :limit="1" type="image" style="margin-right: 20px" />
      <upload-file :fileList="videoList" :limit="1" type="video" />
    </section>

    <section>
      <el-row class="title-main"><span class="red-required">*</span>套餐详情</el-row>
      <custom-detail-module ref="detail"></custom-detail-module>
    </section>
  </div>
</template>

<script>
  import UploadFile from '@/components/UploadFile'
  import CustomDetailModule from '@/components/CustomDetailModule/index'

  export default {
    name: 'publishGoodsEdit',
    components: { UploadFile, CustomDetailModule },
    props: {
      businessNo: {
        type: Number,
        default: 1
      },
      goodImages: {
        type: Array,
        default: () => []
      },
      videoImages: {
        type: Array,
        default: () => []
      },
      videoList: {
        type: Array,
        default: () => []
      },
      detailList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {}
    },
    mounted() {
      if (this.detailList[0] && this.detailList[0].typeValue) {
        this.$refs['detail'].setContent(JSON.parse(this.detailList[0].typeValue), true)
      }
    },
    methods: {
      getDetailContent() {
        return this.$refs.detail.getContent()
      },
      validateMediaList() {
        this.$parent.detailList = [{
          id: this.detailList[0] && this.detailList[0].id,
          typeValue: this.getDetailContent()
        }]
        if (!this.goodImages.length) {
          this.$message.error('至少上传一张套餐图片')
          return false
        }
        if (this.videoImages.length && !this.videoList.length) {
          this.$message.error('上传视频封面图片请上传视频')
          return false
        }
        if (this.videoList.length && !this.videoImages.length) {
          this.$message.error('视频存在至少上传一张封面图片')
          return false
        }
        if (!this.$parent.detailList[0].typeValue || this.$parent.detailList[0].typeValue === '[]') {
          this.$message.error('请添加套餐详情')
          return false
        }
        return true
      }
    }
  }
</script>

<style lang='scss' scoped>
  .app-container {
    section {
      padding-bottom: 20px;
    }

    .title-main {
      font-weight: bold;
      margin-bottom: 15px;
    }

    .red-required {
      font-size: 12px;
      color: #f56c6c;
      margin-right: 4px;
      margin-left: -10px;
      margin-top: -8px;
    }

    /deep/ .album-wrapper {
      display: inline-block;
      vertical-align: top;
    }
  }
</style>
