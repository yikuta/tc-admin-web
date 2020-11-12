<template>
  <div class="app-container">
    <el-card class="search-bar">
      <el-row>
        <el-col :span="12">
          <p class="head-text">商品名称：{{curGoodsInfo.commodityName}}</p>
        </el-col>
        <el-col :span="12">
          <p class="head-text">商品分类：{{curGoodsInfo.baseCategoryName}}</p>
        </el-col>
      </el-row>
    </el-card>
    <el-table :data="tableData" row-key="id" header-row-class-name="table-head">
      <el-table-column v-for="(item,index) in columns" :key="index" :prop="item.prop" :label="item.label" :width="item.width"></el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
  </div>
</template>
<script>
import { reqLog, reqBaseGoodsById } from '@/api/baseGoods'
import Pagination from '@/components/Pagination'

const columns = [
  {
    label: '操作时间',
    prop: 'updateTime',
    width: 200
  },
  {
    label: '操作内容',
    prop: 'content'
  },
  {
    label: '操作人',
    prop: 'operator',
    width: 200
  }
]
export default {
  name: 'baseGoodsLog',
  components: {
    Pagination
  },
  data() {
    return {
      columns,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      goodsId: '',
      tableData: [],
      curGoodsInfo: ''
    }
  },
  mounted() {
    this.goodsId = this.$route.params.id
    this.$nextTick(() => {
      this._reqLog(this.goodsId)
      this._reqBaseGoodsById()
    })
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this._reqLog(this.goodsId)
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this._reqLog(this.goodsId)
    },
    _reqLog(id) {
      return reqLog({
        identifier: id,
        logServerType: 14, // 1: 会员 2:团长 3: 商品 4:商家商品 5:账户 6:数据字典和常量
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          let result = res.result || {}
          this.currentPage = result.pageNo
          this.totalCount = result.totalCount
          this.tableData = result.itemVOs || []
        }
      })
    },
    _reqBaseGoodsById() {
      return reqBaseGoodsById(this.goodsId).then(res => {
        if (res.code === 200) {
          this.curGoodsInfo = res.result || {}
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .head-text {
    margin: 0;
    padding: 0
  }

  .search-bar {
    margin: 0 0 20px 0;
  }
</style>

