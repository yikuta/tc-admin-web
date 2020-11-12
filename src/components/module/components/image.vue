<template>
  <dialog-model title="图片选择" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" showClose @success="handleSubmit">
    <div class="">
      <el-upload class="upload-demo" ref="upload" accept="image/*" name="image" style="display: inline-block;" action="" :limit="1" :show-file-list="false" :http-request="uploadRequest" :before-upload="beforeUpload" :file-list="fileList">
        <el-button type="primary" plain size="mini" icon="el-icon-plus">上传图片</el-button>
      </el-upload>
<!--      <div>预留的选择图片功能弹窗</div>-->
    </div>
  </dialog-model>
</template>

<script>
  import DialogModel from './dialog/index'
  import { uploadFileRequest } from '@/api/uploadFile'
  export default {
    name: 'UploadImage',
    components: {
      DialogModel
    },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      height: { // 最大高度
        type: Number,
        default: 1000
      },
      minHeight: { // 最小高度
        type: Number,
        default: 200
      },
      width: { // 最大宽度
        type: Number,
        default: 750
      },
      minWidth: { // 最小宽度
        type: Number,
        default: 750
      }
    },
    data() {
      return {
        dialogVisible: false,
        fileList: [],
        type: 'IMAGE'
      }
    },
    computed: {
      fileType: function() {
        return this.type.toLowerCase()
      }
    },
    watch: {
      visible(n) {
        this.dialogVisible = n
      },
      dialogVisible(n) {
        this.$emit('update:visible', n)
      }
    },
    methods: {
      handleSubmit() {
        // 确定
      },
      getImageMeasure(file) {
        // 图片宽高验证器
        return new Promise(function(resolve) {
          let reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = function(res) {
            let image = new Image()
            image.src = res.target.result
            image.onload = function() {
              resolve({ width: this.width, height: this.height })
            }
          }
        })
      },
      async validate(file) {
        // 校验
        const { accept, desc } = {
          desc: '图片',
          accept: 'jpeg|jpg|png|gif'
        }
        const regexp = new RegExp(`.(${this.accept || accept})$`)
        if (!regexp.test(file.name.toLowerCase())) {
          this.$message(`只允许上传${this.accept || accept}格式的${desc}`)
          return false
        }

        if (file.size / 1024 / 1024 > this.maxSize) {
          this.$message(`上传${desc}大小不能超过${this.maxSize}MB`)
          return false
        }
        if (this.width && this.height) {
          // 限制图片尺寸
          try {
            const { width, height } = await this.getImageMeasure(file)
            if (width > this.width || height > this.height) {
              this.$message(`上传图片尺寸不能高于${this.width}*${this.height}`)
              return false
            }
            if (width < this.minWidth || height < this.minHeight) {
              this.$message(`上传图片尺寸不能低于${this.width}*${this.height}`)
              return false
            }
          } catch (err) {
            this.$message('上传图片失败，请重新上传')
            return false
          }
        }
        return true
      },
      beforeUpload(file) {
        return this.validate(file)
      },
      uploadRequest(data) {
        let reader = new FileReader()
        reader.readAsArrayBuffer(data.file)
        reader.onload = (res) => {
          let byte = new Uint8Array(res.currentTarget.result)
          let binary = []
          for (let i = 0; i < byte.length; i++) {
            binary.push(byte[i])
          }
          const loading = this.$loading({
            lock: true,
            text: '图片上传中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const nameArray = data.file.name.split('.')

          uploadFileRequest({
            date: binary,
            filePath: this.fileType.toLowerCase(),
            fileName: nameArray[0],
            fileType: nameArray[1]
          }).then(res => {
            if (res.code === 200) {
              // 上传成功之后更新上传对象
              // this.fileList.push(res.result)
              this.$message.success('上传成功')
              this.$emit('success', res.result)
              this.$refs.upload.uploadFiles.pop()
              this.$emit('update:visible')
            } else {
              this.$refs.upload.uploadFiles.pop()
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

<style lang="scss" scoped></style>
