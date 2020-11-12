<template>
  <div class="show-dialog">
    <el-dialog
    :title="type == 'depot' ? '查看店铺' : '查看商品'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="50%">
      <div class="depot" v-if="type == 'depot'">
        <span v-if="row.shopUsableType.value == 2">以下门店适用</span>
        <span v-else-if="row.shopUsableType.value == 3">以下门店不适用</span>
        <div v-show="optionalType == 'TYPE'">
          <el-table :data="depotTableData" size="mini">
            <el-table-column prop="name" align="center" label="类型"></el-table-column>
          </el-table>
        </div>
        <div v-show="optionalType == 'AREA'">
          <el-table :data="depotTableData" size="mini">
            <el-table-column prop="provincesName" align="center" label="省"></el-table-column>
            <el-table-column prop="cityName" align="center" label="市（县）"></el-table-column>
            <el-table-column prop="districtsName" align="center" label="区（乡）"></el-table-column>
          </el-table>
        </div>
        <div v-show="optionalType == 'CODE'">
          <el-table :data="depotTableData" size="mini">
            <el-table-column prop="shopCode" align="center" label="店铺编码"></el-table-column>
            <el-table-column prop="name" align="center" label="店铺名称"></el-table-column>
            <el-table-column label="类型" align="center">
              <template slot-scope="scope">
                {{ scope.row.shopType }}
              </template>
            </el-table-column>
            <el-table-column label="店长/联系方式" align="center">
              <template slot-scope="scope">
                {{ scope.row.managerName + '/' + scope.row.managerTel }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="goods" v-else>
        <span v-if="row.commodityUsableType.value == 2">以下商品适用</span>
        <span v-else-if="row.commodityUsableType.value == 3">以下商品不适用</span>
        <el-table v-if="optionalType == 'TYPE'" :data="goodsTableData" size="mini">
          <el-table-column prop="kind1.name" align="center" label="一级分类"></el-table-column>
          <el-table-column prop="kind2.name" align="center" label="二级分类">
            <template slot-scope="scope">
              <span v-if="scope.row.kind2">{{scope.row.kind2.name}}</span>
              <span v-else>全部</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delGoods(form.commoditySelected.categoryIdList, scope.$index)">删除</el-button>
            </template>
          </el-table-column> -->
        </el-table>
        <el-table v-if="optionalType == 'CODE'" :data="goodsTableData" size="mini">
          <el-table-column prop="channelCommodityNo" align="center" label="商品编码"></el-table-column>
          <el-table-column prop="channelCommodityName" align="center" label="商品名称"></el-table-column>
          <el-table-column prop="price" align="center" label="销售价">
            <template slot-scope="scope">
              <span>￥{{scope.row.minSalePrice}}</span>
              <span>—</span>
              <span>￥{{scope.row.maxSalePrice}}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[20, 30, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount">
      </el-pagination>
      <!-- <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" /> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 认</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import { reqShopSetting, reqGoodsSetting } from '@/api/coupon'
export default {
  name: 'show-selected',
  components: {
    Pagination
  },
  // props: {
  //   showType: {
  //     type: String,
  //     default: 'depot'
  //   },
  //   item: {
  //     type: Object,
  //     default: () => {}
  //   }
  // },
  data() {
    return {
      optionalType: '',
      type: '',
      row: '',
      dialogVisible: false,
      tableData: [],
      depotTableData: [],
      goodsTableData: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0
    }
  },
  methods: {
    onSearch() {
      let reqQuery = {
        couponCode: this.row.couponCode,
        version: this.row.version
      }
      if (this.type === 'depot') {
        // 查询门店可用列表
        this._reqShopSetting(reqQuery)
      } else {
        // 查询商品可用列表
        this._reqGoodsSetting(reqQuery)
      }
    },
    getList() {
      if (this.type === 'depot') {
        this.depotTableData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      } else {
        this.goodsTableData = this.tableData.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
      }
    },
    showDialog(type, row) {
      this.type = type
      this.row = row
      this.onSearch()
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getList()
    },
    _reqShopSetting(data) {
      return reqShopSetting(data).then((res) => {
        if (res.code === 200) {
          if (res.result.shopOptionalType.value === 1) {
            this.optionalType = 'TYPE'
            this.totalCount = res.result.shopTypeList.length
            this.tableData = res.result.shopTypeList
            this.depotTableData = res.result.shopTypeList.slice(0, this.pageSize)
          } else if (res.result.shopOptionalType.value === 2) {
            this.optionalType = 'AREA'
            this.totalCount = res.result.areaList.length
            this.tableData = res.result.areaList
            this.depotTableData = res.result.areaList.slice(0, this.pageSize)
          } else if (res.result.shopOptionalType.value === 3) {
            this.optionalType = 'CODE'
            this.totalCount = res.result.shopCodeList.length
            this.tableData = res.result.shopCodeList
            this.depotTableData = res.result.shopCodeList.slice(0, this.pageSize)
          }
          this.dialogVisible = true
        } else {
          // this.$message({
          //   message: res.message,
          //   type: 'error'
          // })
        }
      })
    },
    _reqGoodsSetting(data) {
      return reqGoodsSetting(data).then((res) => {
        if (res.code === 200) {
          if (res.result.commodityOptionalType.value === 1) {
            this.optionalType = 'TYPE'
            let arr = []
            res.result.categoryList.map((item) => {
              arr.push({
                kind1: item[0],
                kind2: item[1]
              })
            })
            this.totalCount = res.result.categoryList.length
            this.tableData = arr
            this.goodsTableData = arr.slice(0, this.pageSize)
          } else if (res.result.commodityOptionalType.value === 2) {
            this.optionalType = 'CODE'
            this.totalCount = res.result.commodityList.length
            this.tableData = res.result.commodityList
            this.goodsTableData = res.result.commodityList.slice(0, this.pageSize)
          }
          this.dialogVisible = true
        } else {
          // this.$message({
          //   message: res.message,
          //   type: 'error'
          // })
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .show-dialog{
    /deep/ .cell {
      text-align: center;
    }
  }
  .pagination {
    text-align: center;
    margin-top: 8px;
  }
</style>