<template>
  <el-dialog
    :title="formItem.id ? '编辑分类' : '添加分类'"
    :visible.sync="dialogVisible"
    :close-on-click-modal='false'
    @close="handleCancel">
    <el-form
      :model="formItem"
      label-width="120px"
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
      <el-form-item label="开放第三方"  v-if="!formItem.parentId" prop='merchantCategoryFlag'>
        <el-checkbox :label='true' v-model="formItem.merchantCategoryFlag">&emsp;</el-checkbox>
      </el-form-item>
      <el-form-item label="排序数字" prop="sort">
        <el-input-number v-model="formItem.sort" :min="0" :max="9999" step-strictly label="排序数字"></el-input-number>
        <p class="label">*0~9999之间的数字，越大排序越靠前</p>
      </el-form-item>
      <el-form-item label="拼团收货时间" prop="groupReceiveTime">
        <el-input-number v-model="formItem.groupReceiveTime" :min="0" :max="360" step-strictly label="拼团收货时间"></el-input-number>&nbsp;小时
        <p class="label">社区拼团商品发货后自动确认收货的时间，允许0~360之间的整数，为0表示使用上级配置</p>
      </el-form-item>
      <el-form-item label="拼团售后时间" prop="groupAfterSaleTime">
        <el-input-number v-model="formItem.groupAfterSaleTime" :min="0" :max="360" step-strictly label="拼团售后时间"></el-input-number>&nbsp;小时
        <p class="label">社区拼团商品收货后用户可以申请售后的时间，允许0~360之间的整数，为0表示使用上级配置</p>
      </el-form-item>
      <div class="btns">
        <el-button type="primary" size="small" @click="handleSave('form')" :loading="loading">{{formItem.id ? '确定修改' : '确定添加'}}</el-button>
        <el-button type="default" size="small" @click="handleCancel">{{formItem.id ? '暂不修改' : '暂不添加'}}</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
  import { addBaseCategory, updateBaseCategory } from '@/api/baseCategory'
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
            id: '',
            categoryPath: '',
            merchantCategoryFlag: false
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
          id: '',
          groupReceiveTime: 24,
          groupAfterSaleTime: 24,
          merchantCategoryFlag: false
        },
        rules: {
          name: [
            { required: true, message: '请填写分类名称', trigger: 'blur' },
            { max: 10, message: '仅允许输入10个字符，建议使用汉字', trigger: 'blur' }
          ],
          sort: [
            { required: true, message: '排序不能为空值', trigger: 'blur, change' }
          ],
          groupReceiveTime: [
            { required: true, message: '拼团收货时间不能为空值', trigger: 'blur, change' }
          ],
          groupAfterSaleTime: [
            { required: true, message: '拼团售后时间不能为空值', trigger: 'blur, change' }
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
            this.reset()
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
        this.formItem = {
          sort: 0,
          parentId: '',
          name: '',
          groupReceiveTime: 24,
          groupAfterSaleTime: 24
        }
        this.loading = false
      },
      handleSave(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const { categoryPath, id, name, parentId, sort, index, merchantCategoryFlag, groupReceiveTime, groupAfterSaleTime } = this.formItem
            const fn = id ? updateBaseCategory : addBaseCategory
            this.loading = true
            let path = id ? categoryPath : (parentId ? this.option.filter(item => item.id === parentId)[0].categoryPath : '')
            fn({ categoryPath: path, id, name, parentId, sort, merchantCategoryFlag, groupReceiveTime, groupAfterSaleTime }).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$message.success(id ? '编辑分类成功~' : '添加分类成功~')
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
        this.$refs['form'].resetFields()
        this.dialogVisible = false
      }
    }
  }
</script>

<style lang="scss" scoped>
.btns{
  text-align: center;
}
.label{
  margin: 0;
  padding: 0;
  font-size: 12px;
  color: #999;
  line-height: 22px;
}
</style>
