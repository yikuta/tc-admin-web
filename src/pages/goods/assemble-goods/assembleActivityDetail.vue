<template>
  <div class="app-container">
    <el-row class="title">活动信息</el-row>
    <el-row class="content">
      <el-col :span="24">活动名称：{{detail.activityName}}</el-col>
      <el-col :span="24">拼团城市：{{detail.city}}</el-col>
      <el-col :span="24">活动类型：{{detail.groupActivityType | statusDescrible}}</el-col>
      <el-col :span="24">拼团时间：{{ detail['activityStartTime'] | format('yyyy-MM-dd HH:mm:ss')}}至{{ detail['activityEndTime'] | format('yyyy-MM-dd HH:mm:ss') }}</el-col>
      <el-col :span="24">提货时间：{{ detail['cutoff']?`截单后第${detail['extractDay']}天`:`活动结束后第${detail['extractDay']}天`}}</el-col>
      <el-col :span="24">开团类型：{{detail.groupActivityRegimentalType | statusDescrible}}</el-col>
    </el-row>
    <el-row class="title" v-if="detail.groupActivityRegimentalType.value !== 1">活动团长</el-row>
    <el-row v-if="detail.groupActivityRegimentalType.value !== 1">
      <el-col :span="24">
        <el-table :data="detail.itemVOs.colonelList" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
          <el-table-column label="团长编号" prop="id"></el-table-column>
          <el-table-column label="团长账号" prop="phoneNumber"></el-table-column>
          <el-table-column label="团长姓名" prop="name"></el-table-column>
          <el-table-column label="所属区域">
            <template v-slot:default="{row}">{{`${row.province}${row.city}${row.district}`}}</template>
          </el-table-column>
          <el-table-column label="详细地址" prop="site"></el-table-column>
          <el-table-column label="加入时间">
            <template v-slot:default="{row}">{{ row['createTime'] | format('yyyy-MM-dd HH:mm:ss')}}</template>
          </el-table-column>
          <el-table-column label="团长状态">
            <template v-slot:default="{row}">{{row['enable']?'启用':'停用'}}</template>
          </el-table-column>
          <template #empty>没有查询到团长数据！</template>
        </el-table>
      </el-col>
    </el-row>
    <el-row class="title">活动商品</el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="detail.itemVOs.goodsList" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini">
          <el-table-column label="商品信息" width="300">
            <template v-slot:default="{ row }">
              <div class="info-style">
                <el-image :src="row['thumbnailImage']" fit="center" />
                <div class="text-info">
                  <div class="text-info-child">
                    <span>{{row['channelCommodityName']}}</span>
                  </div>
                  <div class="text-info-child">
                    <div>基础商品编码</div>
                    <div>{{row['baseCommodityNo']}}</div>
                  </div>
                  <div class="text-info-child">
                    <div>业务商品编码</div>
                    <div>{{row['channelCommodityNo']}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格信息">
            <template v-slot:default="{ row }">
              <div>
                <div>拼团价:{{ priceSection(row.minSalePrice,row.maxSalePrice) }}</div>
                <div>市场价:{{ priceSection(row['minMarketPrice'], row['maxMarketPrice']) }}</div>
                <div>税后供货价:{{ priceSection(row['minCostPrice'], row['maxCostPrice']) }}</div>
                <div>佣&emsp;金:{{ row['channelCommoditySub']['commissionType'] | formatCommission(row['channelCommoditySub']['commissionValue']) }}</div>
              </div>
            </template>
          </el-table-column>
          <!-- <el-table-column label="所属分类" prop="commodityCategory"></el-table-column> -->
          <el-table-column label="拼团城市">
            <template v-slot:default>{{(detail.businessCity || {}).provinceName+''+(detail.businessCity || {}).cityName}}</template>
          </el-table-column>
          <el-table-column label="商品类型">
            <template v-slot:default="{row}">{{row['commodityType'] | statusDescrible}}</template>
          </el-table-column>
          <el-table-column label="地推商品">
            <template slot-scope="{row}">{{row['channelCommoditySub']['offLine'] ? '是' : '否'}}</template>
          </el-table-column>
          <el-table-column label="商品状态">
            <template v-slot:default="{row}">{{row['commodityStatus'] | statusDescrible}}</template>
          </el-table-column>
          <template #empty>没有查询到商品数据！</template>
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { reqAssembleActivityById } from '@/api/assembleGoods'

export default {
  name: 'assembleActivityDetail',
  filters: {
    /**
     * @description: 格式化佣金
     */
    formatCommission(type, value) {
      if (!type) return '-'
      return type.value === 1 ? `${value}元` : `${value}%`
    }
  },
  data() {
    return {
      detail: {
        itemVOs: {}
      }
    }
  },
  mounted() {
    this.$nextTick(() => {
      const { id } = this.$route.query
      this._reqAssembleActivityById(id)
    })
  },
  methods: {
    /**
     * @description: 格式化价格
     */
    priceSection(minPrice, maxPrice) {
      let result = minPrice || maxPrice
      if (minPrice && maxPrice && minPrice !== maxPrice) {
        result = `${minPrice}-${maxPrice}`
      }
      if (!result && result !== 0) result = '-'
      return result
    },
    // *** 网络请求 ***
    _reqAssembleActivityById(id) {
      return reqAssembleActivityById({ id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.detail = result
            this.detail.city = this.detail.businessCity.provinceName + '-' + this.detail.businessCity.cityName
            this.detail.itemVOs = {}
            this.detail.itemVOs.goodsList = this.detail.channelCommodityList || [] // 商品信息
            this.detail.itemVOs.colonelList = this.detail.regimentalByGoodsList || [] // 团长信息
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  font-size: 15px;
  .title {
    border-left: 6px solid rgba(64, 158, 255, 1);
    padding-left: 10px;
    font-size: 17px;
  }
  .content {
    padding: 30px;
  }
  .el-col {
    margin-bottom: 30px;
  }
  .info-style {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-align: start;
    /deep/ .el-image {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
      margin-right: 5px;
    }
    .text-info {
      .text-info-child {
        display: flex;
        flex-direction: row;
        div:first-child {
          flex-shrink: 0;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
