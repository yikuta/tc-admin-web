<template>
  <div class="express-step">
    <el-steps
      :active="stepActive"
      align-center
      v-if="hasStep"
    >
      <el-step
        v-for="(item,index) in stepList"
        :key="index"
        :title="item.label"
        :description="item.desc"
      ></el-step>
    </el-steps>
    <div v-if="orderType && orderType.value === 3"></div>
    <div class="step-status" v-else>
      <p class="step-status-text">当前状态：{{currentState}}
        <el-button 
          size="small" 
          type="primary" 
          style="float:right" 
          @click="handleReceivedBtn" 
          v-np='type==="ReturnGoods" ? "AFTER_SALE_RETURN_ORDER_PRODUCT_RECEIVE" : "AFTER_SALE_EXCHANGE_ORDER_PRODUCT_RECEIVE"'
          v-if="orderState.value&&orderState.value===2&&(type==='ReturnGoods'||type==='ExchangeGoods')&&tableData[0]&&tableData[0].deliverGoodsChannel==='MIDDLE_GROUND'">收货</el-button>
        <el-button 
          size="small" 
          type="primary" 
          style="float:right" 
          @click="handleRefundBtn" 
          v-np='"AFTER_SALE_RETURN_ORDER_PRODUCT_REFUND"'
          :disabled="button"
          v-if="orderState.value&&orderState.value===4&&type==='ReturnGoods'">退款</el-button>
        <el-button 
          size="small" 
          type="primary" 
          style="float:right" 
          @click="handleRefundAgain" 
          v-np='"AFTER_SALE_REFUND_MANUAL_RETRY"'
          v-if="orderState.value&&orderState.value===4&&type==='Refund'">重新退款</el-button>
        <el-button 
          size="small" 
          type="primary" 
          style="float:right"    
          @click="handleSendGoodsBtn" 
          v-if="orderState.value&&orderState.value===4&&type==='ExchangeGoods'&&tableData[0]&&tableData[0].deliverGoodsChannel==='MIDDLE_GROUND'">换货出库</el-button>
        <el-button 
          size="small" 
          type="primary" 
          style="float:right" 
          @click="handleSendGoodsBtn" 
          v-if="orderState.value&&orderState.value===2&&type==='AgainSupply'&&tableData[0]&&tableData[0].deliverGoodsChannel==='MIDDLE_GROUND'">补发出库</el-button>
      </p>
      <p style="font-size:14px" v-if="currentState==='收货失败'">收货失败原因：{{receiptGoodsFailReason}}</p>
      <p style="font-size:14px">{{rejectReason}}</p>
      <el-button 
        size="small" 
        v-if="orderState.value&&(orderState.value===5&&type==='ExchangeGoods' || orderState.value===3&&type==='AgainSupply')"
        @click="handleSearchLogisticsBtn">查看物流</el-button>
      <el-button size="small" @click="handlePassBtn" v-if="orderState.value&&orderState.value===1" v-np='dealPermision'>同意{{controlName}}</el-button>
      <el-button size="small" @click="handleCancelBtn" v-if="orderState.value&&orderState.value===1" v-np='dealPermision'>拒绝{{controlName}}</el-button>
    </div>
    <!-- 取消订单弹窗 -->
    <el-dialog
      title="审核拒绝"
      :visible.sync="dialogFormVisible"
      width='480px'
      :close-on-click-modal='false'
      @close="handleClose('cancelForm')"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="cancelForm"
        size="small"
      >
        <el-form-item
          label="请填写审核拒绝的原因："
          prop='rejectReason'
        >
          <el-input
            v-model="form.rejectReason"
            type="textarea"
            :minlength="3"
            :maxlength="50"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose('cancelForm')" size="small">关 闭</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleCancel('cancelForm')"
        >确 认</el-button>
      </div>
    </el-dialog>
    <!-- 收货弹窗 -->
    <el-dialog
      title="收货确认"
      :visible.sync="dialogReceivedVisible"
      width='480px'
      :close-on-click-modal='false'
      @close="handleCloseReceivedForm('receivedForm')"
    >
      <el-form
        :model="receivedForm"
        ref="receivedForm"
        size="small"
      >
        <el-form-item
          label=""
          prop='receiveGoodsState'>
          <el-radio-group v-model="receivedForm.receiveGoodsState">
            <el-radio label="SUCCESS">收货成功</el-radio>
            <el-radio label="REJECT">收货失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="`请填写收货${receivedForm.receiveGoodsState==='SUCCESS'?'成功':'失败'}的原因：`"
          prop='everyFailReason'
        >
          <el-input
            v-model="receivedForm.everyFailReason"
            type="textarea"
            :minlength="3"
            :maxlength="50"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleCloseReceivedForm('receivedForm')" size="small">关 闭</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleReceivedForm('receivedForm')"
        >确 认</el-button>
      </div>
    </el-dialog>
    <!-- 退款弹窗 -->
    <el-dialog
      title="退款确认"
      :visible.sync="dialogRefundVisible"
      :close-on-click-modal='false'
      width='960px'
    >
      <el-table 
        :data="tableData"
        header-row-class-name="table-head">
          <el-table-column
          prop="goodsInfo"
          label="商品信息"
          width="380"
        >
          <template v-slot:default='{ row }'>
            <div style="margin-bottom:5px;overflow:hidden">{{row.commodityName}}_{{row.commodityCode}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="销售价（元）">
          <template v-slot:default='{ row }'>
            <div>
              <span>{{(row.commodityUnitPrice||row.commodityUnitPrice===0) ? row.commodityUnitPrice : '-'}}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="commodityActualPayment" label="可退金额（元）" :formatter="(row)=>formatNoneValue(row['commodityActualPayment'])"></el-table-column>
        <el-table-column prop="actualPrice" label="实退金额（元）" width="200px">
          <template v-slot:default='{ row }'>
            <el-input-number size="small" style="width:100%" :min="0" :max="row['commodityActualPayment']" :precision="2" v-model="actualRefundAmount"></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogRefundVisible = false" size="small">关 闭</el-button>
        <el-button
          type="primary"
          size="small"
          @click="handleRefund"
        >确 认</el-button>
      </div>
    </el-dialog>
    <!-- 发货弹窗 -->
    <el-dialog
      title="发货"
      :close-on-click-modal='false'
      :visible.sync="dialogSendFormVisible"
      width='520px'
      @close="handleSendClose('shipmentsForm')"
    >
      <el-form
        :model="sendGoodsForm"
        :rules="sendGoodsRules"
        ref="shipmentsForm"
        size="small"
        label-width="80px"
      >
        <el-form-item
          label="发货方式"
          prop='orderLogisticsType'
        >
          <el-radio-group v-model="sendGoodsForm.orderLogisticsType">
            <el-radio label="ACTUAL">实物发货</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="物流公司"
          prop='code'
        >
          <el-select
            v-model="sendGoodsForm.code"
            style="width:100%"
          >
            <el-option
              v-for="item in companyList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="配送单号"
          prop='logisticsNum'
        >
          <el-input v-model="sendGoodsForm.logisticsNum"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleSendClose('shipmentsForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="handleShipmentes('shipmentsForm')"
          :loading='loading'
        >确 定</el-button>
      </div>
    </el-dialog>
    <!-- 查看物流弹窗 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisible"
      :close-on-click-modal='false'
      width='1080px'
      class="logostocsVisible"
    >
      <div class="logistics-head">
        <el-row>
          <el-col :span="10">发货方式：{{logisticsData.logisticsMerchantsName}}</el-col>
          <el-col :span="14">快递单号：{{logisticsData.nu}}</el-col>
        </el-row>
      </div>
      <div class="logistics-content" v-if="logisticsData.data.length>0">
        <dl v-for="(item,index) in logisticsData.data" :key="index">
          <dt>{{item.ftime}}</dt>
          <dd>{{item.context}}</dd>
        </dl>
      </div>
      <div class="logistics-content" style="text-align:center;margin-top:20px" v-else>
        暂无物流信息
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  asyncAfterSaleListGenerate,
  asyncAfterSaleReceiveGoods,
  asyncAfterSaleRefund,
  asyncAfterSaleShipGoods,
  asyncAfterSaleRefundAgain,
  asyncAfterSaleLogistics
} from '@/api/afterSale'
export default {
  props: {
    orderState: {
      type: Object,
      default: () => {}
    },
    orderType: {
      type: Object,
      default: () => {}
    },
    orderStatusTime: {
      type: Array,
      default: () => []
    },
    tableData: {
      type: Array,
      default: () => []
    },
    currentState: String,
    rejectReason: String,
    logisticsCode: String,
    logisticsNum: String,
    receiptGoodsFailReason: String,
    type: String,
    hasStep: {
      type: Boolean,
      default: () => true
    },
    button: {
      type: Boolean,
      default: () => false
    },
    stepList: {
      type: Array,
      default: () => {
        return [
          {
            label: '方案生成',
            desc: ''
          },
          {
            label: '方案审核',
            desc: ''
          },
          {
            label: '退款成功',
            desc: ''
          }
        ]
      }
    }
  },
  computed: {
    controlName() {
      switch (this.type) {
        case 'Refund': return '退款'
        case 'ReturnGoods': return '退货'
        case 'AgainSupply': return '补发'
        case 'SendStamps': return ''
        case 'ExchangeGoods': return '换货'
      }
    },
    dealPermision() {
      switch (this.type) {
        case 'Refund': return 'AFTER_SALE_REFUND_AUDIT'
        case 'ReturnGoods': return 'AFTER_SALE_RETURN_ORDER_AUDIT'
        case 'AgainSupply': return 'AFTER_SALE_COMPENSATE_ORDER_AUDIT'
        case 'SendStamps': return 'AFTER_SALE_EXTRA_COUPON_ORDER_AUDIT'
        case 'ExchangeGoods': return 'AFTER_SALE_EXCHANGE_ORDER_AUDIT'
      }
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      dialogReceivedVisible: false,
      dialogRefundVisible: false,
      dialogSendFormVisible: false,
      logisticsDialogVisible: false,
      logisticsList: [],
      form: {
        rejectReason: ''
      },
      rules: {
        rejectReason: [{ required: true, message: '请填写拒绝原因', trigger: 'blur' }]
      },
      stepActive: 0,
      receivedForm: {
        everyFailReason: '',
        receiveGoodsState: 'SUCCESS'
      },
      actualRefundAmount: 0,
      companyList: [
        {
          label: '中通快递',
          value: 'zhongtong'
        }, {
          label: '韵达快递',
          value: 'yunda'
        }, {
          label: '圆通快递',
          value: 'yuantong'
        }, {
          label: '百世快递',
          value: 'huitongkuaidi'
        }, {
          label: '申通快递',
          value: 'shentong'
        }, {
          label: '邮政快递包裹',
          value: 'youzhengguonei'
        }, {
          label: '顺丰速运',
          value: 'shunfeng'
        }
      ],
      sendGoodsForm: {
        orderLogisticsType: 'ACTUAL',
        code: '',
        logisticsNum: ''
      },
      sendGoodsRules: {
        code: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        logisticsNum: [{ required: true, message: '请填写配送单号', trigger: 'blur' }]
      },
      loading: false,
      logisticsData: {
        logisticsMerchantsName: '',
        nu: '',
        data: []
      }
    }
  },
  watch: {
    orderStatusTime(newVal) {
      if (newVal && newVal.length > 0) {
        this.stepActive = newVal.length
        newVal.forEach((item, index) => {
          this.stepList[index].desc = item
        })
      }
    }
  },
  methods: {
    handlePassBtn() {
      this.$confirm(`是否确认同意${this.controlName}？`, '提示', {}).then(() => {
        this.handleControl('SUCCESS')
      })
    },
    handleControl(flag, data) {
      const { afterSaleNum, generateNum, type } = this.$route.query
      let chooseTreatmentPlan = ''
      if (type === 'Refund') {
        chooseTreatmentPlan = 'REFUND'
      } else if (type === 'ReturnGoods') {
        chooseTreatmentPlan = 'RETURN_REFUND'
      } else if (type === 'AgainSupply') {
        chooseTreatmentPlan = 'SUPPLEMENTARY_DELIVERY'
      } else if (type === 'SendStamps') {
        chooseTreatmentPlan = 'COUPON_COMPENSATION'
      } else if (type === 'ExchangeGoods') {
        chooseTreatmentPlan = 'EXCHANGE'
      }
      asyncAfterSaleListGenerate({
        afterSaleNum,
        chooseTreatmentPlan,
        detailAuditState: flag,
        generateNum,
        rejectReason: data
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          if (flag === 'REJECT') {
            this.dialogFormVisible = false
          }
          this.$emit('update')
        }
      })
    },
    handleCancelBtn() {
      this.dialogFormVisible = true
    },
    handleCancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleControl('REJECT', this.form.rejectReason)
        } else {
          return false
        }
      })
    },
    handleClose(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    handleCloseReceivedForm(formName) {
      this.dialogReceivedVisible = false
      this.$refs[formName].resetFields()
    },
    handleSendClose(formName) {
      this.dialogSendFormVisible = false
      this.$refs[formName].resetFields()
    },
    handleReceivedBtn() {
      this.dialogReceivedVisible = true
    },
    handleReceivedForm() {
      const { everyFailReason, receiveGoodsState } = this.receivedForm
      const { afterSaleNum, generateNum } = this.$route.query
      if (!everyFailReason) {
        this.$message.error(`请填写收货${receiveGoodsState === 'SUCCESS' ? '成功' : '失败'}的原因`)
        return
      }
      asyncAfterSaleReceiveGoods({
        afterSaleNum,
        generateNum,
        receiveRemark: receiveGoodsState === 'SUCCESS' ? everyFailReason : '',
        everyFailReason: receiveGoodsState === 'SUCCESS' ? '' : everyFailReason,
        receiveGoodsState
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$emit('update')
          this.handleCloseReceivedForm()
        }
      })
    },
    handleRefundBtn() {
      this.dialogRefundVisible = true
    },
    // 退款
    handleRefund() {
      const { afterSaleNum, generateNum, type } = this.$route.query
      let chooseTreatmentPlan = ''
      if (type === 'Refund') {
        chooseTreatmentPlan = 'REFUND'
      } else if (type === 'ReturnGoods') {
        chooseTreatmentPlan = 'RETURN_REFUND'
      } else if (type === 'AgainSupply') {
        chooseTreatmentPlan = 'SUPPLEMENTARY_DELIVERY'
      } else if (type === 'SendStamps') {
        chooseTreatmentPlan = 'COUPON_COMPENSATION'
      } else if (type === 'ExchangeGoods') {
        chooseTreatmentPlan = 'EXCHANGE'
      }
      asyncAfterSaleRefund({
        actualRefundAmount: this.actualRefundAmount,
        afterSaleNum,
        generateNum,
        chooseTreatmentPlan
      }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$emit('update')
          this.dialogRefundVisible = false
        }
      })
    },
    // 重新退款
    handleRefundAgain() {
      const { afterSaleNum, generateNum } = this.$route.query
      asyncAfterSaleRefundAgain({ afterSaleNum, generateNum }).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message)
          this.$emit('update')
        }
      })
    },
    // 换货出库/补发出库
    handleSendGoodsBtn() {
      this.dialogSendFormVisible = true
    },
    handleShipmentes(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const { afterSaleNum, generateNum, type } = this.$route.query
          let chooseTreatmentPlan = ''
          if (type === 'Refund') {
            chooseTreatmentPlan = 'REFUND'
          } else if (type === 'ReturnGoods') {
            chooseTreatmentPlan = 'RETURN_REFUND'
          } else if (type === 'AgainSupply') {
            chooseTreatmentPlan = 'SUPPLEMENTARY_DELIVERY'
          } else if (type === 'SendStamps') {
            chooseTreatmentPlan = 'COUPON_COMPENSATION'
          } else if (type === 'ExchangeGoods') {
            chooseTreatmentPlan = 'EXCHANGE'
          }
          asyncAfterSaleShipGoods({
            afterSaleNum,
            generateNum,
            chooseTreatmentPlan,
            logisticsCode: this.sendGoodsForm.code,
            logisticsName: this.companyList.filter(item => item.value === this.sendGoodsForm.code)[0].label,
            logisticsNum: this.sendGoodsForm.logisticsNum
          }).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$emit('update')
              this.handleSendClose(formName)
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    handleSearchLogisticsBtn() {
      this.logisticsDialogVisible = true
      const { logisticsCode, logisticsNum } = this
      asyncAfterSaleLogistics({ logisticsCode, logisticsNum }).then(res => {
        if (res.code === 200) {
          const { result } = res
          Object.keys(this.logisticsData).forEach(key => {
            if (key === 'logisticsMerchantsName') {
              let arr = this.companyList.filter(item => item.value === result.com)
              this.logisticsData[key] = arr && arr.length ? arr[0].label : ''
            } else if (key === 'data') {
              this.logisticsData[key] = result[key] || []
            } else {
              this.logisticsData[key] = result[key] || ''
            }
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.express-step {
  .step-status {
    border: 1px solid rgba(215, 215, 215, 1);
    padding: 20px;
    margin: 20px 0px;
    &-text {
      color: #ff0005;
      font-weight: 700;
    }
  }
}
.logistics-head{
  border-bottom: 1px solid rgba(215, 215, 215, 1);
  height: 60px;
  line-height: 60px;
  padding: 0 20px;
}
.logostocsVisible{
  /deep/ .el-dialog__body{
    padding: 0 0 30px;
  }
  /deep/ .el-dialog__header{
    border-bottom: 1px solid rgba(215, 215, 215, 1);
    text-align: center;
  }
}
.logistics-content{
  padding: 0 20px;
  dl{
    overflow: hidden;
  }
  dt{
    width: 140px;
  }
  dd {
    width: calc(100% - 180px);
    line-height: 22px;
  }
  dt,dd{
    float: left;
  }
}
</style>