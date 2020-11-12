<template>
  <div class="app-container">
    <el-dialog :title="form.id?'编辑标签':'添加标签'" :visible="visible" @update:visible="onChange" width="40%" @open='handleOpen'>
      <el-form 
        class="form" 
        ref="form" 
        :model="form" 
        :rules="rules" 
        label-width="90px" 
        size="mini"
        @submit.native.prevent>
        <el-form-item label="标签编号" prop="code" v-if="form.code">
          <span>{{form.code}}</span>
        </el-form-item>
        <el-form-item label="标签名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入标签名称" clearable />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="handleSave" :loading="loading">确认{{form.id ? '修改':'添加'}}</el-button>
        <el-button type="plain" size="mini" @click="onChange(false)">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { asyncCookBookTagByName } from '@/api/cookBook'
  export default {
    name: 'AddDialog',
    components: {
      UploadFile: resolve => {
        return require(['@/components/UploadFile/index'], resolve)
      }
    },
    props: {
      visible: Boolean,
      info: {
        type: Object,
        default: () => {
          return {
            id: '',
            name: '',
            code: ''
          }
        }
      }
    },
    data() {
      return {
        form: {
          id: '',
          code: '',
          name: ''
        },
        rules: {
          name: [
            { required: true, message: '标签名称不可为空', trigger: 'blur' },
            { max: 5, message: '标签名称不能超过5个字', trigger: 'blur' }
          ]
        },
        loading: false
      }
    },
    methods: {
      handleOpen() {
        Object.keys(this.form).forEach(key => {
          this.form[key] = this.info[key]
        })
      },
      // 提交
      handleSave() {
        this.$refs['form'].validate(isSuccess => {
          if (isSuccess) {
            this.loading = true
            asyncCookBookTagByName({ ...this.form }).then(res => {
              if (res.code === 200) {
                this.handleClose()
                this.$message.success(res.message || '操作成功')
                this.$emit('update')
                this.loading = false
              } else {
                this.loading = false
              }
            }).catch(() => {
              this.loading = false
            })
          }
        })
      },
      onChange(visible) {
        this.$emit('update:visible', visible)
      },
      handleClose(isSuccess) {
        this.$emit('update:visible', false)
        this.$emit('close', isSuccess)
      }
    }
  }
</script>

<style lang='scss' scoped>
</style>
