<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="120px" size="small" class="platform-form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="退货单号" prop="generateNum.value" :label-width="labelWidth">
            <el-input v-model="form.generateNum.value" placeholder="退货单号" clearable style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="来源工单" prop="afterSaleNum.value" :label-width="labelWidth">
            <el-input v-model="form.afterSaleNum.value" placeholder="来源工单" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="来源订单" prop="orderNum.value" :label-width="labelWidth">
            <el-input v-model="form.orderNum.value" placeholder="来源订单" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="退货状态" prop="returnOfGoodsState1.value" :label-width="labelWidth">
            <el-select v-model="form.returnOfGoodsState1.value" placeholder="请选择" clearable>
              <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label-width="labelWidth" label="申请时间" prop="createTime.value">
            <el-date-picker
              v-model="form.createTime.value"
              align="center"
              type="daterange"
              size="small"
              style="width:100%"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              :picker-options="{ disabledDate (time) { return time.getTime() - 1 >= new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() + 86400000 - 1 }}">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="商品名称" prop="commodityName.value" :label-width="labelWidth">
            <el-input v-model="form.commodityName.value" placeholder="商品名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="商品编码" prop="commodityCode.value" :label-width="labelWidth">
            <el-input v-model="form.commodityCode.value" placeholder="商品编码" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
// import { Cascader } from '../common'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'Search',
  data() {
    return {
      labelWidth: '120px',
      form: {
        returnOfGoodsState: { value: '""', name: 'returnOfGoodsState', matchType: MatchType.Not_NULL, type: DataType.STRING },
        afterSaleChooseTreatmentPlan: { value: 'AfterSaleChooseTreatmentPlan_2', name: 'afterSale.chooseTreatmentPlan', matchType: MatchType.EQUAL, type: DataType.ENUM },
        generateNum: { value: '', name: 'generateNum', matchType: MatchType.EQUAL, type: DataType.STRING },
        orderNum: { value: '', name: 'afterSale.orderNum', matchType: MatchType.EQUAL, type: DataType.STRING },
        afterSaleNum: { value: '', name: 'afterSale.afterSaleNum', matchType: MatchType.EQUAL, type: DataType.STRING },
        returnOfGoodsState1: { value: '', name: 'returnOfGoodsState', matchType: MatchType.EQUAL, type: DataType.ENUM },
        type: { value: '', name: 'type', matchType: MatchType.EQUAL, type: DataType.STRING },
        commodityName: { value: '', name: 'commodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        commodityCode: { value: '', name: 'commodityCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE }
      },
      statusOption: [
        { value: '', label: '全部' },
        { value: 'AfterSaleReturnGoodsState_1', label: '待审核' },
        { value: 'AfterSaleReturnGoodsState_2', label: '待仓库收货' },
        { value: 'AfterSaleReturnGoodsState_3', label: '收货失败' },
        { value: 'AfterSaleReturnGoodsState_4', label: '待退款' },
        { value: 'AfterSaleReturnGoodsState_5', label: '退货退款成功' },
        { value: 'AfterSaleReturnGoodsState_6', label: '审核拒绝' }
      ]
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
.platform-form .el-form-item,.platform-form .el-form-item .el-select {
  display: inline-block;
  width: 100%
}
</style>
