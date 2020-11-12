<template>
  <div class="app-container">
    <el-table :data="tableData" size="mini">
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="更新时间" prop="lastUpdateTime"></el-table-column>
      <el-table-column label="最后操作人" prop="operator"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{ row }">
          <el-button v-np="'HOMEPAGE_NEW_CONTENT_PUSH'" type="primary" size="mini" @click="handleUpdate(row)">更新</el-button>
          <el-button v-np="'HOMEPAGE_NEW_CONTENT_SAVE'" type="primary" size="mini" @click="handleEdit(row)">装修</el-button>
          <el-button v-np="'HOMEPAGE_OPERATION_HISTORY_VIEW'" type="default" size="mini" @click="handleReport(row)">操作日志</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import { getConfigList, pushConfig } from '@/api/cms'
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  export default {
    name: 'CMSIndex',
    data() {
      return {
        tableData: []
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        getConfigList({
          searchs: JSON.stringify(searchTool({
            renovationType: { value: 'INDEX', name: 'renovationType', matchType: MatchType.EQUAL, type: DataType.STRING }
          }))
        }).then(res => {
          this.tableData = res.result.itemVOs
        })
      },
      handleUpdate(item) {
        // 更新
        pushConfig({
          configId: item.id
        }).then(res => {
          if (res.code === 200) {
            this.$notify.success('更新缓存成功')
          }
        })
      },
      handleEdit(row) {
        // 编辑
        this.$router.push({ path: '/cms/form', query: { id: row.id, opt: 'edit', type: 'INDEX' }})
      },
      handleReport(item) {
        // 日志详情
        this.$router.push(`/cms/report/${item.id}?name=${item.name}`)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
