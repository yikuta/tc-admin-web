<template>
  <div class="order-detail-list">
    <p class="order-text">拼团信息
      <span style="color:#FF0005;margin-left:30px;font-size:14px">拼团状态：{{orderGroupInfo.accomplishGroupStatus?orderGroupInfo.accomplishGroupStatus.describe:''}}</span>
    </p>
    <div class="order-list">
      <el-row>
        <el-col :span='12'>
          <dl>
            <dt>发团时间</dt>
            <dd>{{orderGroupInfo.startGroupDate}}</dd>
          </dl>
        </el-col>
        <el-col :span='12'>
          <dl>
            <dt>拼团成功时间</dt>
            <dd>{{orderGroupInfo.groupSucDate}}</dd>
          </dl>
        </el-col>
      </el-row>
      <div class="table-text">参团人员</div>
      <table-info :columns='columns' :tableData='orderGroupInfo.groupPersonInfo'/>
    </div>
  </div>
</template>
<script>
import TableInfo from './TableInfo'
export default {
  props: {
    orderGroupInfo: {
      type: Object,
      default: () => {}
    }
  },
  components: {
    TableInfo
  },
  data() {
    return {
      tableData: [],
      columns: [
        {
          label: '参与人',
          value: 'memberPhone',
          key: 'memberPhone'
        }, {
          label: '下单时间',
          value: 'createTime'
        }, {
          label: '状态',
          value: 'pay',
          key: 'pay'
        }, {
          label: '支付时间',
          value: 'payTime'
        }
      ]
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
.table-text{
  background: rgba(242, 242, 242, 1);
  text-align: center;
  line-height: 35px;
}
</style>