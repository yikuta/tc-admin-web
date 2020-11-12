<template>
  <div class="express-step">
    <el-steps
      :active="stepActive"
      align-center
    >
      <el-step
        v-for="(item,index) in stepList"
        :key="index"
        :title="item.label"
        :description="item.desc"
      ></el-step>
    </el-steps>
    <div class="step-status">
      <p class="step-status-text">当前状态：{{currentOrderState}}</p>
      <p style="font-size:14px" v-if="orderState.value===10">买家还有{{payTimeOutSecond | changeTime}}时间支付订单，否则系统将自动关闭订单（如果该订单为恶意订单，您可以取消该订单）</p>
      <p style="font-size:14px" v-if="cancelReason && !orderCancelSource.value">{{cancelReason}}</p>
      <p style="font-size:14px" v-if="orderCancelSource.value === 1 || orderCancelSource.value === 2">{{orderCancelSource.value === 2 ? '平台手动取消订单':'用户手动取消订单' }}</p>
      <p style="font-size:14px" v-if="orderCancelSource.value && orderCancelSource.value === 2">备注：{{cancelRemark}}</p>
      <p style="font-size:14px" v-else-if="orderCancelSource.value && orderCancelSource.value === 1">取消原因：{{cancelReason}}</p>
      <p style="font-size:14px" v-else-if="orderCancelSource.value && orderCancelSource.value === 3">超时未支付系统自动取消订单</p>
      <el-button 
        size="small" 
        @click="handleCancelBtn" 
        v-if="orderState.value&&(orderState.value===10 || orderState.value===20 || (orderState.value===30&&orderShipmentState&&orderShipmentState.value===1))"
        v-np='permission'>
        取消订单
      </el-button>
    </div>
    <!-- 取消订单弹窗 -->
    <el-dialog
      title="取消订单警告"
      :visible.sync="dialogFormVisible"
      width='520px'
      :close-on-click-modal='false'
      @close="handleClose('cancelForm')"
    >
      <p style="color:#D9001B;font-size:18px;margin:0 0 18px">注意：为维护平台良好信用度，防止用户投诉，请务必与客户沟通后才能取消订单！取消订单后订单金额将自动退还。</p>
      <el-form
        :model="form"
        :rules="rules"
        ref="cancelForm"
        label-width="1px"
        @submit.native.prevent
      >
        <el-form-item
          label=""
          prop='cancelRemark'
        >
          <el-input
            v-model="form.cancelRemark"
            autocomplete="off"
            maxlength="50"
            placeholder="请输入备注（必填）"
          ></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose('cancelForm')">关 闭</el-button>
        <el-button
          type="primary"
          @click="handleCancel('cancelForm')"
        >确认取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { asyncOrderCancel } from '@/api/order'
export default {
  props: {
    orderState: {
      type: Object,
      default: () => {}
    },
    orderCancelSource: {
      type: Object,
      default: () => {}
    },
    orderShipmentState: {
      type: Object,
      default: () => {}
    },
    orderStatusTime: {
      type: Array,
      default: () => []
    },
    currentOrderState: String,
    cancelReason: String,
    cancelRemark: String,
    payTimeOutSecond: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      dialogFormVisible: false,
      stepList: [
        {
          label: '下单',
          desc: ''
        },
        {
          label: '付款',
          desc: ''
        },
        {
          label: '接单',
          desc: ''
        },
        {
          label: '发货',
          desc: ''
        },
        {
          label: '确认收货',
          desc: ''
        }
      ],
      form: {
        cancelRemark: ''
      },
      rules: {
        cancelRemark: [{ required: true, message: '请填写备注信息', trigger: 'blur' }]
      },
      stepActive: 0
    }
  },
  computed: {
    cancelDate() {
      if (this.orderStatusTime[0] && this.orderState.value === 10) {
        let day = new Date().getTime()
        let lastDay = new Date(this.orderStatusTime[0]).getTime()
        let total = 24 * 60 * 60 - (day - lastDay) / 1000 // 剩余秒数
        let hour = parseInt(total / (60 * 60)) // 计算整数小时数
        let min = parseInt((total - hour * 60 * 60) / 60) // 计算整数分钟数
        return hour + '小时' + min + '分钟'
      } else {
        return 0
      }
    },
    permission() {
      const { orderState } = this
      if (orderState.value === 10) {
        return 'ORDER_CANCEL'
      } else if (orderState.value === 20) {
        return 'ORDER_PRE_SALE_CANCEL'
      } else if (orderState.value === 30) {
        return 'ORDER_OWNED_CANCEL'
      } else if (orderState.value === 40) {
        return 'ORDER_PURCHASE_CANCEL'
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
  filters: {
    changeTime(val) {
      let total = val // 剩余秒数
      let hour = parseInt(total / (60 * 60)) // 计算整数小时数
      let min = parseInt((total - hour * 60 * 60) / 60) // 计算整数分钟数
      return hour + '小时' + min + '分钟'
    }
  },
  methods: {
    handleCancelBtn() {
      this.dialogFormVisible = true
    },
    handleCancel(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { orderNum } = this.$route.query
          asyncOrderCancel({ orderNum, ...this.form }).then(res => {
            if (res.code === 200) {
              this.dialogFormVisible = false
              this.$message.success(res.message || '请求成功')
              this.$emit('update')
            }
          })
        } else {
          return false
        }
      })
    },
    handleClose(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    formatDate(time, format) {
      if (!time) return ''
      let t = new Date(time)
      let tf = function(i) { return (i < 10 ? '0' : '') + i }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
          case 'MM':
            return tf(t.getMonth() + 1)
          case 'mm':
            return tf(t.getMinutes())
          case 'dd':
            return tf(t.getDate())
          case 'HH':
            return tf(t.getHours())
          case 'ss':
            return tf(t.getSeconds())
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
</style>
