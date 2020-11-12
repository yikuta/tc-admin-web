<template>
  <div class="app-container">
    <el-card>
      <el-form
        size="small"
        label-width="100px"
        :model="form"
        :rules="rules"
        ref="ruleForm"
        :hide-required-asterisk='true'>
        <el-form-item label="参数名称" prop="name">
          <el-input placeholder="请输入参数名称" v-model="form.name"/>
          <!-- <div class="tips">*请输入2~20个字符，属性名称用于商品基本参数填写和展示</div> -->
        </el-form-item>
        <el-form-item label="输入类型" prop="paramType">
          <el-select v-model="form.paramType" pladeholder="请选择输入类型">
            <el-option v-for="(item, index) in option.params" :label="item.name" :value="item.type" :key="index"></el-option>
          </el-select>
          <!-- <div class="tips">*发布和修改商品时根本不同的输入类型有不同的参数值输入方式</div> -->
        </el-form-item>
        <el-form-item label="参数值" v-show='form.paramType!="TEXT"&&form.paramType!="TEXTAREA"'>
          <div class="">
            <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"></el-button>
          </div>
          <el-table :data="tableData" size="mini">
            <el-table-column label="属性值名称">
              <template slot-scope="scope">
                <el-input type="text" placeholder="请输入属性值名称" maxlength="20" v-model="scope.row.name"/>
              </template>
            </el-table-column>
            <el-table-column label="排序">
              <template slot-scope="scope">
                <!-- <el-input type="text" placeholder="请输入序号" v-model="scope.row.sort"/> -->
                <el-input-number v-model="scope.row.sort" :min="0" :max="9999" :step="1" step-strictly placeholder="请输入序号"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">{{scope.row.status===1?'显示':'隐藏'}}</template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click='handleToggle(scope.row)'>{{scope.row.status===1?'隐藏':'显示'}}</el-button>
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
    </el-card>
  </div>
</template>

<script>
  import { asyncBaseParamsAdd, findBaseParamsById, asyncBaseParamsUpdate } from '@/api/baseCategory'
  export default {
    name: 'SpecsPublish',
    data() {
      return {
        form: {
          name: '',
          paramType: null,
          id: ''
        },
        rules: {
          name: [
            { required: true, message: '请输入参数名称', trigger: 'blur' },
            { min: 2, max: 20, message: '请输入2~20个字符，参数名称用于商品基本参数填写和展示', trigger: 'blur' }
          ],
          paramType: [
            { required: true, message: '请选择输入类型,发布和修改商品时根据不同的输入类型有不同的参数值输入方式', trigger: 'change' }
          ]
        },
        option: {
          params: [
            { id: 1, name: '单选项', type: 'RADIO' },
            { id: 2, name: '复选框', type: 'CHECKBOX' },
            { id: 3, name: '下拉选择', type: 'SELECT' },
            { id: 4, name: '单行输入框', type: 'TEXT' },
            { id: 5, name: '多行输入框', type: 'TEXTAREA' }
            // { id: 6, name: '下拉输入框', type: 'SELECT_TEXT' },
            // { id: 7, name: '搜索下拉框', type: 'SEARCH_TEXT' }
          ]
        },
        tableData: [{
          name: '',
          sort: '',
          status: 1
        }], // 属性值
        btnLoading: false
      }
    },
    mounted() {
      this.$route.query.id && this.handleParamsInfo(this.$route.query.id)
    },
    methods: {
      handleParamsInfo(id) {
        findBaseParamsById(id).then(res => {
          if (res.code === 200) {
            this.form.id = res.result.id
            this.form.name = res.result.name
            this.form.paramType = this.option.params.filter(item => item.id === res.result.paramType.value)[0].type
            this.tableData = res.result.value ? JSON.parse(res.result.value) : []
          }
        })
      },
      handleSave(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const { id, paramType } = this.form
            let fn = id ? asyncBaseParamsUpdate : asyncBaseParamsAdd
            let value = ''
            if (paramType !== 'TEXT' && paramType !== 'TEXTAREA') {
              let arr = this.tableData.filter(item => item.name)
              value = JSON.stringify(arr)
              // let flag = this.tableData.find(item => item.name)
              // if (this.tableData.length === 0 || !flag) {
              //   this.$message.error('请至少填写一条参数值')
              //   return
              // } else {
              //   value = JSON.stringify(this.tableData)
              // }
            } else {
              value = ''
            }
            this.btnLoading = true
            fn({ ...this.form, value }).then(res => {
              this.btnLoading = false
              if (res.code === 200) {
                this.$message.success(res.result)
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
      // 添加属性值
      handleAdd() {
        this.tableData.push({
          name: '',
          sort: '',
          status: 1
        })
      },
      // 隐藏/显示
      handleToggle(row) {
        row.status = row.status === 1 ? 0 : 1
      },
      // 删除
      handleDelete(row) {
        this.tableData.splice(row.$index, 1)
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
    .tips{font-size:14px;color:#909399;margin-bottom:10px;}
  }
</style>
