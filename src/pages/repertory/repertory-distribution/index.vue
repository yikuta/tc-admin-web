<template>
  <div class="app-main">
    <div class="wrapper">
      <el-card>
        <search-card @query="handleQueryStock" />
      </el-card>
    </div>
    <div class="wrapper" style="overflow:hidden">
      <!-- <el-card style="float:left;width:160px" class="alter-side">
        <tab-side :sideList='sideList' @update='handleTabChange'/>
      </el-card> -->
      <el-card>
        <table-list
          :tableData='tableData'
          :loading='loading'
          :totalCount='totalCount'
        />
      </el-card>
    </div>
  </div>
</template>
<script>
import SearchCard from './components/SearchCard.vue'
import TableList from './components/TableList'
import Pagination from '@/components/Pagination'
import { fetchStockList } from '@/api/repertory'
import searchTool from '@/utils/searchTool'
export default {
  name: 'repertoryDistribution',
  components: {
    SearchCard,
    TableList,
    Pagination
  },
  data() {
    return {
      tableData: [],
      totalCount: 0,
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
    handleStockList() {
      this.loading = true
      fetchStockList({
        orderby: 'commodityStockType',
        sort: 'desc',
        searchs: JSON.stringify(this.queryForm)
      }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.tableData = res.result || []
          this.totalCount = res.result.stockCount
        } else {
          this.tableData = []
          this.totalCount = 0
        }
      }).catch(() => {
        this.loading = false
      })
    },
    handleQueryStock(form) {
      this.queryForm = searchTool(form)
      this.commodityNo = form.commodityNo.value
      this.handleStockList()
    },
    handleTabChange(id) {
      this.queryForm.forEach(item => {
        if (item.propertyName === 'skuNo') {
          item.propertyValue1 = id
        }
      })
      this.handleStockList()
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