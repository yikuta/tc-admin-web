<template>
  <el-table
    ref="lazyTable"
    row-key="id"
    lazy
    default-expand-all
    :data="list"
    :load="$parent.loadChildren"
    :tree-props="{ hasChildren: 'hasChildren', children: 'childDeptList' }"
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
      <template slot-scope="scope">
        <el-button type="text" v-if="!scope.row.isRoot" @click="$parent.handleEditDepartment(scope.row)">编辑</el-button>
        <el-button type="text" @click="$parent.updateDepartmentStatus(scope.row)">{{ scope.row.enable ? '停用' : '启用' }}</el-button>
        <el-button type="text" @click="$parent.deleteDepartment(scope.row)">删除</el-button>
        <el-button type="text" @click="$parent.addDepartmentSub(scope.row)">添加下级部门</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  export default {
    name: 'lazyTable',
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    methods: {
      toggleRowExpansion(row, expanded) {
        this.$refs.lazyTable.toggleRowExpansion(row, expanded)
      }
    }
  }
</script>

<style></style>
