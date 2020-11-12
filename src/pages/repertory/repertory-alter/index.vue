<template>
  <div class="app-main">
    <div class="wrapper">
      <el-card>
        <search-card @query="handleQueryStock" />
      </el-card>
    </div>
    <div class="wrapper" style="overflow:hidden">
      <el-card style="float:left;width:160px" class="alter-side">
        <tab-side :sideList='sideList' @update='handleTabChange'/>
      </el-card>
      <el-card>
        <table-list
          :tableData='tableData'
          :loading='loading'
        />
        <pagination
          :current="tableData.pageNo"
          :total="tableData.total"
          :page-size='tableData.pageSize'
          @onPageChange='handlePageChange'
          @onSizeChange='handleSizeChange'
          v-if="tableData.data.length>0"
        />
      </el-card>
    </div>
  </div>
</template>
<script>
import SearchCard from './components/SearchCard.vue'
import TableList from './components/TableList'
import TabSide from '../components/TabSide'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
import { fetchStockChangeLog, fetchStockSku } from '@/api/repertory'
export default {
  name: 'repertoryAlter',
  components: {
    SearchCard,
    TableList,
    TabSide,
    Pagination
  },
  data() {
    return {
      tableData: {
        pageSize: 20,
        pageNo: 1,
        total: 0,
        data: []
      },
      queryForm: [],
      loading: false,
      sideList: [],
      commodityNo: ''
    }
  },
  methods: {
    /**
     * @description: 获取库存列表
     */
    handleStockChangeLogList() {
      const { pageNo, pageSize } = this.tableData
      this.loading = true
      fetchStockChangeLog({
        pageNo,
        pageSize,
        // distinct: true, // 去重
        orderby: 'createTime',
        sort: 'desc',
        searchs: JSON.stringify(this.queryForm)
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.tableData.data = res.result.itemVOs
          this.tableData.total = res.result.totalCount
        } else {
          this.tableData.data = []
          this.tableData.total = 0
        }
      })
    },
    handleStockSkuList() {
      fetchStockSku({ commodityNo: this.commodityNo }).then(res => {
        if (res.code === 200) {
          if (res.result && res.result.length > 0) {
            this.sideList = res.result.map(item => {
              let str = ''
              if (item.specificationValue) {
                let arr = JSON.parse(item.specificationValue) || []
                arr.forEach(item => {
                  str += item.name + ' '
                })
              }
              return {
                id: item.skuNo,
                name: str
              }
            })
            let sockChangeSourceForm = {
              skuNo: { value: res.result[0].skuNo, name: 'skuNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
            }
            this.queryForm = this.queryForm.concat(searchTool(sockChangeSourceForm))
            this.handleStockChangeLogList()
          } else {
            this.sideList = []
            this.tableData.data = []
            this.tableData.total = 0
          }
        }
      })
    },
    handleQueryStock(form) {
      this.tableData.pageNo = 1
      this.queryForm = searchTool(form)
      this.commodityNo = form.commodityNo.value
      this.handleStockSkuList()
    },
    handlePageChange(page) {
      this.tableData.pageNo = page
      this.handleStockChangeLogList()
    },
    handleSizeChange(size) {
      this.tableData.pageNo = 1
      this.tableData.pageSize = size
      this.handleStockChangeLogList()
    },
    handleTabChange(id) {
      this.tableData.pageNo = 1
      this.queryForm.forEach(item => {
        if (item.propertyName === 'skuNo') {
          item.propertyValue1 = id
        }
      })
      this.handleStockChangeLogList()
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
    margin: 10px;
}
.alter-side{
  float:left;
  width:calc(100% - 160px);
  /deep/ .el-card__body{
    padding: 0;
  }
}
</style>