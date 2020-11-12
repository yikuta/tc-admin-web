<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column label="广告名称" prop="advertName" />
      <el-table-column label="广告位信息">
        <template v-slot:default="{row}">
          <div class="space-info">
            <div>广告位名称：{{row.positionName}}</div>
            <div>广告位类型：{{row.positionTypeDesc}}</div>
            <div>所属终端：{{row.positionTerminalDesc}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="有效期" width="300" prop="expire">
        <template v-slot:default="{row}">{{row.expiryDate}}</template>
      </el-table-column>
      <el-table-column label="添加时间" prop="createTime">
        <template v-slot:default="{row}">{{row.createTime | format('yyyy-MM-dd HH:mm:ss')}}</template>
      </el-table-column>
      <el-table-column label="添加人" prop="createOperator" />
      <el-table-column label="排序">
        <template v-slot:default="{row}">
          <el-input-number v-model="row.sortNum" :precision="0" :controls="false" controls-position="right" :min="0" :max="10000" @change="()=>onChangeSort(row)" :style="{width:'100px'}"></el-input-number>
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template v-slot:default="{row}">{{row.advertDetailStatusDesc}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot:default="{ row }">
          <el-link type="primary" v-np="'ADV_CONTENT_VIEW'" @click="handleCheck(row)">查看详情</el-link>
          <el-link type="primary" v-np="'ADV_CONTENT_UPDATE'" v-if="isAbleEdit(row)" @click="handleRoute('edit',row)">编辑</el-link>
          <el-link type="primary" v-np="'ADV_CONTENT_ENABLE_STATUS_CHANGE'" v-if="isAbleShelfOn(row)" @click="handleEditStatus('shelf_on',row)">上架</el-link>
          <el-link type="primary" v-np="'ADV_CONTENT_ENABLE_STATUS_CHANGE'" v-if="isAbleShelfOff(row)" @click="handleEditStatus('shelf_off',row)">下架</el-link>
        </template>
      </el-table-column>
      <template #empty>没有查询到数据！</template>
    </el-table>
  </div>
</template>

<script>
import { AD_TYPE, AD_STATUS } from '../../constants'
import { reqUpdateStatus, reqUpdateSort } from '@/api/advertising'

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
     * @description: 是否可编辑
     */
    isAbleEdit(row) {
      return row.advertDetailStatusDesc === '待上架' || row.advertDetailStatus === AD_STATUS.SHELF_OFF
    },
    /**
     * @description: 是否可上架
     */
    isAbleShelfOn(row) {
      return row.advertDetailStatus === AD_STATUS.SHELF_OFF
    },
    /**
     * @description: 是否可下架
     */
    isAbleShelfOff(row) {
      return row.advertDetailStatus === 'DETAIL_STATUS_ON'
    },
    /**
     * @description: 改变sort
     */
    onChangeSort(row) {
      this._reqUpdateSort(row)
    },
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
          query: { id: row.id }
        },
        edit: {
          path: '/advertising/advertisingForm',
          query: {
            id: row.id,
            spaceId: this.$parent.spaceId,
            type: this.$parent.type === AD_TYPE.TEXT ? 'text' : 'img'
          }
        }
      }
      this.$router.push(routes[target])
    },
    /**
     * @description: 停用/启用
     */
    handleEditStatus(target, row) {
      this.$confirm(target === 'shelf_on' ? '是否确认上架该广告？' : '下架后用户将无法看到该广告，是否确认下架？', `${target === 'shelf_on' ? '上架' : '下架'}`, {
        confirmButtonText: '确定',
        cancelButtonText: '我再想想',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            reqUpdateStatus({ ...row, positionType: this.$parent.type, advertDetailStatus: target === 'shelf_on' ? 'DETAIL_STATUS_ON' : AD_STATUS.SHELF_OFF })
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
      }).catch(() => {})
    },
    /**
     * @description: 更新广告排序值
     */
    _reqUpdateSort(data) {
      return reqUpdateSort(data)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('on-search')
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .space-info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
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
