<!--
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-13 15:43:58
 * @LastEditTime: 2020-09-15 15:33:28
 * @LastEditors: Joker
-->
<template>
  <el-card class="search-form">
    <el-form ref="form" :model="form" label-width="70px" size="mini">
      <el-row :gutter="20">
       <!-- <el-col :span="6">
          <el-form-item label="角色名称">
            <el-input v-model="form.name" placeholder="请输入角色名称" />
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="角色状态">
            <el-select v-model="form.enable" placeholder="请选择角色状态">
              <el-option label="全部" value="" />
              <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>-->

        <el-col :span="24">
          <el-row type="flex" justify="end" class="search-btn">
<!--            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleChange('search')">查询</el-button>-->
            <el-button type="primary" icon="el-icon-plus" size="mini" v-np="'ACCOUNT_AUTH_ADD'" @click="handleChange('add')">添加菜单</el-button>
          </el-row>
        </el-col>
      </el-row>
    </el-form>
  </el-card>
</template>

<script>
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
        option: {
          status: [
            { id: 1, value: '启用' },
            { id: 0, value: '停用' }
          ]
        }
      }
    },
    methods: {
      handleChange(type) {
        this.$emit('change', type)
      }
    }
  }
</script>

<style lang="scss">
  .search-form {
    margin-bottom: 20px;

    /deep/ .el-select {
      width: 100%;
    }
  }
</style>
