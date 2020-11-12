<template>
  <!--字典值-->
  <div class="app-container">
    <el-row>
      <el-col :span="18">
        <el-form label-width="100px" size="mini" :model="form" :rules="rules" ref="fieldForm">
          <el-form-item label="编码值" prop="code">
            <el-input v-model="form.code" type="text" placeholder="请输入字典值编码" />
          </el-form-item>

          <el-form-item label="值名称" prop="name">
            <el-input v-model="form.name" type="text" placeholder="请输入字典值名称" />
          </el-form-item>

          <el-form-item label="排序" prop="sortNum">
            <el-input-number v-model="form.sortNum" :min="0" :max="9999" label="显示排序"/>
          </el-form-item>

          <el-form-item label="预留1" prop="value">
            <el-input v-model="form.value" type="text" placeholder="请输入预留1" />
          </el-form-item>

          <el-form-item label="预留2" prop="value2">
            <el-input v-model="form.value2" type="text" placeholder="请输入预留2" />
          </el-form-item>

          <el-form-item label="预留3" prop="value3">
            <el-input v-model="form.value3" type="text" placeholder="请输入预留3"/>
          </el-form-item>

          <el-form-item label="备注说明" prop="remark">
            <el-input type="textarea" :rows="5" v-model="form.remark" placeholder="请输入备注说明" />
          </el-form-item>
          <el-col :offset="20">
            <el-button size="small" type="primary" @click.prevent.stop="handleSubmit">确定{{id ? '修改' : '添加'}}</el-button>
          </el-col>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchDictionaryField, addDictionaryField, updateDictionaryField } from '@/api/setting/dataSetting'
  import { filterEmptyParams } from '@/utils/util'
  export default {
    name: 'dictionaryValue',
    data() {
      return {
        id: undefined,
        form: {
          parentId: null,
          code: '',
          name: '',
          sortNum: 0,
          value: '',
          value2: '',
          value3: '',
          remark: ''
        },
        rules: {
          code: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { pattern: /^[a-zA-Z]([0-9a-zA-Z_]){0,50}$/, message: '以字母开头,1~50个字符，仅限数字、字母和下划线，', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { min: 1, max: 225, message: '1～255任意字符', trigger: 'blur' }
          ],
          sortNum: [
            { required: true, message: '请输入排序', trigger: 'blur' },
            { pattern: /^[0-9]{1,4}$/, message: '请输入0~9999整数', trigger: 'blur' }
          ],
          value: [
            { max: 225, message: '1～255任意字符', trigger: 'blur' }
          ],
          value2: [
            { max: 225, message: '1～255任意字符', trigger: 'blur' }
          ],
          value3: [
            { max: 225, message: '1～255任意字符', trigger: 'blur' }
          ],
          remark: [
            { max: 225, message: '0~255个任意字符', trigger: 'blur' }
          ]
        }
      }
    },
    watch: {
      'form.sortNum': function(val) {
        if (val) {
          const value = val.toString()
          if (value === '-' || val.toString().includes('-')) {
            this.form.sortNum = Number(val.toString().replace(/\-/g, ''))
          }
        }
      }
    },
    mounted() {
      const { id, pid } = this.$route.query // 编辑时数据值id 父级字典id
      this.id = id // 编辑时数据值id
      this.form = { parentId: pid }
      if (this.id) {
        this.getDictionaryField()
      }
    },
    methods: {
      getDictionaryField() {
        fetchDictionaryField(this.id).then(res => {
          if (res.code === 200) {
            this.form = {
              ...this.form,
              ...res.result,
              sortNum: Number(res.result.sortNum)
            }
            delete this.form.enable
          }
        })
      },
      handleSubmit() {
        this.$refs.fieldForm.validate(validate => {
          if (validate) {
            const postData = { id: this.id, ...this.form }
            const promise = this.id ? updateDictionaryField(postData) : addDictionaryField(filterEmptyParams(postData))
            promise.then(res => {
              if (res.code === 200) {
                this.$router.go(-1)
                this.$message.success(this.id ? '字典值修改成功~' : '字典值添加成功~')
              } else {
                this.$message.success(`字典值${this.id ? '修改' : '添加'}失败～`)
              }
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  /deep/ .el-form-item__error {
    padding-top: 3px;
  }
</style>
