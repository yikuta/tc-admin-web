<template>
  <div class="table-item">
    <p class="table-text">选择优惠券</p>
    <div style="width:90%">
      <el-button size='small' type="primary" style="margin-bottom:20px" @click="handleClick" icon="el-icon-plus">选择优惠券</el-button>
      <el-table header-row-class-name="table-head" :data="goodsData">
        <el-table-column prop="couponCode" label="优惠券编码" align='center' width='120'></el-table-column>
        <el-table-column prop="couponName" label="优惠券名称"></el-table-column>
        <el-table-column label="优惠券类型" width="120">
          <template slot-scope="scope">
            {{ scope.row.couponType.describe }}
          </template>
        </el-table-column>
        <el-table-column label="业务终端">
          <template slot-scope="scope">
            {{ scope.row.channelType.describe }}
          </template>
        </el-table-column>
        <el-table-column prop="availableTime" label="可用时间" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.availableTime && scope.row.availableTime.length">
              <div>{{scope.row.availableTime.split(' 至 ')[0]}}</div>
              <div>至</div>
              <div>{{scope.row.availableTime.split(' 至 ')[1]}}</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status.describe }}
          </template>
        </el-table-column>
        <el-table-column label="发放数量" width="200">
          <template slot-scope="scope">
            <el-input-number :min="1" :max="10" step-strictly v-model="scope.row.number" size="mini"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template slot-scope="scope">
            <el-link type="primary" @click="remove(scope.$index)">删除</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      title="选择优惠券"
      :visible.sync="dialogVisible"
      :close-on-click-modal='false'
      width="980px"
      :footer='null'>
      <el-form ref="form" :model="searchForm" label-width="100px" inline size="mini" class="">
        <el-form-item label="优惠券名称" class="" prop='couponName.value'>
          <el-input v-model="searchForm.couponName.value"></el-input>
        </el-form-item>
        <el-form-item label="优惠券码" prop='couponCode.value'>
          <el-input v-model="searchForm.couponCode.value"></el-input>
        </el-form-item>
        <el-form-item label="">
          <div class="search-btn">
            <el-button type="primary" size="mini" @click="onSearch">查询</el-button>
            <el-button type="default" size="mini" @click="handleReset">清空</el-button>
          </div>
        </el-form-item>
      </el-form>
      <el-table
        :data="dataList"
        stripe
        style="width: 100%"
        header-row-class-name='table-head'
      >
        <el-table-column prop="couponCode" label="优惠券编码" align='center' width='160'></el-table-column>
        <el-table-column prop="couponName" label="优惠券名称"></el-table-column>
        <el-table-column label="优惠券类型">
          <template slot-scope="scope">
            {{ scope.row.couponType.describe }}
          </template>
        </el-table-column>
        <el-table-column label="业务终端">
          <template slot-scope="scope">
            {{ scope.row.channelType.describe }}
          </template>
        </el-table-column>
        <el-table-column prop="availableTime" label="可用时间" width="180px">
          <template slot-scope="scope">
            <div v-if="scope.row.availableTime && scope.row.availableTime.length">
              <div>{{scope.row.availableTime.split(' 至 ')[0]}}</div>
              <div>至</div>
              <div>{{scope.row.availableTime.split(' 至 ')[1]}}</div>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            {{ scope.row.status.describe }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80px">
          <template v-slot:default="{ row }">
            <el-link type="primary" @click="copy(row)">选择</el-link>
          </template>
        </el-table-column>
      </el-table>
      <pagination :pagePhase='pagePhase' :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
import { reqCouponList } from '@/api/coupon'
export default {
  components: {
    Pagination
  },
  data() {
    return {
      dialogVisible: false,
      dataList: [],
      searchForm: {
        couponName: { value: '', name: 'couponName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        couponCode: { value: '', name: 'couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
        sceneType: { value: 'coupon.SceneType_6', name: 'scene.sceneType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        status: { value: 'coupon.CouponStatus_30', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM }
      },
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      pagePhase: [10, 20, 30, 50],
      goodsData: []
    }
  },
  created() {
    this.$nextTick(() => {
      // 获取商品商品列表
      this.onSearch()
    })
  },
  methods: {
    onSearch() {
      // 查询
      let req = searchTool(JSON.parse(JSON.stringify(this.searchForm)))
      this._reqCouponList(req)
    },
    // ***请求处理***
    _reqCouponList(data) {
      return reqCouponList({
        searchs: JSON.stringify(data),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.dataList = (result.itemVOs || []).map(item => {
              const { couponCode, couponName, couponType, channelType, availableTime, status } = item
              return {
                couponCode,
                couponName,
                couponType,
                channelType,
                availableTime,
                status,
                number: 1
              }
            })
          }
        })
        .catch(() => {
        })
    },
    handleClick() {
      this.dialogVisible = true
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
    copy(row) {
      let arr = this.goodsData.filter(item => item.couponCode === row.couponCode) || []
      if (arr.length) {
        arr[0].number++
      } else {
        this.goodsData.push({ ...row })
      }
      this.dialogVisible = false
    },
    handleReset() {
      this.searchForm.couponName.value = ''
      this.searchForm.couponCode.value = ''
    },
    remove(index) {
      this.goodsData.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-text{
  font-size:14px;
  line-height: 32px;
  padding: 0;
  margin: 0 20px 0 0;
}
.table-item{
  display: flex;
}
</style>
