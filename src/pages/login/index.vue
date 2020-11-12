<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="loginForm"
               :rules="loginRules"
               ref="loginForm"
               label-position="left">
        <div style="text-align: center">
          <svg-icon icon-class="login-mall"
                    style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
        <h2 class="login-title color-main">天呈食材管理系统</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model.trim="loginForm.username"
                    autoComplete="on"
                    maxlength="30"
                    placeholder="请输入登录手机号">
            <span slot="prefix">
              <i class="el-icon-user"></i>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    @keyup.enter.native="handleLogin"
                    v-model.trim="loginForm.password"
                    autoComplete="on"
                    show-password
                    maxlength="20"
                    placeholder="请输入登录密码">
            <span slot="prefix">
              <i class="el-icon-unlock"></i>
            </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="graphicCode"
                      class="code-item">
          <el-input name="graphicCode"
                    @keyup.enter.native="handleLogin"
                    v-model.trim="loginForm.graphicCode"
                    autoComplete="on"
                    maxlength="6"
                    placeholder="图形验证码">
            <i class="el-icon-collection"
               slot="prefix"></i>
          </el-input>
          <el-image :src="imgCodeSrc"
                    title="点击更换验证码"
                    class="code-img"
                    v-if="!loadingCode"
                    @click="getImgCode">
            <div slot="error"
                 class="image-slot"
                 @click="getImgCode">
              <i class="el-icon-refresh"> 点击重新获取</i>
            </div>
          </el-image>
          <div class="loading-code"
               v-else>
            <i class="el-icon-loading"></i>
            正在获取验证码
          </div>
        </el-form-item>
        <el-form-item prop="smsCode"
                      class="code-item"
                      v-if="!whiteFlag">
          <el-input @keyup.enter.native="handleLogin"
                    v-model.trim="loginForm.smsCode "
                    autoComplete="on"
                    maxlength="4"
                    placeholder="请输入验证码">
          </el-input>
          <el-button type="primary"
                     plain
                     @click="sentCode"
                     :disabled="!!timer"><span class="cut-txt">{{timer?`${cutTime}秒后重试`:'立即获取验证码'}}</span></el-button>
        </el-form-item>
        <el-form-item class="code-item">
          <el-row style="width:100%;">
            <el-col :span="12">
              <el-checkbox v-model="rememberPwd">记住密码</el-checkbox>
            </el-col>
            <el-col :span="12" justify="space-between" style="text-align:right;">
              <el-link type="info" @click="handleClear">清除缓存</el-link>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 100%"
                     type="primary"
                     :loading="loading"
                     @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img src="@/assets/images/login_center_bg.png"
         class="login-center-layout">
  </div>
</template>

<script>
import { telValidator } from '@/utils/validate'
import { setCookie, getCookie, removeCookie } from '@/utils/support'
import { getImgCodeApi, getClientInfosApi, getPhoneCodeApi } from '@/api/login'
import { unInvalidPwd } from '@/utils/auth'
import md5 from 'js-md5'
let Base64 = require('js-base64').Base64

const validatePass = (rule, value, callback) => {
  if (value.length < 6) {
    callback(new Error('请输入正确的密码'))
  } else {
    callback()
  }
}
const validateGraphicCode = (rule, value, callback) => {
  const numWordReg = /^[A-Za-z0-9]{6}$/
  if (!value) {
    callback(new Error('请输入正确的验证码'))
  } else if (!numWordReg.test(value)) {
    callback(new Error('请输入正确的验证码'))
  } else {
    callback()
  }
}

export default {
  name: 'login',
  data() {
    return {
      loadingCode: false,
      imgCodeSrc: '',
      whiteFlag: true,
      cutTime: 60,
      timer: 0,
      rememberPwd: false,
      beforeLoginInfo: {},
      loginForm: {
        username: '',
        password: '',
        graphicCode: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'change', validator: telValidator }
        ],
        password: [
          { required: true, trigger: 'change', validator: validatePass }
        ],
        graphicCode: [
          { required: true, trigger: 'change', message: '请输入正确的验证码', validator: validateGraphicCode }
        ]
      },
      loading: false,
      pwdType: 'password',
      dialogVisible: false,
      supportDialogVisible: false
    }
  },

  methods: {
    // 获取图形验证码
    getImgCode() {
      this.loadingCode = true
      let { loginUserId } = this.beforeLoginInfo
      return getImgCodeApi({ loginUserId })
        .then(res => {
          let imageUrl = (window.URL || window.webkitURL).createObjectURL(res)
          this.imgCodeSrc = imageUrl
        })
        .catch()
        .finally(() => {
          this.loadingCode = false
        })
    },
    // 点击发送验证码
    sentCode() {
      if (!this.loginForm.username) {
        this.$message.error('请输入登录用户手机号')
        return
      }
      return getPhoneCodeApi(this.loginForm.username).then(res => {
        if (res.code === 200) {
          // let result = res.result || {}
          // 倒计时
          this.$notify.success('短信发送成功')
          this.timer = setInterval(() => {
            if (this.cutTime === 1) {
              clearInterval(this.timer)
              this.timer = null
              this.cutTime = 60
            }
            this.cutTime--
          }, 1000)
        }
      })
    },
    // 显示密码
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    // 点击登录
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          let { username, password, graphicCode } = this.loginForm
          let _param = {
            loginUserId: this.beforeLoginInfo.loginUserId,
            rememberMe: this.rememberPwd,
            password: md5(password),
            loginName: username,
            graphicCode
          }
          // todo:手动给他写入验证码
          // this.sentCode()
          !this.whiteFlag && (_param.smsCode = this.loginForm.smsCode)

          this.loading = true
          this.$store
            .dispatch('Login', _param)
            .then(res => {
              if (res.code === 200) {
                setCookie('username', this.loginForm.username)
                setCookie('nickname', res.result ? res.result.loginName : '')
                setCookie('logintime', new Date().getTime())
                // 如果选择了记住密码-存入密码
                if (this.rememberPwd) {
                  setCookie('password', Base64.encode(this.loginForm.password))
                } else {
                  removeCookie('password')
                }
                sessionStorage.setItem('lastTime', new Date().getTime())
                this.$router.replace({ path: '/dashboard' })
              }
            })
            .catch(() => {
              this.getImgCode()
              this.loading = false
            })
        }
      })
    },
    getClientInfos() {
      return getClientInfosApi().then(res => {
        let { whiteFlag } = res.result
        // true 为白名单，不需要短信验证码
        this.whiteFlag = whiteFlag
        this.beforeLoginInfo = res.result
        // 是否有非ip地址
        if (!this.whiteFlag) {
          this.$set(this.loginForm, 'smsCode', '')
          this.loginRules.smsCode = [
            {
              required: true,
              trigger: 'change',
              message: '请输入正确的验证码'
            }
          ]
        }

        this.getImgCode()
      })
    },
    // 如果有密码，说明是选择了记住密码的-默认填充用户名和密码
    getCookieUserInfo() {
      let _name = getCookie('username') || ''
      let _pwd = getCookie('password') || ''
      if (_pwd) {
        this.loginForm.username = _name
        this.loginForm.password = Base64.decode(_pwd)
        this.rememberPwd = true
      }
      this.$store.commit('SET_NAME', _name)
    },
    handleClear() {
      // 清除缓存
      localStorage.clear()
      sessionStorage.clear()
      this.$confirm('清除缓存成功！', '成功提示', {
        showCancelButton: false,
        showClose: false,
        closeOnPressEscape: false,
        closeOnClickModal: false
      }).then(() => {
        location.reload()
      })
    }
  },
  created() {
    // 进入当前页面如果有 token，则返回首页
    if (this.$store.getters.token) {
      this.$router.replace('/')
    } else {
      // 如果有值就进行操作，没有就刷新
      if (this.$route.query.random) {
        // 判断密码是否已经存了一周
        !unInvalidPwd() && this.getCookieUserInfo()
        this.getClientInfos()
      } else {
        location.replace(`/login?random=${Math.random()}`)
      }
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss">
.code-item {
  /deep/ {
    .el-form-item__content {
      display: flex;
      align-items: center;
    }
    .loading-code {
      width: 238px;
      color: #409eff;
      text-align: center;
    }
    .image-slot {
      text-align: center;
      color: #409eff;
      &:hover {
        opacity: 0.8;
      }
    }
  }
  .cut-txt {
    width: 98px;
    display: inline-block;
  }
  .el-input {
    margin-right: 5px;
  }
  .el-button {
    margin-left: 2px;
    width: 140px;
  }

  .code-img {
    width: 238px;
    height: 40px;
    vertical-align: middle;
    cursor: pointer;
  }
}
.login-form-layout {
  position: absolute;
  left: 0;
  right: 0;
  width: 400px;
  margin: 140px auto;
  border-top: 10px solid #409eff;
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
  margin-top: 200px;
}
</style>
