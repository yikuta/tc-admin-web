<template>
  <div class="app-container">
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px">
      <el-row class="title-main">商品图片</el-row>
      <el-form-item prop="imageUrl">
        <el-upload class="cover-uploader" action="upload" :http-request="_reqUpload" :show-file-list="false" :before-upload="beforePicUpload">
          <span v-if="form.imageUrl" @mouseover="showDel='visible'" @mouseout="showDel='hidden'">
            <img :src="form.imageUrl" class="cover" />
            <span class="pic-delete-area" :style="{visibility:showDel}" @click="handleRemove">
              <i class="el-icon-close" :style="{color:'white',transform:'rotate(-45deg)'}"></i>
            </span>
          </span>
          <i v-else class="el-icon-plus cover-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-row class="title-main">详情头部</el-row>
      <custom-detail-module ref="detailHeader" :businessNo="2" :isShowCommon="true"></custom-detail-module>
      <el-row class="title-main">详情底部</el-row>
      <custom-detail-module ref="detailBottom" :businessNo="2" :isShowCommon="true"></custom-detail-module>
    </el-form>
  </div>
</template>

<script>
import CustomDetailModule from '@/components/CustomDetailModule/index'
import { reqUpload, reqDeleteFile } from '@/api/mallGoods'
import { mapState } from 'vuex'

export default {
  name: 'publishGoodsEdit',
  components: { CustomDetailModule },
  computed: {
    ...mapState('assembleGoods', ['curAssembleGoods', 'curGoodsDetail'])
  },
  data() {
    return {
      showDel: 'hidden',
      form: {
        imageUrl: ''
      },
      rules: {}
    }
  },
  mounted() {
    if (this.curAssembleGoods.id) {
      this.form.imageUrl = this.curGoodsDetail.thumbnailImage
      this.curGoodsDetail.channelCommodityMediaList.map(item => {
        item.type && item.type.value === 4 ? this.$refs['detailHeader'].setContent(item.typeValue) : null
        item.type && item.type.value === 5 ? this.$refs['detailBottom'].setContent(item.typeValue) : null
        return item
      })
    }
  },
  methods: {
    getContentHeader() {
      return this.$refs['detailHeader'].getContent()
    },
    getContentBottom() {
      return this.$refs['detailBottom'].getContent()
    },
    handlePicSuccess(res) {
      this.form.imageUrl = res.fileUrl
    },
    async beforePicUpload(file) {
      if (!/(jpeg|jpg|JPEG|JPG|png|PNG|gif|GIF)$/.test(file.type)) {
        this.$message('只允许上传jpg/png/gif格式的图片')
        throw new Error('只允许上传jpg/png/gif格式的图片')
      }
      if (file.size / 1024 / 1024 > 1) {
        this.$message('上传图片大小不能超过1MB')
        throw new Error('上传图片大小不能超过1MB')
      }
      return true
      // 限制图片尺寸，目前注释掉，但后期可能会用
      // try {
      //   const { width, height } = await this.getImageMeasure(file)
      //   if (width > 800 || height > 800) {
      //     this.$message('上传图片尺寸不能高于800*800')
      //     return false
      //   }
      //   return true
      // } catch (err) {
      //   this.$message('上传图片失败，请重新上传')
      //   return false
      // }
    },
    handleRemove(e) {
      reqDeleteFile({ filePath: this.form.imageUrl })
        .then(res => {
          if (res.code === 200) {
            this.form.imageUrl = ''
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        })
        .catch(() => {})
      e.stopPropagation()
    },
    /**
     * @description: 自定义上传图片
     */
    _reqUpload(data) {
      let _this = this
      let reader = new FileReader()
      reader.readAsArrayBuffer(data.file)
      reader.onload = function(res) {
        let byte = new Uint8Array(res.currentTarget.result)
        let binary = []
        for (let i = 0; i < byte.length; i++) {
          binary.push(byte[i])
        }
        reqUpload({ date: binary, filePath: 'image', fileName: new Date().getTime() + '', fileType: data.file.type.split('/')[1] })
          .then(res => {
            if (res.code === 200) {
              _this.$message({
                message: '上传成功',
                type: 'success'
              })
              _this.handlePicSuccess(res.result)
            }
          })
          .catch(() => {
            _this.$message({
              type: 'error',
              message: '上传失败'
            })
          })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  .form {
    margin-top: 10px;
  }
  .title-main {
    font-weight: bold;
    margin-bottom: 15px;
  }
  .text-second {
    color: rgb(215, 215, 215);
  }
  .cover-uploader /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .cover-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .cover-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 150px;
    height: 150px;
    line-height: 150px;
    text-align: center;
  }
  .cover {
    width: 150px;
    height: 150px;
    display: block;
  }
  .pic-delete-area {
    background-color: red;
    width: 40px;
    height: 30px;
    position: absolute;
    top: -10px;
    right: -15px;
    transform: rotate(45deg);
  }
}
</style>
