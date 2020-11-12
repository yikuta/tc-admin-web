<template>
  <div class="app-container">
    <coupon-show></coupon-show>
    <template>
      <el-form :model="form" :rules="rules" ref="couponForm" label-width="120px" size="mini" class="app-form" :disabled="showDisabled">
        <div>基础信息</div>
        <el-divider></el-divider>
        <el-form-item label="优惠券名称" prop="couponName">
          <el-input class="input-width" type="text" v-model="form.couponName" :disabled="releaseDisabled" placeholder="优惠券名称" />
        </el-form-item>
        <el-form-item label="适用业务终端" prop="channelType">
          <el-radio-group v-model="form.channelType" @change="handleTermChange" :disabled="releaseDisabled">
            <el-radio label="ALL">通用</el-radio>
            <el-radio v-for="(item, index) in term" :label="item.id" :key="index">{{ item.name }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用业务范围" prop="businessTypeSet">
          <el-checkbox v-if="form.channelType == 'ALL' && !$route.query.business" v-model="form.businessTypeSet" label="ALL" :disabled="releaseDisabled">通用</el-checkbox>
          <template v-else>
            <!-- <el-checkbox class="selectALL" :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">通用</el-checkbox> -->
            <el-checkbox-group class="channelTypeList" v-model="form.businessTypeSet" @change="handleCheckedBusinessTypeChange" :disabled="releaseDisabled">
              <el-checkbox v-for="(item, index) in term[termIndex].list" :label="item.id" :key="index">{{ item.name }}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
        <el-form-item label="优惠设置" prop="deductionType">
          <div class="">
            <el-radio-group v-model="form.deductionType" @change="deductionTypeChange" :disabled="releaseDisabled">
              <el-radio label="DIRECT_DEDUCTION">直减</el-radio>
              <el-radio label="SATISFY_DEDUCTION">满减</el-radio>
              <el-radio v-if="$route.query.couponType === 'DOORFILL'" label="STEP_DEDUCTION">每满减</el-radio>
            </el-radio-group>
          </div>
          <div class="coupon-setting" v-if="form.deductionType === 'DIRECT_DEDUCTION' && $route.query.couponType === 'DOORFILL'">
            无条件立减
            <el-input type="text" placeholder="" v-model="form.directDeductionRule.money" :disabled="releaseDisabled" ref="directDeductionRule_money" />
            元
          </div>
          <div class="coupon-setting" v-if="form.deductionType === 'DIRECT_DEDUCTION' && $route.query.couponType === 'DISCOUNT'">
            无条件享
            <el-input type="text" placeholder="" v-model="form.directDeductionRule.deduction" :disabled="releaseDisabled" ref="directDeductionRule_deduction" />
            折，最多优惠
            <el-input type="text" placeholder="" v-model="form.directDeductionRule.upperLimitMoney" :disabled="releaseDisabled" ref="directDeductionRule_upperLimitMoney" />
            元
          </div>
          <div class="" v-if="form.deductionType === 'SATISFY_DEDUCTION' && $route.query.couponType === 'DOORFILL'">
            <div class="coupon-setting">
              满额形式：
              <el-radio-group v-model="form.satisfyDeductionRule.unitType" :disabled="releaseDisabled">
                <el-radio label="MONEY">满金额</el-radio>
                <el-radio label="PIECE">满件数</el-radio>
              </el-radio-group>
            </div>
            <div class="coupon-setting" v-for="(item, index) in form.satisfyDeductionRule.items" :key="index">
              满
              <el-input v-show="form.satisfyDeductionRule.unitType == 'MONEY'" v-model="form.satisfyDeductionRule.items[index].satisfyMoney" :disabled="releaseDisabled" ref="satisfyDeductionRule_satisfyMoney" placeholder="" />
              <el-input v-show="form.satisfyDeductionRule.unitType == 'PIECE'" v-model="form.satisfyDeductionRule.items[index].satisfyPiece" :disabled="releaseDisabled" ref="satisfyDeductionRule_satisfyPiece" placeholder="" />
              <!-- <el-select placeholder="" v-model="form.discountList[index].unit">
                <el-option label="元" :value="1"></el-option>
                <el-option label="件" :value="2"></el-option>
              </el-select> -->
              减
              <el-input placeholder="" v-model="form.satisfyDeductionRule.items[index].money" :disabled="releaseDisabled" ref="satisfyDeductionRule_deduction" />
              元
              <!-- <el-button v-if="form.discountList.length - 1 === index" type="primary" icon="el-icon-plus" circle @click="handleAddDiscount"></el-button> -->
              <!-- <el-button v-if="form.discountList.length !== 1" type="danger" icon="el-icon-delete" circle @click="handleRemoveDiscount(index)"></el-button> -->
            </div>
          </div>
          <div class="" v-if="form.deductionType === 'SATISFY_DEDUCTION' && $route.query.couponType === 'DISCOUNT'">
            <div class="coupon-setting">
              满额形式：
              <el-radio-group v-model="form.satisfyDeductionRule.unitType" :disabled="releaseDisabled">
                <el-radio label="MONEY">满金额</el-radio>
                <el-radio label="PIECE">满件数</el-radio>
              </el-radio-group>
            </div>
            <div class="coupon-setting" v-for="(item, index) in form.satisfyDeductionRule.items" :key="index">
              满
              <el-input v-show="form.satisfyDeductionRule.unitType == 'MONEY'" v-model="form.satisfyDeductionRule.items[index].satisfyMoney" :disabled="releaseDisabled" ref="satisfyDeductionRule_satisfyMoney" placeholder="" />
              <el-input v-show="form.satisfyDeductionRule.unitType == 'PIECE'" v-model="form.satisfyDeductionRule.items[index].satisfyPiece" :disabled="releaseDisabled" ref="satisfyDeductionRule_satisfyPiece" placeholder="" />
              <!-- <el-select placeholder="" v-model="form.discountList[index].unit">
                <el-option label="元" :value="1"></el-option>
                <el-option label="件" :value="2"></el-option>
              </el-select> -->
              享
              <el-input placeholder="" v-model="form.satisfyDeductionRule.items[index].deduction" :disabled="releaseDisabled" ref="satisfyDeductionRule_deduction" />
              折，最多优惠
              <el-input type="text" placeholder="" v-model="form.satisfyDeductionRule.items[index].upperLimitMoney" :disabled="releaseDisabled" ref="satisfyDeductionRule_upperLimitMoney" />
              元
              <!-- <el-button v-if="form.discountList.length - 1 === index" type="primary" icon="el-icon-plus" circle @click="handleAddDiscount"></el-button>
              <el-button v-if="form.discountList.length !== 1" type="danger" icon="el-icon-delete" circle @click="handleRemoveDiscount(index)"></el-button> -->
            </div>
          </div>
          <div class="" v-if="form.deductionType === 'STEP_DEDUCTION'">
            <div class="coupon-setting">
              满额形式：
              <el-radio-group v-model="form.stepDeductionRule.unitType" :disabled="releaseDisabled">
                <el-radio label="MONEY">满金额</el-radio>
                <el-radio label="PIECE">满件数</el-radio>
              </el-radio-group>
            </div>
            <!-- <div class="coupon-setting" v-for="(item, index) in form.discountList" :key="index"> -->
            <div class="coupon-setting">
              每满
              <el-input v-show="form.stepDeductionRule.unitType == 'MONEY'" v-model="form.stepDeductionRule.stepForMoney" :disabled="releaseDisabled" ref="stepDeductionRule_stepForMoney" placeholder="" />
              <el-input v-show="form.stepDeductionRule.unitType == 'PIECE'" v-model="form.stepDeductionRule.stepForPiece" :disabled="releaseDisabled" ref="stepDeductionRule_stepForPiece" placeholder="" />
              <!-- <el-select placeholder="" v-model="form.discountList[index].unit">
                <el-option label="元" :value="1"></el-option>
                <el-option label="件" :value="2"></el-option>
              </el-select> -->
              减
              <el-input placeholder="" v-model="form.stepDeductionRule.money" :disabled="releaseDisabled" ref="stepDeductionRule_money" />
              元，优惠上限
              <el-input type="text" placeholder="" v-model="form.stepDeductionRule.upperLimitMoney" :disabled="releaseDisabled" ref="stepDeductionRule_upperLimitMoney" />
              元
              <!-- <el-button v-if="form.discountList.length - 1 === index" type="primary" icon="el-icon-plus" circle @click="handleAddDiscount"></el-button>
              <el-button v-if="form.discountList.length !== 1" type="danger" icon="el-icon-delete" circle @click="handleRemoveDiscount(index)"></el-button> -->
            </div>
          </div>
        </el-form-item>
        <el-form-item label="可用时间" prop="availableTimeType">
          <div class="">
            <el-radio label="FIXED_TIME_PERIOD" v-model="form.availableTimeSetting.availableTimeType" :disabled="releaseDisabled">固定时间段</el-radio>
            <el-date-picker :disabled="releaseDisabled"
              v-model="form.availableTimeSetting.fixedTimeList"
              ref="availableTimeSetting_fixedTimeList"
              type="datetimerange"
              value-format="yyyy-MM-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
          </div>
          <div class="coupon-setting">
            <el-radio label="FIXED_DURATION" v-model="form.availableTimeSetting.availableTimeType" :disabled="releaseDisabled">固定时长</el-radio>
            自领取起
            <el-input type="text" v-model="form.availableTimeSetting.fixedDurationNum" :disabled="releaseDisabled" ref="availableTimeSetting_fixedDurationNum" />
            <el-select placeholder="" v-model="form.availableTimeSetting.timeUnit" :disabled="releaseDisabled">
              <el-option label="小时" value="HOUR"></el-option>
              <el-option label="天" value="DAY"></el-option>
            </el-select>
          </div>
          <div class="coupon-setting">
            <el-radio label="FIXED_PERIOD" v-model="form.availableTimeSetting.availableTimeType" :disabled="releaseDisabled">固定周期</el-radio>
            <el-select placeholder="" v-model="form.availableTimeSetting.fixedPeriodType" :disabled="releaseDisabled" ref="availableTimeSetting_timeUnit">
              <el-option label="当日有效" value="VALID_FOR_THE_DAY"></el-option>
              <el-option label="当周有效" value="VALID_FOR_THE_WEEK"></el-option>
              <el-option label="当月有效" value="VALID_FOR_THE_MONTH"></el-option>
            </el-select>
          </div>
        </el-form-item>

        <div>投放设置</div>
        <el-divider></el-divider>
        <el-form-item label="投放目标" prop="sceneSetting">
          <el-select placeholder="请选择投放目标" v-model="form.sceneSetting.sceneType" @change="sceneSettingSceneTypeChange" :disabled="releaseDisabled">
            <el-option label="商详页" value="COMMODITY_DETAIL"></el-option>
            <el-option label="领券中心" value="COLLECTION_CENTER"></el-option>
            <el-option label="人工发券" value="COUPON_QUEUE"></el-option>
            <el-option label="新人礼" value="FOR_NEW_PEOPLE"></el-option>
            <el-option label="满赠活动" value="FULL_GIVE_ACTIVITY"></el-option>
            <el-option label="售后专用" value="FOR_AFTER_SALE"></el-option>
            <el-option label="邀请有礼" value="FOR_INVITATION"></el-option>
            <el-option label="门店首页" value="FOR_SHOP" :disabled="true"></el-option>
          </el-select>
        </el-form-item>
        <scene-setting ref="sceneSetting"
          @on-validate="onValidate"
          :sceneSetting="form.sceneSetting"
          :rules="rules"
          :showDisabled="showDisabled"
          :releaseDisabled="releaseDisabled"
          :term="term"
          v-if="form.sceneSetting.sceneType == 'FOR_SHOP' || form.sceneSetting.sceneType == 'COMMODITY_DETAIL' || form.sceneSetting.sceneType == 'COLLECTION_CENTER' || form.sceneSetting.sceneType == 'FOR_NEW_PEOPLE' || form.sceneSetting.sceneType == 'FOR_INVITATION'"
          ></scene-setting>

        <div>适用范围</div>
        <el-divider></el-divider>
        <el-form-item label="适用门店" prop="shopSetlected">
          <el-button @click="showSelectDialog('depot')" :disabled="depotDisabled" v-show="!showDisabled">选择门店</el-button>
          <span v-show="form.shopSetlected.usableType == 'ALL'" class="tipsText">全部门店适用</span>
          <span v-show="form.shopSetlected.usableType == 'USABLE'" class="tipsText">以下门店适用</span>
          <span v-show="form.shopSetlected.usableType == 'UNUSABLE'" class="tipsText">以下门店不适用</span>
          <div v-show="!depotDisabled && (form.shopSetlected.usableType == 'USABLE' || form.shopSetlected.usableType == 'UNUSABLE')">
            <el-table v-if="form.shopSetlected.shopTypeList.length > 0 && form.shopSetlected.shopOptionalType == 'TYPE'" :data="form.shopSetlected.shopTypeList" size="mini">
              <el-table-column prop="name" label="类型"></el-table-column>
              <el-table-column label="操作" v-if="!showDisabled">
                <template slot-scope="scope">
                  <el-button type="text" @click="delDepot(form.shopSetlected.shopTypeList, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-if="form.shopSetlected.areaList.length > 0 && form.shopSetlected.shopOptionalType == 'AREA'" :data="form.shopSetlected.areaList" size="mini">
              <el-table-column prop="province.name" label="省"></el-table-column>
              <el-table-column prop="city.name" label="市（县）">
                <template slot-scope="scope">
                  <span v-if="scope.row.city">{{scope.row.city.name}}</span>
                  <span v-else>全部</span>
                </template>
              </el-table-column>
              <el-table-column prop="county.name" label="区（乡）">
                <template slot-scope="scope">
                  <span v-if="scope.row.county">{{scope.row.county.name}}</span>
                  <span v-else>全部</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="!showDisabled">
                <template slot-scope="scope">
                  <el-button type="text" @click="delDepot(form.shopSetlected.areaList, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-if="form.shopSetlected.shopCodeList.length > 0 && form.shopSetlected.shopOptionalType == 'CODE'" :data="form.shopSetlected.shopCodeList" size="mini">
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
                  <el-button type="text" @click="delDepot(form.shopSetlected.shopCodeList, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="适用商品" prop="commoditySelected">
          <el-button @click="showSelectDialog('goods')" :disabled="goodsDisabled" v-show="!showDisabled">选择商品</el-button>
          <span v-show="form.commoditySelected.usableType == 'ALL'" class="tipsText">全部商品适用</span>
          <span v-show="form.commoditySelected.usableType == 'USABLE'" class="tipsText">以下商品适用</span>
          <span v-show="form.commoditySelected.usableType == 'UNUSABLE'" class="tipsText">以下商品不适用</span>
          <div v-show="!goodsDisabled && (form.commoditySelected.usableType == 'USABLE' || form.commoditySelected.usableType == 'UNUSABLE')">
            <el-table v-if="form.commoditySelected.categoryIdList.length > 0 && form.commoditySelected.commodityOptionalType == 'TYPE'" :data="form.commoditySelected.categoryIdList" size="mini">
              <el-table-column prop="kind1.name" label="一级分类"></el-table-column>
              <el-table-column prop="kind2.name" label="二级分类">
                <template slot-scope="scope">
                  <span v-if="scope.row.kind2">{{scope.row.kind2.name}}</span>
                  <span v-else>全部</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="!showDisabled">
                <template slot-scope="scope">
                  <el-button type="text" @click="delGoods(form.commoditySelected.categoryIdList, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-table v-if="form.commoditySelected.commodityNoList.length > 0 && form.commoditySelected.commodityOptionalType == 'CODE'" :data="form.commoditySelected.commodityNoList" size="mini">
              <el-table-column prop="channelCommodityNo" label="商品编码"></el-table-column>
              <el-table-column prop="channelCommodityName" label="商品名称"></el-table-column>
              <el-table-column prop="price" label="销售价">
                <template slot-scope="scope">
                  <span>￥{{scope.row.minSalePrice}}</span>
                  <span>—</span>
                  <span>￥{{scope.row.maxSalePrice}}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" v-if="!showDisabled">
                <template slot-scope="scope">
                  <el-button type="text" @click="delGoods(form.commoditySelected.commodityNoList, scope.$index)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
        <el-form-item label="平台承担比例" prop="ratioForPlatform">
          <el-input class="input-width" v-model="form.ratioForPlatform" :disabled="releaseDisabled" placeholder="请输入平台承担比例">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
        <el-form-item label="使用说明" prop="instructions">
          <el-input class="input-width" type="textarea" :rows="4" v-model="form.instructions" :disabled="releaseDisabled" placeholder="请输入使用说明"></el-input>
        </el-form-item>
        <el-form-item v-show="!showDisabled">
          <el-button type="primary" @click="submit()" :loading="saveLoading" v-np="btnPermission">保存</el-button>
        </el-form-item>
      </el-form>
      <select-dialog ref="selectDialog" :shopSetlected="form.shopSetlected" :commoditySelected="form.commoditySelected" :selectType="selectType" @on-dialog-save="onDialogSave" />
    </template>

  </div>
</template>

<script>
  import term from './json/term.json'
  import rulesFn from './js/rules'
  import { reqAddFullReduction, reqAddDiscount, reqFindByCouponCode, reqUpdateFullReduction, reqUpdateDiscount, reqShopSetting, reqGoodsSetting } from '@/api/coupon'
  import SelectDialog from './templates/select-dialog'
  import CouponShow from './templates/coupon-show'
  import SceneSetting from './templates/sceneSetting'

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
      SceneSetting
    },
    data() {
      return {
        btnPermission: '',
        saveLoading: false, // 保存loading
        checkAll: false,
        isIndeterminate: false,
        form: {
          couponName: '', // 优惠券名称
          channelType: 'ALL', // 业务终端
          businessTypeSet: ['ALL'], // 业务范围
          deductionType: 'DIRECT_DEDUCTION', // 优惠设置
          directDeductionRule: { money: '', deduction: '', upperLimitMoney: '' }, // 直减
          satisfyDeductionRule: {
            items: [{ money: '', deduction: '', satisfyMoney: '', satisfyPiece: '', upperLimitMoney: '' }],
            unitType: 'MONEY'
          }, // 满减
          stepDeductionRule: { money: '', stepForMoney: '', stepForPiece: '', upperLimitMoney: '', unitType: 'MONEY' },
          sceneSetting: {
            channelTypeSet: [], // 投放范围
            launchNum: '', // 发放总数
            receiveTimeList: [], // 领券时间
            sceneType: '', // 投放目标
            singleUserLimitType: 'UPPER_LIMIT',
            singleUserLimitNum: '', // 可领数量
            userRangeType: 'ALL' // 可领用户
          },
          discountList: [
            { money: '100', unit: 1, discount: '10' },
            { money: '1000', unit: 2, discount: '10' }
          ], // 满减列表
          availableTimeSetting: {
            fixedTimeList: [formatTime('start'), formatTime('end')],
            availableTimeType: 'FIXED_TIME_PERIOD',
            fixedDurationNum: '',
            fixedPeriodType: 'VALID_FOR_THE_DAY',
            timeUnit: 'HOUR'
          }, // 可用时间
          shopSetting: { // 适用门店选择提交用
            usableType: 'ALL',
            shopOptionalType: null,
            shopTypeList: [],
            areaList: [],
            shopCodeList: []
          },
          shopSetlected: { // 适用门店已选，页面缓存做删除
            usableType: 'ALL',
            shopOptionalType: 'TYPE',
            shopTypeList: [],
            areaList: [],
            shopCodeList: []
          },
          commoditySetting: { // 适用商品选择，提交用
            usableType: 'ALL',
            commodityOptionalType: null,
            categoryIdList: [],
            commodityNoList: []
          },
          commoditySelected: { // 适用商品选择，页面缓存做删除
            usableType: 'ALL',
            commodityOptionalType: 'TYPE',
            categoryIdList: [],
            commodityNoList: []
          },
          productCodes: [],
          ratioForPlatform: 100,
          instructions: ''
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
      if (this.$route.query.type === 'add') {
        if (this.$route.query.couponType === 'DOORFILL') {
          this.btnPermission = 'COUPON_FULL_REDUCTION_RULE_ADD'
        } else {
          this.btnPermission = 'COUPON_DISCOUNT_RULE_ADD'
        }
      } else if (this.$route.query.type === 'edit' || this.$route.query.type === 'release') {
        if (this.$route.query.couponType === 'DOORFILL') {
          this.btnPermission = 'COUPON_FULL_REDUCTION_RULE_UPDATE'
        } else {
          this.btnPermission = 'COUPON_DISCOUNT_RULE_UPDATE'
        }
      }
    },
    mounted() {
      if (this.$route.query.type === 'show') {
        this.showDisabled = true
      } else if (this.$route.query.type === 'release') {
        this.releaseDisabled = true
      }
      if (this.$route.query.couponCode) {
        this.getCouponInfo()
      }
      // edit
      // this.form = {...this.form, ...{}}
    },
    methods: {
      getCouponInfo() {
        // 编辑，查看，复制时调用
        let query = {
          couponCode: this.$route.query.couponCode,
          version: this.$route.query.version
        }
        this._reqFindByCouponCode(query)
        // this._reqShopSetting(query)
      },
      submit() {
        if (this.form.sceneSetting.sceneType === 'COMMODITY_DETAIL' || this.form.sceneSetting.sceneType === 'COLLECTION_CENTER' || this.form.sceneSetting.sceneType === 'FOR_INVITATION') {
          // 校验投放目标相关数据
          let scene_setting = this.$refs.sceneSetting
          scene_setting.validateFn()
        } else {
          this.validate = true
        }
        this.$refs['couponForm'].validate((valid) => {
          if (valid && this.validate) {
            if (JSON.stringify(this.form.businessTypeSet).indexOf('PRE_SALE') > -1 || JSON.stringify(this.form.businessTypeSet).indexOf('LOGISTICS') > -1) {
              this.form.shopSetlected = { // 适用门店已选，页面缓存做删除
                usableType: 'ALL',
                shopOptionalType: 'TYPE',
                shopTypeList: [],
                areaList: [],
                shopCodeList: []
              }
            }
            if (JSON.stringify(this.form.businessTypeSet).indexOf('CLEAN_FOOD') > -1) {
              this.form.commoditySelected = { // 适用商品选择，页面缓存做删除
                usableType: 'ALL',
                commodityOptionalType: 'TYPE',
                categoryIdList: [],
                commodityNoList: []
              }
            }
            if (this.form.businessTypeSet.length === 1 && this.form.businessTypeSet[0] === 'ALL') {
              this.form.shopSetlected = { // 适用门店已选，页面缓存做删除
                usableType: 'ALL',
                shopOptionalType: 'TYPE',
                shopTypeList: [],
                areaList: [],
                shopCodeList: []
              }
              this.form.commoditySelected = { // 适用商品选择，页面缓存做删除
                usableType: 'ALL',
                commodityOptionalType: 'TYPE',
                categoryIdList: [],
                commodityNoList: []
              }
            }
            this.dealDepotArea()
            this.dealGoodsKind()
            // this.form.commoditySetting = this.form.commoditySelected
            // console.log(this.form)
            if (this.$route.query.type === 'edit' || this.$route.query.type === 'release') {
              if (this.$route.query.couponType === 'DOORFILL') {
                this._reqUpdateFullReduction(this.form, this.$route.query.couponCode)
              } else {
                this._reqUpdateDiscount(this.form, this.$route.query.couponCode)
              }
            } else {
              if (this.$route.query.couponType === 'DOORFILL') {
                this._reqAddFullReduction(this.form)
              } else {
                this._reqAddDiscount(this.form)
              }
            }
          } else {
            return false
          }
        })
      },
      dealDepotArea() {
        // TYPE
        let shopSetlected = JSON.parse(JSON.stringify(this.form.shopSetlected))
        if (this.form.shopSetlected.shopOptionalType === 'TYPE') {
          let shopTypeList = []
          shopSetlected.shopTypeList.map((type) => {
            shopTypeList.push(type.code)
          })
          this.form.shopSetting = shopSetlected
          this.form.shopSetting.shopTypeList = shopTypeList
          this.form.shopSetting.areaList = []
          this.form.shopSetting.shopCodeList = []
        } else if (this.form.shopSetlected.shopOptionalType === 'AREA') {
          let areaList = []
          shopSetlected.areaList.map((area) => {
            let item = []
            item.push(area.province.id)
            if (area.city) {
              item.push(area.city.id)
            }
            if (area.county) {
              item.push(area.county.id)
            }
            areaList.push(item)
          })
          this.form.shopSetting = shopSetlected
          this.form.shopSetting.shopTypeList = []
          this.form.shopSetting.areaList = areaList
          this.form.shopSetting.shopCodeList = []
        } else if (this.form.shopSetlected.shopOptionalType === 'CODE') {
          let shopCodeList = []
          shopSetlected.shopCodeList.map((shop) => {
            shopCodeList.push(shop.shopCode)
          })
          this.form.shopSetting = shopSetlected
          this.form.shopSetting.shopTypeList = []
          this.form.shopSetting.areaList = []
          this.form.shopSetting.shopCodeList = shopCodeList
        } else {
          this.form.shopSetting = shopSetlected
        }
      },
      dealGoodsKind() {
        let commoditySelected = JSON.parse(JSON.stringify(this.form.commoditySelected))
        if (this.form.commoditySelected.commodityOptionalType === 'TYPE') {
          let categoryIdList = []
          commoditySelected.categoryIdList.map((category) => {
            let item = []
            item.push(category.kind1.id)
            if (category.kind2) {
              item.push(category.kind2.id)
            }
            categoryIdList.push(item)
          })
          this.form.commoditySetting = commoditySelected
          this.form.commoditySetting.categoryIdList = categoryIdList
          this.form.commoditySetting.commodityNoList = []
        } else if (this.form.commoditySelected.commodityOptionalType === 'CODE') {
          let commodityNoList = []
          commoditySelected.commodityNoList.map((goods) => {
            commodityNoList.push(goods.channelCommodityNo)
          })
          this.form.commoditySetting = commoditySelected
          this.form.commoditySetting.commodityNoList = commodityNoList
          this.form.commoditySetting.categoryIdList = []
        } else {
          this.form.commoditySetting = commoditySelected
        }
      },
      sceneSettingSceneTypeChange(val) {
        if (val === 'FOR_NEW_PEOPLE') {
          this.form.sceneSetting.singleUserLimitType = 'UPPER_LIMIT'
          this.form.sceneSetting.receiveTimeList = []
        } else {
          this.form.sceneSetting.receiveTimeList = [formatTime('start'), formatTime('end')]
        }
      },
      onValidate() {
        this.validate = true
      },
      _reqFindByCouponCode(data) {
        return reqFindByCouponCode(data).then((res) => {
          if (res.code === 200) {
            // this.form = { ...this.form, ...res.result }
            Object.keys(this.form).forEach((item) => {
              if (Object.prototype.toString.call(res.result[item]) === '[object Object]') {
                Object.keys(res.result[item]).forEach((child) => {
                  if (res.result[item][child]) {
                    this.form[item][child] = res.result[item][child]
                  }
                })
              } else {
                if (item === 'ratioForPlatform') {
                  if (typeof res.result[item] === 'number' && !isNaN(res.result[item])) {
                    this.form[item] = res.result[item]
                  }
                } else if (res.result[item]) {
                  this.form[item] = res.result[item]
                }
              }
            })
            this.releaseForm = JSON.parse(JSON.stringify(this.form))
            if (!(res.result.shopSetting.usableType === 'ALL')) {
              this._reqShopSetting(data)
            }
            if (!(res.result.commoditySetting.usableType === 'ALL')) {
              this._reqGoodsSetting(data)
            }
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        }).catch(() => {
        })
      },
      _reqShopSetting(data) {
        let _this = this
        return reqShopSetting(data).then((res) => {
          if (res.code === 200) {
            if (res.result.shopUsableType.value === 1) {
              this.form.shopSetlected.usableType = 'ALL'
            } else if (res.result.shopUsableType.value === 2) {
              _this.form.shopSetlected.usableType = 'USABLE'
            } else if (res.result.shopUsableType.value === 3) {
              this.form.shopSetlected.usableType = 'UNUSABLE'
            }
            if (res.result.shopOptionalType.value === 1) {
              _this.form.shopSetlected.shopOptionalType = 'TYPE'
              _this.form.shopSetlected.shopTypeList = res.result.shopTypeList
            } else if (res.result.shopOptionalType.value === 2) {
              this.form.shopSetlected.shopOptionalType = 'AREA'
              let arr = []
              res.result.areaList.map((item) => {
                arr.push({
                  province: {
                    code: item.provincesCode,
                    id: item.provincesId,
                    name: item.provincesName
                  },
                  city: {
                    code: item.cityCode,
                    id: item.cityId,
                    name: item.cityName
                  },
                  county: {
                    code: item.districtsCode,
                    id: item.districtsId,
                    name: item.districtsName
                  }
                })
              })
              this.form.shopSetlected.areaList = arr
            } else if (res.result.shopOptionalType.value === 3) {
              this.form.shopSetlected.shopOptionalType = 'CODE'
              this.form.shopSetlected.shopCodeList = res.result.shopCodeList
            }
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        }).catch(() => {
          // this.$message({
          //   message: err,
          //   type: 'error'
          // })
        })
      },
      _reqGoodsSetting(data) {
        return reqGoodsSetting(data).then((res) => {
          if (res.code === 200) {
            if (res.result.commodityUsableType.value === 1) {
              this.form.commoditySelected.usableType = 'ALL'
            } else if (res.result.commodityUsableType.value === 2) {
              this.form.commoditySelected.usableType = 'USABLE'
            } else if (res.result.commodityUsableType.value === 3) {
              this.form.commoditySelected.usableType = 'UNUSABLE'
            }
            if (res.result.commodityOptionalType.value === 1) {
              this.form.commoditySelected.commodityOptionalType = 'TYPE'
              let arr = []
              res.result.categoryList.map((item) => {
                arr.push({
                  kind1: item[0],
                  kind2: item[1]
                })
              })
              this.form.commoditySelected.categoryIdList = arr
            } else if (res.result.commodityOptionalType.value === 2) {
              this.form.commoditySelected.commodityOptionalType = 'CODE'
              this.form.commoditySelected.commodityNoList = res.result.commodityList
            }
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        }).catch(() => {
          // this.$message({
          //   message: err,
          //   type: 'error'
          // })
        })
      },
      _reqAddFullReduction(data) {
        this.saveLoading = true
        return reqAddFullReduction(data).then((res) => {
          this.saveLoading = false
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        }).catch(() => {
          this.saveLoading = false
        })
      },
      _reqUpdateFullReduction(data, query) {
        this.saveLoading = true
        return reqUpdateFullReduction(data, query).then((res) => {
          this.saveLoading = false
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        }).catch(() => {
          this.saveLoading = false
        })
      },
      _reqAddDiscount(data) {
        this.saveLoading = true
        return reqAddDiscount(data).then((res) => {
          this.saveLoading = false
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        }).catch(() => {
          this.saveLoading = false
        })
      },
      _reqUpdateDiscount(data, query) {
        this.saveLoading = true
        return reqUpdateDiscount(data, query).then((res) => {
          this.saveLoading = false
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        }).catch(() => {
          this.saveLoading = false
        })
      },
      onDialogSave(val) {
        // 门店和商品弹框保存执行
        if (this.selectType === 'depot') {
          this.form.shopSetlected = val
        } else if (this.selectType === 'goods') {
          this.form.commoditySelected = val
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
          this.form.businessTypeSet = ['ALL']
        } else {
          this.form.businessTypeSet = []
        }
      },
      // 优惠设置添加
      handleAddDiscount() {
        this.form.discountList.push({
          money: '',
          unit: 1,
          discount: ''
        })
      },
      // 优惠设置删除
      handleRemoveDiscount(index) {
        if (this.form.discountList.length === 1) {
          // 如果只有最后一项，置空内容
          this.form.discountList[0] = {
            money: '',
            unit: 1,
            discount: ''
          }
          this.$forceUpdate()
          return
        }
        // 删除指定的行数
        this.form.discountList.splice(index, 1)
      },
      // 打开选择弹框
      showSelectDialog(type) {
        this.selectType = type
        this.$refs.selectDialog.showDialog()
      },
      // 删除已选店铺
      delDepot(rows, index) {
        rows.splice(index, 1)
        // debugger
        // if (this.form.shopSetlected.shopOptionalType === 'AREA') {
        //   this.$refs.selectDialog.$refs.selectDepotArea.delAreas(index)
        //   this.$refs.selectDialog.$refs.selectDepotAreas.delAreas(index)
        // }
      },
      // 删除已选商品
      delGoods(rows, index) {
        rows.splice(index, 1)
        // if (this.form.commoditySelected.commodityOptionalType === 'TYPE') {
        //   this.$refs.selectDialog.$refs.selectGoodsKind.delAreas(index)
        //   this.$refs.selectDialog.$refs.selectGoodsKinds.delAreas(index)
        // }
      },
      // 优惠设置改变
      deductionTypeChange() {
        // if (val === 'SATISFY_DEDUCTION') {
        //   this.form.satisfyDeductionRule = {
        //     items: [{ deduction: '', satisfyMoney: '', satisfyPiece: '', upperLimitMoney: '' }],
        //     unitType: 'MONEY'
        //   }
        // }
      },
      handleCheckAllChange(val) {
        let cityOptions = []
        this.term[this.termIndex].list.map((item) => {
          cityOptions.push(item.id)
        })
        this.form.businessTypeSet = val ? cityOptions : []
        this.isIndeterminate = false
      },
      handleCheckedBusinessTypeChange(value) {
        let checkedCount = value.length
        this.checkAll = checkedCount === this.term[this.termIndex].list.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.term[this.termIndex].list.length
      }
    },
    watch: {
      'form.businessTypeSet': {
        handler(newVal) {
          this.$nextTick(() => {
            // if (JSON.stringify(newVal).indexOf('PRE_SALE') > -1 || JSON.stringify(newVal).indexOf('LOGISTICS') > -1) {
            //   this.depotDisabled = true
            //   this.form.shopSetlected = {
            //     usableType: 'ALL',
            //     shopOptionalType: 'TYPE',
            //     shopTypeList: [],
            //     areaList: [],
            //     shopCodeList: []
            //   }
            // } else {
            //   this.depotDisabled = false
            // }
            if ((newVal.length <= 2 && newVal.length > 0) && (JSON.stringify(newVal).indexOf('PRE_SALE') < 0 && JSON.stringify(newVal).indexOf('LOGISTICS') < 0)) {
              this.depotDisabled = false
            } else {
              this.depotDisabled = true
              this.form.shopSetlected = {
                usableType: 'ALL',
                shopOptionalType: 'TYPE',
                shopTypeList: [],
                areaList: [],
                shopCodeList: []
              }
            }
            if (newVal.length === 1 && (newVal[0] === 'PRE_SALE' || newVal[0] === 'LOGISTICS')) {
              this.$refs.selectDialog.businessTypeSet(newVal[0])
              this.goodsDisabled = false
            } else {
              this.goodsDisabled = true
              this.form.commoditySelected = {
                usableType: 'ALL',
                commodityOptionalType: 'TYPE',
                categoryIdList: [],
                commodityNoList: []
              }
            }
            // if (JSON.stringify(newVal).indexOf('CLEAN_FOOD') > -1) {
            //   this.goodsDisabled = true
            // } else {
            //   this.goodsDisabled = false
            // }
            if (newVal.length === 1 && newVal[0] === 'ALL') {
              this.depotDisabled = true
              this.goodsDisabled = true
              this.form.shopSetlected = {
                usableType: 'ALL',
                shopOptionalType: 'TYPE',
                shopTypeList: [],
                areaList: [],
                shopCodeList: []
              }
              this.form.commoditySelected = {
                usableType: 'ALL',
                commodityOptionalType: 'TYPE',
                categoryIdList: [],
                commodityNoList: []
              }
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
