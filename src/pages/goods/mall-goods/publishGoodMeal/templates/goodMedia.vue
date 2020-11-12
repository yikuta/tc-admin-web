<template>
  <div class="app-container">
    <section>
      <el-row class="title-main"><span class="red-required">*</span>套餐图片</el-row>
      <upload-file :fileList="goodImages" :limit="10" type="image" />
    </section>
    <section>
      <el-row class="title-main">套餐视频</el-row>
      <div class="video-box">
        <div class="video-image">
          <upload-file
            type="IMAGE"
            :limit="1"
            :maxSize="1"
            :fileList="videoImages"
            ref="videoCover"
          />
          <div class="image-txt">视频封面</div>
        </div>
        <div class="video-file" v-if="!videoList.length">
          <div class="video-file-card" @click="dialogVisible = true">
            <i class="el-icon-upload"></i>
            <em>点击上传</em>
          </div>
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
    </section>

    <section>
      <el-row class="title-main"><span class="red-required">*</span>套餐详情</el-row>
      <custom-detail-module ref="detail" isShowCommon :businessNo="1"></custom-detail-module>
    </section>
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
            :maxSize="50"
            :fileList="tempVideoList"
          />
          <div class="image-txt">请上传mp4格式的视频文件;视频大小不能超过50MB；</div>
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
      return {
        dialogVisible: false,
        activeName: 'first',
        videoForm: {
          fileUrl: ''
        },
        rules: {
          fileUrl: [
            { max: 100, message: '最长允许100个字符', trigger: 'blur' },
            { pattern: /^(https?|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]$/, message: '连接格式错误', trigger: 'blur' }
          ]
        },
        tempVideoList: []
      }
    },
    mounted() {
      if (this.detailList[0] && this.detailList[0].typeValue) {
        this.$refs['detail'].setContent(JSON.parse(this.detailList[0].typeValue), true)
      }
    },
    methods: {
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
      },
      getDetailContent() {
        return this.$refs.detail.getContent()
      },
      validateMediaList() {
        const content = this.getDetailContent()
        this.$parent.detailList = [{
          id: this.detailList[0] && this.detailList[0].id,
          typeValue: content.value,
          htmlValue: content.html
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

    .video-dialog {
      /deep/ .el-dialog__body {
        padding: 0 20px;
      }
      .image-txt {
        margin-top: 10px;
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
  }
</style>
