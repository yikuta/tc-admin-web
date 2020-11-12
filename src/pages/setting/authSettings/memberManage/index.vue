<template>
  <div class="app-container">
    <div class="page-layout">
      <section class="layout-aside">
        <el-card shadow="never">
          <div slot="header" class="clearfix">
            <span>组织机构</span>
            <div class="operates">
              <el-link
                :underline="false"
                type="primary"
                @click="$router.push({ path: '/setting/authSettings/organizationManage' })"
              ><i class="el-icon-plus"></i></el-link>
              <el-link :underline="false" type="primary" @click="handleRefresh"><i class="el-icon-refresh-left"></i></el-link>
            </div>
          </div>
          <el-tree
            :data="departmentsList"
            node-key="id"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
            :props="props"
            @node-click="handleNodeClick">
          </el-tree>
        </el-card>
      </section>
      <section class="layout-content">
        <search-form :form="searches" @change="handleSearchChange" />
        <base-table :list="users" :pagination="pagination" :columns="columns" @change="handleTableChange">
          <template slot="mainDept" slot-scope="{ row, index, column }">
            <span>{{row.mainDept && row.mainDept.name}}</span>
          </template>
          <template slot="slaveDept" slot-scope="{ row, index, column }">
            <span>{{row.slaveDept && row.slaveDept.name}}</span>
          </template>
          <template slot="enable" slot-scope="{ row, index, column }">
            <el-badge is-dot class="badge-item" :type="row.enable ? 'success' : 'danger'" />
            <span>{{row.enable ? '正常' : '停用'}}</span>
          </template>
          <el-table-column slot="operates" label="操作" width="240px">
            <template slot-scope="{ row }">
              <el-button type="text" v-np="'ACCOUNT_USER_UPDATE'"  @click="handleEditMember(row)">编辑</el-button>
              <el-button type="text" @click="updateMemberStatus(row)" v-np="row.enable?'ACCOUNT_USER_DISABLE':'ACCOUNT_USER_ENABLE'">{{ row.enable ? '停用' : '启用' }}</el-button>
              <el-button type="text" v-np="'ACCOUNT_USER_DEL'" @click="deleteMember(row)">删除</el-button>
              <el-button type="text" @click="$router.push({ path: '/setting/authSettings/memberManage/authorizations', query: { uid: row.id } })">权限</el-button>
              <el-button
                type="text"
                @click="$router.push({ path: '/setting/authSettings/memberManage/logs', query: { uid: row.id, fullName: row.fullName, mainDept: row.mainDept && row.mainDept.name, slaveDept: row.slaveDept && row.slaveDept.name } })">日志</el-button>
            </template>
          </el-table-column>
        </base-table>
      </section>
    </div>
    <dialog-form :form="editForm" :visible="dialogVisible" :departments="departmentsList" @close="handleCloseDialog" />
  </div>
</template>

<script>
  import { searchDepartmentsList, disableMember, enableMember, fetchMembersListByDepartment, deleteMember } from '@/api/setting/authSetting'
  import searchFormat from '@/utils/searchFormat'
  import { traceTreePath } from '@/utils/traceTreePath'
  const columns = [{
    title: '姓名',
    prop: 'fullName'
  }, {
    title: '登录手机',
    prop: 'phone'
  }, {
    title: '主属部门',
    prop: 'mainDept',
    slot: true
  }, {
    title: '附属部门',
    prop: 'slaveDept',
    slot: true
  }, {
    title: '角色',
    prop: 'roleStr'
  }, {
    title: '状态',
    prop: 'enable',
    slot: true
  }]
  const initSearches = {
    phone: '',
    fullName: '',
    enable: '',
    role: ''
  }
  const initForm = {
    fullName: '',
    phone: '',
    gender: 2,
    password: '',
    mainDept: '',
    slaveDeptId: '',
    category: '',
    remark: ''
  }
  export default {
    name: 'memberManage',
    components: {
      SearchForm: resolve => require(['./templates/searchForm.vue'], resolve),
      DialogForm: resolve => require(['./templates/dialogForm.vue'], resolve),
      BaseTable: resolve => require(['@/components/BaseTable/index'], resolve)
    },
    data() {
      return {
        columns,
        searches: { ...initSearches },
        departmentsList: [],
        expandKeys: [],
        users: [],
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        editForm: { ...initForm },
        props: { children: 'childDeptList', label: 'name', disabled: data => !data.enable },
        selectedRow: null,
        dialogVisible: false
      }
    },
    mounted() {
      const { roleId } = this.$route.query
      this.searches.role = roleId
      if (roleId) {
        this.fetchMembersListByDepartment()
      }
      this.searchDepartmentsList()
    },
    methods: {
      formatSearches() {
        const { phone, fullName, enable, role } = this.searches
        const results = searchFormat({
          phone: { value: phone, matchType: 'CONTAIN' },
          fullName: { value: fullName, matchType: 'CONTAIN' },
          enable: { value: enable === '' ? enable : enable === 1, matchType: 'EQUAL' },
          'roleList.id': { value: role === '' ? undefined : role, matchType: 'EQUAL' },
          'mainDepartment.id': { value: this.selectedRow ? this.selectedRow.id : null, matchType: 'EQUAL', tempType: 'Long' }
        })
        return results.length ? JSON.stringify(results) : null
      },
      // 根据部门查询员工
      fetchMembersListByDepartment() {
        const postData = {
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          searchs: this.formatSearches()
        }
        fetchMembersListByDepartment(postData).then(res => {
          if (res.code === 200) {
            this.$set(this, 'users', res.result.itemVOs)
            this.pagination.pageNo = res.result.pageNo
            this.pagination.pageSize = res.result.pageSize
            this.pagination.total = res.result.totalCount
          }
        })
      },
      handleRefresh() {
        this.users = []
        this.pagination.total = 0
        this.pagination.pageNo = 1
        this.searchDepartmentsList()
      },
      // 搜索部门列表
      searchDepartmentsList() {
        /* const searches = JSON.stringify(searchFormat({
           enable: { value: true, matchType: 'EQUAL' }
         }))*/
        // { searchs: searches }
        searchDepartmentsList({}).then(res => {
          if (res.code === 200) {
            this.expandKeys.push(res.result[0].id.toString())
            this.departmentsList = res.result
          }
        })
      },
      handleSearchChange(type) {
        switch (type) {
          case 'search': this.fetchMembersListByDepartment(); break
          case 'add':this.dialogVisible = true; break
          case 'reset': this.searches = { ...initSearches }; break
        }
      },
      // 编辑人员
      handleEditMember(row) {
        const { id, fullName, phone, gender, password, remark, mainDept, slaveDept } = row
        let mainPath, slavePath
        if (mainDept && mainDept.id) {
          mainPath = traceTreePath(this.departmentsList, mainDept.id, 'childDeptList')
        }
        if (slaveDept && slaveDept.id) {
          slavePath = traceTreePath(this.departmentsList, slaveDept.id, 'childDeptList')
        }
        this.editForm = {
          id, fullName, phone, password, remark,
          gender: gender.value,
          mainDeptId: mainPath ? mainPath.path : [],
          slaveDeptId: slavePath ? slavePath.path : []
        }
        this.dialogVisible = true
      },

      handleNodeClick(node) {
        this.selectedRow = node
        this.fetchMembersListByDepartment()
      },

      handleTableChange(data) {
        this.pagination = { ...this.pagination, ...data }
        this.fetchMembersListByDepartment()
      },

      handleCloseDialog(isSuccess) {
        this.dialogVisible = false
        if (isSuccess) {
          this.fetchMembersListByDepartment()
        }
        this.editForm = { ...initForm }
      },

      // 停、启用员工
      updateMemberStatus(row) {
        if (row.enable) {
          this.$confirm('人员停用后将无法登录系统且不可恢复，确定要停用吗？', '停用确认', {
            closeOnPressEscape: false,
            closeOnClickModal: false,
            showClose: false
          }).then(() => {
            disableMember({ id: row.id }).then(() => {
              this.fetchMembersListByDepartment()
            })
          })
        } else {
          enableMember({ id: row.id }).then(() => {
            this.fetchMembersListByDepartment()
          })
        }
      },

      // 删除员工
      deleteMember(row) {
        if (row.enable) {
          this.$alert('员工停用才能删除，请先停用员工', '删除确认', {
            confirmButtonText: '确定'
          })
        } else {
          this.$confirm('员工被删除后将无法登录系统且不可恢复，确定要删除该员工吗？', '删除确认', {
            confirmButtonText: '确定删除',
            cancelButtonText: '我再想想'
          }).then(() => {
            deleteMember({ id: row.id }).then(res => {
              if (res.code === 200) {
                this.$message.success('删除成功！')
                this.fetchMembersListByDepartment()
              }
            })
          })
        }
      }
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (from.name === 'authorizations') {
          vm.fetchMembersListByDepartment()
        }
      })
    },
    beforeRouteLeave(to, from, next) {
      if (to.name === 'authorizations') {
        from.meta.keepAlive = true
        next()
      } else {
        from.meta.keepAlive = false
        this.$destroy()
        next()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .page-layout {
    width: 100%;
    display: grid;
    grid-template-columns: 20% 80%;

    .layout-aside {
     /* min-width: 260px;
      max-width: 400px;*/
      padding-right: 12px;

      /deep/ .el-card {
        border-radius: 0;
      }

      .operates {
        height: 18px;
        font-size: 0;
        float: right;

        /deep/ .el-link--inner {
          display: inline-block;
          font-size: 18px;
          line-height: 18px;
          margin-left: 5px;
          vertical-align: top;
        }
      }
    }

    /deep/ .el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content {
      background: #409EFF;
      color: #fff;

      .el-tree-node__expand-icon {
        color: #fff;

        &.is-leaf {
          color: transparent;
        }
      }
    }

    .layout-content {
      padding: 0 20px 20px;
      border: 1px solid #EBEEF5;
    }
  }
</style>
