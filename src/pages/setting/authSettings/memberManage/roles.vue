<template>
  <div class="app-container">
    <el-row :gutter="20" class="desc-list">
      <el-col :span="8" class="desc-item">
        <span class="label">姓名：</span>
        <span class="content">{{detail.fullName}}</span>
      </el-col>

      <el-col :span="8" class="desc-item">
        <span class="label">主属部门：</span>
        <span class="content">{{detail.mainDept && detail.mainDept.name}}</span>
      </el-col>

      <el-col :span="8" class="desc-item">
        <span class="label">附属部门：</span>
        <span class="content">{{detail.slaveDept && detail.slaveDept.name}}</span>
      </el-col>
    </el-row>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="功能权限配置" name="tab1">
        <el-transfer
          v-model="targetKeys"
          :data="list"
          :props="{ key: 'id', label: 'name' }"
          :titles="['可选角色', '已选角色']"
        ></el-transfer>
        <el-button class="save-button" type="primary" size="small" v-np="'ACCOUNT_USER_AUTH_CONFIG'" @click="handleUpdateUserRole">保&nbsp;&nbsp;存</el-button>
      </el-tab-pane>
      <el-tab-pane label="数据权限配置" name="tab2">数据权限配置</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { fetchUserRoles, updateUserRole } from '@/api/setting/authSetting'
  export default {
    name: 'userRoles',
    data() {
      return {
        uid: null,
        activeTab: 'tab1',
        detail: {},
        list: [],
        targetKeys: []
      }
    },
    mounted() {
      this.uid = this.$route.query.uid
      this.fetchUserRoles()
    },
    methods: {
      handleTabClick(tab) {
        this.activeTab = tab.name
      },
      // 根据userId查询角色
      fetchUserRoles() {
        fetchUserRoles({ id: this.uid }).then(res => {
          if (res.code === 200) {
            const { fullName, mainDept, slaveDept, roleSet } = res.result
            this.detail = { fullName, mainDept, slaveDept }
            this.list = roleSet
            const targetKeys = [];
            (roleSet || []).forEach(item => {
              if (item.selected) {
                targetKeys.push(item.id)
              }
            })
            this.targetKeys = targetKeys
          }
        })
      },

      // 保存角色配置
      handleUpdateUserRole() {
        this.$confirm('修改员工角色后需要再次登录才会生效，确定保存该员工的权限变更吗？', '保存确认', {
          confirmButtonText: '确定保存',
          cancelButtonText: '我再想想'
        }).then(() => {
          updateUserRole({
            id: this.uid,
            roleIdList: this.targetKeys
          }).then(() => {
            this.$message.success('保存成功')
            this.$router.go(-1)
          })
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  /deep/ .el-transfer {
    .el-transfer-panel {
      width: 300px;
      height: 500px;

      .el-transfer-panel__body, .el-transfer-panel__list {
        height: 458px;
      }
    }
  }

  .save-button {
    margin-left: 360px;
    margin-top: 20px;
  }
</style>
