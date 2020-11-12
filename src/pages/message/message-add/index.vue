<template>
  <div class="app-container">
    <detail-head title='新建信息' @back='handleBack'/>
    <div class="add-form">
      <el-form class="form" ref="form" :model="form" :rules="rules" size="small" label-width="100px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="消息类型" prop="messageType">
              <el-select v-model="form.messageType" clearable @change="handleChangeMessage">
                <el-option v-for="item of typeOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模板" prop="templateCode">
              <el-select v-model="form.templateCode" clearable @change="handleChangeTemplate">
                <el-option v-for="item of templateOptions" :key="item.templateCode" :label="item.title" :value="item.templateCode"></el-option>
                <el-option label="未选择模板" value=""></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="业务判别" prop="businessType" v-if="$route.query.type==='SM'">
              <el-select v-model="form.businessType" clearable disabled>
                <el-option v-for="item of businessTypes" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="消息标题" prop="title">
              <el-input :disabled="form.templateCode !== ''" v-model="form.title" placeholder="消息标题" clearable />
            </el-form-item>
            <el-form-item label="消息内容" prop="content">
              <el-input :disabled="form.templateCode !== ''" type="textarea" v-model="form.content" clearable />
            </el-form-item>
            <el-row style="position: relative">
              <el-col :span="24">
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="参数" prop="templateParams">
                      <el-input v-model="form.templateParams" placeholder="多参数填写用“,”隔开，例如：{0}, {1}" clearable />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="排序数字" prop="templateSort">
                      <el-input v-model="form.templateSort" placeholder="可填写1,2,3" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="" prop="sendUserName">
                      <el-checkbox v-model="form.sendUserName">用户名</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="排序数字" prop="sendUserNameSort">
                      <el-input v-model="form.sendUserNameSort" placeholder="可填写1,2,3" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="" prop="sendPhone">
                      <el-checkbox v-model="form.sendPhone">手机号</el-checkbox>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="排序数字" prop="sendPhoneSort">
                      <el-input v-model="form.sendPhoneSort" placeholder="可填写1,2,3" clearable />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-col>
              <div class="tip">
                <p>说明：</p>
                <p>1、填写参数默认存在；</p>
                <p>2、若排序数字相同，则按照手写参数、姓名，手机尾号顺序传参，排序代表传参顺序；</p>
                <p>3、用户名和手机尾号勾选则生效，对应尾号和姓名均为选择的用户；</p>
                <p>4、若用户名不存在，则传空字符串；</p>
              </div>
            </el-row>
            <el-form-item label="发送方式" prop="sendAuto">
              <el-radio-group v-model="form.sendAuto">
                <el-radio :label="true">自定义发送时间</el-radio>
                <el-radio :label="false">手动发送</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="" prop="sendTime" v-if="form.sendAuto">
              <el-date-picker
                v-model="form.sendTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
                :picker-options="{ disabledDate (time) { return time.getTime() - 1 < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() - 1 }}">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="发送渠道" prop="channelType">
              <el-radio-group v-model="form.channelType" @change="handleChangeChannel">
                <el-radio label="CLIENT_USER">用户</el-radio>
                <el-radio label="BOSS_USER">商家</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="选择接收人" prop="receivedUser">
              <el-row>
                <el-col :span="7">
                  <el-radio-group v-model="form.receivedUser" @change="handleDeleteMembers">
                    <el-radio :label="1">添加用户</el-radio>
                    <el-radio :label="2">上传文件</el-radio>
                  </el-radio-group>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" v-if="form.receivedUser===1" @click="handleAddUser">添加用户</el-button>
                  <!-- <el-button
                    v-else
                    size="mini"
                    type="primary"
                    @click="showDialog">上传文件</el-button> -->
                  <!-- <el-button type="primary" v-else>添加文件</el-button> -->
                  <upload-file
                    type="FILE"
                    :limit="1"
                    :maxSize="0"
                    :fileList="form.fileList"
                    :templateType='$route.query.type'
                    :channelType='form.channelType'
                    :identifier='identifier'
                    @change="handleUploadChange" v-else/>
                </el-col>
                <el-col :span="9">
                  <div style="height:32px">
                    <div v-show="form.receivedUser===2 && form.fileList.length">
                      <div class="upload-file">
                        <span>用户范围上传模板.xlsx&nbsp;&nbsp;</span>
                        <el-button size="mini" type="text" @click="showUserDialog">查看上传</el-button>
                        <i class="el-icon-upload-success el-icon-circle-check" style="line-height:32px;color:#67c23a"></i>
                        <i class="el-icon-close"  style="line-height:32px" @click="handleDeleteMembers"></i>
                      </div>
                      <UserDialog
                        ref="userDialog"
                        :uploadResult='uploadResult'
                        :channelType='form.channelType'
                        :identifier='identifier'/>
                    </div>
                  </div>
                </el-col>
                <el-col :span="5" :offset="1" v-if="form.receivedUser===2">
                  <a ref="download" target="_blank" download="" href="" v-show="2<1"></a>
                  <div>只能上传.xls或.xlsx            <el-button :disabled="downloadBtn" type="text" @click="_reqDownloadMemberTemplate">下载模版</el-button></div>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <show-user-data
        v-if="form.channelType==='CLIENT_USER' && showData"
        :nomove='form.receivedUser===2'
        :channelType='form.channelType'
        :identifier='identifier'
        @deleteAll='handleDeleteMembers'
        ref="userData"/>
      <show-merchant-data
        v-if="form.channelType==='BOSS_USER' && showData"
        :nomove='form.receivedUser===2'
        :channelType='form.channelType'
        :identifier='identifier'
        @deleteAll='handleDeleteMembers'
        ref="bossData"
        />
      <div class="btns">
        <el-button v-np='`MSG_${fetchType(row)}_CONFIG_CONTENT_SAVE`' type="primary" style="margin-right:10px" size="small" @click="handleSave">保存并关闭</el-button>
        <el-button size="small" @click="handleBack">取消</el-button>
      </div>
    </div>
    <add-user-data-dialog :visible.sync='userVisible' @add='handleAdd' @addAll='handleAddAll'/>
    <add-merchant-data-dialog :visible.sync='merchantVisible' @add='handleAdd' @addAll='handleAddAll'/>
  </div>
</template>
<script>
import DetailHead from '../templates/DetailHead'
import AddUserDataDialog from './AddUserDataDialog'
import AddMerchantDataDialog from './AddMerchantDataDialog'
import ShowUserData from './showUserData'
import ShowMerchantData from './showMerchantData'
import UserDialog from '../templates/UserDialog'
import { asyncMessageMembersAdd, asyncMessageMembersDelete, fetchMessageTemplatesList, fetchInitMessageTemplate, asyncMessageCreate, asyncMessageMembersQueryAdd, fetchMessageTemplateById } from '@/api/message'
import { reqDownloadMemberTemplate } from '@/api/coupon'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'
import { MatchType, DataType } from '@/constants/search'
function getTimestamp() {
  const date = new Date().getTime() / 1000
  return parseInt(date.toString(), 10)
}
export default {
  components: {
    DetailHead,
    AddUserDataDialog,
    AddMerchantDataDialog,
    ShowUserData,
    UserDialog,
    ShowMerchantData,
    UploadFile: resolve => {
      return require(['../templates/UploadFile/index'], resolve)
    }
  },
  data() {
    return {
      form: {
        channelType: 'CLIENT_USER',
        receivedUser: 1,
        sendAuto: true,
        title: '',
        content: '',
        messageType: '',
        templateCode: '',
        sendTime: '',
        businessType: 'MARKETING',
        templateParams: '',
        fileList: [],
        sendUserName: false,
        sendPhone: false,
        templateSort: '',
        sendUserNameSort: '',
        sendPhoneSort: ''
      },
      rules: {
        title: [
          { required: true, message: '请输入消息标题', trigger: 'blur' },
          { max: 20, message: '请输入20字以内的任意字符', trigger: 'blur' }
        ],
        messageType: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
        // template: [{ required: true, message: '请选择模板', trigger: 'change' }],
        content: [
          { required: true, message: '请输入消息内容', trigger: 'blur' },
          { max: 200, message: '请输入200字以内的任意字符', trigger: 'blur' }
        ],
        templateParams: [
          { max: 50, message: '请输入200字以内的任意字符', trigger: 'blur' }
        ],
        sendAuto: [{ required: true, message: '请选择发送方式', trigger: 'change' }],
        channelType: [{ required: true, message: '请选择发送渠道', trigger: 'change' }],
        receivedUser: [{ required: true, message: '请选择接收人', trigger: 'change' }],
        businessType: [{ required: true, message: '请选择业务判别', trigger: 'change' }]
      },
      typeOptions: [
        { name: '系统消息', code: '1' },
        { name: '采购单信息', code: '2' },
        { name: '自营商品信息', code: '3' },
        { name: '未选择', code: '' }
      ],
      templateOptions: [],
      businessTypes: [],
      userVisible: false,
      merchantVisible: false,
      downloadBtn: false,
      currentPage: 1,
      pageSize: 10000,
      showData: false,
      uploadResult: {
        totalNum: 0,
        successNum: 0,
        failedNum: 0
      },
      templateType: ''
    }
  },
  created() {
    this.identifier = getTimestamp()
    this.handleInit()
  },
  mounted() {
    if (this.$route.query.id) {
      this.handleDetail(this.$route.query.id)
    }
    if (this.$route.query.type) {
      this.templateType = this.$route.query.type
    }
  },
  methods: {
    handleDetail(id) {
      fetchMessageTemplateById(id).then(res => {
        if (res.code === 200) {
          this.form.messageType = res.result.messageType
          this.handleDataList(this.form.messageType)
          this.form.templateCode = res.result.templateCode
          this.form.title = res.result.title
          this.form.content = res.result.content
          this.form.businessType = res.result.businessType
        }
      })
    },
    handleInit() {
      fetchInitMessageTemplate().then(res => {
        if (res.code === 200) {
          this.typeOptions = res.result.messageTypes || []
          this.businessTypes = res.result.businessTypes || []
        }
      })
    },
    handleCheckDate(time) {
      let strtime = time.replace('/-/g', '/') // 时间转换
      // 时间
      let date1 = new Date(strtime)
      // 现在时间
      let date2 = new Date()
      // 距离现在十分钟后的时间
      let date3 = date2.setTime(date2.getTime() + 10 * 60 * 1000)
      // 判断时间是否过期
      return date1 < date3
    },
    handleAddUser() {
      if (this.form.channelType === 'CLIENT_USER') {
        this.userVisible = true
      } else {
        this.merchantVisible = true
      }
    },
    handleAdd(val) {
      let memberInfoList = []
      if (this.form.channelType === 'CLIENT_USER') {
        memberInfoList = val.map(item => {
          return {
            memberCode: item.memberCode,
            memberPhone: item.memberPhone,
            nickName: item.nickName,
            memberId: item.id,
            existence: true
          }
        })
      } else {
        memberInfoList = val.map(item => {
          return {
            memberCode: item.username,
            memberPhone: item.username,
            nickName: item.nickname,
            memberId: item.id,
            existence: true
          }
        })
      }
      asyncMessageMembersAdd({
        channelType: this.form.channelType,
        memberInfoList,
        templateType: this.templateType,
        identifier: this.identifier
      }).then(res => {
        if (res.code === 200) {
          this.showData = true
          if (this.form.channelType === 'CLIENT_USER') {
            this.userVisible = false
            if (this.$refs.userData) this.$refs.userData.handleSearch()
          } else {
            this.merchantVisible = false
            if (this.$refs.bossData) this.$refs.bossData.handleSearch()
          }
        }
      })
    },
    handleAddAll(searchs) {
      asyncMessageMembersQueryAdd({
        channelType: this.form.channelType,
        searchs,
        templateType: this.templateType,
        identifier: this.identifier
      }).then(res => {
        if (res.code === 200) {
          this.showData = true
          if (this.form.channelType === 'CLIENT_USER') {
            this.userVisible = false
            if (this.$refs.userData) this.$refs.userData.handleSearch()
          } else {
            this.merchantVisible = false
            if (this.$refs.bossData) this.$refs.bossData.handleSearch()
          }
        }
      })
    },
    _reqDownloadMemberTemplate() {
      this.downloadBtn = true
      return reqDownloadMemberTemplate().then((res) => {
        if (res) {
          let url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }))
          let node = this.$refs.download
          node.download = '用户范围上传模板.xlsx'
          node.target = '_blank'
          node.href = url
          node.click()
        }
        this.downloadBtn = false
      })
    },
    handleUploadChange(fileList) {
      if (fileList && fileList.length) {
        this.uploadResult = fileList[0]
        this.showData = true
        if (this.form.channelType === 'CLIENT_USER') {
          if (this.$refs.userData) this.$refs.userData.handleSearch()
        } else {
          if (this.$refs.bossData) this.$refs.bossData.handleSearch()
        }
      }
    },
    handleDeleteMembers() {
      this.showData = false
      asyncMessageMembersDelete({
        channelType: this.form.channelType,
        templateType: this.templateType,
        deleteAll: true,
        identifier: this.identifier
      }).then(res => {
        if (res.code === 200) {
          this.form.fileList = []
        }
      })
    },
    handleChangeChannel() {
      this.handleDeleteMembers()
      this.form.sendTime = ''
    },
    handleBack() {
      // this.handleDeleteMembers()
      this.$router.go(-1)
    },
    handleDataList(messageType) {
      let obj = {
        templateType: { value: this.templateType, name: 'templateType', matchType: MatchType.EQUAL, type: DataType.STRING },
        messageType: { value: messageType, name: 'messageType', matchType: MatchType.EQUAL, type: DataType.STRING },
        templateStatus: { value: 'MESSAGE_TEMPLATE_STATUS_ON', name: 'templateStatus', matchType: MatchType.EQUAL, type: DataType.STRING }
      }
      const searches = searchTool(deepClone(obj))
      fetchMessageTemplatesList({
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        searchs: searches.length ? JSON.stringify(searches) : null
      }).then(res => {
        if (res.code === 200) {
          this.templateOptions = res.result.itemVOs || []
        }
      })
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.sendAuto) {
            if (!this.form.sendTime || this.handleCheckDate(this.form.sendTime)) {
              this.$message.error('请填写合法的消息发送时间')
              return
            }
          } else {
            this.form.sendTime = ''
          }
          const {
            channelType, sendAuto, title, content, messageType, templateCode, sendTime, businessType, templateParams,
            sendUserName, sendPhone, templateSort, sendUserNameSort, sendPhoneSort
          } = this.form
          asyncMessageCreate({
            channelType,
            sendAuto,
            title,
            content,
            messageType,
            templateCode: templateCode || null,
            sendTime,
            businessType: this.templateType === 'SM' ? businessType : null,
            pushMediaType: this.templateType === 'PM' ? 'TEXT' : '',
            templateParams,
            identifier: this.identifier,
            templateType: this.templateType,
            sendUserName, sendPhone, templateSort, sendUserNameSort, sendPhoneSort
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('保存成功')
              this.handleBack()
            }
          })
        } else {
          return false
        }
      })
    },
    handleChangeTemplate(val) {
      if (val) {
        let arr = this.templateOptions.filter(item => item.templateCode === val)
        if (arr && arr.length && arr.length > 0) {
          this.form.title = arr[0].title
          this.form.content = arr[0].content
          this.form.businessType = arr[0].businessType
        }
      } else {
        this.form.title = ''
        this.form.content = ''
        this.form.businessType = 'MARKETING'
      }
    },
    showUserDialog() {
      this.$refs.userDialog.showDialog()
    },
    handleChangeMessage(val) {
      this.handleDataList(val)
      this.form.templateCode = ''
      this.form.businessType = 'MARKETING'
      this.form.title = ''
      this.form.content = ''
    },
    fetchType() {
      if (this.templateType === 'SM') {
        return 'SMS'
      } else if (this.templateType === 'IM') {
        return 'TIPS'
      } else if (this.templateType === 'PM') {
        return 'TEXT'
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.btns{
  text-align: center;
}
.upload-file{
  display:flex;
  padding:0 5px;
  justify-content: space-between;
  .el-icon-close{
    display: none
  }
  .el-icon-upload-success{
    display: inline-block;
  }
}
.upload-file:hover{
  background: #f5f7fa;
  transition: all 1s;
  .el-icon-upload-success{
    display: none;
  }
  .el-icon-close{
    display: inline-block
  }
}
.tip{
  border: 1px solid #AAAAAA;
  padding:20px 5px;
  width: 300px;
  color: #AAAAAA;
  font-size: 12px;
  border-radius: 8px;
  position: absolute;
  right: -350px;
  p{
    margin:0;
  }
}
</style>
