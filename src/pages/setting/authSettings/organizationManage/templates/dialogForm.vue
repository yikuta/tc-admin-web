<template>
  <el-dialog
    class="dialog-form"
    :title="form.id ? '编辑部门' : '添加部门'"
    :visible="visible"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleCancel(false)"
    width="600"
  >
    <el-form :model="form" :rules="rules" size="small" ref="form" label-width="80px">

      <el-form-item label="上级部门" prop="parentIds">
        <el-cascader
          ref="parentNodes"
          v-model="form.parentIds"
          :options="departments"
          :props="{children: 'childDeptList', label: 'name', value: 'id', checkStrictly: true}"
          placeholder="请选择上级部门"
          style="width: 100%"
        ></el-cascader>
      </el-form-item>

      <el-form-item label="部门名称" prop="name">
        <el-input v-model="form.name" autocomplete="off" placeholder="请输入部门名称" />
      </el-form-item>

      <el-form-item label="部门分类" prop="classifyType">
        <el-select
          v-model="form.classifyType"
          placeholder="请选择部门分类"
          :options="categories"
          style="width: 100%"
        >
          <el-option
            v-for="option in categories"
            :key="option.code"
            :label="option.value"
            :value="option.code"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="显示排序" prop="sortNum">
        <el-input-number v-model="form.sortNum" :min="0" :max="9999" label="显示排序"></el-input-number>
      </el-form-item>

      <el-form-item label="部门状态" prop="enable" v-if="!form.id">
        <el-radio-group v-model="form.enable">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">停用</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="备注说明" prop="remark">
        <el-input type="textarea" :rows="3" v-model="form.remark" autocomplete="off" placeholder="请输入备注说明" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button :loading="submitting" size="mini" type="primary" @click="handleSubmit">确定{{form.id ? '编辑' : '添加'}}</el-button>
      <el-button size="mini" @click="handleCancel(false)">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { searchDepartmentsList, fetchDepartmentCategories, updateDepartment, addDepartment } from '@/api/setting/authSetting'
  import { filterEmptyParams } from '@/utils/util'
  import searchFormat from '@/utils/searchFormat'
  const formRules = {
    parentIds: [{ required: true, message: '请选择上级部门', trigger: 'blur' }],
    name: [
      { required: true, message: '请输入名称', trigger: 'blur' },
      { pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{1,19}$/, message: '2～20个字符（汉字、数字、字母、下划线）', trigger: 'blur' }
    ],
    classifyType: [{ required: true, message: '请选择部门分类', trigger: 'blur' }],
    sortNum: [{ required: true, message: '请输入排序', trigger: 'blur' }],
    enable: [{ required: true, message: '请选择状态', trigger: 'blur' }],
    remark: [
      { max: 200, message: '至多200个字符', trigger: 'blur' }
    ]
  }
  function filterInvalidData(data, id = null) {
    return data.filter(item => {
      if (id) { // 编辑
        if (item.id === id) return false
        if (item.childDeptList && item.childDeptList.length) {
          item.childDeptList = filterInvalidData(item.childDeptList, id)
        }
        return true
      } else { // 添加
        if (item.enable && item.childDeptList && item.childDeptList.length) {
          item.childDeptList = filterInvalidData(item.childDeptList, id)
        }
        return item.enable
      }
    })
  }
  export default {
    name: 'dialogForm',
    props: {
      form: {
        type: Object,
        default: {
          parentIds: [],
          name: '',
          classifyType: '',
          sortNum: 0,
          enable: 1,
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
        departments: [],
        categories: [],
        submitting: false
      }
    },
    methods: {
      // 打开弹窗回调
      handleOpen() {
        this.fetchDepartmentCategories()
        this.searchDepartmentsList()
      },
      formatSearches() {
        const results = searchFormat({
          enable: { value: true, matchType: 'EQUAL', tempType: 'Boolean' }
        })
        return results.length ? JSON.stringify(results) : null
      },
      // 搜索部门列表
      searchDepartmentsList() {
        // { searchs: this.formatSearches() }
        searchDepartmentsList({}).then(res => {
          if (res.code === 200) {
            this.departments = filterInvalidData(res.result, this.form.id)
          }
        })
      },
      // 查询部门分类
      fetchDepartmentCategories() {
        fetchDepartmentCategories({}).then(res => {
          if (res.code === 200) {
            this.categories = res.result
          }
        })
      },
      /* handleParentRowChange() {
        const parentNode = this.$refs.parentNodes.getCheckedNodes()[0].data || {}
        this.$parent.parentRow = parentNode
      },*/
      // 关闭弹出层
      handleCancel(isSuccess) { // true：成功 ｜ false：失败
        if (this.visible) {
          this.$emit('close', isSuccess)
        }
      },
      // 提交
      handleSubmit() {
        this.$refs.form.validate(validate => {
          if (validate) {
            this.$confirm(`确定要${this.form.id ? '编辑' : '添加'}部门吗？`, '提示', {
              closeOnPressEscape: false,
              closeOnClickModal: false,
              showClose: false
            }).then(() => {
              this.submitting = true
              const { classifyType, enable, name, remark, sortNum, parentIds } = this.form
              const postData = { classifyType, enable, name, remark, sortNum, parentId: parentIds[parentIds.length - 1] }
              const promise = this.form.id ? updateDepartment({ id: this.form.id, ...postData }) : addDepartment(filterEmptyParams(postData))
              promise.then((res) => {
                if (res.code === 200) {
                  this.$message.success(this.form.id ? '部门修改成功' : '部门添加成功')
                  this.$emit('close', true, res.result)
                }
                this.submitting = false
              }).catch(() => {
                this.submitting = false
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
