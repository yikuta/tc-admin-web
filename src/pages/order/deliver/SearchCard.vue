<template>
  <div style="margin-top: 15px">
    <el-form ref="queryForm" :model="form" label-width="100px" size="mini" class="">
      <el-row>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="配送单号">
            <el-input
              v-model="form.num.value"
              placeholder="配送单号"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="订单编号">
            <el-input
              v-model="form.orderNum.value"
              placeholder="订单编号"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="门店名称">
            <el-input
              v-model="form.storeName.value"
              placeholder="门店名称"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label-width="labelWidth" label="门店编码">
            <el-input
              v-model="form.storeNo.value"
              placeholder="门店编码"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="生单日期" prop="date">
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
          <el-form-item :label-width="labelWidth" label="配送人电话">
            <el-input
              v-model="form.distributionTel.value"
              placeholder="配送人电话"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="配送人姓名">
            <el-input
              v-model="form.distributionName.value"
              placeholder="配送人姓名"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item :label-width="labelWidth" label="收货人电话">
            <el-input
              v-model="form.receiveTel.value"
              placeholder="收货人电话"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="收货人姓名">
            <el-input
              v-model="form.receiveName.value"
              placeholder="收货人姓名"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :label-width="labelWidth" label="配送状态">
            <el-select
              v-model="form.status.value"
              placeholder="请选择"
              size="small"
              clearable
              style="width:100%"
            >
              <el-option label="全部" value="" />
              <el-option v-for="item in options" :key="item.id" :label="item.value" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label-width="20px">
            <div class="search-form-btn">
              <el-button type="primary" size="small" @click="submitQueryForm">查询</el-button>
              <el-button size="small" @click="handleResetForm('queryForm')">重置</el-button>
              <!-- <el-button type="success" size="small">Excel下载</el-button> -->
            </div>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
        num: { value: '', name: 'deliveryNo', matchType: MatchType.EQUAL, type: DataType.STRING }, // 配送单号
        orderNum: { value: '', name: 'orderNo', matchType: MatchType.EQUAL, type: DataType.STRING }, // 订单编号
        storeName: { value: '', name: 'shop.name', matchType: MatchType.CONTAIN, type: DataType.STRING }, // 门店名称
        storeNo: { value: '', name: 'shop.shopCode', matchType: MatchType.EQUAL, type: DataType.STRING }, // 门店编码
        createTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE }, // 下单日期
        distributionTel: { value: '', name: 'transporterPhone', matchType: MatchType.EQUAL, type: DataType.STRING }, // 配送人电话
        distributionName: { value: '', name: 'transporterName', matchType: MatchType.CONTAIN, type: DataType.STRING }, // 配送人姓名
        receiveTel: { value: '', name: 'contactInformation', matchType: MatchType.CONTAIN, type: DataType.STRING }, // 收货人电话
        receiveName: { value: '', name: 'orderReceiver', matchType: MatchType.CONTAIN, type: DataType.STRING }, // 收获人姓名
        status: { value: '', name: 'deliveryStatus', matchType: MatchType.EQUAL, type: DataType.ENUM } // 发货状态
      },
      activeName: '',
      options: [
        // { id: -1, value: '已取消' },
        { id: 'boss.DeliveryStatusType_10', value: '待配送' },
        { id: 'boss.DeliveryStatusType_20', value: '配送中' },
        { id: 'boss.DeliveryStatusType_30', value: '已送达' },
        { id: 'boss.DeliveryStatusType_40', value: '已取消(配送员取消)' },
        { id: 'boss.DeliveryStatusType_50', value: '已取消(超时未抢单)' },
        { id: 'boss.DeliveryStatusType_60', value: '妥投异常' }
      ]
    }
  },
  // watch: {
  //   '$route.query.code'(newVal) {
  //     this.form.groupActivityCode.value = newVal || ''
  //     this.$emit('query', searchTool(this.form))
  //   }
  // },
  methods: {
    submitQueryForm() {
      this.$emit('query', searchTool(this.form))
    },
    handleResetForm() {
      Object.keys(this.form).forEach(key => {
        if (key !== 'orderState') {
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
