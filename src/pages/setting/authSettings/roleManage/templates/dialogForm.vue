<template>
  <el-dialog
    class="dialog-form"
    :title="`${form.id ? '编辑' : '添加'}角色`"
    :visible="visible"
    :close-on-click-modal="false"
    @close="handleCancel(false)"
    width="600"
  >
    <el-form :model="form" :rules="rules" size="small" ref="form" label-width="80px">

      <el-form-item label="角色名" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入角色名" />
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
  import { updateRole, addRole } from '@/api/setting/authSetting'
  import { filterEmptyParams } from '@/utils/util'
  const formRules = {
    /* code: [
      { required: true, message: '请输入编码', trigger: 'blur' },
      { pattern: /^[A-Z_]{2,20}$/, message: '2～30个字符（仅支持大写字母、下划线）', trigger: 'blur' }
    ],*/
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { pattern: /^[A-Z\u4e00-\u9fa5][a-zA-Z0-9\u4e00-\u9fa5]{1,29}$/, message: '2～30个字符（仅支持中文，字母，数字）', trigger: 'blur' }
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
        default: {
          name: '',
          remark: ''
        }
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        rules: formRules,
        categories: []
      }
    },
    methods: {
      handleCancel(type) { // true：成功 ｜ false：失败
        if (this.visible) {
          this.$emit('close', type)
        }
      },

      handleSubmit() {
        this.$refs.form.validate(validate => {
          if (validate) {
            const promise = this.form.id ? updateRole(this.form) : addRole(filterEmptyParams(this.form))
            promise.then((res) => {
              if (res.code === 200) {
                this.$message.success(this.form.id ? '角色修改成功' : '角色添加成功')
                this.handleCancel(true)
              }
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
