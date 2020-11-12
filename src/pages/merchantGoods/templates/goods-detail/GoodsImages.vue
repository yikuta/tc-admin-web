<template>
  <div class="goods-detail">
    <div class="detail-item">
      <div class="item-title">
        <span><span class="red-required">*</span>商品图片</span>*图片封面展示在商品主图第一张，及各列表位置，图片尺寸要求不高于800*800，图片比例为1：1，最大不超过1MB，最多可上传10张，可拖动排序
      </div>
      <upload-file
        type="IMAGE"
        :limit="10"
        :maxSize='1'
        :fileList="goodImagesList"
        @change='handleGoodImageList'
      />
    </div>
    <div class="detail-item">
      <div class="item-title">
        <span>商品视频</span>*视频显示在商品主图的第一个位置，视频封面表示进入页面时展示的默认视频，封面尺寸不高于800*800，比例为1：1，最大不超过50MB
      </div>
      <div class="video-box">
        <div class="video-image" style="margin-right:20px">
          <upload-file
            type="IMAGE"
            :maxSize='1'
            :limit="1"
            :fileList="videoCoverList"
            ref="videoCover"
          />
          <div class="image-txt">视频封面</div>
        </div>
        <div class="video-file">
          <upload-file
            type="VIDEO"
            :limit="1"
            :maxSize='50'
            :fileList="videoList"
          />
          <div class="image-txt">视频</div>
        </div>
      </div>
    </div>
    <div class="detail-item">
      <div class="item-title">
        <span>商品详情</span>最大不超过1MB，最多可上传10张，可拖动排序
        <upload-file
          type="IMAGE"
          :limit="10"
          :maxSize='1'
          :fileList="contentList"
          @change='handleContentsList'
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { deepClone } from '@/utils/util'
  export default {
    name: 'GoodsDetail',
    props: {
      gid: {
        type: String,
        default: ''
      },
      goodImageList: {
        type: Array,
        default: () => []
      },
      videoCoverList: {
        type: Array,
        default: () => []
      },
      videoList: {
        type: Array,
        default: () => []
      },
      contentsList: {
        type: Array,
        default: () => []
      }
    },
    components: {
      UploadFile: resolve => require(['@/components/UploadFile/index'], resolve)
    },
    data() {
      return {
        dataList: [],
        contentList: this.contentsList,
        goodImagesList: this.goodImageList
      }
    },
    methods: {
      handleGoodImageFormat() {
        return deepClone(this.goodImagesList).map((file, index) => {
          if (index === 0) {
            return {
              cover: false,
              type: 'IMAGE',
              typeValue: 1,
              fileUrl: file.fileUrl
            }
          } else {
            return {
              cover: true,
              type: 'IMAGE',
              typeValue: 1,
              fileUrl: file.fileUrl
            }
          }
        })
      },
      handleVideoCoverFormat() {
        return deepClone(this.videoCoverList).map(file => {
          return {
            cover: true,
            type: 'IMAGE',
            typeValue: 2,
            fileUrl: file.fileUrl
          }
        })
      },
      handleVideoFormat() {
        return deepClone(this.videoList).map(file => {
          return {
            cover: false,
            type: 'VIDEO',
            typeValue: 2,
            fileUrl: file.fileUrl
          }
        })
      },
      handleDetailFormat() {
        return deepClone(this.contentList).map(file => {
          return {
            cover: false,
            type: 'IMAGE',
            typeValue: 3,
            fileUrl: file.fileUrl
          }
        })
      },
      validateMediaList() {
        if (!this.goodImageList.length) {
          this.$message.error('至少上传一张商品图片')
          return false
        }
        if (this.videoList.length && !this.videoCoverList.length) {
          this.$message.error('视频存在至少上传一张封面图片')
          return false
        }
        this.$parent.form.baseCommodityMediaList = [
          ...this.handleGoodImageFormat(),
          ...this.handleVideoCoverFormat(),
          ...this.handleVideoFormat(),
          ...this.handleDetailFormat()
        ]
        return true
      },
      handleContentsList(list) {
        this.contentList = list
      },
      handleGoodImageList(list) {
        this.goodImagesList = list
      }
    }
  }
</script>

<style lang="scss" scoped>
  .goods-detail {
    .detail-item {
      margin-top: 20px;

      .item-title {
        font-size: 12px;
        color: #909399;
        margin-bottom: 10px;

        span {
          color: #303133;
          font-size: 14px;
          font-weight: bold;
          margin-right: 10px;
        }

        .red-required {
          font-size: 12px;
          color: #F56C6C;
          margin-right: 4px;
          margin-left: -10px;
          margin-top: -8px;
        }
      }

      .video-box {
        > div {
          display: inline-block;
          vertical-align: top;

          .image-txt {
            color: #606266;
            font-size: 12px;
            text-align: center;
            padding-top: 10px;
          }
        }

        .video-image {
        }

        .video-file {
        }
      }
    }
  }
</style>
