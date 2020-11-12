<template>
  <div class="show-dialog">
    <el-dialog
    :title="type == 'depot' ? '查看店铺' : '查看商品'"
    :visible.sync="dialogVisible"
    v-if="dialogVisible"
    width="50%">
      <div class="depot" v-if="type == 'depot'">
        <span>以下门店适用</span>
        <div>
          <el-table :data="depotTableData" size="mini">
            <el-table-column prop="shopCode" align="center" label="店铺编码"></el-table-column>
            <el-table-column prop="name" align="center" label="店铺名称"></el-table-column>
            <el-table-column label="类型" align="center">
              <template slot-scope="scope">
                {{ scope.row.shopType }}
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="shopStatus">
              <template slot-scope="scope">
                <span v-show="scope.row.shopStatus==1">启用</span>
                <span v-show="scope.row.shopStatus==2">禁用</span>
                <span v-show="scope.row.shopStatus==3">销店</span>
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
        <span>以下商品适用</span>
        <el-table :data="goodsTableData" size="mini">
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
import { reqGetShopSetting, reqGetCommoditySetting } from '@/api/coupon'
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
        orderActivityCode: this.row.orderActivityCode,
        version: this.row.version
      }
      if (this.type === 'depot') {
        // 查询门店可用列表
        this._reqGetShopSetting(reqQuery)
      } else {
        // 查询商品可用列表
        this._reqGetCommoditySetting(reqQuery)
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
    _reqGetShopSetting(data) {
      return reqGetShopSetting(data).then((res) => {
        if (res.code === 200) {
          this.totalCount = res.result.length
          this.tableData = res.result
          this.depotTableData = res.result.slice(0, this.pageSize)
          this.dialogVisible = true
        }
      })
    },
    _reqGetCommoditySetting(data) {
      return reqGetCommoditySetting(data).then((res) => {
        if (res.code === 200) {
          this.totalCount = res.result.length
          this.tableData = res.result
          this.goodsTableData = res.result.slice(0, this.pageSize)
          this.dialogVisible = true
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