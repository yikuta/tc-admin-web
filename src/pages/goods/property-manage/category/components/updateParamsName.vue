<template>
  <el-dialog 
    :title="form.id?'修改分组':'添加分组'" 
    :visible.sync="dialogVisible" 
    :close-on-click-modal='false'
    @close="handleCancel('form')">
    <el-form 
      :model="form" 
      size="small" 
      label-width="100px" 
      :rules="rules" 
      ref="form" 
      @submit.native.prevent
      :hide-required-asterisk='true'>
      <el-form-item label="分组名称" prop="name">
        <el-input type="text" placeholder="请输入分组名称" v-model="form.name" clearable></el-input>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button type="primary" size="small" @click.stop="handleUpdate('form')" :loading="loading">{{form.id?'确定修改':'确定添加'}}</el-button>
      <el-button type="default" size="small" @click="handleCancel('form')">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { updateBaseParamGroupName, addBaseParamGroup } from '@/api/baseCategory'
  // 关联参数
  export default {
    name: 'paramsDialog',
    props: {
      dialogSupVisible: {
        type: Boolean,
        default: false
      },
      info: {
        type: Object,
        default: {
          id: '',
          name: ''
        }
      },
      maxSort: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dialogVisible: false,
        rules: {
          name: [
            { required: true, message: '请填写分组名称', trigger: 'blur' },
            { min: 2, max: 20, message: '请输入2~20个字符，分组名称用于商品基本参数展示分组', trigger: 'blur' }
          ]
        },
        form: {
          id: '',
          name: ''
        },
        loading: false
      }
    },
    watch: {
      dialogVisible(n) {
        this.$emit('update:dialogSupVisible', n)
      },
      dialogSupVisible(n) {
        this.dialogVisible = n
        Object.keys(this.form).forEach(key => {
          this.form[key] = this.info[key]
        })
      }
    },
    methods: {
      handleUpdate(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true
            let sort = this.maxSort + 1
            let fn = this.form.id ? updateBaseParamGroupName : addBaseParamGroup
            let obj = this.form.id ? { id: this.form.id, name: this.form.name } : { baseCategoryId: this.$route.query.id, name: this.form.name, sort }
            fn(obj).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$message.success(this.form.id ? '修改分组成功~' : '添加分组成功~')
                this.dialogVisible = false
                this.$emit('update')
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      },
      handleCancel(formName) {
        this.dialogVisible = false
        this.$refs[formName].resetFields()
      }
    }
  }
</script>

<style lang="scss" scoped>
.btns{
  text-align: center;
}
</style>
