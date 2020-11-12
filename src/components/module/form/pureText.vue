<template>
  <div class="text padding">
    <div class="">
      <div class="text-main text-xl border-bottom-seat padding-bottom-sm margin-bottom-sm">纯文本</div>
      <div class="text-df padding-bottom-sm text-convention">排列方式</div>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">标题字号</el-col>
        <el-col :span="16">
          <el-select v-model="config.config.titleSize" size="mini">
            <el-option v-for="(item, index) in 36" :key="index" :label="item" :value="item" v-if="item > 11"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">标题位置</el-col>
        <el-col :span="16">
          <el-radio-group v-model="config.config.align">
            <el-radio label="left">左</el-radio>
            <el-radio label="center">中</el-radio>
            <el-radio label="right">右</el-radio>
          </el-radio-group>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">正文字号</el-col>
        <el-col :span="16">
          <el-select v-model="config.config.contentSize" size="mini">
            <el-option v-for="(item, index) in 36" :key="index" :label="item" :value="item" v-if="item > 11"></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">设置标题</el-col>
        <el-col :span="16">
          <el-input type="text" size="mini" v-model="config.content.title" placeholder="请输入标题" />
        </el-col>
      </el-row>
      <el-row class="padding-bottom-sm">
        <el-col :span="8" class="text-df text-second">设置文本</el-col>
        <el-col :span="16">
          <el-input type="textarea" size="mini" v-model="config.content.content" placeholder="请输入文本" />
        </el-col>
      </el-row>
      <div class="padding-bottom-sm">
        <div class="text-df text-convention">设置背景图</div>
        <div class="text-sm text-seat padding-top-sm padding-bottom-sm">建议图片尺寸宽度150×375，支持类型：jpg、png。</div>
        <div class="notice-image cursor" @click.stop="imageVisible = true">
          <img :src="config.content.image" v-if="config.content.image" />
          <el-button type="primary" size="mini" v-if="!config.content.image">点击上传</el-button>
        </div>
      </div>
    </div>
    <image-dialog :visible.sync="imageVisible" @success="handleSuccess"></image-dialog>
  </div>
</template>

<script>
  export default {
    name: 'Text',
    components: {
      ImageDialog: resolve => {
        return require(['../components/image'], resolve)
      }
    },
    props: {
      config: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    data() {
      return {
        imageVisible: false
      }
    },
    methods: {
      handleSuccess(result) {
        // 选择了图片
        this.config.content.image = result.fileUrl
      },
      getValid() {
        if (!this.config.content.title || !this.config.content.content) {
          this.$message.error('文本标题或文本内容不能为空')
          return false
        }
        return true
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/common";
  .notice-image{
    width:150px;height:150px;
    img{width:100%;height:100%;}
  }
</style>
