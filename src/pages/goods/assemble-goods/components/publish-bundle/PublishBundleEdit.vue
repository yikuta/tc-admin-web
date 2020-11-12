<template>
  <div class="goods-detail">
    <div class="detail-item">
      <div class="item-title">
        <span>
          <span class="red-required">*</span>套餐图片
        </span>*图片封面展示在商品主图第一张，及各列表位置，图片尺寸要求不高于800*800，图片比例为1：1，最大不超过1MB，最多可上传10张，可拖动排序
      </div>
      <upload-file type="IMAGE" :limit="10" :fileList="goodImageList" />
    </div>
    <div class="detail-item">
      <div class="item-title">
        <span>套餐视频</span>*视频显示在商品主图的第一个位置，视频封面表示进入页面时展示的默认视频，封面尺寸不高于800*800，比例为1：1，最大不超过1MB
      </div>
      <div class="video-box">
        <div class="video-image">
          <upload-file type="IMAGE" :limit="1" :fileList="videoCoverList" ref="videoCover" />
          <div class="image-txt">视频封面</div>
        </div>
        <div class="video-file" v-if="!videoList.length">
          <div class="video-file-card" @click="dialogVisible = true">
            <i class="el-icon-upload"></i>
            <em>点击上传</em>
          </div>
          <div class="image-txt">视频</div>
        </div>
        <div class="video-file" v-if="videoList.length">
          <upload-file
            type="VIDEO"
            :limit="1"
            :fileList="videoList"
          />
          <div class="image-txt">视频</div>
        </div>
      </div>
    </div>
    <div class="detail-item">
      <div class="item-title">
        <span>套餐详情</span>
      </div>
      <custom-detail-module ref="customDetailModule" :businessNo="2" :isShowCommon="true"></custom-detail-module>
      <!--<div class="">
        <el-button type="primary" @click="getCustomContent" size="mini">获取内容</el-button>
        <el-button type="primary" @click="setCustomContent" size="mini">设置内容</el-button>
      </div>-->
    </div>
    <el-dialog
      title="上传视频"
      :visible.sync="dialogVisible"
      width="500px"
      class="video-dialog"
    >
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="上传视频" name="first">
          <upload-file
            type="VIDEO"
            :limit="1"
            accept="mp4|avi|mkv"
            :maxSize="50"
            :fileList="tempVideoList"
          />
          <div class="image-txt">请上传mp4、avi、mkv格式的视频文件;视频大小不能超过50MB；</div>
        </el-tab-pane>
        <el-tab-pane label="视频地址" name="second">
          <el-form label-width="80px" size="mini" :model="videoForm" :rules="rules" ref="videoForm">
            <el-form-item label="视频地址" prop="fileUrl">
              <el-input placeholder="请填写视频地址" v-model="videoForm.fileUrl"></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCloseDialog">我再想想</el-button>
        <el-button size="small" type="primary" @click="handleConfirmDialog">确定设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomDetailModule from '@/components/CustomDetailModule/index'
import { deepClone } from '@/utils/util'
export default {
  name: 'GoodsDetail',
  props: {
    gid: {
      type: Number,
      default: null
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
    UEditor: resolve => require(['@/components/UEditor/index'], resolve),
    UploadFile: resolve => require(['@/components/UploadFile/index'], resolve),
    CustomDetailModule
  },
  data() {
    return {
      dialogVisible: false,
      activeName: 'first',
      tempVideoList: [],
      videoForm: {
        fileUrl: ''
      },
      rules: {
        fileUrl: [
          { max: 100, message: '最长允许100个字符', trigger: 'blur' },
          { pattern: /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/, message: '连接格式错误', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.setCustomContent()
  },
  methods: {
    handleGoodImageFormat() {
      return deepClone(this.goodImageList).map((file, index) => {
        if (index === 0) {
          return {
            cover: true,
            type: 1,
            typeValue: file.fileUrl
          }
        } else {
          return {
            cover: false,
            type: 1,
            typeValue: file.fileUrl
          }
        }
      })
    },
    handleVideoCoverFormat() {
      return deepClone(this.videoCoverList).map(file => {
        return {
          cover: true,
          type: 2,
          typeValue: file.fileUrl
        }
      })
    },
    handleVideoFormat() {
      return deepClone(this.videoList).map(file => {
        return {
          cover: false,
          type: 2,
          typeValue: file.fileUrl
        }
      })
    },
    getCustomContent() {
      const content = this.$refs.customDetailModule.getContent()
      return content
    },
    setCustomContent() {
      if (this.contentsList[0] && this.contentsList[0].typeValue) {
        this.$refs.customDetailModule.setContent(this.contentsList[0].typeValue)
      }
    },
    validateMediaList() {
      // this.$parent.contentsList = this.getCustomContent()
      if (!this.goodImageList.length) {
        this.$message.error('至少上传一张商品图片')
        return false
      }
      if (this.videoList.length && !this.videoCoverList.length) {
        this.$message.error('视频存在至少上传一张封面图片')
        return false
      }
      if (this.videoCoverList.length && !this.videoList.length) {
        this.$message.error('视频封面存在至少上传一个视频')
        return false
      }
      this.$parent.form.baseCommodityMediaList = [...this.handleGoodImageFormat(), ...this.handleVideoCoverFormat(), ...this.handleVideoFormat()]
      return true
    },
    handleCloseDialog() {
      this.tempVideoList = []
      this.dialogVisible = false
    },
    handleConfirmDialog() {
      if (!this.tempVideoList.length && !this.videoForm.fileUrl) {
        this.$message.error('请至少上传一个视频或者视频地址')
        return false
      }

      this.$refs.videoForm.validate(validate => {
        if (!validate) {
          this.$message.error('视频地址格式错误')
          return false
        } else {
          if (this.tempVideoList.length) {
            this.$parent.videoList = this.tempVideoList
          } else if (this.videoForm.fileUrl) {
            this.$parent.videoList = [{
              fileUrl: this.videoForm.fileUrl
            }]
          }
          this.handleCloseDialog()
        }
      })
    },
    handleTabClick(tab) {
      this.activeName = tab.name
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '@/assets/style/common.scss';
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
        color: #f56c6c;
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
    }
  }
}
.video-file-card {
  width: 148px;
  height: 148px;
  display: inline-block;
  vertical-align: top;
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  text-align: center;
  position: relative;
  overflow: hidden;

  .el-icon-upload {
    font-size: 67px;
    color: #C0C4CC;
    margin: 40px 0 16px;
    line-height: 50px;
  }

  em {
    display: block;
    color: #409EFF;
    font-style: normal;
    line-height: 1.15;
    font-size: 14px;
    text-align: center;
  }
}
.video-dialog {
  /deep/ .el-dialog__body {
    padding: 0 20px;
  }
  .image-txt {
    margin-top: 10px;
  }
}
</style>
