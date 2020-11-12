<template>
  <div class="order-detail-list">
    <p class="order-text"><span class="line"></span>{{title}}</p>
    <div class="order-list">
      <dl
        v-for="(item,index) in questionInfo"
        :key="index"
      >
        <dt>{{item.label}}</dt>
        <dd v-if="item.key === 'afterSaleImage'">
          <el-image class="single-image-small" v-for="(img, i) in item['value']" :src="img" :preview-src-list="item['value']" :key='i'></el-image>
        </dd>
        <dd 
          style="color:#409EFF;cursor:pointer" 
          v-else-if="item.key === 'afterSaleNum'"
          v-np='item.key === "afterSaleNum" ? salePermission : ""'
          @click="handleClick('/afterSale/workOrderDetail','afterSaleNum')">{{item.value}}</dd>
        <dd 
          style="color:#409EFF;cursor:pointer" 
          v-else-if="item.key === 'orderNum'"
          v-np='item.key === "orderNum" ? orderPermission : ""'
          @click="handleOrderClick('orderNum')">{{item.value}}</dd>
        <dd :style="'color:'+item.color" v-else>{{item.value}}</dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    questionInfo: Array,
    title: {
      type: String,
      default: () => '售后问题'
    },
    type: {
      type: String,
      default: () => 'Refund'
    },
    orderType: {
      type: Object,
      default: () => {
        return {
          describe: '',
          value: 1
        }
      }
    }
  },
  computed: {
    orderPermission() {
      if (this.type === 'Refund') {
        return 'AFTER_SALE_REFUND_REL_ORDER_VIEW'
      } else if (this.type === 'ReturnGoods') {
        return 'AFTER_SALE_RETURN_ORDER_REL_REQ_VIEW'
      } else if (this.type === 'AgainSupply') {
        return 'AFTER_SALE_COMPENSATE_ORDER_REL_ORDER_VIEW'
      } else if (this.type === 'SendStamps') {
        return 'AFTER_SALE_EXTRA_COUPON_ORDER_REL_ORDER_VIEW'
      } else if (this.type === 'ExchangeGoods') {
        return 'AFTER_SALE_EXCHANGE_ORDER_REL_ORDER_VIEW'
      }
    },
    salePermission() {
      if (this.type === 'Refund') {
        return 'AFTER_SALE_REFUND_REL_REQ_VIEW'
      } else if (this.type === 'ReturnGoods') {
        return 'AFTER_SALE_RETURN_ORDER_REL_ORDER_VIEW'
      } else if (this.type === 'AgainSupply') {
        return 'AFTER_SALE_COMPENSATE_ORDER_REL_REQ_VIEW'
      } else if (this.type === 'SendStamps') {
        return 'AFTER_SALE_EXTRA_COUPON_ORDER_REL_REQ_VIEW'
      } else if (this.type === 'ExchangeGoods') {
        return 'AFTER_SALE_EXCHANGE_ORDER_REL_REQ_VIEW'
      }
    }
  },
  methods: {
    handleClick(link, code) {
      let value = ''
      if (code) {
        this.questionInfo.map(item => {
          if (item.key === code) {
            value = item.value
          }
        })
        this.$router.push({ path: link, query: { afterSaleNum: value }})
      } else {
        return
      }
    },
    handleOrderClick(code) {
      let value = ''
      let path = '/order/expressServiceDetail'
      if (code) {
        this.questionInfo.map(item => {
          if (item.key === code) {
            value = item.value
          }
        })
        if (this.orderType.value === 1) {
          path = '/order/expressServiceDetail'
        } else if (this.orderType.value === 2) {
          path = '/order/productPreSaleDetail'
        } else if (this.orderType.value === 3) {
          path = '/order/merchantOwnedDetail'
        } else {
          path = '/order/procurementDetail'
        }
        this.$router.push({ path, query: { orderNum: value }})
      } else {
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('./index.scss');
.single-image-small{
  width: 80px;
  height: 80px;
  margin-top: 10px;
  margin-right: 10px;
}
</style>
