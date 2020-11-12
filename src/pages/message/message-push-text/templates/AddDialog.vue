<template>
  <div class="app-container">
    <el-dialog :title="this.id ? '编辑模板':'新建模板'" :visible="visible" @update:visible="onChange" width="960px">
      <el-form class="form" ref="form" :model="form" :rules="rules" size="mini">
        <el-row>
          <el-col :span="24">
            <el-row>
              <el-col :span="8">
                <el-form-item label="消息类型" prop="messageType" label-width="90px">
                  <el-select v-model="form.messageType" clearable @change="handleChangeMessage" :disabled="this.id ? true : false">
                    <el-option v-for="item of messageTypes" :key="item.code" :label="item.name" :value="item.code"></el-option>
                    <el-option label="未选择" value=""></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12" v-if="form.messageType">
                <el-form-item :label="`模版编号 ${templateCodeType}`" prop="templateCode" label-width="120px">
                  <el-input  
                    v-model="form.templateCode" 
                    placeholder="模板编号 不填写则使用自增" 
                    clearable
                    :disabled="this.id ? true : false"
                    @blur="handleBlurCode"/>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="12">
            <el-form-item label="消息标题" prop="title" label-width="90px">
              <el-input v-model="form.title" placeholder="消息标题" clearable :disabled="this.id ? true : false"/>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-row>
              <el-col :span="8">
                <el-form-item label="push前缀" prop="messagePrefix" label-width="90px">
                  <el-input v-model="form.messagePrefix" placeholder="例：天呈生活" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="16">
                <el-form-item label="" prop="pre" label-width="10px">
                  <span>例：【天呈生活】您的订单TX2901383120已发货。请注意查看运输记录。</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="24">
            <el-form-item label="消息内容" prop="content" label-width="90px">
              <el-input type="textarea" v-model="form.content" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="tip">
        <p class="head">注意：</p>
        <ul>
          <li>1、最多支持5个参数；</li>
          <li>
            <p style="margin-bottom:10px">2、参数填写方式：</p>
            <p>消息内容：您的店铺信息<span style="color:#66B1FF">因店招无效</span>被驳回，请修改后重新提交审核；</p>
            <p style="margin-bottom:10px">模版设置：您的店铺信息｛0｝被驳回，请修改后重新提交审核；</p>
            <p>参数值占位符：｛0｝，｛1｝，｛2｝，｛3｝｛4｝，填写其他无效</p>
          </li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="plain" size="mini" @click="onChange(false)">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSave" :loading="loading">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import { fetchInitMessageTemplate, asyncMessageTemplateSave, fetchMessageTemplateById, asyncMessageTemplateValidate } from '@/api/message'
  export default {
    name: 'AddDialog',
    props: {
      visible: Boolean,
      id: {
        type: Number,
        default: () => 0
      },
      templateStatus: {
        type: String,
        default: () => 'MESSAGE_TEMPLATE_STATUS_ON'
      }
    },
    data() {
      let validateCode = (rule, value, callback) => {
        if (value === '') {
          callback()
        } else {
          let reg = /^[0-9]{0,4}$/g
          if (reg.test(value)) {
            callback()
          } else {
            callback('请输入4个字符以内的数字')
          }
        }
      }
      return {
        form: {
          id: '',
          messageType: '', // 消息类型
          templateCode: '', // 模板编号
          title: '', // 标题
          messagePrefix: '', // 前缀
          content: '' // 内容
        },
        loading: false,
        rules: {
          messageType: [
            { required: true, message: '请选择消息类型', trigger: 'change' }
          ],
          templateCode: [
            { validator: validateCode, trigger: 'blur' }
          ],
          messagePrefix: [
            { max: 6, message: '请输入6位以内（包含）字符作为短信前缀', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入消息标题', trigger: 'blur' },
            { max: 20, message: '请输入1-20个字符作为消息标题', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '请输入消息内容', trigger: 'blur' },
            { max: 200, message: '请输入1-200位字符作为消息内容', trigger: 'blur' }
          ]
        },
        messageTypes: [],
        templateCodeType: '',
        codeValidate: true
      }
    },
    created() {
      this.handleInit()
    },
    watch: {
      visible(newVal) {
        if (newVal) {
          if (this.id) {
            this.form.id = this.id
            this.handleDetail()
          }
        } else {
          this.form.id = ''
        }
      }
    },
    methods: {
      handleInit() {
        fetchInitMessageTemplate().then(res => {
          if (res.code === 200) {
            this.messageTypes = res.result.messageTypes || []
          }
        })
      },
      handleDetail() {
        fetchMessageTemplateById(this.id).then(res => {
          if (res.code === 200) {
            Object.keys(this.form).forEach(key => {
              if (key === 'templateCode') {
                this.form[key] = res.result[key] ? res.result[key].slice(2) : ''
                this.templateCodeType = res.result[key] ? res.result[key].slice(0, 2) : ''
              } else {
                this.form[key] = res.result[key]
              }
            })
          }
        })
      },
      // 保存
      handleSave() {
        this.$refs['form'].validate(isSuccess => {
          if (isSuccess) {
            if (!this.codeValidate) {
              this.$message.error('模版编号已被其他模版使用')
              return
            }
            this.loading = true
            const { id, messageType, title, messagePrefix, content, templateCode } = this.form
            asyncMessageTemplateSave({
              id,
              messageType,
              title,
              messagePrefix,
              content,
              templateStatus: this.templateStatus,
              templateCode: templateCode ? this.templateCodeType + templateCode : null,
              templateType: 'PM',
              pushMediaType: 'MEDIA_TEXT'
            }).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$message.success('保存成功')
                this.onChange(false)
                this.$emit('update')
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      onChange(visible) {
        if (!visible) {
          this.$refs['form'].resetFields()
          this.form.templateCode = ''
        }
        this.$emit('update:visible', visible)
      },
      handleChangeMessage(val) {
        let arr = this.messageTypes.filter(item => item.code === val)
        if (arr && arr.length) {
          this.templateCodeType = arr[0].value || ''
        } else {
          this.templateCodeType = ''
        }
      },
      handleBlurCode() {
        asyncMessageTemplateValidate({
          templateCode: this.templateCodeType + this.form.templateCode,
          templateType: 'PM',
          messageType: this.form.messageType
        }).then(res => {
          if (res.code === 200) {
            this.codeValidate = true
          } else {
            this.codeValidate = false
          }
        })
      }
    }
  }
</script>

<style lang='scss' scoped>
.tip{
  color: #AAAAAA;
  font-size: 12px;
  p{
    margin: 0;
    padding: 0;
  }
  .head{
    margin-left: 25px;
  }
  ul{
    padding-left: 25px;
    li{
      list-style: none;
      margin-top: 10px;
    }
  }
}
</style>
