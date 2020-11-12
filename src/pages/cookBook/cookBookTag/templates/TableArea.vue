<template>
  <div class="wrapper">
    <el-table 
      :data="tableData.data" 
      style="width: 100%" 
      :cell-style="{ textAlign:'center' }" 
      :header-cell-style="{ textAlign:'center' }" 
      v-loading='loading'
      size="mini">
      <el-table-column prop="index" label="序号" width="100">
        <template slot-scope='scope'>
          <span v-show="!loading">{{(tableData.pageNo - 1) * tableData.pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签编号" prop="code" />
      <el-table-column label="标签名称" prop="name" />
      <el-table-column label="排序" prop="sort" >
        <template v-slot:default="{row}">
          <el-input-number
            v-model="row.sort"
            v-np='"COOKBOOK_LABEL_SORT_ORDER_CHANGE"'
            size="mini"
            @blur='handleBlurs'>
          </el-input-number>
        </template>
      </el-table-column>
      <el-table-column prop="enable" label="状态">
        <template v-slot:default="{row}">
          <el-switch
            @change="changeStatus($event, row)"
            v-np='"COOKBOOK_LABEL_ENABLE_STATUS_CHANGE"'
            v-model="row.enable"
            :active-value="true"
            :inactive-value="false"
        ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80">
        <template v-slot:default="{row}">
          <el-button type="text" size="mini" @click='handleEdit(row)' v-np='"COOKBOOK_LABEL_EDIT"'>编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { asyncCookBookTagEnable, asyncCookBookTagBySort } from '@/api/cookBook'
  export default {
    name: 'TableArea',
    components: {
      UploadFile: resolve => {
        return require(['@/components/UploadFile/index'], resolve)
      }
    },
    props: {
      tableData: { type: Object, default: () => {} },
      loading: {
        type: Boolean,
        default: () => false
      }
    },
    data() {
      return {
        currentRow: {}
      }
    },
    methods: {
      changeStatus(callback, row) {
        if (callback === true) {
          asyncCookBookTagEnable(row.id).then(res => {
            if (res.code === 200) {
              row.enable = true
              this.$message.success('开启成功')
            }
          })
        } else {
          row.enable = true
          this.$confirm('关闭该标签后，该标签将不再显示，是否确认关闭？', '提示', {
            confirmButtonText: '确认关闭',
            cancelButtonText: '取消'
          }).then(async() => {
            asyncCookBookTagEnable(row.id).then(res => {
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
      handleEdit(row) {
        this.$emit('edit', row)
      },
      handleBlurs() {
        let cookBookSortDtos = this.tableData.data.map(item => {
          return {
            id: item.id,
            sort: item.sort
          }
        })
        asyncCookBookTagBySort({ cookBookSortDtos }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.$emit('update')
          }
        })
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
