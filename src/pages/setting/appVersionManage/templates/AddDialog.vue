<template>
  <div class="app-container">
    <el-dialog title="新增配置" :visible="visible" @update:visible="onChange" width="500px" @close='handleClose(false)'>
      <el-form class="form" ref="form" :model="form" :rules="rules" label-width="90px" size="mini">
        <el-form-item label="版本号" prop="version">
          <el-input v-model="form.version" placeholder="请输入版本号" :maxlength="20" clearable />
        </el-form-item>
        <el-form-item label="类型" prop="os">
          <el-select v-model="form.os" clearable>
            <el-option v-for="item of typeOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端" prop="terminal">
          <el-select v-model="form.terminal" clearable>
            <el-option v-for="item of terminalOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="强制升级" prop="force">
          <el-select v-model="form.force" clearable>
            <el-option v-for="item of upgradeOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传安装包" v-if="form.os === 'ANDROID'">
          <upload-file type="FILE" :limit="1" :maxSize="0" :fileList="form.package" accept="apk" @change="handleUploadChange" />
        </el-form-item>
        <el-form-item label="URL" prop="url">
          <el-input v-model="form.url" :maxlength="200" clearable />
        </el-form-item>
        <el-form-item label="升级说明" prop="description">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }"
            :maxlength="200"
            placeholder="请输入内容"
            v-model="form.description"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" size="mini" @click="onChange(false)">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSave" :loading="loading">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchAppInitData, addAppVersion } from '@/api/setting/appVersion'
  // import regexp from '@/constants/regexp'
  export default {
    name: 'AddDialog',
    components: {
      UploadFile: resolve => {
        return require(['@/components/UploadFile/index'], resolve)
      }
    },
    props: {
      visible: Boolean
    },
    data() {
      let validateURL = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
          if (urlregex.test(value)) {
            callback()
          } else {
            callback(new Error('请输入正常的url地址'))
          }
        }
      }
      let validateVersion = (rule, value, callback) => {
        if (value === '') {
          callback('请输入版本号')
        } else {
          const urlregex = /^[\d|\.]{1,20}$/
          if (urlregex.test(value)) {
            callback()
          } else {
            callback(new Error('版本号只能输入1-20字符，仅限数字、点'))
          }
        }
      }
      return {
        form: {
          version: '', // 版本号
          os: '', // 类型
          terminal: '', // 终端
          force: '', // 是否强制升级
          package: [], // 上传的安装包
          appName: null,
          url: '',
          description: '' // 升级说明
        },
        rules: {
          version: [{ required: true, validator: validateVersion, trigger: 'blur' }],
          os: [{ required: true, message: '请选择类型', trigger: 'change' }],
          terminal: [{ required: true, message: '请选择终端', trigger: 'change' }],
          force: [{ required: true, message: '请选择是否强制升级', trigger: 'change' }],
          url: [
            // { required: false, message: '请输入URL链接', trigger: 'blur' },
            { pattern: false, validator: validateURL, trigger: 'blur' }
          ]
        },
        typeOptions: [],
        terminalOptions: [],
        upgradeOptions: [
          { key: '是', value: true },
          { key: '否', value: false }
        ],
        loading: false
      }
    },
    mounted() {
      this.fetchAppInitData()
    },
    methods: {
      fetchAppInitData() {
        fetchAppInitData({}).then(res => {
          if (res.code === 200) {
            this.terminalOptions = res.result.upGradeTerminalTypes
            this.typeOptions = res.result.upGradeOsTypes
          }
        })
      },
      handleUploadChange(fileList) {
        if (fileList[0] && fileList[0].fileUrl) {
          this.form.url = fileList[0].fileUrl
          this.form.appName = fileList[0].fileName
        } else {
          this.form.url = ''
          this.from.appName = null
        }
      },
      // 提交升级配置
      handleSave() {
        this.$refs['form'].validate(isSuccess => {
          if (isSuccess) {
            this.loading = true
            addAppVersion({ ...this.form }).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$message.success(res.message)
                this.handleClose(true)
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      onChange(visible) {
        this.$emit('update:visible', visible)
      },
      handleClose(isSuccess) {
        this.$emit('update:visible', false)
        this.$emit('close', isSuccess)
        this.$refs['form'].resetFields()
      }
    }
  }
</script>

<style lang='scss' scoped>
</style>
