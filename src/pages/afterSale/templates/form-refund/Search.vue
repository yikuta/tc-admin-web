<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="120px" size="small" class="platform-form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="退款单号" prop="generateNum.value" :label-width="labelWidth">
            <el-input v-model="form.generateNum.value" placeholder="退款单号" clearable style="width:100%"></el-input>
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
          <el-form-item label="退款类别" prop="chooseTreatmentPlan.value" :label-width="labelWidth">
            <el-select v-model="form.chooseTreatmentPlan.value" placeholder="请选择" clearable>
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
          <el-form-item label="退款状态" prop="refundState1.value" :label-width="labelWidth">
            <el-select v-model="form.refundState1.value" placeholder="请选择" clearable>
              <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="退款账户" prop="memberPhone.value" :label-width="labelWidth">
            <el-input v-model="form.memberPhone.value" placeholder="退款账户" clearable></el-input>
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
        afterSaleChooseTreatmentPlan: { value: 'AfterSaleChooseTreatmentPlan_1,2', name: 'afterSale.chooseTreatmentPlan', matchType: MatchType.IN, type: DataType.LISTENUM },
        generateNum: { value: '', name: 'generateNum', matchType: MatchType.EQUAL, type: DataType.STRING },
        afterSaleNum: { value: '', name: 'afterSale.afterSaleNum', matchType: MatchType.EQUAL, type: DataType.STRING },
        orderNum: { value: '', name: 'afterSale.orderNum', matchType: MatchType.EQUAL, type: DataType.STRING },
        chooseTreatmentPlan: { value: '', name: 'afterSale.chooseTreatmentPlan', matchType: MatchType.EQUAL, type: DataType.ENUM },
        memberPhone: { value: '', name: 'afterSale.memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        refundState: { value: '""', name: 'refundState', matchType: MatchType.Not_NULL, type: DataType.STRING },
        refundState1: { value: '', name: 'refundState', matchType: MatchType.EQUAL, type: DataType.ENUM }
      },
      statusOption: [
        { value: '', label: '全部' },
        { value: 'AfterSaleChooseTreatmentPlan_1', label: '退款' },
        { value: 'AfterSaleChooseTreatmentPlan_2', label: '退货退款' }
      ],
      // statusOption: [
      //   { value: '', label: '全部' },
      //   { value: 'PaymentType_1', label: '银联支付' },
      //   { value: 'PaymentType_2', label: '支付宝支付' },
      //   { value: 'PaymentType_3', label: '微信支付' },
      //   { value: 'PaymentType_5', label: '通联支付' },
      //   { value: 'PaymentType_6', label: '现金支付' },
      //   { value: 'PaymentType_7', label: '0元支付' }
      // ],
      typeOption: [
        { value: '', label: '全部' },
        { value: 'AfterSaleRefundState_1', label: '待审核' },
        { value: 'AfterSaleRefundState_2', label: '退款中' },
        { value: 'AfterSaleRefundState_3', label: '退款成功' },
        { value: 'AfterSaleRefundState_4', label: '退款失败' },
        { value: 'AfterSaleRefundState_5', label: '审核拒绝' }
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
