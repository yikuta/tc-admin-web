<template>
  <div class="app-container">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" size="small">
      <el-row class="title">修改门店名称</el-row>
      <el-row class="content">
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <el-form-item label="门店编码：" prop="shopCode">
                <el-input v-model="form.shopCode" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="门店名称：" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="店招：" prop="shopSignList">
                <upload-file
                  type="IMAGE"
                  :limit="1"
                  :fileList="form.shopSignList"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <el-button size="small" style="width:108px" type="primary" @click="handleSubmit('ruleForm')" :loading="loading">提交审核</el-button>
    </div>
  </div>
</template>

<script>
import { asyncNameAndSignUpdate, reqAuditDetail } from '@/api/seller.js'
export default {
  name: 'shopDetail',
  components: {
    UploadFile: resolve => {
      return require(['@/components/UploadFile/index'], resolve)
    }
  },
  data() {
    return {
      form: {
        shopCode: '',
        name: '',
        detail: '',
        shopSignList: [],
        shopSign: ''
      },
      rules: {
        name: [
          { required: true, message: '请填写门店名称', trigger: 'blur' },
          { max: 30, message: '最多30个字符', trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  mounted() {
    const { code } = this.$route.query
    this.form.shopCode = code || ''
    if (code) {
      this.handleDetail()
    }
  },
  methods: {
    handleDetail() {
      const { code } = this.$route.query
      reqAuditDetail(code).then(res => {
        if (res.code === 200) {
          Object.keys(this.form).forEach(key => {
            if (key === 'shopSignList') {
              if (res.result[key.substr(0, key.length - 4)]) {
                this.form[key] = [{
                  fileUrl: res.result[key.substr(0, key.length - 4)],
                  name: res.result[key.substr(0, key.length - 4)]
                }]
              } else {
                this.form[key] = []
              }
            } else {
              this.form[key] = res.result[key]
            }
          })
        }
      })
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const { shopCode, name, shopSignList } = this.form
          this.loading = true
          asyncNameAndSignUpdate({
            shopCode,
            name,
            shopSign: shopSignList[0] ? shopSignList[0].fileUrl : ''
          }).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$message.success(res.message || '提交审核成功')
              this.$router.go(-1)
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
@import './style/index.scss';
.app-container {
  font-size: 14px;
  .title {
    border-left: 6px solid rgba(64, 158, 255, 1);
    padding-left: 10px;
    font-size: 16px;
  }
  .content {
    padding: 30px;
  }
}
.btns{
  margin-top: 50px;
  margin-left: 142px;
}
</style>
