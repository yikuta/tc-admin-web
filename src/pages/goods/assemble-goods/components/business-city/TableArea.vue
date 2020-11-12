<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
      <el-table-column prop="cityName" label="城市" width="200">
        <template v-slot:default="{row}">{{row['provinceName']?row['provinceName']+'-'+row['cityName']:row['cityName']}}</template>
      </el-table-column>
      <el-table-column label="开通区域">
        <template v-slot:default="{row}">{{row['businessAreaList']?row['businessAreaList'].length?row['businessAreaList'].map(item=>(item.areaName)).join(';'):'-':'-'}}</template>
      </el-table-column>
      <el-table-column prop="enable" label="状态" width="100">
        <template v-slot:default="{row}">{{row['enable']?'启用':'停用'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template v-slot:default="{ row }">
          <el-link v-np="'GROUP_BIZCITY_EDIT'" type="primary" @click="handleEdit(row)">编辑</el-link>
          <el-link v-np="row.enable ? 'GROUP_BIZCITY_DISABLE' : 'GROUP_BIZCITY_ENABLE'" type="primary" @click="handleEditStatus(row)">{{row['enable']?'停用':'启用'}}</el-link>
        </template>
      </el-table-column>
      <template #empty>没有查询到数据！</template>
    </el-table>
  </div>
</template>

<script>
import Common from '../common'
import { reqUpdateBusinessCityStatus } from '@/api/assembleGoods'

export default {
  name: 'TableArea',
  components: { ...Common },
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
    handleEdit(row) {
      this.$emit('on-update-service', row)
    },
    /**
     * @description: 停用/启用
     */
    handleEditStatus(row) {
      this.$confirm(
        row.enable ? '城市停用后将不可开展拼团业务，确定要停用吗？' : '城市启用成功后，开通的区域将可开展拼团业务且用户可以申请该区域的团长，确定要启用吗？',
        `${row.enable ? '停用' : '启用'}城市`,
        {
          confirmButtonText: `确定${row.enable ? '停用' : '启用'}`,
          cancelButtonText: '我再想想',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              reqUpdateBusinessCityStatus({ id: row['id'], status: !row['enable'] })
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
<style lang='scss'>
.setting-model-style {
  width: 900px;
  max-height: 700px;
}
</style>
