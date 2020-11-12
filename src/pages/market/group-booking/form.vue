<template>
  <div class="app-container">
    <coupon-show></coupon-show>
    <template>
      <el-form :model="form" :rules="rules" ref="couponForm" label-width="120px" size="mini" class="app-form" :disabled="showDisabled">
        <div>基础信息</div>
        <el-divider></el-divider>
        <el-form-item label="活动名称" prop="groupBuyActivityName">
          <el-input class="input-width" type="text" v-model="form.groupBuyActivityName" placeholder="活动名称" />
        </el-form-item>
        <el-form-item label="发起时间" prop="groupBuyActivityTimeList">
          <div class="">
            <el-date-picker
              v-model="form.groupBuyActivityTimeList"
              ref="availableTimeSetting_fixedTimeList"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="参团时限" prop="joinHours">
          自发起时<el-input class="input-width" type="text" v-model="form.joinHours" placeholder="参团时限" />小时
        </el-form-item>

        <div>拼团商品</div>
        <el-divider></el-divider>
        <el-form-item label="适用商品" prop="commoditySelected">
          <el-button @click="showSelectDialog('goods')" :disabled="goodsDisabled" v-show="!showDisabled">选择商品</el-button>
          <div v-show="form.channelCommodityName" style="display:flex;align-items: center;">
            <img :src="form.channelCommodityImage" alt="" style="width:100px;margin-right: 10px;" srcset="">
            <div>
              <p>{{form.channelCommodityName}}</p>
              <p v-if="form.commodityStatus.describe">{{form.commodityStatus.describe}}</p>
            </div>
          </div>
          <div v-show="(form.commoditySkuList.length > 0)">
            <el-table v-if="form.commoditySkuList.length > 0" :data="form.commoditySkuList" size="mini">
              <el-table-column label="商品规格">
                <template slot-scope="scope">
                  <div>
                    {{getSkuInfo(scope.row.skuInfo)}}
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="salePrice" label="销售价"></el-table-column>
              <el-table-column prop="stock" label="库存数"></el-table-column>
              <!-- <el-table-column prop="commodityStatus.describe" label="状态"></el-table-column> -->
              <!-- <el-table-column prop="commodityStatus.describe" label="是否地推"></el-table-column> -->
              <el-table-column label="拼团价">
                <template slot-scope="scope">
                  <span v-if="showDisabled">{{scope.row.groupBuyPrice}}</span>
                  <el-input-number v-else class="input-width" :step="0.01" :controls="false" :min="0.01" :max="999999.99" v-model.number="scope.row.groupBuyPrice" placeholder="拼团价" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="拼团限量" prop="commodityTotalNum">
          <el-input class="input-width" type="text" v-model="form.commodityTotalNum" placeholder="拼团限量" />
        </el-form-item>
        <el-form-item label="成团人数" prop="participatorLeastNum">
          <el-input class="input-width" type="text" v-model="form.participatorLeastNum" placeholder="成团人数" />起 &nbsp;&nbsp;
          <span style="color:#7F7F7F">成团人数至少两人</span>
        </el-form-item>

        <div>参与限制</div>
        <el-divider></el-divider>
        <el-form-item label="发起身份" prop="initiatorType">
          <el-radio-group v-model="form.initiatorType">
            <el-radio label="ALL">全部用户</el-radio>
            <el-radio label="NEW_USER">新用户</el-radio>
            <el-radio label="OLD_USER">老用户</el-radio>
            <el-radio label="FIRST_PARTICIPATION">首次参与用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="参团身份" prop="participantType">
          <el-radio-group v-model="form.participantType">
            <el-radio label="ALL">全部用户</el-radio>
            <el-radio label="NEW_USER">新用户</el-radio>
            <el-radio label="OLD_USER">老用户</el-radio>
            <el-radio label="FIRST_PARTICIPATION">首次参与用户</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-show="!showDisabled">
          <el-button type="primary" @click="submit()" :loading="saveLoading" v-np="'ACTIVITY_FOR_GROUP_BUY_ADD'">保存</el-button>
        </el-form-item>
      </el-form>
      <select-dialog ref="selectDialog" :form="form" :selectType="selectType" @on-dialog-save="onDialogSave" />
    </template>
    
  </div>
</template>

<script>
  import term from './json/term.json'
  import rulesFn from './js/rules'
  import { reqGroupBuyActivityAdd, reqGroupBuyActivityInfo, reqGroupBuyActivityUpdate, reqGetShopSetting, reqGetCommoditySetting } from '@/api/coupon'
  import SelectDialog from './templates/select-dialog'
  import CouponShow from './templates/coupon-show'

  function formatTime(type) {
    let date = new Date()
    let y = date.getFullYear()
    let m = date.getMonth() + 1
    m = m < 10 ? '0' + m : m
    let d = date.getDate()
    d = d < 10 ? ('0' + d) : d
    if (type === 'start') {
      return y + '-' + m + '-' + d + ' 00:00:00'
    } else {
      return y + '-' + m + '-' + d + ' 23:59:59'
    }
  }
  export default {
    name: 'couponForm',
    components: {
      SelectDialog,
      CouponShow
    },
    data() {
      return {
        saveLoading: false, // 保存loading
        checkAll: false,
        isIndeterminate: false,
        form: {
          commodityStatus: {},
          channelCommodityCode: '',
          channelCommodityId: '',
          channelCommodityImage: '',
          channelCommodityName: '',
          commodityTotalNum: '', // 拼团限量
          groupBuyActivityName: '', // 拼团活动名称
          groupBuyActivityTimeList: [formatTime('start'), formatTime('end')], // 活动开始时间与结束时间
          initiatorType: 'ALL', // 发起人
          joinHours: '', // 参团时限
          participantType: 'ALL', // 参与人
          participatorLeastNum: '', // 最少参与人数
          commoditySkuList: [] // 商品sku信息
        },
        rules: rulesFn(this),
        termIndex: 0, // 业务终端的索引键值
        term,
        selectType: '',
        goodsDisabled: false, // 选择商品btn禁用
        validate: false,
        showDisabled: false, // 查看优惠券
        releaseForm: {} // 发布编辑初始数据用于对比编辑数量
      }
    },
    created() {
      this.form.businessType = 'PRE_SALE'
    },
    mounted() {
      if (this.$route.query.type === 'show') {
        this.showDisabled = true
      }
      if (this.$route.query.groupBuyActivityCode) {
        this.getCouponInfo()
      }
      // edit
      // this.form = {...this.form, ...{}}
    },
    methods: {
      getCouponInfo() {
        // 编辑，查看，复制时调用
        let query = {
          groupBuyActivityCode: this.$route.query.groupBuyActivityCode,
          version: this.$route.query.version
        }
        this._reqGroupBuyActivityInfo(query)
        // this._reqGetShopSetting(query)
      },
      submit() {
        this.$refs['couponForm'].validate((valid) => {
          if (valid) {
            if (this.form.commoditySkuList.length === 0) {
              this.$message({
                message: '请选择适用商品',
                type: 'error'
              })
              return false
            }
            for (let index = 0; index < this.form.commoditySkuList.length; index++) {
              const element = this.form.commoditySkuList[index]
              if (element.groupBuyPrice === '') {
                this.$message({
                  message: '请选择输入拼团价',
                  type: 'error'
                })
                return false
              }
            }
            let formData = JSON.parse(JSON.stringify(this.form))
            if (this.$route.query.type === 'edit' || this.$route.query.type === 'release') {
              // 编辑
              this._reqGroupBuyActivityUpdate(formData)
            } else {
              // 新建
              this._reqGroupBuyActivityAdd(formData)
            }
          } else {
            return false
          }
        })
      },
      dealDepotArea() {
        let orderActivityStoreSelected = JSON.parse(JSON.stringify(this.form.orderActivityStoreSelected))
        let shopCodeList = []
        orderActivityStoreSelected.map((shop) => {
          shopCodeList.push(shop.shopCode)
        })
        this.form.orderActivityStore = shopCodeList
      },
      dealGoodsKind() {
        let commoditySelected = JSON.parse(JSON.stringify(this.form.orderActivityCommoditySelected))
        let commodityNoList = []
        commoditySelected.map((goods) => {
          commodityNoList.push(goods.channelCommodityNo)
        })
        this.form.orderActivityCommodity = commodityNoList
      },
      getSkuInfo(val) {
        let sku = JSON.parse(val)
        let text = ''
        sku.map((item) => {
          text += item.name
        })
        return text
      },
      _reqGroupBuyActivityInfo(data) {
        return reqGroupBuyActivityInfo(data).then((res) => {
          if (res.code === 200) {
            Object.keys(this.form).forEach((item) => {
              if (res.result[item]) {
                this.form[item] = res.result[item]
              }
              if (item === 'commodityStatus') {
                this.form[item] = res.result['channelCommodityStatus']
              }
            })
            if (this.$route.query.type === 'edit') {
              this.form.id = res.result.id
            }
          }
        })
      },
      _reqGetShopSetting(data) {
        // let _this = this
        return reqGetShopSetting(data).then((res) => {
          if (res.code === 200) {
            this.form.orderActivityStoreSelected = res.result
          }
        })
      },
      _reqGetCommoditySetting(data) {
        return reqGetCommoditySetting(data).then((res) => {
          if (res.code === 200) {
            this.form.orderActivityCommoditySelected = res.result
          }
        })
      },
      _reqGroupBuyActivityAdd(data) {
        this.saveLoading = true
        return reqGroupBuyActivityAdd(data).then((res) => {
          this.saveLoading = false
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          }
        }).catch(() => {
          this.saveLoading = false
        })
      },
      _reqGroupBuyActivityUpdate(data, query) {
        this.saveLoading = true
        return reqGroupBuyActivityUpdate(data, query).then((res) => {
          this.saveLoading = false
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          }
        }).catch(() => {
          this.saveLoading = false
        })
      },
      onDialogSave(val) {
        this.form.channelCommodityCode = val.channelCommodityNo
        this.form.channelCommodityId = val.id
        this.form.channelCommodityImage = val.thumbnailImage
        this.form.channelCommodityName = val.channelCommodityName
        this.form.commodityStatus = val.commodityStatus
        let arr = []
        val.channelCommoditySpecificationList.map((sku) => {
          arr.push({
            groupBuyPrice: '',
            salePrice: sku.salePrice,
            skuInfo: sku.skuInfo,
            skuNo: sku.skuNo,
            skuId: sku.id,
            stock: sku.stock,
            commodityStatus: val.commodityStatus
          })
        })
        this.form.commoditySkuList = arr
        // if (this.selectType === 'depot') {
        //   this.form.orderActivityStoreSelected = val
        // } else if (this.selectType === 'goods') {
        //   this.form.orderActivityCommoditySelected = val
        // }
      },
      // 打开选择弹框
      showSelectDialog(type) {
        this.selectType = type
        this.$refs.selectDialog.showDialog()
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-container {
    display: flex;
  }
  .app-form{
    flex: 1;
    .coupon-setting{
      min-height:30px;
      margin-top:10px;
      color: #606266;
      .el-input{width:100px;}
      .el-select{width:100px;}
    }
    .tipsText {
      color: #606266;
    }
    /deep/ .input-width{width:200px;}
    .selectALL {
      margin-right: 30px;
    }
    .channelTypeList {
      display: inline-block;
    }
    /deep/ .el-divider{
      margin: 12px 0;
    }
  }
</style>
