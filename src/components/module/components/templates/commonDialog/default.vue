<template>
  <div>
    <el-form size="mini" label-width="150px" :model="form" :rules="rules" ref="form">
      <el-form-item label="请选择平台：">
        <el-select v-model="form.platformId" placeholder="请选择平台">
          <el-option v-for="(item, index) in option.platform" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="请输入链接" prop="platformLink">
        <el-input placeholder="请输入链接" v-model="form.platformLink"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: 'Default',
    data() {
      return {
        form: {
          platformId: 2,
          platformLink: ''
        },
        rules: {
          'platformLink': [
            { required: true, message: '链接不能为空', trigger: 'blur' }
          ]
        },
        option: {
          platform: [
            // { id: 1, value: '全部' },
            { id: 2, value: '天呈生活APP' },
            { id: 3, value: '天呈净菜小程序' },
            { id: 4, value: '天呈生活小程序' }
          ]
        }
      }
    },
    methods: {
      getData() {
        let valid = false
        this.$refs.form.validate(validate => {
          valid = validate
        })
        const info = this.option.platform.filter(o => o.id === this.form.platformId)
        const data = {
          platformId: this.form.platformId,
          platformLink: this.form.platformLink,
          baseData: info[0] || null
        }
        return valid ? data : null
      }
    }
  }
</script>

<style lang="scss" scoped></style>
