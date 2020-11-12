<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
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
            <div>市场价:{{ priceSection(row.minMarketPrice,row.maxMarketPrice) }}</div>
            <div>税后供货价:{{ priceSection(row.minCostPrice,row.maxCostPrice) }}</div>
            <div>佣&emsp;金:{{ row['channelCommoditySub']['commissionType'] | formatCommission(row['channelCommoditySub']['commissionValue']) }}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="所属分类" prop="category"></el-table-column> -->
      <el-table-column label="拼团城市">
        <template v-slot:default="{row}">{{row.cityStr}}</template>
      </el-table-column>
      <el-table-column v-if="activeName==='selected'" label="排序" :key="'sort'">
        <template v-slot:default="{row}">
          <el-form ref="form" :rules="rules" inline :model="row" size="mini">
            <el-form-item prop="sort">
              <el-input v-model="row['sort']" clearable></el-input>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="商品类型">
        <template v-slot:default="{row}">{{row['commodityType'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column label="地推商品" width="100">
        <template slot-scope="{row}">{{row['channelCommoditySub']['offLine'] ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column label="商品状态" prop="status" width="100">
        <template v-slot:default="{row}">{{row['commodityStatus'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column v-if="activeName==='disabled'" label="不可选原因" :key="'reason'">
        <template v-slot:default="{row}">{{fetchReason(row)}}</template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ColonelTable',
  props: {
    tableData: { type: Array, default: () => [] },
    activeName: String
  },
  inject: ['context'],
  filters: {
    /**
     * @description: 格式化佣金
     */
    formatCommission(type, value) {
      if (!type || (!value && value !== 0)) return '-'
      return type.value === 1 ? `${value}元` : `${value}%`
    }
  },
  data() {
    return {
      multipleSelection: '',
      rules: {
        sort: [{ validator: this.sortValidator, trigger: 'blur' }]
      }
    }
  },
  methods: {
    fetchReason(row) {
      let res = '' // 正在进行的活动
      let res1 = '' // 已暂停的活动
      for (let key in this.context.goods.disabled.unusableIdMap) {
        if (Number(key) === row.id) {
          if (this.context.goods.disabled.unusableIdMap[key] && this.context.goods.disabled.unusableIdMap[key].length) {
            this.context.goods.disabled.unusableIdMap[key].map(item => {
              Object.keys(item).forEach(i => {
                if (item[i].value === 2) {
                  res += i + '；'
                } else if (item[i].value === 3) {
                  res1 += i + '；'
                }
              })
            })
          }
          // res += (this.context.goods.disabled.unusableIdMap[key] || []).join('；')
        }
      }
      return (res ? '已关联正在进行中的活动' + res : '') + (res1 ? '已关联暂停的活动' + res1 : '')
    },
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    /**
     * @description: 排序校验
     */
    sortValidator(rule, sort, callback) {
      if (!sort) {
        callback()
      } else if (/\D/.test(sort)) {
        callback('请填写10000以内的整数')
      } else if (Number(sort) >= 10000) {
        callback('请填写10000以内的整数')
      } else {
        callback()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
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
