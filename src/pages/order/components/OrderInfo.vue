<template>
  <div class="order-detail-list">
    <p class="order-text"><span class="line"></span>订单基本信息</p>
    <div class="order-list">
      <dl
        v-for="(item,index) in baseInfo"
        :key="index"
      >
        <dt>{{item.label}}</dt>
        <!-- <dd :style="'color:'+item.color" v-if="item.key=='createTime'">{{item.value | format('yyyy-MM-dd HH:mm:ss')}}</dd> -->
        <dd :style="'color:'+item.color">{{item.value}}</dd>
      </dl>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    baseInfo: Array
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
</style>
