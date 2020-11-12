<template>
  <div class="app-container">
    <el-form size="small" 
        label-width="100px" 
        :model="form" 
        :rules="rules" 
        ref="ruleForm" 
        :hide-required-asterisk='true'>
      <el-form-item label="规格名称" prop="name">
        <el-input placeholder="请输入规格名称" v-model="form.name"/>
      </el-form-item>
      <el-form-item label="规格值管理">
        <div>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"></el-button>
        </div>
        <el-table size="small" :data="tableData">
          <el-table-column label="规格值">
            <template slot-scope="scope">
              <el-input type="text" placeholder="请输入规格值名称" maxlength="20" v-model="scope.row.name"/>
            </template>
          </el-table-column>
          <el-table-column label="排序">
            <template slot-scope="scope">
              <!-- <el-input type="text" placeholder="请输入排序" v-model="scope.row.sort"/> -->
              <el-input-number v-model="scope.row.sort" :min="0" :max="9999" step-strictly placeholder="请输入序号"></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{scope.row.enable?'显示':'隐藏'}}</template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click='handleToggle(scope.row)'>{{scope.row.enable?'隐藏':'显示'}}</el-button>
              <el-button type="text" @click="handleDelete(scope)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-row type='flex' justify='center'>
        <el-col :span="3.5">
          <el-form-item label-width="0">
            <el-button type="primary" @click="handleSave('ruleForm')" :loading="btnLoading">{{this.$route.query.id?'确定修改':'确定添加'}}</el-button>
            <el-button type="default" @click="handleCancel">取消</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
  import { asyncBaseSpecsAdd, asyncBaseSpecsUpdate, findBaseSpecsById } from '@/api/baseCategory'
  export default {
    name: 'SpecsPublish',
    data() {
      return {
        tableData: [
          {
            name: '',
            sort: '',
            enable: true
          },
          {
            name: '',
            sort: '',
            enable: true
          },
          {
            name: '',
            sort: '',
            enable: true
          }
        ],
        form: {
          name: ''
        },
        btnLoading: false,
        rules: {
          name: [
            { required: true, message: '请输入规格名称', trigger: 'blur' },
            { max: 20, message: '最长20个字符', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.$route.query.id && this.handleSpecsInfo(this.$route.query.id)
    },
    methods: {
      handleSpecsInfo(id) {
        findBaseSpecsById(id).then(res => {
          if (res.code === 200) {
            this.form.id = res.result.id
            this.form.name = res.result.name
            this.tableData = res.result.specificationValueList || []
          }
        })
      },
      // 添加规格值
      handleAdd() {
        this.tableData.push({
          name: '',
          sort: '',
          enable: true
        })
      },
      // 隐藏/显示
      handleToggle(row) {
        row.enable = !row.enable
      },
      // 删除
      handleDelete(row) {
        this.tableData.splice(row.$index, 1)
      },
      handleSave(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const { id } = this.form
            let fn
            if (id) {
              fn = asyncBaseSpecsUpdate
            } else {
              delete this.form.id
              fn = asyncBaseSpecsAdd
            }
            let specificationValueList = []
            let arr = this.tableData.filter(item => item.name)
            specificationValueList = arr
            // let flag = this.tableData.find(item => item.name)
            // if (this.tableData.length === 0 || !flag) {
            //   this.$message.error('请至少填写一条规格值')
            //   return
            // } else {
            //   specificationValueList = this.tableData
            // }
            this.btnLoading = true
            fn({ ...this.form, specificationValueList }).then(res => {
              this.btnLoading = false
              if (res.code === 200) {
                this.$message.success(res.result || '操作成功')
                this.$router.go(-1)
              }
            }).catch(() => {
              this.btnLoading = false
            })
          } else {
            return false
          }
        })
      },
      // 取消
      handleCancel() {
        this.$router.go(-1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container{
  }
</style>
