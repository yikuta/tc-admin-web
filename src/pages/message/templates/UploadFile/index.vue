<template>
  <div class="album-wrapper">
    <div class="upload-area" v-if="fileType === 'file'">
      <el-upload
        class="upload-file"
        ref="file"
        action="upload"
        :show-file-list="false"
        :http-request="uploadRequest"
        :limit="limit"
        :before-upload="beforeUpload"
        :file-list="filesList"
      >
        <el-button :disabled="filesList.length >= limit" size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>
  </div>
</template>
<script>
  import { asyncMessageMembersUoload } from '@/api/message'
  // import { deleteFileRequest } from '@/api/uploadFile'

  const defaultConfig = {
    file: {
      desc: '文件',
      accept: 'xlsx|xltx|xlsm|xls|csv|pdf|docx|dotx|dotm|docm|doc|sheet'
    }
  }

  export default {
    name: 'uploadFile',
    props: {
      fileList: {
        type: Array,
        default: () => []
      },
      limit: { // 文件数量限制
        type: Number,
        default: 10
      },
      accept: {
        type: String,
        default: null
      },
      maxSize: {
        type: Number,
        default: 3
      },
      type: { // 文件类型
        type: String,
        default: 'IMAGE' // VIDEO | FILE | AUDIO
      },
      width: { // 图片宽度(为图片时需要)
        type: Number,
        default: null
      },
      height: { // 图片高度(为图片时需要)
        type: Number,
        default: null
      },
      templateType: {
        type: String,
        default: ''
      },
      channelType: {
        type: String,
        default: ''
      },
      identifier: {
        type: Number,
        default: 0
      }
    },
    watch: {
      fileList: {
        handler(newList) {
          this.filesList = newList
        },
        deep: true
      },
      filesList: { // 内部数据
        handler(newList) {
          this.$emit('change', newList)
        },
        deep: true
      }
    },
    computed: {
      previewSrcList: function() {
        const results = []
        if (this.filesList.length) {
          (this.filesList || []).forEach(item => {
            results.push(item.fileUrl)
          })
        }
        return results
      },
      fileType: function() {
        return this.type.toLowerCase()
      }
    },
    data() {
      return {
        defaultConfig: defaultConfig,
        isDragging: false,
        isPreview: false,
        showViewer: false,
        currentIndex: 0,
        filesList: this.fileList
      }
    },
    methods: {
      validate(file) {
        const { accept, desc } = defaultConfig[this.fileType]
        const regexp = new RegExp(`.(${this.accept || accept})$`)
        if (!regexp.test(file.name.toLowerCase())) {
          this.$message(`只允许上传${this.accept || accept}格式的${desc}`)
          return false
        }

        if (Number(this.maxSize) !== 0 && file.size / 1024 / 1024 > this.maxSize) {
          this.$message(`上传${desc}大小不能超过${this.maxSize}MB`)
          return false
        }
        /* if (this.width && this.height) {
          // 限制图片尺寸
          try {
            const {width, height} = await this.getImageMeasure(file)
            if (width > this.width || height > this.height) {
              this.$message(`上传图片尺寸不能高于${this.width}*${this.height}`)
              return false
            }
          } catch (err) {
            this.$message('上传图片失败，请重新上传')
            return false
          }*/
        return true
      },
      beforeUpload(file) {
        return this.validate(file)
      },
      uploadRequest(data) {
        let reader = new FileReader()
        reader.readAsArrayBuffer(data.file)
        reader.onload = () => {
          const loading = this.$loading({
            lock: true,
            text: `${defaultConfig[this.fileType].desc}上传中...`,
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          asyncMessageMembersUoload({ file: data.file }, {
            templateType: this.templateType,
            channelType: this.channelType,
            identifier: this.identifier
          }).then(res => {
            if (res.code === 200) {
              this.filesList.push(res.result)
              this.$message.success('上传成功')
            } else {
              this.$refs[this.fileType].uploadFiles.pop()
            }
            loading.close()
          }).catch(() => {
            this.$message.error('上传失败')
            loading.close()
          })
        }
      }
    }
  }
</script>
<style lang="scss" scoped>
  .album-wrapper{
    .album-list{
      margin: 0;
      display: inline;
      vertical-align: top;

      .album-item {
        display: inline-block;
        vertical-align: top;
        margin-right: 20px;

        .item-content {
          position: relative;
          overflow: hidden;
          background-color: #fff;
          border: 1px solid #c0ccda;
          border-radius: 6px;
          box-sizing: border-box;
          width: 148px;
          height: 148px;
          display: inline-block;
          transition: all .5s cubic-bezier(.55, 0, .1, 1);
          font-size: 14px;
          color: #606266;
          line-height: 1.8;

          .item-thumbnail {
            width: 100%;
            height: 100%;
          }

          .item-action {
            position: absolute;
            width: 100%;
            height: 100%;
            left: 0;
            top: 0;
            cursor: default;
            text-align: center;
            color: #fff;
            opacity: 0;
            font-size: 20px;
            background-color: rgba(0, 0, 0, .5);
            transition: opacity .3s;
            line-height: 148px;

            .item-preview {
              display: none;
              cursor: pointer;
            }

            .item-delete {
              display: none;
              cursor: pointer;
            }

            &:hover {
              opacity: 1;

              .item-preview {
                display: inline-block;
              }

              .item-delete {
                display: inline-block;
              }
            }
          }
        }

        .item-name {
          color: #606266;
          font-size: 12px;
          text-align: center;
          padding-top: 10px;
        }
      }
    }
    .upload-card-file {
      width: 148px;
      height:148px;
      display: inline-block;
      vertical-align: top;

      /deep/ .el-upload {
        width: 100%;
        height: 100%;

        .el-upload-dragger {
          width: 100%;
          height: 100%;
        }

        .el-upload__text {
          line-height: 1.15;
        }
      }
    }
  }
</style>
