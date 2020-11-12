<template>
  <!-- <el-card> -->
  <el-table :data="tables">
    <el-table-column prop="name" label="模块名称"></el-table-column>
    <el-table-column prop="enable" label="状态" :formatter="formatEnable" width="80" align="center"></el-table-column>
    <el-table-column prop="createTime" label="创建时间" align="center">
      <template v-slot:default="{row}">{{row['createTime'] | format('yyyy-MM-dd HH:mm:ss')}}</template>
    </el-table-column>
    <!-- 当前没有创建人 之后注意删掉formatter-->
    <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
    <el-table-column prop="control" label="操作" width="320" align="center">
      <template slot-scope="scope">
        <div class="module-btn-group">
          <el-button size="mini" type="primary" @click="handlePreview(scope.$index, scope.row)">预览</el-button>
          <el-button v-if="!scope.row['enable']" size="mini" type="primary" @click="handleEnable(scope.$index, scope.row)">启用</el-button>
          <el-button v-else size="mini" type="primary" @click="handleEnable(scope.$index, scope.row)">停用</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </div>
      </template>
    </el-table-column>
  </el-table>
  <!-- </el-card> -->
</template>
<script>
export default {
  props: {
    tables: {
      type: Array,
      default: () => []
    }
  },
  data() {
    this.formatEnable = row => {
      return row['enable'] ? '启用' : '停用'
    }
    return {}
  },
  methods: {
    /**
     * @description: 预览
     */
    handlePreview(index, row) {
      this.$router.push({
        path: '/goods/supplyGoods/updateModule',
        query: {
          id: row['id'],
          pv: '0' // 编辑-1 预览-0
        }
      })
    },
    /**
     * @description: 编辑
     */
    handleEdit(index, row) {
      this.$router.push({
        path: '/goods/supplyGoods/updateModule',
        query: {
          id: row['id'],
          pv: '1' // 编辑-1 预览-0
        }
      })
    },
    /**
     * @description: 启用/停用
     */
    handleEnable(index, row) {
      this.$emit('set-enable', !row['enable'], row['id'], row['businessNo'])
    },
    /**
     * @description: 删除
     */
    handleDelete(index, row) {
      if (row['enable']) {
        this.$confirm('只能删除停用状态的模块，请先将模块停用后再删除', '删除模块', {
          showConfirmButton: false,
          cancelButtonText: '关闭'
        })
          .then()
          .catch()
      } else {
        this.$confirm('模块删除后不能恢复，确认要删除吗？', '删除模块', {
          confirmButtonText: '确定删除',
          cancelButtonText: '我再想想'
        })
          .then(() => {
            this.$emit('action-delete', row['id'])
          })
          .catch(() => {})
      }
    }
  }
}
</script>
<style lang="scss" scoped>
// /deep/ .table-head th{
//   background: #f9fafc !important
// }
</style>
