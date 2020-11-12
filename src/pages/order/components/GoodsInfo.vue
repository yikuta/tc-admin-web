<template>
  <div class="order-detail-list">
    <p class="order-text">商品信息
      <span style="color:#FF0005;margin-left:30px;font-size:14px">发货状态：{{goodsInfo.orderShipmentState | statusDescrible}}</span>
      <el-button
        size="small"
        type="primary"
        @click="handleShipmentesBtn"
        :disabled="!form.orderDetailId||form.orderDetailId.length===0"
        v-np='orderState.value==10?"ORDER_SHIP":(orderState.value==40?"ORDER_PURCHASE_SHIP":"")'
        v-if="orderState.value==30||orderState.value==40"
      >发货</el-button>
      <el-button
        size="small"
        type="primary"
        @click="handlePushBtn"
        style="margin-right:10px"
        v-np='orderState.value==10?"ORDER_PUSH_OMS":(orderState.value==40?"ORDER_PURCHASE_PUSH_OMS":"")'
        v-if="canPush"
      >推送OMS</el-button>
    </p>
    <el-table
      :data="tableData"
      header-row-class-name="table-head"
      @selection-change="handleSelectionChange"
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column
        type="selection"
        v-if="orderState.value==30||orderState.value==40"
        width="55"
        key='skuNo'
        :selectable='checkboxSelect'>
      </el-table-column>
      <el-table-column
        prop="goodsInfo"
        label="商品"
        key='channelCommodityNo'
      >
        <template slot-scope="scope">
          <div style="margin-bottom:5px;overflow:hidden" v-if="scope.row.pkgNo">
            <span class="table-img table-text-vo">套餐</span>
            <div class="table-text" style="width:calc(100% - 85px)">
              <p>{{scope.row.pkgName}}</p>
              <p>业务商品编码：{{ scope.row.pkgNo }}</p>
            </div>
          </div>
          <div style="margin-bottom:5px;overflow:hidden" v-else>
            <img
              :src="scope.row.channelCommodityThumbnailImage"
              alt=""
              style="margin-right:5px"
              class="table-img"
            />
            <div class="table-text" style="width:calc(100% - 85px)">
              <p>名称：
                <span>{{scope.row.channelCommodityName}}</span>
              </p>
              <p>{{scope.row.ispkg?'基础商品编码':'编码'}}：{{ scope.row.channelCommodityNo }}</p>
              <p>规格：
                <span v-if="!scope.row.skuInfo||scope.row.skuInfo.toString()==='[]'">-</span>
                <span v-for="(item,index) in JSON.parse(scope.row.skuInfo.replace(/\\/g, ''))" :key="index" v-else>{{item.specName}}:{{item.name}}&nbsp;&nbsp;</span>
              </p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="singlePrice"
        label="单价（元）"
        width="100"
        align="center"
        key='singlePrice'
      >
        <template slot-scope="scope">
          <div> {{ scope.row.sellingPrice | goodsMoney(scope.row.pkgNo) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="count"
        label="数量"
        width="100"
        align="center"
        key='count'
      >
        <template slot-scope="scope">
          <div>
            {{ scope.row.num }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="totalPrice"
        label="小计"
        width="100"
        align="center"
        key='totalPrice'
      >
        <template slot-scope="scope">
          <div>{{ scope.row.numSellingPrice  | goodsMoney(scope.row.pkgNo) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="discount"
        label="优惠"
        width="100"
        align="center"
      >
        <template slot-scope="scope">
          <div>
            <span v-if="isBuy">{{ scope.row.numPreferential | goodsMoney(scope.row.pkgNo) }}</span>
            <div v-else>
              <el-popover
                title=""
                width="520"
                trigger="hover"
                @show='handleGoodsGridList(scope.row)'
              >
                <el-table
                  :data="gridGoodsData"
                  border
                >
                  <el-table-column
                    prop="type"
                    label="优惠类型"
                  >
                    <template slot-scope="scope">
                      <div>{{ scope.row.discountType | statusDescrible }}</div>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="discountMoney"
                    label="优惠金额（元）"
                  ></el-table-column>
                  <el-table-column
                    prop="remark"
                    label="优惠项"
                  ></el-table-column>
                </el-table>
                <span
                  slot="reference"
                  :class="{'discount-img':!scope.row.pkgNo}"
                ></span>
              </el-popover>

              {{ scope.row.numPreferential | goodsMoney(scope.row.pkgNo) }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="pay"
        label="实际支付"
        width="100"
        align="center"
        key='pay'
      >
        <template slot-scope="scope">
          <div>{{ scope.row.numActualPrice | goodsMoney(scope.row.pkgNo) }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="flagDelivery"
        label="商品状态"
        width="130"
      >
        <template slot-scope="scope">
          <div>
            <span :style="scope.row.viewLogisticsFlag?'color:#AAAAAA':''">{{ scope.row.pkgNo ? '' : scope.row.orderItemState ? scope.row.orderItemState.describe : '-'}}</span>
            <a href="javascript:;" style="color:#3F9CFC;margin-left:6px" v-if="scope.row.viewLogisticsFlag" @click="handleSearchLogisticsBtn(scope.row)">查看物流</a>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="afterSale"
        label="售后"
        width="100"
        align="center"
        v-if="orderState.value !== 10 && orderType.value !== 3 && orderState.value !== 60 && orderState.value !== 40"
      >
        <template slot-scope="scope">
          <div v-if="!scope.row.pkgNo">
            <el-button
              size="mini"
              style="color:#3F9CFC"
              @click="handleClick(scope.row.orderDetailId)"
              v-np='orderType.value === 1 ? "AFTER_SALE_DELIVERY_REQ_CREATE" : "AFTER_SALE_SHOP_REQ_CREATE"'
              >添加售后</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="order-detail-info">
      <dl
        v-for="(item,index) in goodsInfo.totalInfo"
        :key="index"
      >
        <dt v-if="item.label=='优惠：'">
          <p slot="reference" v-if="isBuy">
            优惠： 
          </p>
          <el-popover
            title=""
            width="520"
            trigger="hover"
            placement='left'
            v-else
            @show='handleOrderGridList'
          >
            <el-table
              :data="gridData"
              border
            >
              <el-table-column
                prop="type"
                label="优惠类型"
              >
                <template slot-scope="scope">
                  <div>{{ scope.row.discountType | statusDescrible }}</div>
                </template>
              </el-table-column>
              <el-table-column
                prop="discountMoney"
                label="优惠金额（元）"
              ></el-table-column>
              <el-table-column
                prop="remark"
                label="优惠项"
              ></el-table-column>
            </el-table>
            <p slot="reference">
              <span class="discount-img"></span>
              优惠：
            </p>
          </el-popover>
        </dt>
        <dt v-else>{{item.label}}</dt>
        <dd :style="item.label=='实付金额：'">{{item.value | goodsMoney}}</dd>
      </dl>
    </div>
    <!-- 发货弹窗 -->
    <el-dialog
      title="发货"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal='false'
      width='520px'
      @close="handleClose('shipmentsForm')"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="shipmentsForm"
        label-width="80px"
      >
        <el-form-item
          label="发货方式"
          prop='orderLogisticsType'
        >
          <el-radio-group v-model="form.orderLogisticsType" @change='handleChangeType'>
            <el-radio label="ACTUAL">实物发货</el-radio>
            <el-radio label="VIRTUAL">虚拟商品</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="物流公司"
          prop='code'
          v-if="form.orderLogisticsType==='ACTUAL'"
        >
          <el-select
            v-model="form.code"
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
          v-if="form.orderLogisticsType==='ACTUAL'"
        >
          <el-input v-model="form.logisticsNum"></el-input>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose('shipmentsForm')">取 消</el-button>
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
          <el-col :span="10">发货方式：{{logisticsMerchantsName}}</el-col>
          <el-col :span="14">快递单号：{{logisticsNum}}</el-col>
        </el-row>
      </div>
      <div class="logistics-content" v-if="logisticsList.length>0">
        <dl v-for="(item,index) in logisticsList" :key="index">
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
import { asyncOrderShip, fetchLogisticsDetail, fetchDiscountDetailByGoods, fetchDiscountDetailByOrder, asyncOrderDetailToAfterSale } from '@/api/order'
function generateKey(data = []) {
  return data.map((item) => {
    item.key = (Math.random() * 100000).toString()
    return item
  })
}
export default {
  props: {
    goodsInfo: {
      type: Object,
      default: () => {
        return {
          skuInfos: [],
          orderDetailPkgVos: []
        }
      }
    },
    orderState: {
      type: Object,
      default: () => {}
    },
    orderType: {
      type: Object,
      default: () => {}
    },
    isBuy: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    this.checkboxSelect = (item) => {
      if (item.flagDelivery === true || item.pkgNo || !item.storeFlag || !item.deliverGoodsFlag) {
        return false
      } else {
        return true
      }
    }
    return {
      gridGoodsData: [
        {
          type: '会员积分1',
          momey: '-10.00',
          object: '积分-100分'
        }
      ],
      gridData: [
        {
          type: '会员积分',
          momey: '-10.00',
          object: '积分-100分'
        }
      ],
      dialogFormVisible: false,
      form: {
        orderLogisticsType: 'ACTUAL',
        code: '',
        logisticsMerchantsName: '',
        logisticsNum: '',
        orderDetailId: []
      },
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
      rules: {
        orderLogisticsType: [
          { required: true, message: '请选择发货方式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请选择物流公司', trigger: 'change' }
        ],
        logisticsNum: [{ required: true, message: '请填写配送单号', trigger: 'blur' }]
      },
      loading: false,
      logisticsDialogVisible: false,
      logisticsList: [],
      logisticsMerchantsName: '',
      logisticsNum: '',
      hasChildren: true,
      expandAll: true
    }
  },
  computed: {
    tableData() {
      let arr = []
      if (this.goodsInfo.orderDetailPkgVos && this.goodsInfo.orderDetailPkgVos.length) {
        arr = this.goodsInfo.orderDetailPkgVos.map(item => {
          return {
            pkgName: item.pkgName,
            pkgImg: item.pkgImg,
            pkgNo: item.pkgNo,
            pkgNum: item.pkgNum,
            skuInfos: item.skuInfos
          }
        })
      }
      let list = this.haveChildren(arr, [])
      return generateKey(this.goodsInfo.skuInfos.concat(list))
    },
    canPush() {
      let arr = this.tableData.filter(item => item.storeFlag && item.orderItemState && item.orderItemState.value === 2)
      return arr && arr.length > 0
    }
  },
  filters: {
    // 给商品价格加补 ￥
    goodsMoney: (value, isVo) => {
      // isVo--是否是套餐
      return value || value === 0 ? '￥' + value.toFixed(2) : (isVo ? '' : '-')
    }
  },
  methods: {
    haveChildren(data, list) {
      if (data && data.length) {
        data.forEach(item => {
          if (item.skuInfos && item.skuInfos.length) {
            list.push(item)
            let arr = item.skuInfos.map(item => {
              return {
                ispkg: true,
                ...item
              }
            })
            list = list.concat(arr)
          }
        })
      }
      return list
    },
    handleShipmentesBtn() {
      this.dialogFormVisible = true
    },
    handlePushBtn() {
      if (this.form.orderDetailId && this.form.orderDetailId.length) {
        const { orderDetailId } = this.form
        let arr = []
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < orderDetailId.length; j++) {
            if (this.tableData[i].orderDetailId === orderDetailId[j]) {
              arr.push(this.tableData[i].channelCommodityName)
            }
          }
        }
        this.$emit('push', this.form.orderDetailId, arr)
      } else {
        this.$message('请先选择需要推送的商品')
      }
    },
    handleShipmentes(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.loading = true
          const { orderNum } = this.$route.query
          if (this.form.orderLogisticsType === 'ACTUAL') {
            this.form.logisticsMerchantsName = this.companyList.filter(item => item.value === this.form.code)[0].label
          } else {
            delete this.form.logisticsMerchantsName
          }
          asyncOrderShip({ ...this.form, orderNum }).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$message.success(res.message)
              this.$emit('update')
              this.handleClose(formName)
            }
          }).catch(() => {
            this.loading = false
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
    handleSelectionChange(selection) {
      this.form.orderDetailId = selection.map(item => item.orderDetailId)
    },
    handleChangeType(val) {
      if (val === 2) {
        delete this.form.logisticsNum
        delete this.form.code
      }
    },
    handleSearchLogisticsBtn(row) {
      this.logisticsDialogVisible = true
      this.handleLogisticsList(row.orderDetailId)
    },
    handleLogisticsList(id) {
      fetchLogisticsDetail(id).then(res => {
        if (res.code === 200) {
          this.logisticsList = res.result.logisticsInfo ? JSON.parse(res.result.logisticsInfo) : []
          this.logisticsMerchantsName = res.result.logisticsMerchantsName
          this.logisticsNum = res.result.logisticsNum
        } else {
          this.logisticsList = []
        }
      }).catch(() => {
        this.logisticsList = []
      })
    },
    handleGoodsGridList(row) {
      fetchDiscountDetailByGoods(row.orderDetailId).then(res => {
        if (res.code === 200) {
          this.gridGoodsData = res.result || []
        } else {
          this.gridGoodsData = []
        }
      }).catch(() => {
        this.gridGoodsData = []
      })
    },
    handleOrderGridList() {
      const { orderNum } = this.$route.query
      fetchDiscountDetailByOrder(orderNum).then(res => {
        if (res.code === 200) {
          this.gridData = res.result || []
        } else {
          this.gridData = []
        }
      }).catch(() => {
        this.gridData = []
      })
    },
    handleClick(orderDetailId) {
      asyncOrderDetailToAfterSale({
        orderNum: this.$route.query.orderNum,
        orderDetailId
      }).then(res => {
        if (res.code === 200) {
          if (res.result.afterSaleOrderVoState) {
            if (res.result.afterSaleOrderVoState === 'APPLY_AFTER_SALE') {
              this.$router.push({ path: '/afterSale/workOrderCreate', query: { orderNum: this.$route.query.orderNum, orderDetailId: orderDetailId }})
            } else if (res.result.afterSaleOrderVoState === 'NOT_APPLY_AFTER_SALE') {
              this.$message('该商品不允许申请售后')
            } else if (res.result.afterSaleOrderVoState === 'AFTER_SALE_ING') {
              this.$message('该商品正在售后中')
            } else if (res.result.afterSaleOrderVoState === 'AFTER_SALE_SUCCESS') {
              this.$message('该商品已经售后完成')
            } else if (res.result.afterSaleOrderVoState === 'REFUND_ING') {
              this.$message('该商品正在退款中，不允许申请售后')
            } else if (res.result.afterSaleOrderVoState === 'REFUND_SUCCESS') {
              this.$message('该商品已经退款完成，不允许申请售后')
            } else if (res.result.afterSaleOrderVoState === 'SALE_REJECT') {
              this.$message('该商品售后拒绝申请')
            } else if (res.result.afterSaleOrderVoState === 'SALE_FAIL') {
              this.$message('该商品售后失败')
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
.discount-img {
  display: inline-block;
  width: 22px;
  height: 22px;
  background: url('~@/assets/images/u296.png') no-repeat center center;
  background-size: cover;
  cursor: pointer;
  vertical-align: middle;
}
.order-detail-info {
  overflow: hidden;
  float: right;
  dl {
    overflow: hidden;
    display: flex;
    dt {
      text-align: right;
      width: 100px;
    }
    dd {
      text-align: right;
      width: 100px;
    }
  }
}
.table-img{
  margin-right:5px;
  border: 1px solid #999;
  width: 80px;
  height: 80px;
  float: left;
}
.table-text-vo{
  display: inline-block;
  border: 0;
  text-align: center;
  line-height: 80px;
  color: #D9001B;
}
.table-text{
  float: left;
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
.after-sale-btn{
  color:#3F9CFC;
  border:1px solid #3F9CFC;
  width: 80px;
  border-radius: 4px;
  display: inline-block;
}
</style>
