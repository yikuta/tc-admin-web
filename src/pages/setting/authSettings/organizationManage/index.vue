<template>
  <div class="app-container">
    <search-form ref="searchForm" :form="searches" @change="handleSearchChange" />
    <el-table
      ref="treeTable"
      :expand-row-keys="expandRowKeys"
      :data="list"
      row-key="id"
      @expand-change="handleExpandChange"
      :tree-props="{ children: 'childDeptList' }"
    >
      <el-table-column prop="name" label="部门结构"></el-table-column>
      <el-table-column prop="departmentClassify" label="分类">
        <template slot-scope="{ row }">
          <span>{{row['departmentClassify'] && row['departmentClassify'].value || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="peoples" label="人数"></el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <el-badge is-dot class="badge-item" :type="scope.row.enable ? 'success' : 'danger'"></el-badge>
          <span>{{scope.row.enable ? '正常' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注说明"></el-table-column>
      <el-table-column label="操作" width="250px">
        <template slot-scope="{ row }">
          <el-button type="text" v-if="!row.isRoot" v-np="'ACCOUNT_DEPT_UPDATE'" @click="handleEditDepartment(row)">编辑</el-button>
          <el-button type="text" @click="updateDepartmentStatus(row)" v-np="row.enable ?'ACCOUNT_DEPT_DISABLE':'ACCOUNT_DEPT_ENABLE'">{{ row.enable ? '停用' : '启用' }}</el-button>
          <el-button type="text" v-if="!row.isRoot && !row.enable" v-np="'ACCOUNT_DEPT_DEL'" @click="deleteDepartment(row)">删除</el-button>
          <el-button type="text" v-if="row.enable" v-np="'ACCOUNT_DEPT_SUB_ADD'" @click="addDepartmentSub(row)">添加下级部门</el-button>
        </template>
      </el-table-column>
    </el-table>
    <dialog-form :visible="dialogVisible" :form="dialogForm" @close="handleCloseDialog" />
  </div>
</template>
<script>
  import SearchForm from './templates/searchForm.vue'
  import DialogForm from './templates/dialogForm.vue'
  /*  import LazyTable from './templates/lazyTable.vue'
    import TreeTable from './templates/treeTable.vue'*/
  import { fetchDepartmentsList, searchDepartmentsList, deleteDepartment, enableDepartment, disableDepartment } from '@/api/setting/authSetting'
  import searchFormat from '@/utils/searchFormat'
  import { traceTreePath } from '@/utils/traceTreePath'
  import { uniqueArr } from '@/utils/util'
  const initSearches = {
    name: '',
    enable: ''
  }
  const initForm = {
    parentIds: [],
    name: '',
    classifyType: '',
    sortNum: 0,
    enable: true,
    remark: ''
  }
  function deleteHasChildrenProperty(data) {
    return data.map(item => {
      delete item.hasChildren
      if (item.childDeptList && item.childDeptList.length) {
        item.childDeptList = deleteHasChildrenProperty(item.childDeptList)
      }
      return item
    })
  }

  function getExpandRowKeys(data, expandRowKeys = []) {
    data.forEach(item => {
      if (item.childDeptList && item.childDeptList.length) {
        expandRowKeys.push(item.id.toString())
        expandRowKeys = getExpandRowKeys(item.childDeptList, expandRowKeys)
      }
    })
    return expandRowKeys
  }

  export default {
    name: 'organizationManage',
    components: { SearchForm, DialogForm },
    data() {
      return {
        searches: { ...initSearches },
        list: [],
        dialogVisible: false,
        dialogForm: { ...initForm },
        expandRowKeys: [],
        parentPath: {},
        currentPath: [],
        currentRow: null,
        isSearch: false
      }
    },
    mounted() {
      this.searchDepartmentsList()
      // this.fetchDepartmentsById({})
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
      // 加载子元素
      loadChildren(tree, treeNode, resolve) {
        fetchDepartmentsList({
          searchs: JSON.stringify(searchFormat({ 'parent.id': { value: tree.id, matchType: 'EQUAL', tempType: 'Integer' }}))
        }).then(res => {
          if (res.code === 200) {
            tree['childDeptList'] = res.result
            resolve && resolve(res.result)
          }
        })
      },
      // 搜索部门列表
      searchDepartmentsList() {
        searchDepartmentsList({
          orderby: 'sortNum',
          sort: 'desc',
          searchs: this.formatSearches()
        }).then(res => {
          if (res.code === 200) {
            if (res.result.length) {
              res.result[0].isRoot = true
              this.list = deleteHasChildrenProperty(res.result)
              if (this.isSearch) {
                this.expandRowKeys = getExpandRowKeys(res.result)
              } else {
                this.expandRowKeys.push(res.result[0].id.toString())
              }
            } else {
              this.list = []
              this.expandRowKeys = []
            }
          }
        })
      },
      // 搜索
      handleSearchChange(type) { // search | reset | add
        if (type === 'add') {
          this.dialogVisible = true // 显示添加弹框
        } else if (type === 'reset') {
          this.searches = { ...initSearches }
          this.fetchDepartmentsById({})
        } else if (type === 'search') {
          this.isSearch = true
          this.searchDepartmentsList()
        }
      },
      // 根据id查询子级部门
      fetchDepartmentsById(parentNode) {
        const postData = {}
        if (parentNode.id) {
          postData.searchs = JSON.stringify(searchFormat({
            'parent.id': { value: parentNode.id, matchType: 'EQUAL', tempType: 'Integer' }
          }))
        }
        fetchDepartmentsList(postData).then(res => {
          if (parentNode.id) {
            this.$set(parentNode, 'hasChildren', res.result.length > 0)
            this.$set(parentNode, 'childDeptList', res.result)
            this.$forceUpdate()
          } else {
            res.result[0].isRoot = true
            this.list = res.result
          }
        })
      },
      // 展开关闭
      handleExpandChange(row, expanded) {
        if (expanded) {
          this.expandRowKeys.push(row.id.toString())
        } else {
          const index = this.expandRowKeys.indexOf(row.id.toString())
          if (index > -1) {
            this.expandRowKeys.splice(index, 1)
          }
        }
      },
      // 更新状态
      updateDepartmentStatus(row) {
        if (row.enable) {
          this.$confirm('部门停用后将不能再添加子部门和人员，确定要停用吗？', '停用确认', {
            closeOnPressEscape: false,
            closeOnClickModal: false,
            showClose: false
          }).then(() => {
            disableDepartment({ id: row.id }).then(res => {
              if (res.code === 200) {
                this.$message.success('停用成功！')
                this.$set(row, 'enable', !row.enable)
              } else {
                if ([5044, 5045].includes(res.subCode)) {
                  const message = res.subCode === 5044 ? ',请先停用所有子部门' : res.subCode === 5045 ? ',只有部门人员全部停用或离职的部门才能停用' : ''
                  this.$alert(res.message + message, '停用确认', {
                    confirmButtonText: '确定'
                  })
                } else {
                  this.$message.error(res.message)
                }
              }
            })
          })
        } else {
          this.$confirm('部门启用后将可以在该部门下添加子部门或人员，确定要启用部门吗？', '启用确认', {
            closeOnPressEscape: false,
            closeOnClickModal: false,
            showClose: false
          }).then(() => {
            enableDepartment({ id: row.id }).then(res => {
              if (res.code === 200) {
                this.$message.success('启用成功！')
                this.$set(row, 'enable', !row.enable)
              }
            })
          })
        }
      },
      // 删除部门
      deleteDepartment(row) {
        this.$confirm('删除部门后该部门将不能恢复，确定要删除吗？', '删除确认', {
          confirmButtonText: '确定删除',
          cancelButtonText: '我再想想'
        }).then(() => {
          deleteDepartment({ id: row.id }).then(res => {
            if (res.code === 200) {
              this.$message.success('删除成功！')
              if (row.parentDept) {
                const currentPath = traceTreePath(this.list, row.id, 'childDeptList')
                const index = currentPath.index.slice(-1)[0]
                const parenRow = currentPath.nodes[currentPath.nodes.length - 2]
                parenRow['childDeptList'].splice(index, 1)
              } else {
                this.list = this.list.filter(item => item.id !== row.id)
              }
            } else {
              if ([5044, 5045].includes(res.subCode)) {
                const message = res.subCode === 5044 ? ',请先删除所有子部门' : res.subCode === 5045 ? ',请先删除所有用户' : ''
                this.$alert(res.message + message, '删除确认', {
                  confirmButtonText: '确定'
                })
              } else {
                this.$message.error(res.message)
              }
            }
          })
        })
      },
      // 编辑部门
      handleEditDepartment(row) {
        this.currentRow = row
        const currentPath = traceTreePath(this.list, row.id, 'childDeptList')
        const { id, name, departmentClassify, sortNum, enable, remark } = row
        this.dialogForm = {
          id, name, sortNum, enable, remark,
          parentIds: currentPath.path.slice(0, -1),
          classifyType: departmentClassify.code
        }
        this.dialogVisible = true
      },
      // 添加下级部门
      addDepartmentSub(row) {
        this.parentPath = traceTreePath(this.list, row.id, 'childDeptList')
        this.dialogForm.parentIds = [...this.parentPath.path]
        this.dialogVisible = true
      },
      // 关闭弹出层
      handleCloseDialog(isSuccess, row) { // eslint-disable-line
        this.dialogVisible = false
        if (isSuccess) {
          // const parentId = this.dialogForm.parentIds.slice(-1)[0]
          this.searchDepartmentsList()
          this.expandRowKeys = uniqueArr([...this.expandRowKeys, ...this.dialogForm.parentIds])
        }
        this.dialogForm = { ...initForm }
      }
    }
  }
</script>
<style lang="scss" scoped>

</style>
