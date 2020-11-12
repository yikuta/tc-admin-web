<template>
  <el-dialog
    class="dialog-form"
    :title="`${form.id ? '编辑' : '添加'}员工`"
    :visible="visible"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleCancel(false)"
    width="600"
  >
    <el-form :model="form" :rules="rules" size="small" ref="form" label-width="80px">

      <el-row :gutter="18" style="margin-bottom: 18px">
        <el-col :span="12">
          <el-form-item label="姓名" prop="fullName" label-width="50px">
            <el-input v-model="form.fullName" autocomplete="off" placeholder="请填写员工真实姓名" />
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="手机" prop="phone" label-width="50px">
            <el-input v-model="form.phone" :disabled="form.id" autocomplete="off" placeholder="请填写员工常用手机号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="18" style="margin-bottom: 18px" >
        <el-col :span="12">
          <el-form-item label="性别" prop="gender" label-width="50px">
            <el-radio-group v-model="form.gender">
              <el-radio :label="2">女</el-radio>
              <el-radio :label="1">男</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="密码" prop="password" label-width="50px">
            <el-input type="password" @focus="handleClearPassword" v-model="form.password" autocomplete="off" placeholder="请输入登录密码" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="主属部门" prop="mainDeptId">
        <el-cascader
          v-model="form.mainDeptId"
          :options="departmentsList"
          :props="{children: 'childDeptList', label: 'name', value: 'id', checkStrictly: true, disabled: 'disabled'}"
          placeholder="请选择主属部门"
          style="width: 100%"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="附属部门" prop="slaveDeptId">
        <el-cascader
          v-model="form.slaveDeptId"
          :options="departmentsList"
          :props="{children: 'childDeptList', label: 'name', value: 'id', checkStrictly: true, disabled: 'disabled'}"
          placeholder="请选择附属部门"
          :clearable="true"
          style="width: 100%"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="备注说明" prop="remark">
        <el-input type="textarea" :rows="3" v-model="form.remark" autocomplete="off" placeholder="请输入备注说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleSubmit">确定{{form.id ? '编辑' : '添加'}}</el-button>
      <el-button size="mini" @click="handleCancel(false)">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { updateMember, addMember } from '@/api/setting/authSetting'
  import { filterEmptyParams } from '@/utils/util'
  import md5 from 'js-md5'
  function setDisabledProp(data) {
    data.forEach(item => {
      item.disabled = !item.enable
      if (item.childDeptList && item.childDeptList.length) {
        setDisabledProp(item.childDeptList)
      }
    })
  }
  const formRules = {
    fullName: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{1,19}$/, message: '2～20个字符（汉字、数字、字母、下划线）', trigger: 'blur' }
    ],
    phone: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { pattern: /^\d{11}$/, message: '请输入正确手机号', trigger: 'blur' }
    ],
    gender: [{ required: true, message: '请选择性别', trigger: 'blur' }],
    mainDeptId: [{ required: true, message: '请选择主属部门', trigger: 'blur' }],
    password: [
      { required: true, message: '请输入登录密码', trigger: 'blur' },
      { min: 6, max: 20, message: '请输入正确密码', trigger: 'blur' }
    ],
    remark: [
      { max: 200, message: '至多200个字符', trigger: 'blur' }
    ]
  }
  export default {
    name: 'dialogForm',
    props: {
      form: {
        type: Object,
        default: () => ({})
      },
      visible: {
        type: Boolean,
        default: false
      },
      departments: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      departmentsList: function() {
        setDisabledProp(this.departments)
        return this.departments
      }
    },
    data() {
      return {
        rules: formRules,
        oldPassword: ''
      }
    },
    methods: {
      handleOpen() {
        this.oldPassword = this.form.password
        this.form.password = this.form.password.substring(0, 6)
      },
      handleClearPassword() {
        this.form.password = ''
      },
      handleCancel(type) { // true：成功 ｜ false：失败
        this.$refs.form.resetFields()
        if (this.visible) {
          this.$emit('close', type)
        }
      },
      handleSubmit() {
        this.$refs.form.validate(validate => {
          if (validate) {
            this.$confirm(`确定要${this.form.id ? '编辑' : '添加'}人员吗？`, '提示', {
              closeOnPressEscape: false,
              closeOnClickModal: false,
              showClose: false
            }).then(() => {
              const { id, fullName, phone, gender, password, mainDeptId, slaveDeptId, remark } = this.form
              const postData = {
                fullName, phone, gender, remark, password,
                mainDeptId: mainDeptId.slice(-1)[0],
                slaveDeptId: slaveDeptId.slice(-1)[0]
              }
              if (!this.oldPassword || this.oldPassword.substring(0, 6) !== password) {
                postData.password = md5(password)
              } else {
                delete postData.password
              }
              const promise = id ? updateMember({ ...postData, id }) : addMember(filterEmptyParams(postData))
              promise.then(res => {
                if (res.code === 200) {
                  this.$message.success(id ? '人员修改成功' : '人员添加成功')
                  this.handleCancel(true)
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-form {
    /deep/ .el-dialog {
      min-width: 500px;
      .el-dialog__body {
        padding: 20px;
      }
    }
    /deep/ .el-form-item:last-child {
      margin-bottom: 0;
    }
  }
</style>
