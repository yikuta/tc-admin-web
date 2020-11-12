<template>
  <div style="margin-top: 15px">
    <el-form ref="queryForm" :model="form" label-width="100px" size="mini" class="">
      <el-row>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="订单编号" prop="orderNum">
            <el-input
              v-model="form.num.value"
              placeholder="订单编号"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="终端来源" prop="channelType">
            <el-select
              v-model="form.channelType.value"
              placeholder="请选择"
              size="small"
              clearable
              style="width:100%"
            >
              <el-option label="全部" value="" />
              <el-option label="天呈生活APP-IOS" value="TerminalType_1" />
              <el-option label="天呈生活APP-Android" value="TerminalType_2" />
              <el-option label="天呈生活小程序" value="TerminalType_3" />
              <el-option label="天呈净菜小程序" value="TerminalType_4" />
              <el-option label="商家端APP" value="TerminalType_5" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label-width="labelWidth" label="付款状态" prop="orderPayState">
            <el-select
              v-model="form.orderPayState.value"
              placeholder="请选择"
              size="small"
              clearable
              style="width:100%"
            >
              <el-option label="全部" value="" />
              <el-option label="待付款" value="OrderPayState_1" />
              <el-option label="已付款" value="OrderPayState_2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="发货状态" prop="orderShipmentState">
            <el-select
              v-model="form.orderShipmentState.value"
              placeholder="请选择"
              size="small"
              clearable
              style="width:100%"
            >
              <el-option label="全部" value="" />
              <el-option label="待发货" value="OrderShipmentState_1" />
              <el-option label="部分发货" value="OrderShipmentState_2" />
              <el-option label="已发货" value="OrderShipmentState_3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="下单日期" prop="date">
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
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="自提点名称" prop="pickUpSite">
            <el-input
              v-model="form.pickUpSite.value"
              placeholder="自提点名称"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label-width="labelWidth" label="商品编码" prop="skuNo">
            <el-input
              v-model="form.skuNo.value"
              placeholder="商品编码"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="商品名称" prop="skuName">
            <el-input
              v-model="form.skuName.value"
              placeholder="商品名称"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="下单用户" prop="userPhone">
            <el-input
              v-model="form.userPhone.value"
              placeholder="下单用户"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="收货人姓名" prop="orderReceiver">
            <el-input
              v-model="form.orderReceiver.value"
              placeholder="收货人姓名"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label-width="labelWidth" label="收货人电话" prop="contactInformation">
            <el-input
              v-model="form.contactInformation.value"
              placeholder="收货人电话"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="活动编码" prop="groupActivityCode">
            <el-input
              v-model="form.groupActivityCode.value"
              placeholder="活动编码"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="活动名称" prop="groupActivityName">
            <el-input
              v-model="form.groupActivityName.value"
              placeholder="活动名称"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="父订单号" prop="tradeNum">
            <el-input
              v-model="form.tradeNum.value"
              placeholder="父订单号"
              size="small"
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label-width="20px">
            <div class="search-form-btn">
              <el-button type="primary" size="small" @click="submitQueryForm">查询</el-button>
              <el-button type="success" size="small" @click="handleResetForm('queryForm')">重置</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <div class="search-tabs">
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="全部订单" name=""></el-tab-pane>
        <el-tab-pane label="待付款" name="10"></el-tab-pane>
        <el-tab-pane label="待成团" name="21"></el-tab-pane>
        <el-tab-pane label="待发货" name="30"></el-tab-pane>
        <el-tab-pane label="待收货" name="40"></el-tab-pane>
        <el-tab-pane label="交易完成" name="50"></el-tab-pane>
        <el-tab-pane label="交易关闭" name="60"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'searchCard',
  data() {
    return {
      labelWidth: '90px',
      name: '',
      form: {
        orderType: { value: 'OrderType_2', name: 'orderType', matchType: MatchType.EQUAL, type: DataType.ENUM }, // 爆品预售
        num: { value: '', name: 'orderNum', matchType: MatchType.EQUAL, type: DataType.STRING }, // 订单编号
        tradeNum: { value: '', name: 'trade.tradeNum', matchType: MatchType.EQUAL, type: DataType.STRING }, // 父订单编号
        contactInformation: { value: '', name: 'orderInfo.contactInformation', matchType: MatchType.CONTAIN }, // 发货人电话
        orderReceiver: { value: '', name: 'orderInfo.orderReceiver', matchType: MatchType.CONTAIN }, // 发货人姓名
        skuName: { value: '', name: 'orderDetails.channelCommodityName', matchType: MatchType.CONTAIN }, // 商品名称
        skuNo: { value: '', name: 'orderDetails.channelCommodityNo', matchType: MatchType.EQUAL, type: DataType.STRING }, // 商品编码
        channelType: { value: '', name: 'terminalType', matchType: MatchType.EQUAL, type: DataType.ENUM }, // 终端来源
        orderPayState: { value: '', name: 'orderPayState', matchType: MatchType.EQUAL, type: DataType.ENUM }, // 付款状态
        orderShipmentState: { value: '', name: 'orderShipmentState', matchType: MatchType.EQUAL, type: DataType.ENUM }, // 发货状态
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE }, // 下单日期
        pickUpSite: { value: '', name: 'orderInfo.locationName', matchType: MatchType.CONTAIN, type: DataType.STRING }, // 自提点名称
        userPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING }, // 下单用户
        groupActivityCode: { value: '', name: 'orderInfo.groupActivityCode', matchType: MatchType.EQUAL, type: DataType.STRING }, // 活动编码
        groupActivityName: { value: '', name: 'orderInfo.groupActivityName', matchType: MatchType.CONTAIN, type: DataType.STRING } // 活动名称
      },
      activeName: ''
    }
  },
  created() {
    const { code, memberPhone, date } = this.$route.query
    if (code) {
      this.form.groupActivityCode.value = code
    } else {
      this.form.groupActivityCode.value = ''
    }
    if (memberPhone) {
      this.form.userPhone.value = memberPhone
    } else {
      this.form.userPhone.value = ''
    }
    if (date) {
      this.form.createTime.value = [date, date]
    } else {
      this.form.createTime.value = []
    }
    this.$emit('query', searchTool(this.form))
  },
  watch: {
    '$route.query.code'(newVal) {
      this.form.groupActivityCode.value = newVal || ''
      this.$emit('query', searchTool(this.form))
    }
  },
  methods: {
    submitQueryForm() {
      this.$emit('query', searchTool(this.form))
    },
    handleResetForm() {
      Object.keys(this.form).forEach(key => {
        if (key !== 'orderState' && key !== 'orderType') {
          this.form[key].value = ''
        }
      })
    },
    handleTabClick(e) {
      let orderState = {
        value: 'OrderState_' + e.name,
        name: 'orderState',
        matchType: MatchType.EQUAL,
        type: DataType.ENUM
      }
      if (e.name) {
        this.form.orderState = orderState
      } else {
        delete this.form.orderState
      }
      this.$emit('query', searchTool(this.form))
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form .el-form-item,.search-form .el-form-item .el-select {
  display: inline-block;
  width: 100%
}
.search-form-btn{
  float: right
}
</style>
