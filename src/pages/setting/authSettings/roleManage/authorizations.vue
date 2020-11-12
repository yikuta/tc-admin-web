<template>
  <div class="app-container">
    <el-row :gutter="20" class="desc-list">
      <el-col :span="8" class="desc-item">
        <span class="label">角色名称：</span>
        <span class="content">{{detail.name}}</span>
      </el-col>

      <el-col :span="14" class="desc-item">
        <span class="label">备注说明：</span>
        <span class="content">{{detail.remark || '--'}}</span>
      </el-col>
    </el-row>
    <div class="checkbox-group-wrapper">
      <template v-for="group in permissions">
        <checkbox-group :currentItem="group" :key="group.id" />
      </template>
    </div>

    <el-row :gutter="20">
      <el-col :offset="8">
        <el-button class="save-button" type="primary" size="small" v-np="'ACCOUNT_ROLE_AUTH_CONFIG'" @click="updateRolesAuthList">保&nbsp;&nbsp;存</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { fetchRolesAuth, updateRoleAuth } from '@/api/setting/authSetting'
  function isChecked(item) {
    if (item['childPermList'] && item['childPermList'].length) { // 非叶子节点
      for (let i = 0, len = item['childPermList'].length; i < len; i++) {
        if (isChecked(item['childPermList'][i])) {
          return true
        }
      }
      return false
    } else { // 叶子节点
      return item.checked
    }
  }
  function getRolesList(data, resultArray = []) {
    data.forEach(item => {
      if (item['childPermList'] && item['childPermList'].length) {
        resultArray.push({
          name: item.name,
          id: item.id,
          checked: isChecked(item),
          silentAuth: item.silentAuth
        })
        resultArray = getRolesList(item['childPermList'], resultArray)
      } else if (item.checked) {
        resultArray.push({
          name: item.name,
          id: item.id,
          checked: true
        })
      }
    })
    return resultArray
  }
  export default {
    name: 'authorizations',
    components: {
      checkboxGroup: resolve => require(['./templates/checkboxGroup'], resolve)
    },
    data() {
      return {
        role_id: null,
        detail: {},
        permissions: []
      }
    },
    mounted() {
      this.role_id = this.$route.query.id
      this.fetchRolesAuthList()
    },
    methods: {
      // 获取权限列表
      fetchRolesAuthList() {
        fetchRolesAuth({ id: this.role_id }).then(res => {
          if (res.code === 200) {
            const { name, remark, permissionSets } = res.result
            this.detail = { name, remark }
            this.permissions = permissionSets
          }
        })
      },
      // 保存更新
      updateRolesAuthList() {
        const authDtoList = getRolesList(this.permissions)
        updateRoleAuth({
          roleId: this.role_id,
          authDtoList: authDtoList
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功')
            this.$router.go(-1)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .checkbox-group-wrapper {
    padding: 10px 0;

    .checkbox-group {
      margin: 15px 0;
    }
  }

  .save-button {
    margin-top: 20px;
  }
</style>
