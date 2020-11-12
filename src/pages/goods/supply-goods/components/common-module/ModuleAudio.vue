<template>
  <div>
    <div class="item">
      <span>上下边距：</span>
      <el-slider
        v-model="form.audioMargin"
        style="float:left;width:80%"
        height='32px'
        @change="onChange('audioMargin', form.audioMargin)"
      ></el-slider>
    </div>
    <div class="item">
      <span>视频封面：</span>
      <el-upload
        drag
        action=""
        :auto-upload="false"
        :on-change="handleChange"
        multiple
        :show-file-list="false"
        :limit="3"
        class="drag-box"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处</div>
        <div class="el-upload__text">或<em>点击上传</em></div>
      </el-upload>
      <span style="color:#AAAAAA;margin-left:20px">*用于视频第一帧展示，图片建议尺寸375px*200px</span>
    </div>
    <div class="item" style="align-items:baseline">
      <span>上传视频：</span>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="3"
        :file-list="fileList">
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip">上传视频大小不能超过20MB，视频支付格式：MP4,AVI,mpeg,quicktime</div>
      </el-upload>
    </div>
  </div>
</template>
<script>
export default {
  components: {
    UEditor: resolve => {
      return require(['@/components/UEditor/index'], resolve)
    }
  },
  data() {
    return {
      form: {
        audioMargin: 20,
        image: '',
        audio: ''
      },
      fileList: []
    }
  },
  methods: {
    onChange(key, value) {
      this.$emit('handleChange', key, value)
    },
    handleChange(file, fileList) {
      // 上传成功后再进行处理
      this.fileList = fileList
    }
  }
}
</script>
<style lang="scss" scoped>
.item {
  margin-bottom: 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  span {
    float: left;
  }
}
</style>
