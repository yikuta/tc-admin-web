<template>
  <div class="app-container">
    <div class="express-detail-head">
      <span>配送单详情</span>
      <el-button size='small' type="primary" @click="$router.go(-1)">返回</el-button>
    </div>
    <!-- 基本信息 -->
    <div class="base-info info">
      <p class="order-text">基本信息</p>
      <div class="order-list">
        <el-row>
          <el-col
            :span='12'
            v-for="(item,index) in baseInfo"
            :key="index"
          >
            <dl>
              <dt>{{item.label}}</dt>
              <dd v-if="item.key == 'deliveryStatus'" :title='typeof item.value === "object" ? (item.value&&item.value["describe"]) : item.value | statusDescrible'>{{typeof item.value === 'object' ? (item.value&&item.value['describe']) : item.value | statusDescrible}}</dd>
              <dd v-else :title='typeof item.value === "object" ? (item.value&&item.value["describe"]) : item.value'>{{typeof item.value === 'object' ? (item.value&&item.value['describe']) : item.value}}</dd>
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
    <!-- 收货/配送信息 -->
    <div class="delivery-info info">
      <p class="order-text">收货/配送信息</p>
      <div class="order-list">
        <el-row>
          <el-col
            :span='12'
            v-for="(item,index) in deliveryInfo"
            :key="index"
          >
            <dl>
              <dt>{{item.label}}</dt>
              <dd 
                :style="`${item.link?'color:#409EFF;cursor:pointer':''}`" 
                @click="handleClick(item.link, 'shopCode')"
                :title='typeof item.value === "object" ? (item.value&&item.value["describe"]) : item.value'>
                {{typeof item.value === 'object' ? (item.value&&item.value['describe']) : item.value}}
              </dd>
            </dl>
          </el-col>
          <el-col :span='12' v-if="deliveryInfo.length%2===1">
            <dl>
              <dt></dt>
              <dd></dd>
            </dl>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 配送员信息 -->
    <div class="delivery-info info">
      <p class="order-text">配送员信息</p>
      <div class="order-list">
        <el-row>
          <el-col
            :span='12'
            v-for="(item,index) in transportInfo"
            :key="index"
          >
            <dl>
              <dt>{{item.label}}</dt>
              <dd 
                :style="`${item.link?'color:#409EFF;cursor:pointer':''}`" 
                @click="handleClick(item.link, 'shopCode')"
                :title='typeof item.value === "object" ? (item.value&&item.value["describe"]) : item.value'>
                {{typeof item.value === 'object' ? (item.value&&item.value['describe']) : item.value}}
              </dd>
            </dl>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 订单及商品信息 -->
    <div class="order-info info">
      <p class="order-text">订单及商品信息</p>
      <div class="order-list">
        <el-row>
          <el-col :span='12'>
            <dl>
              <dt>{{orderInfo[0].label}}</dt>
              <dd :style="`${orderInfo[0].link?'color:#409EFF;cursor:pointer':''}`" @click="handleOrderClick(orderInfo[0].link, 'orderNo')">{{typeof orderInfo[0].value === 'object' ? (orderInfo[0].value&&orderInfo[0].value['describe']) : orderInfo[0].value}}</dd>
            </dl>
          </el-col>
          <el-col :span='12'>
            <dl>
              <dt>{{orderInfo[1].label}}</dt>
              <dd>{{typeof orderInfo[1].value === 'object' ? (orderInfo[1].value&&orderInfo[1].value['describe']) : orderInfo[1].value | orderStatus}}</dd>
            </dl>
          </el-col>
          <el-col :span='24'>
            <dl style="height: unset;display:flex;">
              <dt style="width: 150px;">{{orderInfo[2].label}}</dt>
              <dd style="margin:0;flex:1;">
                <el-table
                  :data="orderInfo[2].value"
                  style="width: 100%"
                  size="mini">
                  <el-table-column prop="channelCommodityNo" label="商品编码"></el-table-column>
                  <el-table-column prop="channelCommodityName" label="商品名称"></el-table-column>
                  <el-table-column prop="num" label="购买数量"></el-table-column>
                </el-table>
              </dd>
            </dl>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 操作日志 -->
    <div class="order-info info">
      <p class="order-text">操作日志</p>
      <base-table :columns="dColumns" :list="tableData"></base-table>
    </div>
    <!-- 配送单处理 --> 
    <!-- <div class="order-info info">
      <p class="order-text">配送单处理</p>
      <div class="order-list">
        <el-form :model="deliverInfo" label-width="150px" size="mini">
          <el-row>
            <el-col :span="12">
              <el-form-item label="运维人员姓名">{{deliverInfo.name}}</el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="运维人员手机">{{deliverInfo.tel}}</el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="处理为线下配送">
                <el-radio v-model="deliverInfo.radio" label="1">是</el-radio>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="备注">
                <el-input
                  type="textarea"
                  :rows="5"
                  placeholder="请输入备注"
                  v-model="deliverInfo.remark">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div> -->
    <!-- <div class="btn">
      <el-button type="primary" size="small" @click="submit">确认处理</el-button>
      <el-button size="small" @click="$router.go(-1)">取消</el-button>
    </div> -->
  </div>
</template>
<script>
import { getShopOrderDeliveryDetail } from '@/api/order'
import BaseTable from '@/components/BaseTable'
export default {
  components: {
    BaseTable
  },
  data() {
    return {
      baseInfo: [
        {
          label: '配送单号',
          key: 'deliveryNo',
          value: ''
        },
        {
          label: '配送费用',
          key: 'deliveryFee',
          value: ''
        },
        {
          label: '生单时间',
          key: 'createTime',
          value: ''
        },
        {
          label: '配送方式',
          key: 'deliveryType',
          value: ''
        },
        {
          label: '配送状态',
          key: 'deliveryStatus',
          value: ''
        },
        {
          label: '备注',
          key: 'remark',
          value: ''
        }
      ],
      deliveryInfo: [
        {
          label: '下单门店',
          key: 'name',
          value: '',
          link: '/seller/shopDetail'
        },
        {
          label: '门店编码',
          key: 'shopCode',
          value: ''
        },
        {
          label: '门店地址',
          key: 'shopAddress',
          value: ''
        },
        {
          label: '商家手机',
          key: 'managerTel',
          value: ''
        },
        {
          label: '下单用户',
          key: 'memberPhone',
          value: ''
        },
        {
          label: '收货人姓名',
          key: 'orderReceiver',
          value: ''
        },
        {
          label: '收货人手机',
          key: 'contactInformation',
          value: ''
        },
        {
          label: '收货人地址',
          key: 'receiveAddress',
          value: ''
        },
        {
          label: '期望送达时间',
          key: 'selfMentionTime',
          value: ''
        }
      ],
      transportInfo: [
        {
          label: '配送员',
          key: 'transporterName',
          value: ''
        },
        {
          label: '手机',
          key: 'transporterPhone',
          value: ''
        },
        {
          label: '接单时间',
          key: 'fetchTime',
          value: ''
        },
        {
          label: '送达时间',
          key: 'finishTime',
          value: ''
        }
      ],
      orderInfo: [
        {
          label: '订单编号',
          key: 'orderNo',
          value: '',
          link: '/order/merchantOwnedDetail'
        },
        {
          label: '订单状态',
          key: 'orderStatus',
          value: ''
        },
        {
          label: '订单商品',
          key: 'orderItems',
          value: ''
        }
      ],
      deliverInfo: {},
      dColumns: [
        {
          title: '操作时间',
          prop: 'createTime'
        },
        {
          title: '操作内容',
          prop: 'content'
        },
        {
          title: '操作人',
          prop: 'operator',
          width: 200
        }
      ],
      tableData: []
    }
  },
  filters: {
    statusDescrible: (val) => {
      switch (val) {
        case 10:
          return '待配送'
          // break
        case 20:
          return '配送中'
          // break
        case 30:
          return '已送达'
          // break
        case 40:
          return '已取消(配送员取消)'
          // break
        case 50:
          return '已取消(超时未抢单)'
          // break
        case 60:
          return '妥投异常'
      }
    },
    orderStatus: (val) => {
      switch (val) {
        case -1:
          return '已取消'
        case 1:
          return '待接单'
        case 2:
          return '备货中'
        case 3:
          return '待配送'
        case 4:
          return '配送中'
        case 5:
          return '线下配送'
        case 6:
          return '待自提'
        case 7:
          return '待签收'
        case 8:
          return '已完成'
      }
    }
  },
  mounted() {
    this._getShopOrderDeliveryDetail({ id: this.$route.query.id })
  },
  methods: {
    submit() {
      // 处理
    },
    _getShopOrderDeliveryDetail(data) {
      return getShopOrderDeliveryDetail(data).then((res) => {
        if (res.code === 200) {
          this.baseInfo.map(item => {
            if (item.key === 'deliveryStatus') {
              item.value = res.result[item.key] | this.statusDescrible
            } else {
              item.value = res.result[item.key]
            }
          })
          this.deliveryInfo.map(item => {
            item.value = res.result[item.key]
          })
          this.transportInfo.map(item => {
            item.value = res.result[item.key]
          })
          this.tableData = res.result.orderLogs || []
          this.orderInfo.map(item => {
            if (item.key === 'orderStatus') {
              item.value = res.result[item.key] | this.orderStatus
            } else {
              item.value = res.result[item.key]
            }
          })
        }
      })
    },
    handleClick(link, code) {
      let value = ''
      if (link) {
        this.deliveryInfo.map(item => {
          if (item.key === code) {
            value = item.value
          }
        })
        this.$router.push({ path: link, query: { code: value }})
      } else {
        return
      }
    },
    handleOrderClick(link, code) {
      let value = ''
      if (link) {
        this.orderInfo.map(item => {
          if (item.key === code) {
            value = item.value
          }
        })
        this.$router.push({ path: link, query: { orderNum: value }})
      } else {
        return
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.app-container {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ebeef5;
  padding: 20px;
  overflow: hidden;
  .express-detail-head{
    display: flex;
    justify-content: space-between;
    padding: 0 0 10px;
    font-size: 14px;
    span{
      line-height: 32px;
      &::before{
        content: '';
        display: inline-block;
        width: 5px;
        height: 20px;
        background: rgba(64, 158, 255, 1);
        float: left;
        margin: 6px 8px 0 0;
      }
    }
  }
}
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
/deep/ .table-head th{
  background: #f9fafc !important
}
.info {
  margin-top: 20px;
}
.btn {
  text-align: center;
  margin: 20px 0 40px;
}
</style>
