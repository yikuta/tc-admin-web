<template>
  <div class="app-container">
    <search-card :params="form" @query="handleQueryModules" />
    <module-table :tables="tableData" @set-enable="handleEnable" @action-delete="handleDelete" :businessNo="businessNo" />
    <pagination :current="listQuery.pageNo" :total="listQuery.totalCount" :pageSize="listQuery.pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
  </div>
</template>

<script>
  import SearchCard from './templates/SearchCard'
  import ModuleTable from './templates/ModuleTable'
  import Pagination from '@/components/Pagination'
  import { reqModuleList, reqUpdateModule, reqDeleteModule } from '@/api/mallGoods'
  import { MatchType, DataType } from '@/constants/search'
  import searchTool from '@/utils/searchTool'

  export default {
    name: 'commonModule',
    components: {
      SearchCard,
      ModuleTable,
      Pagination
    },
    props: {
      businessNo: {
        type: Number,
        default: 1
      }
    },
    data() {
      return {
        tableData: [],
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0
        },
        form: {
          name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
          status: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
          businessNo: { value: 1, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
        }
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.form.businessNo.value = this.businessNo
        this.getList()
      })
    },
    methods: {
      getList() {
        reqModuleList({
          searchs: JSON.stringify(searchTool(this.form)),
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }).then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.listQuery.pageNo = result.pageNo
            this.listQuery.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          }
        }).catch(() => {})
      },
      onPageChange(page) {
        // 页面切换
        this.tableData.pageNo = page
        this.getList()
      },
      onSizeChange(size) {
        // 页面大小切换
        this.tableData.pageSize = size
        this.tableData.pageNo = 1
        this.getList()
      },
      handleQueryModules() {
        // 检索
        this.tableData.pageNo = 1
        this.getList()
      },
      handleEnable(row) {
        const h = this.$createElement
        this.$msgbox({
          title: row.enable ? '停用确认' : '启用模块',
          message: h('p', null, row.enable ? '模块启用后将允许在发布商城商品或套餐时引用该模块，确定要启用吗？' : '模块停用后已引用该模块的商品将不会再展示该模块的内容，确定要停用吗？'),
          showCancelButton: true,
          confirmButtonText: row.enable ? '确定停用' : '确定启用',
          cancelButtonText: '我再想想',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              this._reqUpdateModule(row)
                .then(() => {
                  done()
                })
                .finally(() => (instance.confirmButtonLoading = false))
            } else {
              done()
            }
          }
        }).catch(() => {})
      },
      handleDelete(row) {
        this._reqDeleteModule(row)
      },
      // 网络请求
      /**
       * @description: 查询模块列表
       */
      _reqModuleList(data) {
        return reqModuleList({
          searchs: JSON.stringify(data),
          pageNo: this.tableData.pageNo,
          pageSize: this.tableData.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        })
          .then(res => {
            if (res.code === 200) {
              let result = res.result || {}
              this.tableData.pageNo = result.pageNo
              this.tableData.data_total = result.totalCount
              this.tableData.data = result.itemVOs || []
            }
          })
          .catch(() => {})
      },
      /**
       * @description: 启用/停用
       */
      _reqUpdateModule(row) {
        return reqUpdateModule({ enable: !row.enable, id: row.id, businessNo: this.form.businessNo.value })
          .then(res => {
            if (res.code === 200) {
              this.$notify.success(`${row.enable ? '停用' : '启用'}成功`)
              this.getList()
            }
          })
          .catch(() => {})
      },
      /**
       * @description: 删除模块
       */
      _reqDeleteModule(row) {
        return reqDeleteModule(row.id)
          .then(res => {
            if (res.code === 200) {
              this.$notify.success('删除成功')
              this.getList()
            }
          })
          .catch(() => {})
      },
      reset() {
        this.tableData = []
        this.listQuery = {
          pageNo: 1,
          pageSize: 10,
          totalCount: 0
        }
        this.form = {
          name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
          status: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
          businessNo: { value: 1, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
        }
      }
    }
  }
</script>

<style lang='scss' scoped>
</style>
