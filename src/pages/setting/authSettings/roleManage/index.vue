<template>
  <div class="app-container">
    <search-form ref="searchForm" :form="searches" @change="handleSearchChange" />
    <base-table :list="list" :columns="columns">
      <template slot="enable" slot-scope="{ row, index, column }">
        <el-badge is-dot class="badge-item" :type="row.enable ? 'success' : 'danger'" />
        <span>{{row.enable ? '正常' : '停用'}}</span>
      </template>
      <el-table-column slot="operates" label="操作" width="220px">
        <template slot-scope="{ row }">
          <el-button type="text" v-np="'ACCOUNT_ROLE_UPDATE'" @click="handleEditDepartment(row)">编辑</el-button>
          <el-button type="text" v-np="row.enable?'ACCOUNT_ROLE_DISABLE':'ACCOUNT_ROLE_ENABLE'" @click="updateDepartmentStatus(row)">{{ row.enable ? '停用' : '启用' }}</el-button>
          <el-button type="text" v-np="'ACCOUNT_ROLE_DEL'" @click="deleteDepartment(row)">删除</el-button>
          <el-button type="text" @click="$router.push({ path: '/setting/authSettings/roleManage/authorizations', query: { id: row.id } })">权限配置</el-button>
        </template>
      </el-table-column>
    </base-table>
    <dialog-form :visible="dialogVisible" :form="dialogForm" @close="handleCloseDialog" />
  </div>
</template>
<script>
  import { fetchRoles, enableRole, disableRole, deleteRole } from '@/api/setting/authSetting'
  import searchFormat from '@/utils/searchFormat'
  const columns = [{
    title: '角色名称',
    prop: 'name'
  }, {
    title: '备注说明',
    prop: 'remark'
  }, {
    title: '状态',
    prop: 'enable',
    slot: true
  }, {
    title: '创建人',
    prop: 'createUser'
  }, {
    title: '创建时间',
    prop: 'createTime'
  }]
  const initSearches = {
    code: '',
    name: '',
    enable: ''
  }
  const initForm = {
    name: '',
    remark: ''
  }
  export default {
    name: 'organizationManage',
    components: {
      BaseTable: resolve => require(['@/components/BaseTable'], resolve),
      SearchForm: resolve => require(['./templates/searchForm.vue'], resolve),
      DialogForm: resolve => require(['./templates/dialogForm.vue'], resolve)
    },
    data() {
      return {
        searches: {
          name: '',
          enable: ''
        },
        columns,
        list: [],
        pagination: {
          total: 0,
          pageSize: 100,
          pageNo: 1
        },
        dialogVisible: false,
        dialogForm: { ...initForm }
      }
    },
    mounted() {
      this.fetchList()
    },
    methods: {
      formatSearches() {
        const { name, enable } = this.searches
        const results = searchFormat({
          name: { value: name, matchType: 'CONTAIN' },
          enable: { value: enable === '' ? enable : enable === 1, matchType: 'EQUAL' }
        })
        return results.length ? JSON.stringify(results) : null
      },
      fetchList() {
        const { pageNo, pageSize } = this.pagination
        const postData = {
          pageNo, pageSize,
          searchs: this.formatSearches()
        }
        fetchRoles(postData).then(res => {
          if (res.code === 200) {
            this.list = res.result.itemVOs
          }
        })
      },
      handleSearchChange(type) { // search | reset | add
        if (type === 'add') {
          this.dialogForm.superDepartment = this.selectedRow
          this.dialogVisible = true
        } else if (type === 'reset') {
          this.searches = { ...initSearches }
          this.fetchList()
        } else {
          this.fetchList()
        }
      },
      handleCloseDialog(isSuccess) { // eslint-disable-line
        this.dialogVisible = false
        this.dialogForm = { ...initForm }
        if (isSuccess) {
          this.fetchList()
        }
      },
      // 编辑部门
      handleEditDepartment(row) {
        const { id, code, name, remark } = row
        this.dialogForm = { id, code, name, remark }
        this.dialogVisible = true
      },
      updateDepartmentStatus(row) {
        if (row.enable) {
          this.$confirm('角色停用后，绑定了该角色的用户将不再拥有该角色对应的权限，确定要停用吗？', '停用确认', {
            closeOnPressEscape: false,
            closeOnClickModal: false,
            showClose: false,
            confirmButtonText: '确定停用',
            cancelButtonText: '我再想想'
          }).then(() => {
            disableRole(row, { id: row.id }).then(res => {
              if (res.code === 200) {
                this.$message.success('停用成功！')
                this.$set(row, 'enable', !row.enable)
              }
            })
          })
        } else {
          enableRole(row, { id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message.success('启用成功！')
              this.$set(row, 'enable', !row.enable)
            }
          })
        }
      },
      deleteDepartment(row) {
        this.$confirm('角色删除后将不能恢复，确定要删除吗?', '删除确认', {
          confirmButtonText: '确定删除',
          cancelButtonText: '我再想想'
        }).then(() => {
          deleteRole({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功！')
              this.fetchList()
            }
          }, (error) => {
            const create = this.$createElement
            this.$msgbox({
              title: '删除确认',
              message: create('p', null, [
                create('span', null, error.message),
                create('span', {
                  style: 'color: #409eff;cursor: pointer;',
                  on: {
                    click: () => {
                      this.$msgbox.close()
                      this.$router.push({ name: 'memberManage', query: { roleId: row.id }})
                    }
                  }
                }, '去看看')
              ]),
              showCancelButton: false,
              confirmButtonText: '确定'
            })
          })
        })
      },
      addDepartmentSub(row) {
        this.dialogForm.superDepartment = row.id
        this.dialogVisible = true
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
