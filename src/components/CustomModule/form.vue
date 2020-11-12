<template>
  <div class="app-container">
    <el-form :model="form" label-width="100px" size="mini" :rules="rules" ref="form">
      <el-form-item label="模块名称" prop="name">
        <el-input type="请输入模块名称" v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="编辑模块">
        <module-detail ref="detail" validate></module-detail>
      </el-form-item>
      <el-form-item class="text-center">
        <el-button type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  // , reqUpdateModule, reqModuleById
  import { reqAddModule, reqModuleById, reqUpdateModule } from '@/api/module'
  export default {
    name: 'CustomModuleForm',
    components: {
      ModuleDetail: resolve => {
        return require(['@/components/CustomDetailModule/index.vue'], resolve)
      }
    },
    props: {
      businessNo: {
        type: Number,
        default: 1
      },
      detailId: {
        type: [Number, String],
        default: 0
      }
    },
    data() {
      return {
        form: {
          name: '', // 名称
          value: '', // 值
          enable: false,
          businessNo: null // 当前的商品类型
        },
        rules: {
          name: [
            { required: true, message: '请输入模块名称', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      if (this.detailId) {
        this.getDetail()
      }
    },
    watch: {
      detailId() {
        this.getDetail()
      }
    },
    methods: {
      getDetail() {
        reqModuleById(this.detailId).then(res => {
          if (res.code === 200) {
            const result = res.result || {}
            this.form.name = result.name
            this.form.value = result.value
            this.form.businessNo = result.businessNo.value
            // this.form.createUser = result.createUser
            this.form.enable = result.enable
            this.$refs['detail'].setContent(this.form.value)
          }
        })
      },
      handleSave() {
        // 保存
        this.$refs.form.validate(validate => {
          if (validate) {
            this.$confirm('确定要保存当前设置吗？', '提示', {
              cancelButtonText: '再改改',
              confirmButtonText: '确定保存'
            }).then(() => {
              const moduleList = this.$refs.detail.getContent()
              if (moduleList.value === '[]') {
                this.$message.error('模块不能为空')
                return
              }
              const fn = this.detailId ? reqUpdateModule : reqAddModule
              fn({
                id: this.detailId || '',
                name: this.form.name, // 名称
                value: moduleList.value, // 值
                enable: this.form.enable,
                businessNo: this.businessNo // 当前的商品类型
                // createUser: this.form.createUser // 创建人
              }).then(res => {
                if (res.code === 200) {
                  this.$notify.success('保存成功')
                  this.$confirm('模板保存成功', '成功提示', {
                    showCancelButton: false,
                    confirmButtonText: '返回列表'
                  }).then(() => {
                    if (this.businessNo === 1) {
                      this.$router.push('/goods/mallGoods/commonModule')
                    }
                    if (this.businessNo === 2) {
                      this.$router.push('/goods/assembleGoods/commonModule')
                    }
                    if (this.businessNo === 3) {
                      this.$router.push('/goods/supplyGoods/commonModule')
                    }
                  })
                }
              })
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import '@/assets/style/common.scss'
</style>
