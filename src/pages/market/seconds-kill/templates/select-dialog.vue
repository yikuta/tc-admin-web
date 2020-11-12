<template>
  <div>
    <el-dialog title="选择商品" :visible.sync="dialogVisible" :before-close="dialogBeforeClose" width="85%">
      <el-tabs v-model="selectGoods" @tab-click="handleClick">
        <el-tab-pane label="可选商品" name="canAdd">
          <el-card class="search-content">
            <el-form ref="searchForm" :model="searchForm" label-width="100px" size="mini">
              <el-form-item label="基础分类" prop="category.value">
                <el-cascader
                size="mini"
                clearable
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
                  <el-option label="全部" value=""></el-option>
                  <el-option label="上架" value="1"></el-option>
                  <el-option label="待上架" value="2"></el-option>
                  <el-option label="下架" value="3"></el-option>
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
            <el-table-column label="是否地推" prop="offLine">
              <template slot-scope="scope">
                <span>{{scope.row.offLine ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="销售价" prop="salePrice"></el-table-column>
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
            <el-table-column label="是否地推" prop="offLine">
              <template slot-scope="scope">
                <span>{{scope.row.offLine ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status"></el-table-column>
            <el-table-column label="销售价" prop="salePrice"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-link type="danger" @click="handleRemove(scope.$index, addedGoodsData)">删除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <!-- <pagination :current="addedGoodsCurrentPage" :total="addedGoodsTotalCount" :pageSize="addedGoodsPageSize" @onPageChange="onAddedGoodsPageChange" @onSizeChange="onAddedGoodsSizeChange" /> -->
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="save">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { MatchType, DataType } from '@/constants/search'
import searchTool from '@/utils/searchTool'
import { reqCategoryAll } from '@/api/coupon'
import { reqGoodsList } from '@/api/coupon'
import Pagination from '@/components/Pagination'
export default {
  name: 'select-dialog',
  components: {
    Pagination
  },
  props: {
    dialogVisible: {
      type: Boolean,
      default: true
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      // dialogVisible: false,
      selectGoods: 'canAdd',
      searchForm: {
        businessType: { value: '', name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        commodityType: { value: 1, name: 'commodityType', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        code: { value: '', name: 'channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING },
        name: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        category: { value: [], name: 'channelCategoryList.id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        status: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        express: { value: '', name: 'transfee', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
        special: { value: '', name: 'special', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
      },
      businessType: 'LOGISTICS',
      pre_sale: [],
      logistics: [],
      options: [],
      optionProps: {
        checkStrictly: true,
        value: 'id',
        label: 'name',
        children: 'children'
      },
      selectAddGoodsArr: [], // 可选商品选中商品
      canAddGoodsData: [], // 可选商品,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      selectAddedGoodsArr: [], // 已选商品选中商品
      addedGoodsData: [], // 已选商品
      addedGoodsCurrentPage: 1,
      addedGoodsPageSize: 20,
      addedGoodsTotalCount: 0
    }
  },
  mounted() {
    this._reqCategoryAllOne()
    this._reqCategoryAllTwo()
  },
  methods: {
    save() {
      // 保存已选商品
      if (this.addedGoodsData.length === 0) {
        this.$message({
          message: '请添加至少一条商品',
          type: 'error'
        })
        return false
      }
      this.$emit('on-save-goods', this.addedGoodsData)
      this.dialogBeforeClose()
    },
    showDialog() {
      this.$nextTick(() => {
        this.addedGoodsData = JSON.parse(JSON.stringify(this.selected))
      })
    },
    cancel() {
      this.dialogBeforeClose()
    },
    dialogBeforeClose() {
      this.$emit('on-close-dialog')
    },
    search() {
      // 2
      if (this.businessType === 'LOGISTICS') {
        this.searchForm.businessType = { value: 1, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      } else {
        this.searchForm.businessType = { value: 2, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
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
    businessTypeSet(type) {
      // 适用业务改变时，商品分类改变
      this.businessType = type
      if (type === 'PRE_SALE') {
        this.options = this.pre_sale
      } else {
        this.options = this.logistics
      }
    },
    handleAddGoodsChange(val) {
      this.selectAddGoodsArr = val
    },
    addGoods() {
      if (this.selectAddGoodsArr.length === 0) {
        this.$message({
          message: '请添加至少一条商品',
          type: 'error'
        })
        return false
      }
      // 1
      let selected = JSON.parse(JSON.stringify(this.addedGoodsData.concat(this.selectAddGoodsArr)))
      let obj = {}
      this.addedGoodsData = selected.reduce((cur, next) => {
        obj[next.channelCommodityNo] ? '' : obj[next.channelCommodityNo] = true && cur.push(next)
        return cur
      }, []) // 去重
      // this.$emit('on-select-goods', this.addedGoodsData)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      this.selectGoods = 'added'
    },
    handleAddedGoodsChange(val) {
      // 选择已选门店
      this.selectAddedGoodsArr = val
    },
    delGoods() {
      // 批量删除
      if (this.selectAddedGoodsArr.length === 0) {
        this.$message({
          message: '请添加至少一条商品',
          type: 'error'
        })
        return false
      }
      // let arr = []
      this.selectAddedGoodsArr.map((del) => {
        this.addedGoodsData.map((added, index) => {
          if (added.channelCommodityNo === del.channelCommodityNo) {
            // arr.push(added)
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
      // this.$emit('on-select-goods', this.addedGoodsData)
    },
    handleRemove(index, rows) {
      // 移除一个
      rows.splice(index, 1)
      // this.$emit('on-select-goods', this.addedGoodsData)
    },
    handleClick(tab) {
      if (tab.name === 'canAdd') {
        this.$refs.multipleTable.clearSelection()
      } else {
        this.$refs.multipleAddedTable.clearSelection()
      }
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
    _reqCategoryAllOne() {
      return reqCategoryAll({
        channelCommodityType: 1
      })
        .then(res => {
          if (res.code === 200) {
            this.logistics = res.result
            this.options = this.logistics
          }
        })
    },
    _reqCategoryAllTwo() {
      return reqCategoryAll({
        channelCommodityType: 2
      })
        .then(res => {
          if (res.code === 200) {
            this.pre_sale = res.result
          }
        })
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
            let dataList = result.itemVOs || []
            if (dataList.length === 0) {
              this.canAddGoodsData = []
              return false
            }
            let goods = []
            dataList.map((item) => {
              let skulist = []
              item.channelCommoditySpecificationList.map((sku) => {
                let info = JSON.parse(sku.skuInfo)
                if (info) {
                  let text = ''
                  info.map((i) => {
                    text += i.name
                  })
                  skulist.push({
                    id: sku.id,
                    channelSkuId: sku.id,
                    channelSkuNo: sku.skuNo,
                    spec: text,
                    channelCommodityName: item.channelCommodityName,
                    salePrice: sku.salePrice,
                    stock: sku.stock,
                    status: item.commodityStatus.describe,
                    seckillPrice: '',
                    skuInfo: sku.skuInfo,
                    limitNum: '',
                    singleUserLimitNum: null
                  })
                }
              })
              if (skulist.length) {
                goods.push({
                  id: item.id,
                  channelCommodityNo: item.channelCommodityNo,
                  channelCommodityId: item.id,
                  spec: '',
                  channelCommodityName: item.channelCommodityName,
                  salePrice: '' + item.minSalePrice + '——' + item.maxSalePrice,
                  stock: item.availableStock,
                  status: item.commodityStatus.describe,
                  seckillPrice: '',
                  limitNum: '',
                  singleUserLimitNum: null,
                  commoditySkuSettings: skulist,
                  offLine: item.channelCommoditySub.offLine
                })
              }
            })
            this.canAddGoodsData = goods
          }
        })
    }
  }
}
</script>
<style scoped lang="scss">
/deep/ .el-form {
  display: flex;
  flex-wrap: wrap;
  .el-form-item {
    width: 33%;
  }
}
/deep/ .input-width {
  width: 200px;
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
</style>