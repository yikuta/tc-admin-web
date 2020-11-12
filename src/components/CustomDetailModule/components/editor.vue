<template>
  <div class="">
    <el-form :model="form" label-width="100px" size="mini">
      <el-form-item label="模块名称">
        {{ config.moduleName || '富文本' }}
      </el-form-item>
      <el-form-item label="上下边距">
        <el-slider v-model="form.padding" class="slider-tip"></el-slider>
      </el-form-item>
      <el-form-item label="内容编辑">
        <div class="upload-btn"><el-button type="primary" size="mini" @click="Visible = true">上传图片</el-button></div>
        <u-editor v-model="form.value" :config="editorConfig" ref="ueditor"></u-editor>
      </el-form-item>
    </el-form>
    <upload-file :visible.sync="Visible" @success="handleFileSuccess"></upload-file>
  </div>
</template>

<script>
  export default {
    name: 'EditorModule',
    components: {
      UEditor: resolve => {
        return require(['@/components/UEditor/index'], resolve)
      },
      UploadFile: resolve => {
        return require(['@/components/UploadFile/manage'], resolve)
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      },
      editorConfig: {
        initialFrameWidth: 750, // 初始化编辑器宽度,默认1000
        initialFrameHeight: 320 // 初始化编辑器高度,默认320
      }
    },
    data() {
      return {
        form: {
          value: ''
        },
        Visible: false
      }
    },
    watch: {
      config: {
        handler() {
          this.form = this.config
        },
        deep: true
      }
    },
    created() {
      this.form = this.config
    },
    methods: {
      handleFileSuccess(file) {
        this.form.value = this.form.value + `<p><img src="${file.fileUrl}" style="max-width:100%;" /></p><p></p>`
        this.$forceUpdate()
      }
    },
    beforeDestroy() {}
  }
</script>

<style scoped lang="scss">
  .slider-tip{
    /deep/ .el-slider__button-wrapper {z-index:4}
  }
  .el-label-width-set{
  }
  .upload-btn{text-align: right;padding-bottom:10px;}
</style>
