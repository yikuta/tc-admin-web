<!--
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-13 15:43:58
 * @LastEditTime: 2020-09-10 15:56:59
 * @LastEditors: Joker
-->
<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" @selection-change="handleSelectionChange" size="mini">
      <el-table-column label="版本号" prop="version" />
      <el-table-column label="类型" prop="osDesc" />
      <el-table-column label="终端" prop="terminalDesc" />
      <el-table-column label="是否强制升级" prop="ifForceDesc"/>
      <el-table-column label="URL" prop="url" />
      <el-table-column label="android安装包上传">
        <template slot-scope="{ row }">
          <div v-if="row.os.toLowerCase() === 'android'" class="package-area">
            <el-link :underline="false" type="primary" v-np="'APP_RELEASE_PKG_UPLOAD'" @click="handleUploadApp(row)">上传安装包</el-link>
            <upload-file ref="upload" v-show="false" type="FILE" :maxSize="0" :fileList="row.package" accept="apk" @change="onChangeUpload" />
            <span>{{row.appName}}</span>
          </div>
          <div v-else>-</div>
        </template>
      </el-table-column>
      <el-table-column label="升级说明" prop="description" width="400" />
      <el-table-column label="操作" width="80">
        <template slot-scope="{ row }">
          <el-link :underline="false" type="danger" v-np="'APP_RELEASE_INFO_DEL'" @click="handleRemove(row)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { deleteAppVersion, updateAppVersion } from '@/api/setting/appVersion'

  export default {
    name: 'TableArea',
    components: {
      UploadFile: resolve => {
        return require(['@/components/UploadFile/index'], resolve)
      }
    },
    props: {
      tableData: { type: Array, default: () => [] }
    },
    data() {
      return {
        currentRow: {}
      }
    },
    methods: {
      //  删除版本
      handleRemove(row) {
        this.$confirm('删除后无法下载该最新安卓包或无法强制升级，确认要删除配置吗', '确认', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(() => {
          deleteAppVersion({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$emit('refresh-list')
            }
          })
        })
      },
      // 上传安装包
      handleUploadApp(row) {
        this.currentRow = row
        this.$refs['upload'].$refs['file'].$el.querySelector('button').click()
      },
      // 上传结束
      onChangeUpload(fileList) {
        if (fileList[0] && fileList[0].fileUrl) {
          const { fileName, fileUrl } = fileList[0]
          updateAppVersion({
            id: this.currentRow.id,
            appName: fileName,
            url: fileUrl
          }).then(res => {
            if (res.code === 200) {
              this.currentRow.url = fileUrl
              this.currentRow.appName = fileName
              this.currentRow = {}
            }
          })
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
.wrapper {
  .package-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
