<template>
  <div class="add-menu app-container">
    <detail-head title="菜谱详情"/>
    <div class="menu-form">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="数据来源：" prop="bookSource">
              <span>{{ruleForm.bookSource}}</span>
              <span v-if="ruleForm.bookSource === '用户发布'">({{ruleForm.phoneNum}})</span>
            </el-form-item>
            <el-form-item label="菜谱名称：" prop="name">
              <span>{{ruleForm.name}}</span>
            </el-form-item>
            <el-form-item label="封面图：" prop="imgList">
              <el-image 
                style="width: 300px; height: 150px"
                :src="ruleForm.homeImgUrl" 
                :preview-src-list="[ruleForm.homeImgUrl]">
              </el-image>
            </el-form-item>
            <el-form-item label="教程视频：" prop="videoList">
              <video ref="video" :src="ruleForm.videoUrl" controls :style="{width:'300px',height:'150px'}" v-if="ruleForm.videoUrl"/>
            </el-form-item>
            <el-row>
              <el-col :span="20">
                <el-form-item label="食材清单：" prop="cookBookIngredients">
                  <div v-for="(item,index) in ruleForm.cookBookIngredients" :key="index">
                    <span>{{item.name}}: {{item.attr}}</span>
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="菜谱描述：" prop="desc">
              <span>{{ruleForm.bookDesc}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="line"></div>
          </el-col>
          <el-col :span="18" :offset="2" style="margin-top:24px">
            <el-form-item v-for="(item,index) in ruleForm.cookBookSteps" :key="index" :label="`步骤${number[index]}：`" prop="cookBookSteps">
              <el-row :gutter="10">
                <el-col :span="10">
                  <el-image 
                    style="width: 300px; height: 150px"
                    :src="item.imgUrl" 
                    :preview-src-list="[item.imgUrl]">
                  </el-image>
                </el-col>
                <el-col :span="12">
                  <span>{{item.stepDesc}}</span>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
          <div v-if="isAudit">
            <el-col :span="24" style="margin-bottom:24px">
              <div class="line"></div>
            </el-col>
            <el-col :span="12" :offset="2">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="">
                    <el-radio-group v-model="form.audit">
                      <el-radio :label="1">审核通过</el-radio>
                      <el-radio :label="0">审核不通过</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="24" v-if="form.audit === 0">
                  <el-form-item label="">
                    <el-input type="textarea" v-model="form.message" :maxlength="150"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row class="btn-group">
                <el-button size="small" type="primary" @click="handleSubmit" :loading="loading" v-np='"COOKBOOK_AUDIT"'>确 认</el-button>
                <el-button size="small" @click="handleBack">取 消</el-button>
              </el-row>
            </el-col>
          </div>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import DetailHead from '../templates/DetailHead'
import UploadFile from '@/components/UploadFile'
import { fetchCookBooksDetailById, asyncCookBooksAudit } from '@/api/cookBook'
export default {
  name: 'cookBookDetail',
  components: { DetailHead, UploadFile },
  data() {
    return {
      number: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
      ruleForm: {
        bookSource: '',
        name: '',
        homeImgUrl: '',
        videoUrl: '',
        cookBookIngredients: [],
        bookDesc: '',
        cookBookSteps: [],
        phoneNum: ''
      },
      form: {
        audit: 1,
        message: ''
      },
      loading: false
    }
  },
  mounted() {
    this.handleDetail()
  },
  computed: {
    isAudit() {
      return this.$route.query.isAudit
    }
  },
  methods: {
    handleBack() {
      this.$router.go(-1)
    },
    handleDetail() {
      fetchCookBooksDetailById(this.$route.query.id).then(res => {
        if (res.code === 200) {
          const { id, bookSource, name, homeImgUrl, videoUrl, cookBookIngredients, bookDesc, cookBookSteps, phoneNum } = res.result
          this.ruleForm = {
            id,
            bookSource: bookSource === 1 ? '平台发布' : '用户发布',
            name,
            homeImgUrl,
            videoUrl,
            cookBookIngredients,
            bookDesc,
            cookBookSteps,
            phoneNum
          }
        }
      })
    },
    handleSubmit() {
      if (this.form.audit === 0 && !this.form.message) {
        this.$message.error('请填写审核不通过的原因')
        return
      }
      this.loading = true
      asyncCookBooksAudit({
        id: this.ruleForm.id,
        auditStatus: this.form.audit === 1 ? 'AUDIT_SUCCESS' : 'APPEAL_REJECT',
        message: this.form.audit === 1 ? '' : this.form.message
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$router.go(-1)
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.image-txt {
  color: #606266;
  font-size: 12px;
  padding-top: 10px;
}
.line{
  border: 1px dashed #999;
}
.icon{
  font-size: 20px;
  line-height: 32px;
  color: #999;
  cursor: pointer;
}
.step-icon{
  font-size: 30px;
  line-height: 145px;
}
.btn-group{
  text-align:center;
  button{
    width: 108px;
  }
}
</style>