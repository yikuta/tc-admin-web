<template>
  <el-card class="search-form" shadow="never">
    <el-form ref="form" :model="form" :rules="rules" label-width="70px" size="mini">
      <el-row :gutter="20">

        <el-col :span="6">
          <el-form-item label="登录手机" prop="phone">
            <el-input v-model="form.phone" placeholder="请输入登录手机" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="员工姓名" prop="fullName">
            <el-input v-model="form.fullName" placeholder="请输入员工姓名" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="人员状态">
            <el-select v-model="form.enable" placeholder="请选择人员状态">
              <el-option label="全部" value="" />
              <el-option v-for="(item, index) in status" :label="item.value" :value="item.id" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="员工角色">
            <el-select v-model="form.role" placeholder="请选择员工角色">
              <el-option label="全部" value="" />
              <el-option v-for="(item, index) in rolesList" :label="item.name" :value="item.id" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row type="flex" justify="end" class="search-btn">
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleChange('search')">查询</el-button>
        <el-button type="primary" icon="el-icon-plus" size="mini" v-np="'ACCOUNT_USER_ADD'" @click="handleChange('add')">添加人员</el-button>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
  import { fetchRoles } from '@/api/setting/authSetting'
  export default {
    name: 'searchForm',
    props: {
      form: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        rolesList: [],
        status: [
          { id: 1, value: '启用' },
          { id: 0, value: '停用' }
        ],
        rules: {
          fullName: [
            { pattern: /^[a-zA-Z\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]{0,20}$/, message: '1～20个字符（汉字、数字、字母、下划线）', trigger: 'blur' }
          ],
          phone: [
            { pattern: /^\d{0,11}$/, message: '请输入正确手机号', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.fetchRolesList()
    },
    methods: {
      fetchRolesList() {
        fetchRoles({}).then(res => {
          if (res.code === 200) {
            this.rolesList = res.result.itemVOs
          }
        })
      },
      handleChange(type) {
        if (type === 'search') {
          this.$refs.form.validate(validate => {
            if (validate) {
              this.$emit('change', type)
            }
          })
        } else {
          this.$emit('change', type)
        }
      }
    }
  }
</script>

<style lang="scss">
  .search-form {
    margin-bottom: 20px;
    border-top: none;
    border-left: none;
    border-right: none;
    border-radius: 0;

    /deep/ .el-select {
      width: 100%;
    }
  }
</style>
