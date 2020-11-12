<template>
  <el-dialog :title="formItem.id ? '编辑分类' : '添加分类'" :visible.sync="dialogVisible" @close="handleCancel">
    <el-form
      :model="formItem"
      label-width="100px"
      size="small"
      :rules="rules"
      ref="form">
      <el-form-item label="父级分类" v-if="formItem.parentId" prop="parentId">
        <el-select v-model="formItem.parentId">
          <el-option v-for="(item, index) in option" :label="item.name" :value="item.id" :key="index" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <el-input placeholder="请输入分类名称" v-model="formItem.name"></el-input>
      </el-form-item>
      <el-form-item label="排序数字" prop="sort">
        <el-input-number v-model="formItem.sort" :min="0" :max="9999" label="排序数字"></el-input-number>
      </el-form-item>
      <div class="btns">
        <el-button type="primary" size="small" @click="handleSave('form')" :loading="loading">{{formItem.id ? '确定修改' : '确定添加'}}</el-button>
        <el-button type="default" size="small" @click="handleCancel">{{formItem.id ? '暂不修改' : '暂不添加'}}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import { updateChannelCategory, addChannelCategory } from '@/api/showClassify.js'
  export default {
    name: 'EditCategory',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      formInfo: {
        type: Object,
        default: () => {
          return {
            parentId: '',
            name: '',
            sort: 0,
            id: ''
          }
        }
      },
      option: {
        type: Array,
        default: () => {
          return []
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        formItem: {
          parentId: '',
          name: '',
          sort: 0,
          id: ''
        },
        rules: {
          name: [
            { required: true, message: '请填写分类名称', trigger: 'blur' },
            { max: 20, message: '仅允许输入20个字符，建议使用汉字', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空值', trigger: 'blur, change' }
          ]
        },
        parentCategory: [],
        loading: false
      }
    },
    watch: {
      dialogVisible(n) {
        this.$emit('update:visible', n)
      },
      visible(n) {
        this.dialogVisible = n
        if (n) {
          this.$nextTick(() => {
            this.$refs.form.resetFields()
            this.formDetail()
          })
        }
      }
    },
    methods: {
      // 基础的信息设置
      formDetail() {
        // 处理传递进来的表单数据
        this.formItem = JSON.parse(JSON.stringify(this.formInfo))
        this.parentCategory = this.option
      },
      // 清除表单数据，防止残留数据
      reset() {
        this.loading = false
        this.formItem = {
          parentId: '',
          name: '',
          sort: 0,
          id: ''
        }
      },
      handleSave(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const fn = this.formItem.id ? updateChannelCategory : addChannelCategory
            const { categoryPath, id, name, parentId, sort, index } = this.formItem
            this.loading = true
            fn({ categoryPath, id, name, parentId, sort, businessNo: 2 }).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$message.success(res.message)
                this.$emit('update', index, this.formInfo.parentId)
                this.handleCancel()
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
        this.reset()
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
.btns{
  text-align: center;
}
</style>
