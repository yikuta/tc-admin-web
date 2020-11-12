<template>
  <dialog-modal title="图片选择" :visible.sync="dialogVisible" width="50%" :close-on-click-modal="false" showClose @success="handleSubmit">
    <div class="">
      <el-upload class="upload-demo" ref="upload" accept="image/*" name="image" style="display: inline-block;" action="" :limit="1" :show-file-list="false" :http-request="uploadRequest" :file-list="fileList">
        <el-button type="primary" plain size="mini" icon="el-icon-plus">上传图片</el-button>
      </el-upload>
<!--      <div>预留的选择图片功能弹窗</div>-->
    </div>
    </el-dialog>
  </dialog-modal>
</template>

<script>
  /*
  * 文件说明
  * 这个文件来自 module/components/image
  * @success 返回参数
  *   fileName // 文件名称
  *   filePath // 文件地址（不含域名）
  *   fileType // 文件类型
  *   fileUrl // 文件地址（包含域名）
  *   urlPrefix // 根地址
  *   needWait // 是否需要等待
  * */
  import FileUpload from '@/utils/fileUpload'
  export default {
    name: 'UploadImage',
    components: {
      DialogModal: resolve => {
        return require(['@/components/Dialog/index.vue'], resolve)
      }
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
      uploadRequest(data) {
        const fileUpd = new FileUpload()
        const that = this
        fileUpd.upload(data.file, {
          img: {
            maxWidth: that.width,
            maxHeight: that.height,
            minWidth: that.minWidth,
            minHeight: that.minHeight
          },
          success(res) {
            // that.fileList.push(res)
            that.$emit('success', res)
            that.$refs.upload.clearFiles()
            that.$emit('update:visible')
          },
          fail() {
            that.$refs.upload.clearFiles()
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped></style>
