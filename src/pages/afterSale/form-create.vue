<template>
  <div class="app-container">
    <express-detail-head title="创建工单" />
    <div class="express-detail-container">
      <order-info :baseInfo='baseInfo' :permission="orderType && orderType.value === 3 ? 'AFTER_SALE_SHOP_REL_ORDER_VIEW' : 'AFTER_SALE_REQ_REL_ORDER_VIEW'"/>
      <after-sale-goods :tableData='goodsList' :hasStore='true'/>
      <el-form ref="form" :model="form" size="small" label-position='top'>
        <el-row>
          <el-col :span="12">
            <el-form-item label="售后原因">
              <el-select v-model="form.requestReason" placeholder="请选择售后原因">
                <el-option v-for="item in resonList" :key="item.id" :label="item.name" :value="item.name"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="问题描述">
              <el-input type="textarea" v-model="form.requestDescription"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="上传凭证">
             <upload-file
                type="IMAGE"
                :limit="4"
                :fileList="form.imgList"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <deal-order
        :btnsLength='5'
        :goodsList='goodsList'
        @submit='handleSubmit'
        :refundableAmount='refundableAmount'
        :commoditySumActualPayment='commoditySumActualPayment'
        :commoditySumFreight='commoditySumFreight'
        :orderNum='$route.query.orderNum'
        :orderState='orderState'
        :orderType='orderType'/>
    </div>
  </div>
</template>
<script>
import { Common, FormCreate, DealWith } from './templates'
import UploadFile from '@/components/UploadFile'
import { findDataListByCode } from '@/api/common'
import { fetchAfterSaleOrderDetail, asyncAfterSaleCreate } from '@/api/afterSale'
export default {
  components: {
    ...Common,
    ...FormCreate,
    ...DealWith,
    UploadFile
  },
  data() {
    return {
      baseInfo: [
        {
          label: '订单编号',
          value: '',
          key: 'orderNum'
        },
        {
          label: '订单状态',
          value: '',
          key: 'orderState'
        },
        {
          label: '订单类型',
          value: '',
          key: 'orderType'
        },
        {
          label: '下单时间',
          value: '',
          key: 'orderCreateTime'
        }
      ],
      goodsList: [],
      orderState: {},
      form: {
        requestReason: '',
        requestDescription: '',
        imgList: []
      },
      goodsInfo: {},
      resonList: [],
      orderType: {},
      refundableAmount: 0, // 可退金额
      commoditySumActualPayment: 0, // 实付金额
      commoditySumFreight: 0 // 运费金额
    }
  },
  mounted() {
    this.handleOrderDetail()
    this.handleResonList()
  },
  methods: {
    /**
     * @description: 获取订单详情
     */
    handleOrderDetail() {
      const { orderNum, orderDetailId } = this.$route.query
      fetchAfterSaleOrderDetail({ orderNum, orderDetailId }).then(res => {
        if (res.code === 200 && res.result) {
          const { result } = res
          this.goodsInfo = result
          // 订单基本信息
          if (result.afterSaleOrderInfoDto) {
            this.baseInfo.map(item => {
              if (
                typeof result.afterSaleOrderInfoDto[item.key] === 'object' &&
                result.afterSaleOrderInfoDto[item.key]
              ) {
                item.value = result.afterSaleOrderInfoDto[item.key].describe
              } else {
                item.value = result.afterSaleOrderInfoDto[item.key]
              }
            })
            // 订单类型
            this.orderState = result.afterSaleOrderInfoDto.orderState
            this.orderType = result.afterSaleOrderInfoDto.orderType
          }
          // 商品信息
          this.goodsList = result.afterSaleCommodityInformationDto || []
          // 可退金额
          this.refundableAmount = result.refundableAmount || 0
          this.commoditySumActualPayment = result.commoditySumActualPayment || 0
          this.commoditySumFreight = result.commoditySumFreight || 0
        }
      })
    },
    /**
     * @description: 获取售后原因列表
     */
    handleResonList() {
      findDataListByCode('AFTER_SALE_REASON').then(res => {
        if (res.code === 200) {
          this.resonList = res.result || []
        } else {
          this.resonList = []
        }
      })
    },
    handleSubmit(info, afterSaleChooseTreatmentPlan) {
      this.$confirm('是否确认方案', '提示', {}).then(() => {
        let obj = {}
        if (afterSaleChooseTreatmentPlan === 'REFUND') {
          obj = {
            commodityRefundAmount: info ? info.actualRefundAmount : '',
            freightRefundAmount: info ? info.freightRefundAmount : 0
          }
          // if (info && info.actualRefundAmount) {
          //   obj = {
          //     commodityRefundAmount: info ? info.actualRefundAmount : '',
          //     freightRefundAmount: info ? info.freightRefundAmount : 0
          //   }
          // } else {
          //   this.$message.error('实际退款金额不能为空或0')
          //   return
          // }
        } else if (afterSaleChooseTreatmentPlan === 'RETURN_REFUND') {
          obj = {
            omsStoreInfo: { ...info }
          }
        } else if (afterSaleChooseTreatmentPlan === 'COUPON_COMPENSATION') {
          if (info && info.length > 0) {
            obj = {
              detailCouponRecordDtoList: info.map(item => {
                return {
                  couponCode: item.couponCode,
                  couponNum: item.number
                }
              })
            }
          } else {
            this.$message.error('请选择优惠券')
            return
          }
        } else if (afterSaleChooseTreatmentPlan === 'REJECT_APPLICATION') {
          obj = {
            rejectReason: info.rejectReason
          }
        } else if (afterSaleChooseTreatmentPlan === 'EXCHANGE') {
          obj = {
            baseExchangeCommodityInfo: info.baseExchangeCommodityInfo || {},
            omsStoreInfo: info.omsStoreInfo
          }
        } else if (afterSaleChooseTreatmentPlan === 'SUPPLEMENTARY_DELIVERY') {
          obj = {
            reshipmentGoodsInfoDto: info || []
          }
        }
        let common = {
          afterSaleChooseTreatmentPlan,
          orderDetailIds: this.goodsInfo.afterSaleCommodityInformationDto.map((item) => item.orderDetailId),
          orderNum: this.goodsInfo.afterSaleOrderInfoDto.orderNum,
          baseAfterSaleQuestion: {
            afterSaleImage: this.form.imgList.map(item => item.fileUrl),
            requestDescription: this.form.requestDescription,
            requestReason: this.form.requestReason
          },
          saleSource: 'MANUAL_INSERT'
        }
        asyncAfterSaleCreate({ ...common, ...obj }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '创建成功')
            this.$router.push('orderPlatform')
          }
        })
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
