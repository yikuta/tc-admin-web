<template>
  <div class="depots">
    <el-card class="depotSelect">
      <el-tabs v-model="selectGoods" @tab-click="handleClick">
        <el-tab-pane label="可选商品" name="canAdd">
        <el-card class="search-content">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" size="mini">
          <el-form-item label="基础分类" prop="category.value">
            <el-cascader
            size="mini"
            v-model="searchForm.category.value"
            :options="options" :props="optionProps"></el-cascader>
          </el-form-item>
          <el-form-item label="商品编码" prop="code.value">
            <el-input class="input-width" v-model="searchForm.code.value" placeholder="请输入商品编码" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="name.value">
            <el-input class="input-width" v-model="searchForm.name.value" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="商品状态" prop="status.value">
            <el-select class="input-width" placeholder="请选择商品状态" v-model="searchForm.status.value" clearable>
              <el-option label="上架" value="1"></el-option>
              <el-option label="待上架" value="2"></el-option>
              <el-option label="下架" value="3"></el-option>
              <!-- <el-option label="审核中" value="4"></el-option>
              <el-option label="售罄" value="5"></el-option> -->
            </el-select>
          </el-form-item>
          </el-form>
          <div class="search-btn">
            <el-button type="primary" size="mini" @click="search">查询</el-button>
            <el-button type="primary" size="mini" @click="addGoods">批量添加</el-button>
          </div>
        </el-card>
        <el-table :data="canAddGoodsData" ref="multipleTable" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" @selection-change="handleAddGoodsChange" size="mini">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="商品编码" prop="channelCommodityNo"></el-table-column>
          <el-table-column label="商品名称" prop="channelCommodityName" width="400"></el-table-column>
          <el-table-column label="状态" prop="commodityStatus.describe"></el-table-column>
          <!-- <el-table-column label="成本价" prop="address">
            <template slot-scope="scope">
              <span>￥{{scope.row.minMarketPrice}}</span>
              <span>——</span>
              <span>￥{{scope.row.maxMarketPrice}}</span>
            </template>
          </el-table-column> -->
          <el-table-column label="销售价" prop="depotType">
            <template slot-scope="scope">
              <span>￥{{scope.row.minSalePrice}}</span>
              <span>—</span>
              <span>￥{{scope.row.maxSalePrice}}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
        </el-tab-pane>
        <el-tab-pane label="已选商品" name="added">
        <el-card class="search-content">
          <div class="search-btn">
            <el-button type="primary" size="mini" @click="delGoods">批量删除</el-button>
          </div>
        </el-card>
        <el-table :data="addedGoodsData" ref="multipleAddedTable" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" @selection-change="handleAddedGoodsChange" size="mini">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="商品编码" prop="channelCommodityNo"></el-table-column>
          <el-table-column label="商品名称" prop="channelCommodityName" width="400"></el-table-column>
          <el-table-column label="状态" prop="commodityStatus.describe"></el-table-column>
          <!-- <el-table-column label="成本价" prop="address"></el-table-column> -->
          <el-table-column label="销售价" prop="depotType">
            <template slot-scope="scope">
              <span>￥{{scope.row.minSalePrice}}</span>
              <span>—</span>
              <span>￥{{scope.row.maxSalePrice}}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
						<template slot-scope="scope">
							<el-link type="danger" @click="handleRemove(scope.$index, addedGoodsData)">删除</el-link>
						</template>
					</el-table-column>
        </el-table>
        <pagination :current="addedGoodsCurrentPage" :total="addedGoodsTotalCount" :pageSize="addedGoodsPageSize" @onPageChange="onAddedGoodsPageChange" @onSizeChange="onAddedGoodsSizeChange" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { MatchType, DataType } from '@/constants/search'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { reqGoodsList } from '@/api/coupon'
export default {
  name: 'goods',
  components: {
    Pagination
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    },
    optionProps: {
      type: Object,
      default: () => {}
    },
    form: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      selectGoods: 'canAdd',
      searchForm: {
        commodityType: { value: 1, name: 'commodityType', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        businessNo: { value: '', name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        code: { value: '', name: 'channelCommodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
        name: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        category: { value: [], name: 'channelCategoryList.id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        status: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        express: { value: '', name: 'transfee', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
        special: { value: '', name: 'special', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
        goodsType: { value: '', name: 'commodityType', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      },
      selectAddGoodsArr: [], // 可选门店选中店铺
      canAddGoodsData: [], // 可选门店,
      currentPage: 1,
      pageSize: 20,
      pagePhase: [10, 20, 30, 50],
      totalCount: 0,
      selectAddedGoodsArr: [], // 已选门店选中店铺
      addedGoodsData: [], // 已选门店
      addedGoodsCurrentPage: 1,
      addedGoodsPageSize: 20,
      addedGoodsTotalCount: 0
    }
  },
  mounted() {
    if (this.selected.length) {
      this.selectGoods = 'added'
    }
    this.addedGoodsData = this.selected
  },
  methods: {
    search() {
      // 查询
      if (this.form.businessType === 'PRE_SALE') {
        this.searchForm.businessNo.value = 2
      } else if (this.form.businessType === 'LOGISTICS') {
        this.searchForm.businessNo.value = 1
      }
      const req = JSON.parse(JSON.stringify(this.searchForm))
      if (req.category && req.category.value && req.category.value.length) {
        const count = req.category.value.length
        if (count === 1) {
          req.category.name += '.parent'
        }
        req.category.value = req.category.value.pop()
      } else {
        delete req.category
      }
      this._reqGoodsList(searchTool(req))
    },
    handleAddGoodsChange(val) {
      // 选择添加门店
      this.selectAddGoodsArr = val
    },
    addGoods() {
      // 批量添加
      if (this.selectAddGoodsArr.length === 0) {
        this.$message({
          message: '至少选中一个商品',
          type: 'error'
        })
        return false
      }
      let selected = JSON.parse(JSON.stringify(this.addedGoodsData.concat(this.selectAddGoodsArr)))
      let obj = {}
      this.addedGoodsData = selected.reduce((cur, next) => {
        obj[next.channelCommodityNo] ? '' : obj[next.channelCommodityNo] = true && cur.push(next)
        return cur
      }, []) // 去重
      this.$emit('on-select-goods', this.addedGoodsData)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      this.addedGoodsTotalCount = this.addedGoodsData.length
      this.selectGoods = 'added'
    },
    handleAddedGoodsChange(val) {
      // 选择已选门店
      this.selectAddedGoodsArr = val
    },
    delGoods() {
      // 批量删除
      // let arr = JSON.parse(JSON.stringify(this.addedGoodsData))
      this.selectAddedGoodsArr.map((del) => {
        this.addedGoodsData.map((added, index) => {
          if (added.channelCommodityNo === del.channelCommodityNo) {
            this.addedGoodsData.splice(index, 1)
          }
        })
      })
      // this.addedGoodsData = arr
      this.selectAddGoodsArr = JSON.parse(JSON.stringify(this.addedGoodsData))
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.addedGoodsTotalCount = this.addedGoodsData.length
      this.$emit('on-select-goods', this.addedGoodsData)
    },
    handleRemove(index, rows) {
      // 移除一个
      rows.splice(index, 1)
      this.addedGoodsTotalCount = this.addedGoodsData.length
      this.$emit('on-select-goods', this.addedGoodsData)
    },
    onPageChange(page) {
      this.currentPage = page
      this.search()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.search()
    },
    onAddedGoodsPageChange(page) {
      this.addedGoodsCurrentPage = page
    },
    onAddedGoodsSizeChange(size) {
      this.addedGoodsPageSize = size
      this.addedGoodsCurrentPage = 1
    },
    handleClick(tab) {
      if (tab.name === 'canAdd') {
        // this.addedDepotData.map((row) => {
        //   debugger
        //   this.$refs.multipleTable.toggleRowSelection(row)
        // })
        this.$refs.multipleTable.clearSelection()
      } else {
        this.$refs.multipleAddedTable.clearSelection()
      }
    },
    // ***请求处理***
    _reqGoodsList(form) {
      return reqGoodsList({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.canAddGoodsData = result.itemVOs || []
          } else {
            this.canAddGoodsData = []
            this.currentPage = 1
            this.totalCount = 0
            this.$message.error(res.message || '服务器错误，请联系管理员')
          }
        })
        .catch(() => {
          this.canAddGoodsData = []
          this.currentPage = 1
          this.totalCount = 0
        })
    }
  }
}
</script>
<style scoped lang="scss">
.input-width {
  width: 200px;
}
.depotSelect {
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 33%;
      .el-select {
        width: 100%;
      }
    }
  }
  /deep/ .el-dialog__body{
    padding: 0 20px;
    .el-card__body {
      padding: 10px 20px;
    }
    .pagination {
      padding: 10px 0 0;
    }
  }
  .search-btn {
    text-align: right;
  }
}
</style>