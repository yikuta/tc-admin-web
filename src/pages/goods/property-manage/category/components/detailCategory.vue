<template>
  <el-dialog 
    title="分类详情" 
    :visible.sync="dialogVisible" 
    width="480px" 
    :close-on-click-modal='false'
    @close="handleCancel">
    <el-form 
      :model="formItem" 
      label-width="100px" 
      size="small" 
      ref="form">
      <el-form-item label="父级分类" v-if="formItem.parentId" prop="parentId">
        <el-select v-model="formItem.parentId" disabled>
          <el-option v-for="(item, index) in option" :label="item.name" :value="item.id" :key="index" />
        </el-select>
      </el-form-item>
      <el-form-item label="分类名称" prop="name">
        <span>{{formItem.name}}</span>
      </el-form-item>
      <el-form-item label="开放第三方"  v-if="!formItem.parentId" prop='merchantCategoryFlag'>
        <span>{{formItem.merchantCategoryFlag ? '是' : '否'}}</span>
      </el-form-item>
      <el-form-item label="排序数字" prop="sort">
        <span>{{formItem.sort}}</span>
      </el-form-item>
      <el-form-item label="拼团收货时间" prop="groupReceiveTime">
        <span>{{formItem.groupReceiveTime}}&nbsp;小时</span>
      </el-form-item>
      <el-form-item label="拼团售后时间" prop="groupAfterSaleTime">
        <span>{{formItem.groupAfterSaleTime}}&nbsp;小时</span>
      </el-form-item>
      <div class="btns">
        <el-button type="default" size="small" @click="handleCancel">关闭</el-button>
      </div>
    </el-form>
  </el-dialog>
</template>

<script>
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
          groupReceiveTime: 0,
          groupAfterSaleTime: 0,
          merchantCategoryFlag: false
        },
        parentCategory: []
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
      handleCancel() {
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
