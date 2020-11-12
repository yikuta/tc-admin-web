<template>
  <div class="app-container">
    <div class="header">
      <span class="title">消息设置</span>
    </div>
    <div class="setting">
      <el-form :model="form" ref="form" :rules="rules" label-width="100px" size="small" hide-required-asterisk>
        <div class="setting-item">
          <div class="title">短信配置：</div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="启用短信">
                <el-switch
                  v-model="form.shortMessageAble"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="服务商1">
                <el-select v-model='form.providerOne'>
                  <el-option v-for="item in messageProviderVos" :key="item.providerCode" :label="item.providerName" :value="item.providerCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="服务商2">
                <el-select v-model='form.providerTwo'>
                  <el-option v-for="item in messageProviderVos" :key="item.providerCode" :label="item.providerName" :value="item.providerCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="服务商3">
                <el-select v-model='form.providerThree'>
                  <el-option v-for="item in messageProviderVos" :key="item.providerCode" :label="item.providerName" :value="item.providerCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="16">
            <el-col :span="6">
              <el-form-item label="营销类短信单日限次" label-width="170px" prop="marketingShortMessageLimit">
                <el-input-number step-strictly :min='0' :max="9999" v-model="form.marketingShortMessageLimit"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="业务类短信单日限次" label-width="170px" prop="businessShortMessageLimit">
                <el-input-number step-strictly :min='0' :max="9999" v-model="form.businessShortMessageLimit"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="其他短信单日限次" label-width="170px" prop="otherShortMessageLimit">
                <el-input-number step-strictly :min='0' :max="9999" v-model="form.otherShortMessageLimit"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="验证码短信单日限次" label-width="170px" prop="validateShortMessageLimit">
                <el-input-number step-strictly :min='0' :max="9999" v-model="form.validateShortMessageLimit"></el-input-number>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row style="positive:relative">
            <el-col :span="6">
              <el-form-item label="短信禁发时间" label-width="170px" prop="sendTimeStart">
                <el-select v-model='form.sendTimeStart'>
                  <el-option v-for="item in timeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="1">
              <span style="text-align:center;line-height:32px">——</span>
            </el-col>
            <el-col :span="6">
              <el-form-item label="" label-width="0" prop="sendTimeEnd">
                <el-select v-model='form.sendTimeEnd'>
                  <el-option v-for="item in timeList" :key="item" :label="item" :value="item"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <div class="tip">
                <p>短信禁发时间设置说明（24小时制）：</p>
                <p>1、前者为开始时间，后者为结束时间；</p>
                <p>2、若选取的前者为1：00，后者为2：00，则禁发时间为晚上的1：00（当日）-2：00（当日）；</p>
                <p>3、若选取的前者为23：00，后者为2：00，则禁发时间为晚上的23：00（当日）-2：00（次日）；</p>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="setting-item">
          <div class="title">站内信配置：</div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="启用站内信服务" label-width="110px">
                <el-switch
                  v-model="form.innerMessageAble"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div class="setting-item">
          <div class="title">push消息配置：</div>
          <el-row>
            <el-col :span="24">
              <el-form-item label="启用push消息服务" label-width="130px">
                <el-switch
                  v-model="form.pushMessageAble"
                  active-color="#13ce66"
                  inactive-color="#ff4949">
                </el-switch>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
      <div style="text-align:center">
        <el-button size="small" v-np='"MSG_CONFIG_CONTENT_SAVE"' type="primary" style="width:108px" @click="handleSave('form')" :loading="loading">保存</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchMessageConfigInit, asyncSaveMessageConfig } from '@/api/message'
export default {
  name: 'messageSetting',
  data() {
    return {
      form: {
        id: '',
        shortMessageAble: true,
        innerMessageAble: true,
        pushMessageAble: true,
        providerOne: '',
        providerTwo: '',
        providerThree: '',
        marketingShortMessageLimit: 10,
        businessShortMessageLimit: 10,
        otherShortMessageLimit: 10,
        validateShortMessageLimit: 10,
        sendTimeStart: '',
        sendTimeEnd: ''
      },
      rules: {
        marketingShortMessageLimit: [
          { required: true, message: '营销类短信数字不合法：请填写0-9999的数字作为限制次数', trigger: 'blur' }
        ],
        businessShortMessageLimit: [
          { required: true, message: '业务类短信数字不合法：请填写0-9999的数字作为限制次数', trigger: 'blur' }
        ],
        otherShortMessageLimit: [
          { required: true, message: '其他短信数字不合法：请填写0-9999的数字作为限制次数', trigger: 'blur' }
        ],
        validateShortMessageLimit: [
          { required: true, message: '验证码短信数字不合法：请填写0-9999的数字作为限制次数', trigger: 'blur' }
        ]
      },
      messageProviderVos: [],
      loading: false,
      timeList: [
        '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
        '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00'
      ]
    }
  },
  mounted() {
    this.handleDataInfo()
  },
  methods: {
    handleDataInfo() {
      fetchMessageConfigInit().then(res => {
        if (res.code === 200) {
          this.messageProviderVos = res.result ? res.result.messageProviderVos : []
          Object.keys(this.form).forEach(key => {
            if (key === 'sendTimeStart' || key === 'sendTimeEnd') {
              this.form[key] = res.result[key] ? this.format(res.result[key], 'HH:mm') : ''
            } else {
              this.form[key] = res.result[key]
            }
          })
        }
      })
    },
    handleSave() {
      if (!this.form.providerOne) {
        this.$message.error('请至少选择服务商1的短信服务商')
      } else {
        this.loading = true
        const { id, shortMessageAble, innerMessageAble, pushMessageAble, providerOne, providerTwo, providerThree, marketingShortMessageLimit,
          businessShortMessageLimit, otherShortMessageLimit, validateShortMessageLimit, sendTimeStart, sendTimeEnd } = this.form
        asyncSaveMessageConfig({
          id, shortMessageAble, innerMessageAble, pushMessageAble, providerOne, providerTwo, providerThree, marketingShortMessageLimit,
          businessShortMessageLimit, otherShortMessageLimit, validateShortMessageLimit,
          sendTimeStart: this.format(new Date(), 'yyyy-MM-dd') + ' ' + sendTimeStart + ':00',
          sendTimeEnd: this.format(new Date(), 'yyyy-MM-dd') + ' ' + sendTimeEnd + ':00'
        }).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.$message.success('消息设置成功')
          }
        })
      }
    },
    // 获取当天日期
    format(time, format) {
      if (!time) return ''
      let t = new Date(time)
      let tf = function(i) { return (i < 10 ? '0' : '') + i }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
          case 'MM':
            return tf(t.getMonth() + 1)
          case 'mm':
            return tf(t.getMinutes())
          case 'dd':
            return tf(t.getDate())
          case 'HH':
            return tf(t.getHours())
          case 'ss':
            return tf(t.getSeconds())
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header .title {
  border-left: 6px solid rgba(64, 158, 255, 1);
  padding-left: 10px;
  line-height: 28px;
}
.setting{
  padding-left: 16px;
}
.setting-item{
  margin-top: 36px;
  .title{
    margin-bottom: 24px;
  }
  .el-input-number--small{
    width: 100%;
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
  top: -50px;
  p{
    margin:0;
  }
}
</style>
