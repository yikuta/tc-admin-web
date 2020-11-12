<template>
  <el-dialog
    class="dialog-detail"
    title="菜单详情"
    :visible="visible"
    :close-on-click-modal="false"
    @open="handleOpen"
    @close="handleCancel"
    width="600"
  >
    <el-tabs v-model="activeTab" @tab-click="handleTabClick" style="margin-top: -20px">
      <el-tab-pane label="基础信息" name="tab1">
        <el-row :gutter="20" class="desc-list">
          <el-col :span="12" class="desc-item">
            <span class="label">菜单名称：</span>
            <span class="content">{{detail.name}}</span>
          </el-col>

          <el-col :span="12" class="desc-item">
            <span class="label">上级菜单：</span>
            <span class="content">{{detail.parentPerm && detail.parentPerm.name}}</span>
          </el-col>

          <el-col :span="12" class="desc-item">
            <span class="label">排序：</span>
            <span class="content">{{detail.sortNum}}</span>
          </el-col>

          <el-col :span="12" class="desc-item">
            <span class="label">菜单类型：</span>
            <span class="content">{{detail.authType && detail.authType.describe}}</span>
          </el-col>

          <el-col :span="12" class="desc-item">
            <span class="label">菜单状态：</span>
            <span class="content">{{detail.enable ? '可用' : '禁用'}}</span>
          </el-col>

          <el-col :span="12" class="desc-item">
            <span class="label">绑定角色：</span>
            <span class="content"><el-link :underline="false" @click="handleTabClick({ name: 'tab2' })">{{detail.roleStr}}</el-link></span>
          </el-col>

          <el-col :span="12" class="desc-item">
            <span class="label">权限标识：</span>
            <span class="content">{{detail.code}}</span>
          </el-col>

          <el-col :span="12" class="desc-item">
            <span class="label">菜单图标：</span>
            <span class="content"><font-awesome-icon v-if="detail.icons" style="color: red" :icon="detail.icons" /></span>
          </el-col>

          <el-col :span="24" class="desc-item">
            <span class="label">备注说明：</span>
            <span class="content">{{detail.remark}}</span>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="绑定角色" name="tab2">
        <base-table :list="list" :columns="columns">
          <template slot="enable" slot-scope="{ row, index, column }">
            <el-badge is-dot class="badge-item" :type="row.enable ? 'success' : 'danger'" />
            <span>{{row.enable ? '正常' : '停用'}}</span>
          </template>
        </base-table>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="handleCancel">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { fetchPermissionDetail, fetchRolesByPermId } from '@/api/setting/authSetting'
  const columns = [{
    title: '角色名称',
    prop: 'name'
  }, {
    title: '状态',
    prop: 'enable',
    slot: true
  }, {
    title: '创建人',
    prop: 'name'
  }, {
    title: '创建时间',
    prop: 'createTime'
  }]

  export default {
    name: 'dialogForm',
    props: {
      row: {
        type: Object,
        default: () => {
          return {}
        }
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
      BaseTable: resolve => require(['@/components/BaseTable'], resolve)
    },
    data() {
      return {
        columns,
        activeTab: 'tab1',
        list: [],
        detail: {}
      }
    },
    methods: {
      handleOpen() {
        this.detail = { ...this.row }
        if (this.detail.icons.split(' ').length > 1) {
          this.detail.icons = this.detail.icons.split(' ')
        }
        this.fetchPermissionDetail()
        this.fetchRolesList()
      },
      fetchPermissionDetail() {
        fetchPermissionDetail({ id: this.row.id }).then((res) => {
          this.detail = res.result
          if (res.result.icons.split(' ').length > 1) {
            this.detail.icons = res.result.icons.split(' ')
          }
        })
      },
      fetchRolesList() {
        fetchRolesByPermId({ id: this.row.id }).then((res) => {
          this.list = res.result
        })
      },
      handleTabClick(tab) {
        this.activeTab = tab.name
      },
      handleCancel() { // true：成功 ｜ false：失败
        if (this.visible) {
          this.$parent.detailVisible = false
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .dialog-detail {
    /deep/ .el-dialog {
      min-width: 500px;
      .el-dialog__body {
        padding: 20px;
      }
    }
    /deep/ .el-form-item:last-child {
      margin-bottom: 0;
    }
  }
</style>
