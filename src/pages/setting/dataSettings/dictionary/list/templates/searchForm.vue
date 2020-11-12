<!--
 * @Description: Joker desc
 * @Author: Joker
 * @Date: 2020-08-13 15:43:58
 * @LastEditTime: 2020-09-15 15:10:43
 * @LastEditors: Joker
-->
<template>
  <el-card class="search-form">
    <el-form ref="form" :model="form" label-width="70px" size="mini">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="字典编码">
            <el-input v-model="form.code" placeholder="请输入字典编码" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="字典名称">
            <el-input v-model="form.name" placeholder="请输入字典名称" />
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="字典状态">
            <el-select v-model="form.enable" placeholder="请选择字典状态">
              <el-option label="全部" value="" />
              <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row type="flex" justify="end" class="search-btn">
      <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
      <el-button type="default" size="mini" @click="handleReset">重置</el-button>
      <el-button type="primary" size="mini" v-np="'VARIABLE_CONF_ADD'" @click="handleShowDialog">添加字典</el-button>
    </el-row>
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
      handleSearch() {
        this.$emit('search')
      },
      handleReset() {
        this.$emit('reset')
      },
      handleShowDialog() {
        this.$parent.handleToggleDialog(true)
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
