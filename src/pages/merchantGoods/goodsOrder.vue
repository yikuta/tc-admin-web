<template>
  <div class="app-container">
    <search-area 
      :isShowTab="false" 
      @resetFields="onResetFields"
      @onSearch="onQuery">
      <search ref="search" />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <p class="tip">提示：排序是从大到小的排序，允许0-100万之间的任意整数</p>
      <table-area ref="list" :tableData="tableData" />
      <pagination 
        :current="currentPage" 
        :total="totalCount" 
        :pageSize="pageSize" 
        @onPageChange="onPageChange" 
        @onSizeChange="onSizeChange" 
        class="pagi"/>
    </content-area>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { Common, GoodsOrder } from './templates'
import searchTool from '@/utils/searchTool'
import { fetchGoodsSourceMaterial } from '@/api/merchantGoods'
export default {
  name: 'merchantGoodsOrder',
  components: { Pagination, ...Common, ...GoodsOrder },
  data() {
    return {
      contentTitle: '素材商品排序',
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: []
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!from.name) {
      next(vm => {
        vm.onSearch()
      })
    } else {
      next()
    }
  },
  activated() {
    this.onSearch()
  },
  methods: {
    onResetFields() {
      this.$refs['search'].$refs['form'].resetFields()
    },
    onPageChange(page) {
      this.currentPage = page
      this.onSearch()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.onSearch()
    },
    onQuery() {
      this.currentPage = 1
      this.onSearch()
    },
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this._reqGoodsSourceMaterialList(searchTool(req))
    },
    // ***请求处理***
    _reqGoodsSourceMaterialList(form) {
      return fetchGoodsSourceMaterial({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
        orderbys: ['sort', 'createTime'],
        sorts: ['desc', 'desc']
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          } else {
            this.tableData = []
            this.currentPage = 1
            this.totalCount = 0
          }
        })
        .catch(() => {
          this.tableData = []
          this.currentPage = 1
          this.totalCount = 0
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
}
.pagi{
  float: right;
}
.tip{
  font-size: 12px;
  margin: 0 0 20px;
  color: #999;
}
</style>
