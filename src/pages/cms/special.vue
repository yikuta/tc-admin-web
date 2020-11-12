<template>
  <div class="app-container">
    <SearchBar @change="handleSearchChange"></SearchBar>
    <el-table :data="tableData" size="mini">
      <el-table-column label="专题ID" prop="renovationCode"></el-table-column>
      <el-table-column label="专题名称" prop="name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="{ row }">{{ row.status | filterStatus }}</template>
      </el-table-column>
      <el-table-column label="发布时间" prop="pushTime"></el-table-column>
      <el-table-column label="最后操作时间" prop="lastUpdateTime"></el-table-column>
      <el-table-column label="最后操作人" prop="operator"></el-table-column>
      <el-table-column label="操作" width="400">
        <template slot-scope="{ row }">
          <el-button type="text" v-np="'CHANNEL_PROMOTION_CONTENT_PUSH'" size="mini" @click="handleUpdate(row)" v-if="row.status !== 'WAIT_PUSH' && row.status !== 'DISABLE'">更新</el-button>
          <el-button type="text" v-np="'CHANNEL_PROMOTION_DETAIL_VIEW'" size="mini" @click="handleEdit(row, 'edit')" v-if="row.status !== 'DISABLE'">装修</el-button>
          <el-button type="text" v-np="'CHANNEL_PROMOTION_DETAIL_COPY'" size="mini" @click="handleEdit(row, 'copy')">复制</el-button>
          <el-button type="text" v-np="'CHANNEL_PROMOTION_CONTENT_RELEASE'" size="mini" @click="handleUpdate(row, 'PUSHING')" v-if="row.status === 'WAIT_PUSH'">发布</el-button>
          <el-button type="text" v-np="'CHANNEL_PAGE_PROMOTION_DISABLE'" size="mini" @click="handleUpdate(row, 'UNUSED')" v-if="row.status === 'PUSHING'">停用</el-button>
          <el-button type="text" v-np="'CHANNEL_PAGE_PROMOTION_ENABLE'" size="mini" @click="handleUpdate(row, 'WAIT_PUSH')" v-if="row.status === 'UNUSED'">启用</el-button>
          <el-button type="text" v-np="'CHANNEL_PAGE_PROMOTION_DISCARD'" size="mini" @click="handleUpdate(row, 'DISABLE')" v-if="['UNUSED', 'PUSHING'].includes(row.status)">作废</el-button>
          <el-button type="text" v-np="'CHANNEL_PAGE_PROMOTION_DELETE'" size="mini" @click="handleDelete(row)" v-if="row.status === 'WAIT_PUSH'">删除</el-button>
          <el-button type="text" v-np="'CHANNEL_PROMOTION_OPERATION_HISTORY_VIEW'" size="mini" @click="handleReport(row)">操作日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pageSize="listQuery.pageSize" :total="listQuery.totalCount" :current="listQuery.pageNo" @onSizeChange="handleSizeChange" @onPageChange="handleCurrentChange"></pagination>
  </div>
</template>

<script>
  import { getConfigList, pushConfig, updateSpecial, deleteSpecial } from '@/api/cms'
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  export default {
    name: 'CMSSpecial',
    components: {
      Pagination: resolve => {
        return require(['@/components/Pagination/index'], resolve)
      },
      SearchBar: resolve => {
        return require(['./templates/search'], resolve)
      }
    },
    data() {
      return {
        tableData: [],
        listQuery: {
          pageNo: 1,
          pageSize: 20,
          totalCount: 0,
          totalPage: 0
        },
        reqForm: {}
      }
    },
    created() {
      this.getList()
    },
    filters: {
      filterStatus(value) {
        switch (value) {
          case 'DISABLE':
            return '已作废'
          case 'UNUSED':
            return '已禁用'
          case 'PUSHING':
            return '发布中'
          case 'WAIT_PUSH':
            return '等待发布'
          default:
            return ''
        }
      }
    },
    methods: {
      getList() {
        getConfigList({
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          searchs: JSON.stringify(searchTool({
            ...this.reqForm,
            renovationType: { value: 'SPECIAL', name: 'renovationType', matchType: MatchType.EQUAL, type: DataType.STRING }
          })),
          orderby: 'createTime'
        }).then(res => {
          this.tableData = res.result.itemVOs
          this.listQuery = {
            pageNo: res.result.pageNo,
            pageSize: res.result.pageSize,
            totalCount: res.result.totalCount,
            totalPage: res.result.totalPageCount
          }
        })
      },
      handleUpdate(item, opt) {
        // 更新
        const that = this
        if (!opt) {
          pushConfig({
            configId: item.id
          }).then(res => {
            if (res.code === 200) {
              that.$notify.success('更新缓存成功')
            }
          })
        } else {
          const option = {
            DISABLE: '作废',
            UNUSED: '停用',
            PUSHING: '发布',
            WAIT_PUSH: '启用'
          }
          let tipsText = ''
          if (opt === 'UNUSED') {
            tipsText = '页面停用后无法被C端访问，请确认相关入口已关闭！'
          } else if (opt === 'DISABLE') {
            tipsText = '页面作废后无法恢复，无法被C端访问，请确认相关入口已关闭！'
          } else if (opt === 'PUSHING') {
            tipsText = '页面发布后，可以被C端访问到，请核对页面内容无误后发布！'
          } else if (opt === 'WAIT_PUSH') {
            tipsText = '页面启用后，可以被C端访问到，请核对页面内容无误后启用！'
          } else {
            tipsText = `确定要${option[opt]}${item.name}吗？`
          }
          this.$confirm(tipsText, '提示', {}).then(() => {
            updateSpecial({
              id: item.id,
              status: opt
            }).then(res => {
              if (res.code === 200) {
                that.$notify.success(`${option[opt]}${item.name}成功！`)
                that.getList()
              }
            })
          })
        }
      },
      handleEdit(row, type) {
        this.$router.push({ path: '/cms/form', query: { id: row.id, opt: type, type: 'SPECIAL' }})
      },
      handleDelete(item) {
        // 删除
        this.$confirm('页面删除后无法恢复，请确认是否删除？', '删除提示').then(() => {
          deleteSpecial({
            configId: item.id
          }).then(() => {
            this.$notify.success('删除成功')
            this.getList()
          })
        })
      },
      // 分页变化
      handleSizeChange(val) {
        this.listQuery.pageNo = 1
        this.listQuery.pageSize = val
        this.getList()
      },
      // 分页变化
      handleCurrentChange(val) {
        this.listQuery.pageNo = val
        this.getList()
      },
      handleSearchChange(result) {
        this.reqForm = result
        this.listQuery.pageNo = 1
        this.getList()
      },
      handleReport(item) {
        // 日志详情
        this.$router.push(`/cms/report/${item.id}?name=${item.name}`)
      }
    }
  }
</script>

<style lang="scss" scoped></style>
