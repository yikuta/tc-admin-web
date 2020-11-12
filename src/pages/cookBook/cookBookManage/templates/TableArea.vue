<template>
  <div class="wrapper">
    <el-table 
      :data="tableData" 
      style="width: 100%" 
      :cell-style="{ textAlign:'center' }" 
      :header-cell-style="{ textAlign:'center' }" 
      tooltip-effect='light'
      @selection-change="handleSelectionChange" size="mini">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="菜谱名称" prop="name" show-overflow-tooltip/>
      <el-table-column label="菜谱标签" prop="showLables" show-overflow-tooltip :formatter="(row)=>formatNoneValue(row['showLables'])"/>
      <el-table-column label="封面图" prop="homeImgUrl" >
        <template v-slot:default="{row}">
          <el-image 
            style="width: 100px; height: 100px"
            :src="row.homeImgUrl" 
            :preview-src-list="[row.homeImgUrl]">
          </el-image>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus" label="审核状态">
        <template v-slot:default="{row}">{{row['auditStatus'] | auditStatus}}</template>
      </el-table-column>
      <el-table-column prop="enable" label="显示状态">
        <template v-slot:default="{row}">
          <el-switch
            v-if="row.auditStatus === 11"
            v-np='"COOKBOOK_ENABLE_STATUS_CHANGE"'
            @change="changeStatus($event, row)"
            v-model="row.enable"
            :active-value="true"
            :inactive-value="false"
        ></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间"></el-table-column>
      <el-table-column prop="bookSource" label="数据来源">
        <template v-slot:default="{row}">{{row['bookSource'] ? (row['bookSource'] === 1 ? '平台发布' : '用户发布') : '-'}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template v-slot:default="{row}">
          <el-button 
            type="text" 
            size="mini" 
            v-if="row['bookSource'] === 1" 
            v-np='"COOKBOOK_EDIT"'
            :disabled="row['auditStatus']===10||(row['auditStatus']===11&&row.enable)"
            @click="handleEdit(row)">编辑</el-button>
          <el-button type="text" size="mini" @click="handleDetail(row)" v-np='"COOKBOOK_DETAIL_VIEW"'>详情</el-button>
          <el-button type="text" size="mini" v-if="row['bookSource'] === 1" @click="handleDelete(row)">删除</el-button>
          <el-button type="text" size="mini" @click="handleLog(row)" v-np='"COOKBOOK_OPERATION_HISTORY_VIEW"'>操作日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { asyncCookBooksEnable } from '@/api/cookBook'
  export default {
    name: 'TableArea',
    components: {
      UploadFile: resolve => {
        return require(['@/components/UploadFile/index'], resolve)
      }
    },
    props: {
      tableData: { type: Array, default: () => [] }
    },
    data() {
      return {
        currentRow: {}
      }
    },
    filters: {
      auditStatus(val) {
        if (val === 10) {
          return '待审核'
        } else if (val === 11) {
          return '审核通过'
        } else if (val === 12) {
          return '审核不通过'
        } else {
          return '-'
        }
      }
    },
    methods: {
      handleLog(row) {
        this.$router.push({ path: 'cookBookLog', query: { id: row.id, name: row.name }})
      },
      handleDelete(item) {
        // 清空选择内容
        this.$confirm('是否确认删除该菜谱？', '删除提示', {}).then(() => {
          this.$emit('del', item.id)
        })
      },
      handleDetail(row) {
        this.$router.push({ path: 'cookBookDetail', query: { id: row.id }})
      },
      changeStatus(callback, row) {
        if (callback === true) {
          asyncCookBooksEnable(row.id).then(res => {
            if (res.code === 200) {
              row.enable = true
              this.$message.success('开启成功')
            }
          })
        } else {
          row.enable = true
          this.$confirm('关闭显示后，该菜谱将不展示给用户，是否确认关闭显示？', '提示', {
            confirmButtonText: '确认关闭',
            cancelButtonText: '取消'
          }).then(async() => {
            asyncCookBooksEnable(row.id).then(res => {
              if (res.code === 200) {
                row.enable = false
                this.$message({
                  type: 'success',
                  message: '关闭成功'
                })
              }
            })
          })
        }
      },
      handleSelectionChange(val) {
        this.$emit('selection', val)
      },
      handleEdit(row) {
        this.$router.push({ path: '/cookBook/cookBookAdd', query: { id: row.id }})
      }
    }
  }
</script>

<style lang='scss' scoped>
.wrapper {
  margin: 0;
  .package-area {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
