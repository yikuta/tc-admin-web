<template>
  <div class="app-container">
    <!-- 场次详情 -->
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
        <el-form-item label="所属业务">
          <el-select v-model="form.businessType.value" placeholder="请选择投放业务">
            <el-option label="全部" value=""></el-option>
            <el-option label="快递到家" value="BussinessType_2"></el-option>
            <el-option label="爆品预售" value="BussinessType_4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品编码">
          <el-input v-model="form.sourceCode.value" placeholder="请输入商品编码"></el-input>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
        <el-button type="default" size="mini" @click="reset">清空</el-button>
      </div>
    </el-card>

    <el-table :data="tableData" row-key="id" size="mini" :tree-props="{children: 'commoditySkuSettings', hasChildren: 'hasChildren'}">
      <el-table-column prop="channelCommodityNo" label="商品编码"></el-table-column>
      <el-table-column prop="specs" label="规格">
        <template slot-scope="scope">
          <span v-if="!scope.row.specs">——</span>
          <span v-else type="text">{{scope.row.specs}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="channelCommodityName" label="商品名称"></el-table-column>
      <el-table-column prop="salePrice" label="销售价"></el-table-column>
      <el-table-column prop="stock" label="可用库存">
        <template slot-scope="scope">
          <span v-if="!scope.row.stock">——</span>
          <span v-else type="text">{{scope.row.stock}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="limitNum" label="秒杀限量">
        <template slot-scope="scope">
          <span v-if="!scope.row.limitNum">——</span>
          <span v-else type="text">{{scope.row.limitNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="singleUserLimitNum" label="单用户限购">
        <template slot-scope="scope">
          <span v-if="!scope.row.singleUserLimitNum">——</span>
          <span v-else type="text">{{scope.row.singleUserLimitNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sellNum" label="已售数量">
        <template slot-scope="scope">
          <span v-if="!scope.row.sellNum">——</span>
          <span v-else type="text">{{scope.row.sellNum}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="seckillPrice" label="秒杀价">
        <template slot-scope="scope">
          <span v-if="!scope.row.seckillPrice">——</span>
          <span v-else type="text">{{scope.row.seckillPrice}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="del(row)" v-np="'SEC_KILL_SESSION_PRODUCT_REMOVE'">移除</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>
<script>
import searchTool from '@/utils/searchTool'
import Pagination from '@/components/Pagination'
import { MatchType, DataType } from '@/constants/search'
import { reqQuerySessionCommodity, deleteCommodity, deleteCommoditySku } from '@/api/seckill'
export default {
  name: 'sessionManager',
  components: {
    Pagination
  },
  data() {
    return {
      form: {
        businessType: { value: '', name: 'bussinessType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        // channelType: { value: 'ChannelType_' + this.$route.query.channelType, name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        sourceCode: { value: '', name: 'channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING },
        seckillSessionCode: { value: this.$route.query.seckillSessionCode, name: 'seckillSessionDetail.seckillSessionCode', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 获取商品商品列表
      this.onSearch()
    })
  },
  methods: {
    onSearch() {
      // 查询
      let req = searchTool(JSON.parse(JSON.stringify(this.form)))
      this._reqQuerySessionCommodity(req)
    },
    reset() {
      this.form = {
        businessType: { value: '', name: 'bussinessType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        // channelType: { value: 'ChannelType_' + this.$route.query.channelType, name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        sourceCode: { value: '', name: 'channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING },
        seckillSessionCode: { value: this.$route.query.seckillSessionCode, name: 'seckillSessionDetail.seckillSessionCode', matchType: MatchType.EQUAL, type: DataType.STRING }
      }
    },
    del(row) {
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      }).then(() => {
        // 执行提交审核请求
        if (row.genre === 'goods') {
          this._deleteCommodity(row.seckillSessionCommodityId)
        } else if (row.genre === 'sku') {
          this._deleteCommoditySku(row.seckillSessionCommoditySkuId)
        }
      })
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.onSearch()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.onSearch()
    },
    _deleteCommodity(id) {
      return deleteCommodity(id).then((res) => {
        if (res.code === 200) {
          this.onSearch()
        }
      })
    },
    _deleteCommoditySku(id) {
      return deleteCommoditySku(id).then((res) => {
        if (res.code === 200) {
          this.onSearch()
        }
      })
    },
    _reqQuerySessionCommodity(data) {
      return reqQuerySessionCommodity({
        searchs: JSON.stringify(data),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      }).then((res) => {
        if (res.code === 200) {
          let result = res.result || {}
          this.currentPage = result.pageNo
          this.totalCount = result.totalCount
          let itemVOs = result.itemVOs || []
          itemVOs.map((item) => {
            item.id = item.channelCommodityId
            item.genre = 'goods'
            item.commoditySkuSettings.map((sku) => {
              let info = JSON.parse(sku.spec)
              let text = ''
              info.map((i) => {
                text += i.name
              })
              sku.specs = text
              sku.genre = 'sku'
            })
          })
          this.tableData = itemVOs
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.search-content{
  /deep/ .el-form{display: flex;flex-wrap: wrap;
    .el-form-item{width:33%;
      .el-select{width:100%;}
    }
  }
  .search-btn{text-align: right;}
}
</style>