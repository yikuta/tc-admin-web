<template>
  <div class="order-detail-list">
    <p class="order-text">工单信息</p>
    <div class="order-list">
      <el-row style="border-right: 1px solid #e4e4e4;">
        <el-col
          :span='12'
          v-for="(item,index) in baseInfo"
          :key="index"
        >
          <dl>
            <dt>{{item.label}}</dt>
            <dd 
              :style="`${item.key==='orderNum'?'color:#409EFF;cursor:pointer':''}`" 
              v-np='item.key==="orderNum"?permission:""'
              @click="handleClick(item.key)">
              {{typeof item.value === 'object' ? (item.value&&item.value['describe']) : item.value}}
            </dd>
          </dl>
        </el-col>
        <el-col :span='12' v-if="baseInfo.length%2===1">
          <dl>
            <dt></dt>
            <dd></dd>
          </dl>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    baseInfo: Array,
    orderType: {
      type: Object,
      default: () => {
        return {
          describe: '',
          value: 1
        }
      }
    },
    permission: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleClick(code) {
      let value = ''
      let path = '/order/expressServiceDetail'
      if (code === 'orderNum') {
        this.baseInfo.map(item => {
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
@import url('./index.scss')
</style>