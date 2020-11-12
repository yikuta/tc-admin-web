<template>
  <el-dialog 
    title="添加规格值" 
    :visible.sync="dialogVisible" 
    :close-on-click-modal='false' 
    @close='handleCancel'>
    <el-form
      :model="form"
      size="small"
      label-width="100px"
      :rules="rules"
      ref="form"
      @submit.native.prevent
      :hide-required-asterisk='true'>
      <el-form-item label="值名称" prop="name">
        <el-input type="text" placeholder="请输入值名称" v-model="form.name" clearable>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button type="primary" size="small" @click="handleUpdate('form')" :loading="loading">确定添加</el-button>
      <el-button type="default" size="small" @click="handleCancel">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { asyncBaseSpecsUpdate } from '@/api/baseCategory'
  // 关联参数
  export default {
    name: 'addSpecsValue',
    props: {
      dialogSupVisible: {
        type: Boolean,
        default: false
      },
      maxSort: {
        type: Number,
        default: 0
      },
      info: {
        type: Object,
        default: {
          id: '',
          name: ''
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        rules: {
          name: [
            { required: true, message: '请填写规格值名称', trigger: 'blur' },
            { max: 20, message: '最多允许20个字符，值名称用于SKU规格组成', trigger: 'blur' }
          ]
        },
        form: {
          name: '',
          enable: true,
          sort: 0
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
      }
    },
    methods: {
      handleUpdate(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loading = true
            const { id, name, specificationValueList } = this.info
            let arr = specificationValueList.concat([{ ...this.form }])
            let obj = { id, name, specificationValueList: arr }
            asyncBaseSpecsUpdate(obj).then(res => {
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
      handleCancel() {
        this.dialogVisible = false
        this.form.name = ''
      }
    }
  }
</script>

<style lang="scss" scoped>
.btns{
  text-align: center;
}
</style>
