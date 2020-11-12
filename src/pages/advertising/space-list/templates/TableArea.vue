<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column label="广告位编码" prop="positionCode" />
      <el-table-column label="广告位名称" prop="positionName" />
      <el-table-column label="所属终端" prop="positionTerminalDesc" />
      <el-table-column label="广告位类型" prop="positionTypeDesc" />
      <el-table-column label="添加时间" prop="createTime">
        <template v-slot:default="{row}">{{row.createTime | format('yyyy-MM-dd HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column prop="statusDesc" label="广告位状态" />
      <el-table-column label="操作" width="200">
        <template v-slot:default="{ row }">
          <el-link type="primary" v-np="'ADV_POSITION_CONTENT_VIEW'" @click="handleCheck(row)">查看</el-link>
          <el-link type="primary" v-np="'ADV_POSITION_LIST_VIEW'" @click="handleRoute('config',row)">配置广告</el-link>
          <el-link type="primary" v-np="'ADV_POSITION_CONTENT_UPDATE'" @click="handleRoute('edit',row)">编辑</el-link>
          <el-link type="primary" v-np="'ADV_POSITION_ENABLE_STATUS_CHANGE'" @click="handleEditStatus(row)">{{row['status']==='OFF'?'启用':'停用'}}</el-link>
        </template>
      </el-table-column>
      <template #empty>没有查询到数据！</template>
    </el-table>
  </div>
</template>

<script>
import { reqUpdateSpaceStatus } from '@/api/advertising'

export default {
  name: 'TableArea',
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {}
  },
  methods: {
    /**
     * @description: 查看
     */
    handleCheck(row) {
      this.$emit('on-check', row)
    },
    /**
     * @description: 处理路由跳转
     */
    handleRoute(target, row) {
      const routes = {
        config: {
          path: '/advertising/advertisingList',
          query: { id: row.positionCode, type: row.positionType, spaceId: row.id }
        },
        edit: {
          path: '/advertising/form',
          query: { id: row.id }
        }
      }
      this.$router.push(routes[target])
    },
    /**
     * @description: 停用/启用
     */
    handleEditStatus(row) {
      this.$confirm(
        row['status'] === 'ON' ? '广告位停用后该广告位将不会在前端展示，确定要停用广告位吗？' : '广告位启用后即可上架对应的广告，请确定前端有相应的广告展示',
        `${row['status'] === 'OFF' ? '启用' : '停用'}`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '我再想想',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              reqUpdateSpaceStatus({ ...row, status: row['status'] === 'OFF' ? 'ON' : 'OFF' })
                .then(res => {
                  if (res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: '操作成功'
                    })
                    this.$emit('on-search')
                  }
                  done()
                })
                .catch(() => {})
                .finally(() => (instance.confirmButtonLoading = false))
            } else {
              done()
            }
          }
        }
      ).catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .info-style {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-align: start;
    /deep/ .el-image {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
      margin-right: 5px;
    }
    .text-info {
      .text-info-child {
        display: flex;
        flex-direction: row;
        div:first-child {
          flex-shrink: 0;
          margin-right: 5px;
        }
      }
    }
  }
  .action-area {
    margin-top: 15px;
    float: left;
  }
}
</style>
