<template>
  <div class="app-container">
    <express-detail-head title="工单详情" />
    <div class="express-detail-container">
      <order-info :baseInfo='baseInfo' :permission="orderType && orderType.value === 3 ? 'AFTER_SALE_SHOP_REL_ORDER_VIEW' : 'AFTER_SALE_REQ_REL_ORDER_VIEW'"/>
      <after-goods :tableData='goodsList'/>
      <sale-question :questionInfo='questionInfo'/>
      <process-record :recordList='recordList' :permission="orderType && orderType.value === 3 ? 'AFTER_SALE_SHOP_SOLUTION_VIEW' : 'AFTER_SALE_REQ_SOLUTION_VIEW'"/>
      <log-info :logList="logList"/>
    </div>
  </div>
</template>
<script>
import { Common } from './templates'
import { QUESTION_INFO } from './config'
import { fetchAfterSaleDetailByAfterSaleNum } from '@/api/afterSale'
export default {
  components: {
    ...Common
  },
  data() {
    return {
      baseInfo: [
        {
          label: '工单编号',
          value: '',
          key: 'afterSaleNum'
        },
        {
          label: '关联订单',
          value: '',
          key: 'orderNum'
        },
        {
          label: '业务类型',
          value: '',
          key: 'orderType'
        },
        {
          label: '申请售后类型',
          value: '',
          key: 'requestType'
        },
        {
          label: '工单发起',
          value: '',
          key: 'afterSaleSource'
        },
        {
          label: '申请时间',
          value: '',
          key: 'createTime'
        },
        {
          label: '客户姓名',
          value: '',
          key: 'memberName'
        },
        {
          label: '客户电话',
          value: '',
          key: 'memberPhone'
        },
        {
          label: '售后状态',
          value: '',
          key: 'afterSaleState'
        },
        {
          label: '拒绝原因',
          value: '',
          key: 'rejectReason'
        }
      ],
      goodsList: [],
      questionInfo: QUESTION_INFO,
      recordList: [],
      logList: [],
      orderType: {}
    }
  },
  mounted() {
    this.handleDetail()
  },
  methods: {
    handleDetail() {
      const { afterSaleNum, generateNum } = this.$route.query
      fetchAfterSaleDetailByAfterSaleNum(afterSaleNum, generateNum).then(res => {
        if (res.code === 200) {
          const { result } = res
          this.baseInfo.map(item => {
            if (
              typeof result.baseAfterSaleInfo[item.key] === 'object' &&
              result.baseAfterSaleInfo[item.key]
            ) {
              item.value = result.baseAfterSaleInfo[item.key].describe
            } else {
              item.value = result.baseAfterSaleInfo[item.key] || '-'
            }
          })
          this.orderType = result.baseAfterSaleInfo['orderType']
          this.goodsList = result.baseAfterSaleCommodityInfos || []
          this.questionInfo.map(item => {
            item.value = result.baseAfterSaleQuestion[item.key] || '-'
          })
          this.recordList = result.auditRecordVos || []
          this.logList = result.operationLogs || []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.express-detail-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  padding: 20px;
  overflow: hidden;
}
</style>