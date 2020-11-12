<template>
  <div>
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
          <div class="image-txt">请上传mp4格式的视频文件;视频大小不能超过50MB；</div>
        </el-tab-pane>
        <el-tab-pane label="视频地址" name="second">
          <el-form label-width="80px" size="mini" :model="videoForm" :rules="rules" ref="videoForm">
            <el-form-item label="视频地址" prop="fileUrl">
              <el-input placeholder="请填写视频地址" v-model.trim="videoForm.fileUrl"></el-input>
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
  export default {
    name: 'Video',
    props: {
    },
    data() {
      return {
        dialogVisible: false
      }
    },
    watch: {}
  }
</script>

<style lang="scss" scoped></style>
