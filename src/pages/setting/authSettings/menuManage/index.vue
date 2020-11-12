<template>
  <div class="app-container">
    <search-form ref="searchForm" :form="searches" @change="handleSearchChange" v-if="isAdmin" />
<!--    <el-button type="danger" @click="handleConsole">打印</el-button>-->
    <el-table
      ref="singleTable"
      row-key="id"
      lazy
      :expand-row-keys="[0]"
      :default-expand-all="true"
      :data="list"
      :load="loadChildren"
      :tree-props="{ hasChildren: 'hasChildren', children: 'children' }"
    >
      <el-table-column prop="name" label="菜单名称"></el-table-column>
      <el-table-column prop="sortNum" label="排序"></el-table-column>
      <el-table-column prop="authType" label="类型">
        <template slot-scope="{ row }">
          <span>{{row.authType && row.authType.describe || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="code" label="权限标识"></el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <el-badge is-dot class="badge-item" :type="scope.row.enable ? 'success' : 'danger'"></el-badge>
          <span>{{scope.row.enable ? '正常' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="说明"></el-table-column>
      <el-table-column label="操作" width="230px">
        <template slot-scope="{row}">
          <el-button type="text" style="color:#f56c6c" v-if="isAdmin" @click="handleDeleteMenu(row)">删除</el-button>
          <el-button type="text" v-np="'ACCOUNT_AUTH_UPDATE'" @click="handleEditMenu(row)">编辑</el-button>
          <el-button type="text" @click="updateMenuStatus(row)" v-np=" row.enable ? 'ACCOUNT_AUTH_DISABLE':'ACCOUNT_AUTH_ENABLE'">{{ row.enable ? '停用' : '启用' }}</el-button>
          <el-button type="text" @click="handleShowDetail(row)" v-np="'ACCOUNT_AUTH_DETAILS'">详情</el-button>
          <el-button type="text" @click="addMenuSub(row)" v-np="'ACCOUNT_AUTH_SUB_ADD'" v-if="isAdmin">添加子菜单</el-button>
        </template>
      </el-table-column>
    </el-table>
    <dialog-form
      :visible="dialogVisible"
      :menuList="list"
      :form="dialogForm"
      :parentRow="parentRow"
      @close="handleCloseDialog"
    />
    <dialog-detail :visible="detailVisible" :row="currentRow" />
  </div>
</template>
<script>
  import { fetchMenuList, disablePermission, enablePermission, deletePermission } from '@/api/setting/authSetting'
  import searchFormat from '@/utils/searchFormat'
  import { traceTreePath } from '@/utils/traceTreePath'
  const initForm = {
    parentIds: [],
    parentId: '',
    authType: '',
    name: '',
    code: '',
    sortNum: 0,
    icons: '',
    remark: ''
  }
  export default {
    name: 'organizationManage',
    components: {
      BaseTable: resolve => require(['@/components/BaseTable'], resolve),
      SearchForm: resolve => require(['./templates/searchForm.vue'], resolve),
      DialogForm: resolve => require(['./templates/dialogForm.vue'], resolve),
      DialogDetail: resolve => require(['./templates/dialogDetail.vue'], resolve)
    },
    data() {
      return {
        list: [],
        dialogVisible: false,
        detailVisible: false,
        dialogForm: { ...initForm },
        searches: {},
        currentRow: {},
        parentRow: {},
        oldParentNode: {},
        isAdmin: false // 管理员模式，可以添加和删除菜单
      }
    },
    mounted() {
      this.isAdmin = !!this.$route.query.admin
      this.fetchMenusList()
    },
    methods: {
      // 获取菜单列表
      fetchMenusList(row = {}, resolve) {
        const postData = {
          orderbys: ['sortNum', 'createTime'],
          sorts: ['desc', 'desc']
        }
        if (row.id) {
          postData.searchs = JSON.stringify(searchFormat({
            'parent.id': { value: row.id, matchType: 'EQUAL', tempType: 'Long' }
          }))
        }
        fetchMenuList(postData).then(res => {
          if (res.code === 200) {
            res.result.forEach(item => {
              item.leaf = item['authTypeValue'] === 2 || (item['authTypeValue'] === 1 && !item.hasChildren)
            })
            if (row.id) { // 子节点
              row.children = res.result
              resolve && resolve(res.result)
            } else { // 根节点
              res.result.forEach(item => {
                if (item.code === 'TINCERE') {
                  item.isRoot = true
                }
              })
              this.list = res.result
            }
          }
        })
      },
      // 加载子级
      loadChildren(tree, treeNode, resolve) {
        this.fetchMenusList(tree, resolve)
      },
      // 添加菜单
      handleSearchChange(type) { // search | reset | add
        if (type === 'add') {
          this.dialogForm.parentIds = []
          this.dialogVisible = true
        }
      },
      // 关闭表单弹窗
      handleCloseDialog(isSuccess, data) {
        this.dialogVisible = false
        if (isSuccess) {
          if (this.dialogForm.id) { // edit
            Reflect.ownKeys(this.currentRow).forEach(key => {
              this.currentRow[key] = data[key]
            })
            /* if (this.oldParentNode.id === data.parentPerm.id) { // 父节点没变化
              Reflect.ownKeys(this.currentRow).forEach(key => {
                this.currentRow[key] = data[key]
              })
            } else { // 父节点发生变化
              const parentRow = traceTreePath(this.list, data.parentPerm.id, 'children').currentNode
              parentRow.hasChildren = true
              this.fetchMenusList(parentRow)
              this.fetchMenusList(this.oldParentNode)
            }*/
          } else { // add
            const parentRow = traceTreePath(this.list, data.parentPerm.id, 'children').currentNode
            if (parentRow.hasChildren && !parentRow.children.length) {
              parentRow.hasChildren = true
              this.fetchMenusList(parentRow)
            } else {
              parentRow.hasChildren = true
              // 修复新增子菜单后再次新增其下子菜单无法回显上级菜单的bug
              let leaf = data.authTypeValue === 2 || (data.authTypeValue === 1 && !data.hasChildren)
              if (parentRow.children && parentRow.children.length) {
                this.$set(parentRow.children, parentRow.children.length, { ...data, leaf, hasChildren: false })
              } else {
                this.$set(parentRow, 'children', [{ ...data, leaf, hasChildren: false }])
              }
            }
          }
          this.$refs.singleTable.doLayout()
        }
        this.$forceUpdate()
        this.dialogForm = { ...initForm }
      },
      // 删除
      handleDeleteMenu(row) {
        this.$confirm('确定要删除吗？', {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showClose: false
        }).then(() => {
          deletePermission({ id: row.id }).then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message)
              // this.fetchMenusList(row.parentPerm)
              location.reload()
            }
          })
        })
      },
      // 编辑部门
      handleEditMenu(row) {
        let parentIds = []
        if (row.parentPerm && row.parentPerm.id) {
          const currentPath = traceTreePath(this.list, row.id, 'children')
          parentIds = currentPath.path.slice(0, -1)
          const parentRow = currentPath.nodes.slice(-2, -1)[0]
          this.parentRow = parentRow
          this.oldParentNode = parentRow
          this.currentRow = row
        }
        const { id, name, authTypeValue, code, sortNum, icons, remark } = row
        this.dialogForm = {
          id, name, code, sortNum, icons, remark,
          authType: authTypeValue,
          parentIds: parentIds
        }
        this.dialogVisible = true
      },
      // 变更菜单状态
      updateMenuStatus(row) {
        let message = '该菜单有绑定的角色，恢复后对应角色将自动获得该菜单权限，确定要恢复吗？'
        if (row.enable) {
          message = '该菜单有绑定的角色，停用后对应角色将不能再使用该菜单对应的功能，确定要停用吗？'
        }
        const tips = row.enable ? '停用确认' : '恢复确认'
        this.$confirm(message, tips, {
          closeOnPressEscape: false,
          closeOnClickModal: false,
          showClose: false
        }).then(() => {
          const postData = { id: row.id, enable: !row.enable }
          const promise = row.enable ? disablePermission(postData) : enablePermission(postData)
          promise.then(res => {
            if (res.code === 200) {
              this.$message.success(row.enable ? '停用成功！' : '启用成功')
              row.enable = !row.enable
            }
          })
        })
      },
      // 添加子菜单
      addMenuSub(row) {
        if (row) {
          const currentPath = traceTreePath(this.list, row.id, 'children')
          this.dialogForm.parentIds = currentPath.path
          this.parentRow = row
        }
        this.dialogVisible = true
      },
      // 展示详情弹框
      handleShowDetail(row) {
        this.detailVisible = true
        this.currentRow = row
      },
      handleConsole() {
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
