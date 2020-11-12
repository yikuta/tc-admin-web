<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="120px" size="small" class="platform-form">
      <el-row>
        <el-col :span="8">
          <el-form-item label="工单编号" prop="afterSaleNum.value" :label-width="labelWidth">
            <el-input v-model="form.afterSaleNum.value" placeholder="工单编号" clearable style="width:100%"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="订单编号" prop="orderNum.value" :label-width="labelWidth">
            <el-input v-model="form.orderNum.value" placeholder="订单编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="处理方案" prop="chooseTreatmentPlan.value" :label-width="labelWidth">
            <el-select v-model="form.chooseTreatmentPlan.value" placeholder="请选择" clearable>
              <el-option v-for="item in projectOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="售后状态" prop="afterSaleState.value" :label-width="labelWidth">
            <el-select v-model="form.afterSaleState.value" placeholder="请选择" clearable>
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
          <el-form-item label="申请售后类型" prop="requestType.value" :label-width="labelWidth">
            <el-select v-model="form.requestType.value" placeholder="请选择" clearable>
              <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="业务类型" prop="orderType.value" :label-width="labelWidth">
            <el-select v-model="form.orderType.value" placeholder="请选择" clearable>
              <el-option v-for="item in businessTypeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工单发起" prop="saleSource.value" :label-width="labelWidth">
            <el-select v-model="form.saleSource.value" placeholder="请选择" clearable>
              <el-option v-for="item in startOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="客户电话" prop="memberPhone.value" :label-width="labelWidth">
            <el-input v-model="form.memberPhone.value" placeholder="客户电话" clearable></el-input>
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
        afterSaleNum: { value: '', name: 'afterSaleNum', matchType: MatchType.EQUAL, type: DataType.STRING },
        orderNum: { value: '', name: 'orderNum', matchType: MatchType.EQUAL, type: DataType.STRING },
        chooseTreatmentPlan: { value: '', name: 'chooseTreatmentPlan', matchType: MatchType.EQUAL, type: DataType.ENUM },
        afterSaleState: { value: '', name: 'afterSaleState', matchType: MatchType.EQUAL, type: DataType.ENUM },
        requestType: { value: '', name: 'requestType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        orderType: { value: 'OrderType_1,2,4', name: 'orderType', matchType: MatchType.IN, type: DataType.LISTENUM },
        saleSource: { value: '', name: 'saleSource', matchType: MatchType.EQUAL, type: DataType.ENUM },
        memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE }
      },
      statusOption: [
        { value: '', label: '全部' },
        { value: 'AfterSaleState_1', label: '待处理' },
        { value: 'AfterSaleState_2', label: '处理中' },
        { value: 'AfterSaleState_3', label: '处理完成' },
        { value: 'AfterSaleState_4', label: '拒绝申请' },
        { value: 'AfterSaleState_5', label: '方案被驳回' },
        { value: 'AfterSaleState_6', label: '处理失败' }
      ],
      projectOption: [
        { value: '', label: '全部' },
        { value: 'AfterSaleChooseTreatmentPlan_1', label: '退款' },
        { value: 'AfterSaleChooseTreatmentPlan_2', label: '退货退款' },
        { value: 'AfterSaleChooseTreatmentPlan_3', label: '补充发货' },
        { value: 'AfterSaleChooseTreatmentPlan_4', label: '发券补偿' },
        { value: 'AfterSaleChooseTreatmentPlan_5', label: '换货' },
        { value: 'AfterSaleChooseTreatmentPlan_6', label: '拒绝申请' }
      ],
      typeOption: [
        { value: '', label: '全部' },
        { value: 'AfterSaleChooseTreatmentPlan_1', label: '退款' },
        { value: 'AfterSaleChooseTreatmentPlan_2', label: '退货退款' }
      ],
      businessTypeOption: [
        { value: 'OrderType_1,2,4', label: '全部' },
        { value: 'OrderType_1', label: '快递到家' },
        { value: 'OrderType_2', label: '爆品预售' },
        { value: 'OrderType_4', label: '商家采购' }
      ],
      startOption: [
        { value: '', label: '全部' },
        { value: 'AfterSaleSource_1', label: '中台手动添加' },
        { value: 'AfterSaleSource_2', label: '系统自动生成' },
        { value: 'AfterSaleSource_3', label: 'C端客户发起' }
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
