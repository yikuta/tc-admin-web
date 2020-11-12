<template>
  <div class="app-container">
    <coupon-show></coupon-show>
    <template>
      <el-form :model="form" :rules="rules" ref="couponForm" label-width="120px" size="mini" class="app-form" :disabled="showDisabled">
        <div>基础信息</div>
        <el-divider></el-divider>
        <el-form-item label="活动名称" prop="orderActivityName">
          <el-input class="input-width" type="text" v-model="form.orderActivityName" :disabled="releaseDisabled" placeholder="优惠券名称" />
        </el-form-item>
        <el-form-item label="适用渠道终端" prop="channelType">
          <el-radio-group v-model="form.channelType" @change="handleTermChange" :disabled="releaseDisabled">
            <!-- <el-radio label="ALL">通用</el-radio> -->
            <el-radio v-for="(item, index) in term" :label="item.id" :key="index">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用业务范围" prop="businessType">
          <!-- <el-checkbox v-if="form.channelType == 'ALL'" v-model="form.businessTypeSet" label="ALL" :disabled="releaseDisabled">通用</el-checkbox> -->
          <template>
            <!-- <el-checkbox-group class="channelTypeList" v-model="form.businessTypeSet" @change="handleCheckedBusinessTypeChange" :disabled="releaseDisabled">
              <el-checkbox v-for="(item, index) in term[termIndex].list" :label="item.id" :key="index">{{ item.name }}</el-checkbox>
            </el-checkbox-group> -->
            <el-radio-group v-model="form.businessType" @change="handleCheckedBusinessTypeChange" :disabled="releaseDisabled">
              <!-- <el-radio label="ALL">通用</el-radio> -->
              <el-radio v-for="(item, index) in term[termIndex].list" :label="item.id" :key="index">{{ item.name }}</el-radio>
            </el-radio-group>
          </template>
        </el-form-item>

        <preferences-setting ref="preferencesSetting" :form="form.fullGiveCouponRule" :rules="rules" :showDisabled="showDisabled" :releaseDisabled="releaseDisabled" @on-validate="onValidate" @on-add-discount="onAddDiscount" @on-remove-discount="onRemoveDiscount" />
        
        <el-form-item label="可享用户" prop="canUseUser">
          <el-radio-group v-model="form.userRangeType" :disabled="releaseDisabled">
            <el-radio label="ALL">全部</el-radio>
            <el-radio label="NEW_USER">新用户</el-radio>
            <el-radio label="OLD_USER">老用户</el-radio>
            <el-radio label="FIRST_PARTICIPATION">首次参与用户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单用户参与" prop="singleUserTime">
          <el-input class="input-width" type="text" v-model="form.singleUserTime" :disabled="releaseDisabled" placeholder="单用户参与" />次
        </el-form-item>
        <el-form-item label="可用时间" prop="orderActivityTimeList">
          <div class="">
            <el-date-picker :disabled="releaseDisabled"
              v-model="form.orderActivityTimeList"
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

        <div>适用范围</div>
        <el-divider></el-divider>
        <el-form-item label="适用门店" prop="shopSetlected">
          <el-button @click="showSelectDialog('depot')" :disabled="depotDisabled" v-show="!showDisabled">选择门店</el-button>
          <span v-show="form.orderActivityStoreSelected.length == 0" class="tipsText">全部门店适用</span>
          <span v-show="form.orderActivityStoreSelected.length > 0" class="tipsText">以下门店适用</span>
          <div v-show="!depotDisabled && form.orderActivityStoreSelected.length > 0">
            <el-table v-if="form.orderActivityStoreSelected.length > 0" :data="form.orderActivityStoreSelected" size="mini">
              <el-table-column prop="shopCode" label="店铺编码"></el-table-column>
              <el-table-column prop="name" label="店铺名称"></el-table-column>
              <el-table-column label="类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.shopTypeValue">{{scope.row.shopTypeValue}}</span>
                  <span v-else>{{scope.row.shopType}}</span>
                </template>
              </el-table-column>
              <el-table-column label="状态" prop="shopStatus">
                <template slot-scope="scope">
                  <span v-show="scope.row.shopStatus==1">启用</span>
                  <span v-show="scope.row.shopStatus==2">禁用</span>
                  <span v-show="scope.row.shopStatus==3">销店</span>
                </template>
              </el-table-column>
              <el-table-column label="店长/联系方式">
                <template slot-scope="scope">
                  {{ scope.row.managerName + '/' + scope.row.managerTel }}
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="!showDisabled">
                <template slot-scope="scope">
                  <el-button type="text" @click="delDepot(form.orderActivityStoreSelected, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="适用商品" prop="commoditySelected">
          <el-button @click="showSelectDialog('goods')" :disabled="goodsDisabled" v-show="!showDisabled && !releaseDisabled">选择商品</el-button>
          <span v-show="form.orderActivityCommoditySelected.length == 0" class="tipsText">全部商品适用</span>
          <span v-show="form.orderActivityCommoditySelected.length > 0" class="tipsText">以下商品适用</span>
          <div v-show="!goodsDisabled && (form.orderActivityCommoditySelected.length > 0)">
            <el-table v-if="form.orderActivityCommoditySelected.length > 0" :data="form.orderActivityCommoditySelected" size="mini">
              <el-table-column prop="channelCommodityNo" label="商品编码"></el-table-column>
              <el-table-column prop="channelCommodityName" label="商品名称"></el-table-column>
              <el-table-column prop="price" label="销售价">
                <template slot-scope="scope">
                  <span>￥{{scope.row.minSalePrice}}</span>
                  <span>—</span>
                  <span>￥{{scope.row.maxSalePrice}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="!showDisabled && !releaseDisabled">
                <template slot-scope="scope">
                  <el-button type="text" @click="delGoods(form.orderActivityCommoditySelected, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item v-show="!showDisabled">
          <el-button type="primary" v-if="$route.query.type === 'add' || $route.query.type === 'copy'" @click="submit()" :loading="saveLoading" v-np="'ACTIVITY_FOR_ORDER_ADD'">保存</el-button>
          <el-button type="primary" v-else-if="$route.query.type === 'edit' || $route.query.type === 'release'" @click="submit()" :loading="saveLoading" v-np="'ACTIVITY_FOR_ORDER_UPDATE'">保存</el-button>
        </el-form-item>
      </el-form>
      <select-dialog ref="selectDialog" :form="form" :shopSetlected="form.orderActivityStoreSelected" :commoditySelected="form.orderActivityCommoditySelected" :selectType="selectType" @on-dialog-save="onDialogSave" />
    </template>
    
  </div>
</template>

<script>
  import term from './json/term.json'
  import rulesFn from './js/rules'
  import { reqActivityAdd, reqActivityGetDetails, reqActivityUpdate, reqGetShopSetting, reqGetCommoditySetting } from '@/api/coupon'
  import SelectDialog from './templates/select-dialog'
  import CouponShow from './templates/coupon-show'
  import PreferencesSetting from './templates/preferencesSetting'

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
      CouponShow,
      PreferencesSetting
    },
    data() {
      return {
        saveLoading: false, // 保存loading
        checkAll: false,
        isIndeterminate: false,
        form: {
          orderActivityType: 'FULL_GIVE',
          channelType: 'APP_TINCERE_LIFE', // 业务终端
          orderActivityName: '', // 活动名称
          businessType: '', // 业务范围
          fullGiveCouponRule: {
            deductionUnitType: 'MONEY',
            giftType: 'COUPON',
            fullGiveItemForDisCountList: [
              { satisfyMoney: '', satisfyPiece: '', couponCode: '', couponName: '', upperLimitMoney: '', totalCount: '', userSingleCount: '' }
            ]
          },
          userRangeType: 'ALL', // 可享用户
          singleUserTime: '', // 单次用户可参加
          orderActivityTimeList: [formatTime('start'), formatTime('end')],
          orderActivityStore: [], // 保存用，活动可用门店list
          orderActivityStoreSelected: [], // 已选可用门店
          orderActivityCommodity: [], // 保存用，活动可用商品list
          orderActivityCommoditySelected: [] // 已选可用商品
        },
        rules: rulesFn(this),
        termIndex: 0, // 业务终端的索引键值
        term,
        selectType: '',
        depotDisabled: true, // 选择门店btn禁用
        goodsDisabled: true, // 选择商品btn禁用
        validate: false,
        showDisabled: false, // 查看优惠券
        releaseDisabled: false, // 发布中编辑
        releaseForm: {} // 发布编辑初始数据用于对比编辑数量
      }
    },
    created() {
      this.form.businessType = 'PRE_SALE'
    },
    mounted() {
      if (this.$route.query.type === 'show') {
        this.showDisabled = true
      } else if (this.$route.query.type === 'release') {
        this.releaseDisabled = true
      }
      if (this.$route.query.orderActivityCode) {
        this.getCouponInfo()
      }
      // edit
      // this.form = {...this.form, ...{}}
    },
    methods: {
      getCouponInfo() {
        // 编辑，查看，复制时调用
        let query = {
          orderActivityCode: this.$route.query.orderActivityCode,
          version: this.$route.query.version
        }
        this._reqActivityGetDetails(query)
        // this._reqGetShopSetting(query)
      },
      submit() {
        let preferencesSetting = this.$refs.preferencesSetting
        preferencesSetting.validateFn()
        this.$refs['couponForm'].validate((valid) => {
          if (valid && this.validate) {
            if (this.form.businessType === 'PRE_SALE' || this.form.businessType === 'LOGISTICS') {
              this.form.orderActivityStoreSelected = []
              if (this.form.orderActivityCommoditySelected.length === 0) {
                this.$message({
                  message: '请选择至少一条适用商品',
                  type: 'error'
                })
                return false
              }
            }
            if (this.form.businessType === 'CLEAN_FOOD') {
              this.form.orderActivityCommoditySelected = []
              if (this.form.orderActivityStoreSelected.length === 0) {
                this.$message({
                  message: '请选择至少一条适用门店',
                  type: 'error'
                })
                return false
              }
            }
            // if (JSON.stringify(this.form.businessTypeSet).indexOf('PRE_SALE') > -1 || JSON.stringify(this.form.businessTypeSet).indexOf('LOGISTICS') > -1) {
            //   this.form.orderActivityStoreSelected = []
            // }
            // if (JSON.stringify(this.form.businessTypeSet).indexOf('CLEAN_FOOD') > -1) {
            //   this.form.orderActivityCommoditySelected = []
            // }
            // if (this.form.businessTypeSet.length === 1 && this.form.businessTypeSet[0] === 'ALL') {
            //   this.form.orderActivityStoreSelected = []
            //   this.form.orderActivityCommoditySelected = []
            // }
            this.dealDepotArea()
            this.dealGoodsKind()
            let formData = JSON.parse(JSON.stringify(this.form))
            // formData.fullGiveCouponRule.fullGiveItemForDisCountList.map((gift) => {
            //   gift.upperLimitMoney = (gift.upperLimitMoney * gift.userSingleCount).toFixed(2)
            // })
            if (this.$route.query.type === 'edit' || this.$route.query.type === 'release') {
              // 编辑
              this._reqActivityUpdate(formData)
            } else {
              // 新建
              this._reqActivityAdd(formData)
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
      onValidate() {
        this.validate = true
      },
      onAddDiscount(index) {
        this.form.fullGiveCouponRule.fullGiveItemForDisCountList.splice(index + 1, 0, { satisfyMoney: '', satisfyPiece: '', couponCode: '', totalCount: '', userSingleCount: '' })
      },
      onRemoveDiscount(index) {
        this.form.fullGiveCouponRule.fullGiveItemForDisCountList.splice(index, 1)
      },
      _reqActivityGetDetails(data) {
        return reqActivityGetDetails(data).then((res) => {
          if (res.code === 200) {
            Object.keys(this.form).forEach((item) => {
              if (res.result[item]) {
                this.form[item] = res.result[item]
              }
            })
            if (this.$route.query.type === 'release' || this.$route.query.type === 'edit') {
              this.form.id = res.result.id
            }
            this.releaseForm = JSON.parse(JSON.stringify(this.form))
            if (this.releaseForm.orderActivityStore.length > 0) {
              this._reqGetShopSetting(data)
            }
            if (this.releaseForm.orderActivityCommodity.length > 0) {
              this._reqGetCommoditySetting(data)
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
      _reqActivityAdd(data) {
        this.saveLoading = true
        return reqActivityAdd(data).then((res) => {
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
      _reqActivityUpdate(data, query) {
        this.saveLoading = true
        return reqActivityUpdate(data, query).then((res) => {
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
        // 门店和商品弹框保存执行
        if (this.selectType === 'depot') {
          this.form.orderActivityStoreSelected = val
        } else if (this.selectType === 'goods') {
          this.form.orderActivityCommoditySelected = val
        }
      },
      // 业务终端选择改变
      handleTermChange() {
        term.forEach((value, index) => {
          if (value.id === this.form.channelType) {
            this.termIndex = index
          }
        })
        if (this.form.channelType === 'ALL') {
          this.form.businessType = ['ALL']
        } else {
          this.form.businessType = ''
        }
      },
      // 打开选择弹框
      showSelectDialog(type) {
        this.selectType = type
        if (type === 'goods' && this.form.businessType === '') {
          this.$message({
            message: '请先选择业务适用范围',
            type: 'error'
          })
          return false
        }
        this.$refs.selectDialog.showDialog()
      },
      // 删除已选店铺
      delDepot(rows, index) {
        rows.splice(index, 1)
      },
      // 删除已选商品
      delGoods(rows, index) {
        rows.splice(index, 1)
      },
      handleCheckAllChange(val) {
        let cityOptions = []
        this.term[this.termIndex].list.map((item) => {
          cityOptions.push(item.id)
        })
        this.form.businessTypeSet = val ? cityOptions : []
        this.isIndeterminate = false
      },
      handleCheckedBusinessTypeChange() {
        // let checkedCount = value.length
        // this.checkAll = checkedCount === this.term[this.termIndex].list.length
        // this.isIndeterminate = checkedCount > 0 && checkedCount < this.term[this.termIndex].list.length
      }
    },
    watch: {
      'form.businessType': {
        handler(newVal) {
          this.$nextTick(() => {
            if (newVal === 'PRE_SALE' || newVal === 'LOGISTICS') {
              this.depotDisabled = true
              this.goodsDisabled = false
              this.form.orderActivityStoreSelected = []
              this.form.orderActivityCommoditySelected = []
              this.$refs.selectDialog.businessTypeSet(newVal)
            } else if (newVal === 'CLEAN_FOOD') {
              this.depotDisabled = false
              this.goodsDisabled = true
              this.form.orderActivityCommoditySelected = []
            }
          })
        },
        immediate: true
      },
      'form.availableTimeSetting.availableTimeType': {
        handler(newVal, oldVal) {
          this.$nextTick(() => {
            if (oldVal === 'FIXED_TIME_PERIOD') {
              this.form.availableTimeSetting.fixedTimeList = []
            }
            if (oldVal === 'FIXED_DURATION') {
              this.form.availableTimeSetting.fixedDurationNum = ''
              this.form.availableTimeSetting.timeUnit = 'HOUR'
            }
            if (oldVal === 'FIXED_PERIOD') {
              this.form.availableTimeSetting.fixedPeriodType = 'VALID_FOR_THE_DAY'
            }
          })
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-container {
    display: flex;
  }
  .app-form{
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
