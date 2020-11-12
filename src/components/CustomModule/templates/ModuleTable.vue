<template>
  <!-- <el-card> -->
  <el-table :data="tables">
    <el-table-column prop="name" label="模块名称"></el-table-column>
    <el-table-column prop="enable" label="状态" width="80" align="center">
      <template slot-scope="{ row }">
        <el-badge is-dot class="badge-item" :type="row.enable ? 'success' : 'danger'"></el-badge>
        <span>{{row.enable ? '正常' : '停用'}}</span>
      </template>
    </el-table-column>
    <el-table-column prop="createTime" label="创建时间" align="center">
      <template v-slot:default="{row}">{{row['createTime'] | format('yyyy-MM-dd HH:mm:ss')}}</template>
    </el-table-column>
    <!-- 当前没有创建人 之后注意删掉formatter-->
    <el-table-column prop="createUser" label="创建人" align="center"></el-table-column>
    <el-table-column prop="control" label="操作" width="320" align="center">
      <template slot-scope="{ row }">
        <div class="module-btn-group">
          <el-button size="mini" type="primary" @click="handlePreview(row)" v-np="['MODULE_GOODS_GET', 'PT_MODULE_GOODS_GET', 'GYS_MODULE_GOODS_GET']">预览</el-button>
          <el-button size="mini" :type="row.enable ? 'danger' : 'success'" @click="handleEnable(row)" v-np="row.enable ? ['MODULE_GOODS_DISABLE', 'PT_MODULE_GOODS_DISABLE', 'GYS_MODULE_GOODS_DISABLE'] : ['MODULE_GOODS_ENABLE', 'PT_MODULE_GOODS_ENABLE', 'GYS_MODULE_GOODS_ENABLE']">{{ row.enable ? '停用' : '启用' }}</el-button>
          <el-button size="mini" type="primary" @click="handleEdit(row)" v-np="['MODULE_GOODS_EDIT', 'PT_MODULE_GOODS_EDIT', 'GYS_MODULE_GOODS_EDIT']">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)" v-np="['MODULE_GOODS_DEL', 'PT_MODULE_GOODS_DEL', 'GYS_MODULE_GOODS_DEL']">删除</el-button>
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
    },
    businessNo: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {}
  },
  filters: {
    formatEnable(enable) {
      return enable ? '启用' : '停用'
    }
  },
  methods: {
    /**
     * @description: 预览
     */
    handlePreview(row) {
      window.open(`${location.origin}/explain/module?id=${row.id}`, '_blank')
    },
    /**
     * @description: 编辑
     */
    handleEdit(row) {
      if (this.businessNo === 1) {
        this.$router.push(`/goods/mallGoods/moduleForm/${row.id}`)
      }
      if (this.businessNo === 2) {
        this.$router.push(`/goods/assembleGoods/moduleForm/${row.id}`)
      }
      if (this.businessNo === 3) {
        this.$router.push(`/goods/supplyGoods/moduleForm/${row.id}`)
      }
    },
    /**
     * @description: 启用/停用
     */
    handleEnable(row) {
      this.$emit('set-enable', row)
    },
    /**
     * @description: 删除
     */
    handleDelete(row) {
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
            this.$emit('action-delete', row)
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
