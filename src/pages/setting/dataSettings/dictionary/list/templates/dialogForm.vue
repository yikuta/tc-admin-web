<template>
  <el-dialog
    class="dialog-form"
    :title="form.id ? '编辑字典' : '添加字典'"
    :visible="visible"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleCancel(false)"
    width="600"
  >
    <el-form :model="form" :rules="rules" size="mini" ref="dictionaryForm">
      <el-form-item label="字典编码" label-width="80px" prop="code">
        <el-input v-model="form.code" autocomplete="off" placeholder="请输入字典编码" />
      </el-form-item>

      <el-form-item label="字典名称" label-width="80px" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入字典名称" />
      </el-form-item>

      <el-form-item label="备注说明" label-width="80px" prop="remark">
        <el-input type="textarea" v-model="form.remark" autocomplete="off" placeholder="请输入备注说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleSubmit">确定{{form.id ? '编辑' : '添加'}}</el-button>
      <el-button size="mini" @click="handleCancel(false)">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { updateDictionary, addDictionary } from '@/api/setting/dataSetting'
  import { filterEmptyParams } from '@/utils/util'
  export default {
    name: 'dialogForm',
    props: {
      form: {
        type: Object,
        default: {
          code: '',
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
        tempRow: {},
        rules: {
          code: [
            { required: true, message: '请输入编码', trigger: 'blur' },
            { pattern: /^[a-zA-Z]([0-9a-zA-Z_]){0,50}$/, message: '以字母开头,1~50个字符，仅限数字、字母和下划线', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 20, message: '1～20任意字符', trigger: 'blur' }
          ],
          remark: [
            { max: 200, message: '至多200个字符', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$refs.dictionaryForm.validate(validate => {
          if (validate) {
            this.form.isOneToMany = 1 // 数据字典
            this.$confirm(`确定要${this.form.id ? '编辑' : '添加'}字典："${this.tempRow.name || this.form.name}" 吗？`, '提示', {
              closeOnPressEscape: false,
              closeOnClickModal: false,
              showClose: false
            }).then(() => {
              delete this.form.enable
              const promise = this.form.id ? updateDictionary(this.form) : addDictionary(filterEmptyParams(this.form))
              promise.then((res) => {
                if (res.code === 200) {
                  this.$message.success(this.form.id ? '数据字典修改成功~' : '数据字典添加成功~')
                  this.$parent.currentRow = {
                    code: '',
                    name: '',
                    remark: ''
                  }
                  this.handleCancel(true)
                } else {
                  this.$message.error('操作失败')
                }
              })
            })
          }
        })
      },
      handleOpen() {
        this.tempRow = { ...this.$parent.currentRow }
      },
      handleCancel(type) { // true：confirm ｜ false：失败
        if (this.visible) {
          this.$emit('close', !!type)
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-form {
    /deep/ .el-form-item:last-child {
      margin-bottom: 0;
    }
  }
</style>
