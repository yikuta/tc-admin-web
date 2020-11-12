<template>
  <div class="add-menu app-container">
    <div class="detail-head">
      <span>{{$route.query.id?'编辑菜谱':'新增菜谱'}}</span>
      <el-button size='small' type="primary" @click="handleBack">返回</el-button>
    </div>
    <div class="menu-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" size="small">
        <el-row>
          <el-col :span="12" :offset="2">
            <el-form-item label="菜谱名称：" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="封面图：" prop="homeImgUrlList">
              <upload-file :limit="1" type="IMAGE" :fileList="ruleForm.homeImgUrlList" :maxSize='10' accept="jpeg|jpg|png"/>
              <div class="image-txt">只能上传PNG/JPG/JPEG格式的图片，图片大小不能超过10M</div>
            </el-form-item>
            <el-form-item label="教程视频：" prop="videoUrlList">
              <upload-file :limit="1" type="VIDEO" :fileList="ruleForm.videoUrlList" :maxSize='100'/>
              <div class="image-txt">只能上传MP4格式的视频，视频大小不能超过100M</div>
            </el-form-item>
            <el-row>
              <el-col :span="20">
                <el-form-item label="食材清单：" prop="cookBookIngredients">
                  <div v-for="(item,index) in ruleForm.cookBookIngredients" :key="index">
                    <el-row>
                      <el-col :span="8">
                        <el-input placeholder="例：猪肉" v-model="item.name" :maxlength="10"></el-input>
                      </el-col>
                      <el-col :span="8" style="margin:0 10px">
                        <el-input placeholder="例：500g" v-model="item.attr" :maxlength="10"></el-input>
                      </el-col>
                      <el-col :span="2">
                        <i class="el-icon-circle-close icon" v-show="ruleForm.cookBookIngredients.length>1" @click="handleRemoveList(index)"></i>
                      </el-col>
                    </el-row>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-button type="primary" size="mini" @click="handleAddList">增加</el-button>
              </el-col>
            </el-row>
            <el-form-item label="菜谱描述：" prop="bookDesc">
              <el-input type="textarea" v-model="ruleForm.bookDesc" placeholder="请输入菜谱描述,描述需在150字以内"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <div class="line"></div>
          </el-col>
          <el-col :span="18" :offset="2" style="margin-top:24px">
            <el-form-item v-for="(item,index) in ruleForm.cookBookSteps" :key="index" :label="`步骤${number[index]}：`" prop="cookBookSteps">
              <el-row :gutter="10">
                <el-col :span="14">
                  <div style="float: left;width:160px">
                    <upload-file :limit="1" type="IMAGE" :fileList="item.imgUrl" :maxSize='10'/>
                  </div>
                  <el-input 
                    type="textarea"  
                    placeholder="请输入该步骤的描述，描述内容需在150字以内" 
                    v-model="item.stepDesc"
                    maxlength="150"
                    :rows='7'
                    show-word-limit
                    style="width:calc(100% - 160px)"></el-input>
                </el-col>
                <el-col :span="3">
                  <i class="el-icon-circle-plus-outline icon step-icon" @click="handleAdd(index)"></i>
                  <i class="el-icon-remove-outline icon step-icon" v-show="ruleForm.cookBookSteps.length>1" @click="handleRemove(index)"></i>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div style="text-align:center">
        <el-button size="small" type="primary" @click="handleSubmit" :loading="loading">提交审核</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import UploadFile from '@/components/UploadFile'
import { asyncCookBooksAddOrEdit, fetchCookBooksDetailById } from '@/api/cookBook'
export default {
  name: 'cookBookAdd',
  components: { UploadFile },
  data() {
    const validateMenu = (rule, value, callback) => {
      if (value[0].name && value[0].attr) {
        callback()
      } else {
        callback(new Error('请完善食材清单'))
      }
    }
    const validateStep = (rule, value, callback) => {
      if (value[0].imgUrl.length && value[0].stepDesc) {
        callback()
      } else {
        callback(new Error('请至少输入一条步骤'))
      }
    }
    return {
      number: ['一', '二', '三', '四', '五', '六', '七', '八', '九'],
      ruleForm: {
        id: '',
        name: '',
        homeImgUrlList: [],
        videoUrlList: [],
        cookBookIngredients: [
          {
            name: '',
            attr: ''
          }
        ],
        cookBookSteps: [
          {
            imgUrl: [],
            stepDesc: '',
            sort: ''
          }
        ]
      },
      rules: {
        name: [
          { required: true, message: '请输入菜谱名称', trigger: 'blur' },
          { max: 30, message: '菜谱名称不能超过30个字', trigger: 'blur' }
        ],
        homeImgUrlList: [
          { type: 'array', required: true, message: '请上传列表封面图', trigger: 'change' }
        ],
        cookBookIngredients: [
          { validator: validateMenu, required: true, trigger: 'blur' }
        ],
        bookDesc: [
          { required: true, message: '请输入食材描述', trigger: 'blur' },
          { max: 150, message: '食材描述需在150字以内', trigger: 'blur' }
        ],
        cookBookSteps: [
          { validator: validateStep, required: true, trigger: 'blur' }
        ]
      },
      loading: false
    }
  },
  mounted() {
    if (this.$route.query.id) {
      this.handleDetail()
    }
  },
  methods: {
    handleDetail() {
      fetchCookBooksDetailById(this.$route.query.id).then(res => {
        if (res.code === 200) {
          const { id, name, homeImgUrl, videoUrl, cookBookIngredients, bookDesc, cookBookSteps, homeImgWidth, homeImgHeight } = res.result
          this.ruleForm = {
            id,
            name,
            homeImgUrlList: homeImgUrl ? [{
              fileUrl: homeImgUrl,
              width: homeImgWidth,
              height: homeImgHeight
            }] : [],
            videoUrlList: videoUrl ? [{ fileUrl: videoUrl }] : [],
            cookBookIngredients,
            bookDesc,
            cookBookSteps: cookBookSteps.map((item, index) => {
              return {
                imgUrl: item.imgUrl ? [{ fileUrl: item.imgUrl }] : [],
                stepDesc: item.stepDesc,
                sort: index + 1
              }
            })
          }
        }
      })
    },
    handleAdd(index) {
      this.ruleForm.cookBookSteps.splice(index + 1, 0, { imgUrl: [], stepDesc: '' })
    },
    handleRemove(index) {
      this.ruleForm.cookBookSteps.splice(index, 1)
    },
    handleAddList() {
      this.ruleForm.cookBookIngredients.push({ name: '', attr: '' })
    },
    handleRemoveList(index) {
      this.ruleForm.cookBookIngredients.splice(index, 1)
    },
    handleSubmit() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const { id, name, homeImgUrlList, videoUrlList, cookBookIngredients, cookBookSteps, bookDesc } = this.ruleForm
          let obj = {
            id,
            name,
            bookDesc,
            cookBookIngredients,
            cookBookSteps: cookBookSteps.map((item, index) => {
              return {
                imgUrl: item.imgUrl[0].fileUrl,
                stepDesc: item.stepDesc,
                sort: index + 1
              }
            }),
            homeImgUrl: homeImgUrlList[0].fileUrl,
            homeImgWidth: homeImgUrlList[0].width,
            homeImgHeight: homeImgUrlList[0].height,
            videoUrl: videoUrlList && videoUrlList.length ? videoUrlList[0].fileUrl : ''
          }
          this.$confirm('是否确认提交审核？', '提示', {}).then(() => {
            this.loading = true
            asyncCookBooksAddOrEdit(obj).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$router.go(-1)
              } else {
                this.loading = false
              }
            }).catch(() => {
              this.loading = false
            })
          })
        } else {
          return false
        }
      })
    },
    handleBack() {
      this.$confirm('页面内容尚未保存，是否确认返回？', '提示', {}).then(() => {
        this.$router.go(-1)
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
.detail-head{
  display: flex;
  justify-content: space-between;
  padding: 0 0 10px;
  font-size: 14px;
  span{
    line-height: 32px;
    &::before{
      content: '';
      display: inline-block;
      width: 5px;
      height: 20px;
      background: rgba(64, 158, 255, 1);
      float: left;
      margin: 6px 8px 0 0;
    }
  }
}
</style>