<template>
  <div class="depots">
    <el-card class="depotSelect">
      <el-tabs v-model="selectDepot" @tab-click="handleClick">
        <el-tab-pane label="可选门店" name="canAdd">
        <el-card class="search-content">
          <el-form ref="searchForm" :model="searchForm" label-width="100px" size="mini">
            <el-form-item label="门店编号">
              <el-input class="input-width" v-model="searchForm.shopCode.value" placeholder="请输入商品编码" clearable></el-input>
            </el-form-item>
            <el-form-item label="门店名称">
              <el-input class="input-width" v-model="searchForm.name.value" placeholder="请输入商品名称" clearable></el-input>
            </el-form-item>
            <el-form-item label="门店类型">
              <el-select class="input-width" v-model="searchForm.type.value" clearable>
                <el-option v-for="item of putOnStatusOptions" :key="item.key" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="门店区域">
              <el-cascader
              size="mini"
              v-model="searchForm.area.value"
              :options="options" :props="optionProps"></el-cascader>
            </el-form-item>
          </el-form>
          <div class="search-btn">
            <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
            <el-button type="primary" size="mini" @click="addDepot">批量添加</el-button>
          </div>
        </el-card>
        <el-table :data="canAddDepotData" ref="multipleTable" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" @selection-change="handleAddDepotChange" size="mini">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="门店编号" prop="shopCode"></el-table-column>
          <el-table-column label="门店名称" prop="name"></el-table-column>
          <el-table-column label="省市区" prop="area">
            <template slot-scope="scope">
							<span>{{scope.row.provinceName}}</span>
							<span>{{scope.row.cityName}}</span>
							<span>{{scope.row.districtName}}</span>
						</template>
          </el-table-column>
          <el-table-column label="详细地址" prop="address"></el-table-column>
          <el-table-column label="状态" prop="shopStatus">
            <template slot-scope="scope">
							<span v-show="scope.row.shopStatus==1">启用</span>
							<span v-show="scope.row.shopStatus==2">禁用</span>
							<span v-show="scope.row.shopStatus==3">销店</span>
						</template>
          </el-table-column>
          <el-table-column label="类型" prop="shopType">
            <template slot-scope="scope">
              <span v-if="scope.row.shopTypeValue">{{scope.row.shopTypeValue}}</span>
              <span v-else>{{scope.row.shopType}}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
        </el-tab-pane>
        <el-tab-pane label="已选门店" name="added">
        <el-card class="search-content">
          <div class="search-btn">
            <el-button type="primary" size="mini" @click="delDepot">批量删除</el-button>
          </div>
        </el-card>
        <el-table :data="addedDepotData" ref="multipleAddedTable" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" @selection-change="handleAddedDepotChange" size="mini">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column label="门店编号" prop="shopCode"></el-table-column>
          <el-table-column label="门店名称" prop="name"></el-table-column>
          <el-table-column label="省市区" prop="area">
            <template slot-scope="scope">
							<span>{{scope.row.provinceName}}</span>
							<span>/{{scope.row.cityName}}</span>
							<span>/{{scope.row.districtName}}</span>
						</template>
          </el-table-column>
          <el-table-column label="详细地址" prop="address"></el-table-column>
          <el-table-column label="状态" prop="shopStatus">
            <template slot-scope="scope">
							<span v-show="scope.row.shopStatus==1">启用</span>
							<span v-show="scope.row.shopStatus==2">禁用</span>
							<span v-show="scope.row.shopStatus==3">销店</span>
						</template>
          </el-table-column>
          <el-table-column label="类型" prop="shopType">
            <template slot-scope="scope">
              <span v-if="scope.row.shopTypeValue">{{scope.row.shopTypeValue}}</span>
              <span v-else>{{scope.row.shopType}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
						<template slot-scope="scope">
							<el-link type="danger" @click="handleRemove(scope.$index, addedDepotData)">删除</el-link>
						</template>
					</el-table-column> -->
        </el-table>
        <pagination :current="addedDepotCurrentPage" :total="addedDepotTotalCount" :pageSize="addedDepotPageSize" @onPageChange="onAddedDepotPageChange" @onSizeChange="onAddedDepotSizeChange" />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>
<script>
import { MatchType, DataType } from '@/constants/search'
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { reqShopList } from '@/api/seller'
export default {
  name: 'depots',
  components: {
    Pagination
  },
  props: {
    options: {
      type: Array,
      default: () => []
    },
    optionProps: {
      type: Object,
      default: () => {}
    },
    putOnStatusOptions: {
      type: Array,
      default: () => []
    },
    selected: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      selectDepot: 'canAdd',
      searchForm: {
        enterStatus: { value: '1', name: 'enterStatus', matchType: MatchType.EQUAL, type: DataType.STRING },
        type: { value: '', name: 'shopType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
        shopCode: { value: '', name: 'shopCode', matchType: MatchType.EQUAL, type: DataType.STRING },
        area: { value: [], name: 'area', matchType: MatchType.EQUAL, type: DataType.LONG },
        provinceId: { value: '', name: 'provinceId', matchType: MatchType.EQUAL, type: DataType.LONG },
        cityId: { value: '', name: 'cityId', matchType: MatchType.EQUAL, type: DataType.LONG },
        districtId: { value: '', name: 'districtId', matchType: MatchType.EQUAL, type: DataType.LONG }
      },
      selectAddDepotArr: [], // 可选门店选中店铺
      canAddDepotData: [], // 可选门店,
      currentPage: 1,
      pageSize: 20,
      pagePhase: [10, 20, 30, 50],
      totalCount: 0,
      selectAddedDepotArr: [], // 已选门店选中店铺
      addedDepotData: [], // 已选门店
      addedDepotCurrentPage: 1,
      addedDepotPageSize: 20,
      addedDepotTotalCount: 0
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   this.submitQuery()
    // })
    if (this.selected.length) {
      this.selectDepot = 'added'
    }
    this.addedDepotData = this.selected
  },
  methods: {
    submitQuery() {
      // 查询
      const req = JSON.parse(JSON.stringify(this.searchForm))
      if (req.area.value[0]) {
        req.provinceId.value = req.area.value[0]
      }
      if (req.area.value[1]) {
        req.cityId.value = req.area.value[1]
      }
      if (req.area.value[2]) {
        req.districtId.value = req.area.value[2]
      }
      delete req.area
      this._reqShopList(searchTool(req))
    },
    handleAddDepotChange(val) {
      // 选择添加门店
      this.selectAddDepotArr = val
    },
    addDepot() {
      // 批量添加
      if (this.selectAddDepotArr.length === 0) {
        this.$message({
          message: '至少选中一个门店',
          type: 'error'
        })
        return false
      }
      let selected = JSON.parse(JSON.stringify(this.addedDepotData.concat(this.selectAddDepotArr)))
      let obj = {}
      this.addedDepotData = selected.reduce((cur, next) => {
        obj[next.shopCode] ? '' : obj[next.shopCode] = true && cur.push(next)
        return cur
      }, []) // 去重
      this.$emit('on-select-depots', this.addedDepotData)
      this.$message({
        message: '添加成功',
        type: 'success'
      })
      this.addedDepotTotalCount = this.addedDepotData.length
      this.selectDepot = 'added'
    },
    handleAddedDepotChange(val) {
      // 选择已选门店
      this.selectAddedDepotArr = val
    },
    delDepot() {
      // 批量删除
      let arr = JSON.parse(JSON.stringify(this.addedDepotData))
      this.addedDepotData.map((added, index) => {
        this.selectAddedDepotArr.map((del) => {
          if (added.shopCode === del.shopCode) {
            arr.splice(index, 1)
          }
        })
      })
      this.addedDepotData = arr
      this.selectAddDepotArr = arr
      this.$message({
        message: '删除成功',
        type: 'success'
      })
      this.addedDepotTotalCount = this.addedDepotData.length
      this.$emit('on-select-depots', this.addedDepotData)
    },
    handleRemove(index, rows) {
      // 移除一个
      rows.splice(index, 1)
      this.addedDepotTotalCount = this.addedDepotData.length
      this.$emit('on-select-depots', this.addedDepotData)
    },
    onPageChange(page) {
      this.currentPage = page
      this.submitQuery()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.submitQuery()
    },
    onAddedDepotPageChange(page) {
      this.addedDepotCurrentPage = page
    },
    onAddedDepotSizeChange(size) {
      this.addedDepotPageSize = size
      this.addedDepotCurrentPage = 1
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
    _reqShopList(form) {
      return reqShopList({
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
            this.canAddDepotData = result.itemVOs || []
          } else {
            this.canAddDepotData = []
            this.currentPage = 1
            this.totalCount = 0
            this.$message.error(res.message || '服务器错误，请联系管理员')
          }
        })
        .catch(() => {
          this.canAddDepotData = []
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