<template>
  <div class="order-detail-list">
    <p class="order-text"><span class="line"></span>订单信息</p>
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
p{
  margin: 0;
  padding: 0;
}
.order-text{
  background-color: #f5f7fa;
  border-bottom: 1px solid #e1e8ed;
  padding: 0 20px;
  font-size: 16px;
  color: #333;
  margin: 0;
  overflow: hidden;
  height: 54px;
  line-height: 54px;
}
.order-text button{
  float: right;
  margin-top: 10px;
}
.order-text::before{
  content: '';
  display: inline-block;
  width: 5px;
  height: 16px;
  background: rgba(64, 158, 255, 1);
  float: left;
  margin: 17px 8px 0 0;
}
.order-detail-list{
  margin-bottom: 20px;
  overflow: hidden;
}
.order-list dl{
  display: flex;
  border-bottom: 1px solid #e4e4e4;
  height: 40px;
  line-height: 40px;
  margin: 0;
  font-size: 14px;
}
.order-list dt{
  border-right: 1px solid #e4e4e4;
  width: 150px;
  text-align: right;
  padding-right: 20px;
  background: #f9fafc;
}
.order-list dd{
  margin-left: 20px;
}
</style>
