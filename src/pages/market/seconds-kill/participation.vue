<template>
  <div class="app-container">
    <!-- 参与记录 -->
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
        <el-form-item label="商品编码">
          <el-input v-model="form.channelCommodityNo.value" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item label="商品名称">
          <el-input v-model="form.channelCommodityName.value" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="参与账号">
          <el-input v-model="form.memberPhone.value" placeholder="请输入参与账号"></el-input>
        </el-form-item>
        <el-form-item label="参与终端">
          <el-select v-model="form.usedChannelType.value" placeholder="请选择投放终端">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option.channelType" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
        <el-button type="default" size="mini" @click="reset">清空</el-button>
      </div>
    </el-card>
    <el-table :data="tableData" size="mini">
      <el-table-column prop="channelCommodityNo" label="商品编码"></el-table-column>
      <el-table-column prop="session" label="规格">
        <template slot-scope="scope">
          <span>{{spec(scope.row.spec)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="channelCommodityName" label="商品名称"></el-table-column>
      <el-table-column prop="seckillPrice" label="秒杀价"></el-table-column>
      <el-table-column prop="salePrice" label="销售价"></el-table-column>
      <el-table-column prop="memberPhone" label="用户账号"></el-table-column>
      <el-table-column prop="tradeNum" label="交易单号"></el-table-column>
      <el-table-column prop="createTime" label="生单时间"></el-table-column>
      <el-table-column prop="usedChannelType.describe" label="参与终端"></el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
  </div>
</template>
<script>
import searchTool from '@/utils/searchTool'
import Pagination from '@/components/Pagination'
import { MatchType, DataType } from '@/constants/search'
import { reqQuerySeckillRecord } from '@/api/seckill'
export default {
  name: 'releaseManager',
  components: {
    Pagination
  },
  data() {
    return {
      form: {
        channelCommodityNo: { value: '', name: 'channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING },
        channelCommodityName: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
        usedChannelType: { value: '', name: 'usedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        day: { value: this.$route.query.day, name: 'seckillSessionDetail.day', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      option: {
        type: [
          { id: 'CouponType_1', value: '满减券' },
          { id: 'CouponType_2', value: '折扣券' }
        ],
        status: [
          { id: 'PromotionStatus_10', value: '待审核' },
          { id: 'PromotionStatus_20', value: '审核中' },
          { id: 'PromotionStatus_30', value: '已投放' },
          { id: 'PromotionStatus_40', value: '已驳回' }
        ],
        channelType: [
          // { id: 'ChannelType_1', value: '通用' },
          { id: 'ChannelType_2', value: '天呈生活APP' },
          { id: 'ChannelType_3', value: '天呈生活小程序' }
          // { id: 'ChannelType_4', value: '天呈净菜小程序' }
        ],
        work: [
          // { id: 'BusinessType_1', value: '通用' },
          { id: 'BusinessType_2', value: '快递到家' },
          // { id: 'BusinessType_3', value: '净菜' },
          { id: 'BusinessType_4', value: '爆款预售' }
          // { id: 'BusinessType_5', value: '社区超市' }
        ]
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
      this._reqQuerySeckillRecord(req)
    },
    reset() {
      this.form = {
        channelCommodityNo: { value: '', name: 'channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING },
        channelCommodityName: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.EQUAL, type: DataType.STRING },
        usedChannelType: { value: '', name: 'usedChannelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        day: { value: this.$route.query.day, name: 'seckillSessionDetail.day', matchType: MatchType.EQUAL, type: DataType.STRING }
      }
    },
    _reqQuerySeckillRecord(data) {
      return reqQuerySeckillRecord({
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
          this.tableData = result.itemVOs || []
        }
      })
    },
    spec(skuInfo) {
      let info = JSON.parse(skuInfo)
      let text = ''
      info.map((i) => {
        text += i.name
      })
      return text
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.onSearch()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.onSearch()
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