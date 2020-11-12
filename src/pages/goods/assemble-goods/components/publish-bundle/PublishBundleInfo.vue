<template>
  <div class="app-container">
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
      <el-row class="title-main text-main padding-bottom-sm margin-bottom-sm border-bottom-seat">基本信息</el-row>
      <el-form-item label="展示分类" prop="curCategory">
        <el-cascader v-model="form.curCategory" @change="handleChangeCategory" clearable :props="cascaderProps"></el-cascader>
        <el-button type="primary" @click="handleAddCategory" :disabled="!form.curCategory.length">添加</el-button>
      </el-form-item>
      <el-form-item>
        <div v-for="(item,idx) of form.showCategoryList" :key="Date.now()+'-'+idx">
          <span v-for="(child,childIndex) of item" :key="childIndex">
            <span v-if="childIndex !== 0">&nbsp;/&nbsp;</span>
            {{child.label}}
          </span>
          <el-button type="danger" icon="el-icon-delete" circle @click="handleRemoveCategory(idx)"></el-button>
        </div>
      </el-form-item>
      <el-form-item label="套餐名称" prop="commodityName">
        <el-input v-model="form.commodityName" placeholder="请输入商品名称"></el-input>
        <!-- <div class="text-second">*该名称用于实际展示，可以与基础商品名称不一致，最长允许50个汉字</div> -->
      </el-form-item>
      <el-form-item label="套餐简介" prop="introduction">
        <el-input type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入商品简介" v-model="form.introduction"></el-input>
        <!-- <div class="text-second">*该名称用于商品详情与商品列表的商品介绍说明，最长允许200个汉字</div> -->
      </el-form-item>
      <el-form-item label="拼团城市" prop="cityCategory">
        <el-cascader v-if="isShowCityCascader" ref="cascader" v-model="form.cityCategory" :props="props" clearable :placeholder="'请选择拼团城市'"></el-cascader>
      </el-form-item>
      <el-form-item label="套餐类型" prop="bundleType">
        <el-radio-group v-model="form.bundleType">
          <el-radio :label="1">固定组合套餐</el-radio>
          <el-radio :label="2">自由组合套餐</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row class="title-main text-main padding-bottom-sm margin-bottom-sm border-bottom-seat">销售配置</el-row>
      <el-form-item>
        <el-table ref="table" :data="tableData" style="width: 100%;margin-top: 10px;" :cell-style="{ textAlign:'center', height:'60px' }" :header-cell-style="{ textAlign:'center' }" size="mini">
          <el-table-column label="商品信息" width="300">
            <template v-slot:default="{ row }">
              <div class="info-style">
                <el-image :src="row['thumbnailImage']" fit="center" />
                <div class="text-info">
                  <div class="text-info-child">
                    <span>{{row['commodityName']}}</span>
                  </div>
                  <div class="text-info-child">
                    <div>基础商品编码</div>
                    <div>{{row['baseCommodityNo']?row['baseCommodityNo']:row['commodityNo']}}</div>
                  </div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="原价" prop="marketPrice">
            <template v-slot:default="{row}">
              <p v-if="!$route.query.id">{{row.marketPrice?row.marketPrice:row.minMarketPrice===row.maxMarketPrice?`${row.minMarketPrice}`:`${row.minMarketPrice}-${row.maxMarketPrice}`}}</p>
              <p v-else>{{row.salePrice?row.salePrice:row.minSalePrice===row.maxSalePrice?`${row.minSalePrice}`:`${row.minSalePrice}-${row.maxSalePrice}`}}</p>
            </template>
          </el-table-column>
          <el-table-column label="搭配价">
            <template v-slot:default="{ row }">
              <span>{{formatCollocationPrice(row)}}</span>
              <i class="el-icon-edit" :style="{cursor:'pointer'}" @click="showPriceDialog(row)" />
            </template>
          </el-table-column>
          <el-table-column label="搭配数量">
            <template v-slot:default="{ row }">
              <span>{{formatLimitCount(row)}}</span>
              <i class="el-icon-edit" :style="{cursor:'pointer'}" @click="showNumDialog(row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-row class="title-main text-main padding-bottom-sm margin-bottom-sm border-bottom-seat">基础信息</el-row>
      <el-form-item label="基础销售" prop="baseSale">
        <el-input v-model="form.baseSale" placeholder="请填写基础销量" />
      </el-form-item>
      <el-form-item label="展示排序" prop="sort">
        <el-input v-model="form.sort" placeholder="请填写排序数字" />
      </el-form-item>
      <el-form-item label="物流信息" prop="transfer">
        <el-radio-group v-model="form.transfer">
          <el-radio :label="1">包邮</el-radio>
          <el-radio :label="0">不包邮</el-radio>
          <el-select v-if="form.transfer===0" v-model="form.freightId" placeholder="请选择运费模板" clearable>
            <el-option v-for="item in expressTemplateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="使用优惠" prop="discount">
        <el-switch v-model="form.discount" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item label="地推商品" prop="discount">
        <el-switch v-model="form.offLine" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-row class="title-main text-main padding-bottom-sm margin-bottom-sm border-bottom-seat">佣金配置</el-row>
      <el-form-item label="佣金类型" prop="commissionType">
        <el-radio-group v-model="form.commissionType" @change="onChangeCommissionType">
          <el-radio :label="1">固定佣金</el-radio>
          <el-radio :label="2">比例佣金</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="团长佣金" prop="commissionValue">
        <el-input v-model="form.commissionValue" placeholder="请填写团长佣金" clearable>
          <template #append>{{form.commissionType===2?'%':'元'}}</template>
        </el-input>
      </el-form-item>
      <el-row class="title-main text-main padding-bottom-sm margin-bottom-sm border-bottom-seat">限购配置</el-row>
      <el-form-item label="限购方式" prop='restrictionType'>
        <el-radio-group v-model="form.restrictionType" @change="onChangeRestrictionType">
          <el-radio :label="1">活动限购</el-radio>
          <el-radio :label="2">累积限购</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="限购数量" prop="restrictionQuantity">
        <el-input v-model="form.restrictionQuantity" placeholder="请填写限购数量" clearable />
      </el-form-item>
      <el-row class="title-main text-main padding-bottom-sm margin-bottom-sm border-bottom-seat">上下架配置</el-row>
      <el-form-item label="上架时间" prop="putOnMethod">
        <el-radio-group v-model="form.putOnMethod" @change="handlePutOnMethodChange">
          <el-radio :label="1">手动上架</el-radio>
          <el-radio :label="2">定时上架</el-radio>
          <el-date-picker v-if="form.putOnMethod===2" v-model="form.putOnTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :default-value="defaultPutOnTime" :picker-options="{disabledDate:disabledPutOnDate,selectableRange:selectablePutOnRange}"></el-date-picker>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="下架时间" prop="putOffMethod">
        <el-radio-group v-model="form.putOffMethod" @change="handlePutOffMethodChange">
          <el-radio :label="1">手动下架</el-radio>
          <el-radio :label="2">定时下架</el-radio>
          <el-date-picker v-if="form.putOffMethod===2" v-model="form.putOffTime" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" :default-value="defaultPutOffTime" :picker-options="{disabledDate:disabledPutOffDate,selectableRange:selectablePutOffRange}"></el-date-picker>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!--todo 需要确定 baseCommoditySpecificationList数据来源-->
    <price-setting-dialog
      ref="priceSettingDialog"
      :visible.sync="priceSettingDialogVisible"
      :tableData="curBundleDetail?(curEditGoods['channelCommoditySpecificationList']?curEditGoods['channelCommoditySpecificationList']:curEditGoods['baseCommoditySpecificationList']):curEditGoods['baseCommoditySpecificationList']"
      :title="'搭配价设置'"
      :info="'搭配价用于用户在购买组合套餐时的价格，只对购买对应的套餐有效，不同的套餐中的相同商品需要单独设置价格，同时不影响单品的销售价格。原则上搭配价应低于单品销售价格。'"
      :skuTableConfig="skuTableConfig"
      :isOpenValidator="true"
      :validator="priceValidator"
      @on-update-price="onUpdatePrice"
      @closed="onClosedDialog"
    />
    <match-num-dialog :visible.sync="numSettingDialogVisible" :goods="curEditGoods || {}" />
  </div>
</template>

<script>
import SkuTable from '@/components/SkuTable/index'
import { PriceSettingDialog } from '../common'
import MatchNumDialog from './MatchNumDialog'
import { reqCategorySub, reqBusinessCityByCode } from '@/api/assembleGoods'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'publishGoodsInfo',
  components: { SkuTable, PriceSettingDialog, MatchNumDialog },
  data() {
    return {
      isShowCityCascader: true,
      cascaderProps: {
        lazy: true,
        lazyLoad: this.lazyLoadCategory
      },
      form: {
        commodityName: '', // 商品名
        introduction: '', // 商品简介
        curCategory: [],
        showCategoryList: [], // 已经添加的展示分类
        baseSale: 0, // 基础销售
        sort: 0, // 展示排序
        transfer: 1, // 是否包邮
        freightId: '', // 运费模板id
        discount: false, // 是否使用优惠
        putOnMethod: 1, // 上架方式
        putOnTime: '', // 上架时间
        putOffMethod: 1, // 下架方式
        putOffTime: '', // 下架时间
        unit: 1, // 单位
        storeNo: '', // 门店编码
        cityCategory: [], // 拼团城市
        commissionType: 2, // 佣金类型
        commissionValue: '', // 团长佣金
        restrictionType: 2, // 限购方式
        restrictionQuantity: '', // 限购数量
        bundleType: 1, // 套餐类型
        offLine: false // 是否地推
      },
      cateOptions: [],
      rules: {
        commodityName: [{ required: true, validator: this.validateGoodsName, trigger: 'blur' }],
        introduction: [{ required: true, validator: this.validateGoodsBrief, trigger: 'blur' }],
        curCategory: [{ required: true, validator: this.validateShowCategoryList, trigger: 'blur' }],
        baseSale: [{ required: true, validator: this.validateBaseSellCount, trigger: 'blur' }],
        sort: [{ required: true, validator: this.validateSort, trigger: 'blur' }],
        commissionValue: [{ validator: this.validateCommission, trigger: 'blur' }],
        restrictionQuantity: [{ validator: this.validateLimitNum, trigger: 'blur' }],
        cityCategory: [{ required: true, message: '请设置拼团城市', trigger: 'change' }],
        bundleType: [{ required: true, message: '请选择套餐类型', trigger: 'change' }],
        commissionType: [{ required: true, message: '请选择佣金类型', trigger: 'change' }],
        restrictionType: [{ required: true, message: '请选择限购方式', trigger: 'change' }],
        transfer: [{ required: true, message: '请设置是否包邮', trigger: 'change' }],
        putOnMethod: [{ required: true, message: '请选择上架时间', trigger: 'change' }],
        putOffMethod: [{ required: true, message: '请选择下架时间', trigger: 'change' }]
      },
      tableData: [],
      expressTemplateList: [
        {
          label: '默认模板',
          value: 1
        }
      ],
      defaultPutOnTime: new Date(),
      defaultPutOffTime: new Date(),
      priceSettingDialogVisible: false, // 搭配价dialog是否可见
      skuTableConfig: [
        { prop: 'platformDelivery', label: '中台发货', formatter: row => (row['platformDelivery'] ? '是' : '否') },
        { prop: 'costPrice', label: '税后供货价' },
        { prop: 'marketPrice', label: '市场价' },
        { prop: 'salePrice', label: '销售价' },
        { prop: 'collocationPrice', label: '搭配价', useComponent: 'input' }
      ],
      curEditGoods: '', // 当前编辑搭配价或搭配数量的商品
      numSettingDialogVisible: false, // 搭配数量dialog是否可见
      props: {
        lazy: true,
        lazyLoad(node, resolve) {
          if (node.root) {
            reqBusinessCityByCode()
              .then(res => {
                let nodes = res.result || []
                nodes = nodes.map(item => ({
                  value: item.provinceCode,
                  label: item.provinceName,
                  leaf: false
                }))
                resolve(nodes)
              })
              .catch(() => {
                resolve([])
              })
          } else {
            reqBusinessCityByCode({ id: node.value })
              .then(res => {
                let result = res.result || []
                let province = result[0] || {}
                let nodes = province.cityList || []
                nodes = nodes.map(item => ({
                  value: item.cityCode,
                  label: item.cityName,
                  leaf: true
                }))
                resolve(nodes)
              })
              .catch(() => {
                resolve([])
              })
          }
        }
      }
    }
  },
  watch: {
    curEditGoods: {
      handler: function(newVal) {
        // 设置值时，把空置为0
        if (newVal) {
          if (newVal['channelCommoditySpecificationList']) {
            newVal['channelCommoditySpecificationList'] = [
              ...newVal['channelCommoditySpecificationList'].map(item => {
                if (!item.collocationPrice) return { ...item, collocationPrice: '0' }
                return item
              })
            ]
          } else {
            newVal['baseCommoditySpecificationList'] = [
              ...newVal['baseCommoditySpecificationList'].map(item => {
                if (!item.collocationPrice) return { ...item, collocationPrice: '0' }
                return item
              })
            ]
          }
        }
      }
    }
  },
  computed: {
    ...mapState('assembleGoods', ['bundleMainGoods', 'bundleRetinueGoods', 'curForm', 'bundleMainGoods_Copy', 'bundleRetinueGoods_Copy', 'curBundleDetail']),
    selectablePutOffRange() {
      if (this.form.putOnTime) {
        let putOnDate = new Date(this.form.putOnTime)
        let putOffDate = new Date(this.form.putOffTime)
        if (putOnDate.getDate() === putOffDate.getDate() && putOnDate.getMonth() === putOffDate.getMonth() && putOnDate.getFullYear() === putOffDate.getFullYear()) {
          let hour = putOnDate.getHours() < 10 ? '0' + putOnDate.getHours() : putOnDate.getHours()
          let min = putOnDate.getMinutes() < 10 ? '0' + putOnDate.getMinutes() : putOnDate.getMinutes()
          let second = putOnDate.getSeconds() + 1 < 10 ? '0' + (putOnDate.getSeconds() + 1) : putOnDate.getSeconds() + 1
          return `${hour}:${min}:${second} - 23:59:59`
        } else {
          return '00:00:00 - 23:59:59'
        }
      }
      return '00:00:00 - 23:59:59'
    },
    selectablePutOnRange() {
      if (this.form.putOffTime) {
        let putOnDate = new Date(this.form.putOnTime)
        let putOffDate = new Date(this.form.putOffTime)
        if (putOnDate.getDate() === putOffDate.getDate() && putOnDate.getMonth() === putOffDate.getMonth() && putOnDate.getFullYear() === putOffDate.getFullYear()) {
          let hour = putOffDate.getHours() < 10 ? '0' + putOffDate.getHours() : putOffDate.getHours()
          let min = putOffDate.getMinutes() < 10 ? '0' + putOffDate.getMinutes() : putOffDate.getMinutes()
          let second = putOffDate.getSeconds() - 1
          second = second < 0 ? '00' : second < 10 ? '0' + second : second
          return `00:00:00 - ${hour}:${min}:${second}`
        } else {
          return '00:00:00 - 23:59:59'
        }
      }
      return '00:00:00 - 23:59:59'
    }
  },
  mounted() {
    let bundleMainGoods, bundleRetinueGoods
    if (this.bundleMainGoods_Copy || this.bundleRetinueGoods_Copy.length) {
      bundleMainGoods = JSON.parse(JSON.stringify(this.bundleMainGoods_Copy))
      bundleRetinueGoods = JSON.parse(JSON.stringify(this.bundleRetinueGoods_Copy))
    } else {
      bundleMainGoods = JSON.parse(JSON.stringify(this.bundleMainGoods))
      bundleRetinueGoods = JSON.parse(JSON.stringify(this.bundleRetinueGoods))
    }
    this.tableData = [bundleMainGoods, ...bundleRetinueGoods]
    this.$nextTick(() => {
      if (this.curForm && this.curBundleDetail) {
        try {
          this.form.commodityName = this.curForm.channelCommodityName
          this.form.introduction = this.curForm.introduction
          this.curForm.channelCategoryList.map(item => {
            let list = []
            if (item.parent) {
              list.push({
                children: [{ ...item, value: item.id, label: item.name }],
                value: item.parent.id,
                label: item.parent.name
              })
            }
            list.push({
              value: item.id,
              label: item.name
            })
            this.form.showCategoryList.push(list)
            return item
          })
          this.form.baseSale = this.curForm.baseSale
          this.form.sort = this.curForm.sort
          this.form.transfer = this.curForm.transfer ? 1 : 0
          this.form.freightId = this.curForm.freightId
          this.form.special = this.curForm.special
          this.form.putOnMethod = this.curForm.channelCommoditySub.nextUpperDate ? 2 : 1
          this.form.putOnTime = this.curForm.channelCommoditySub.nextUpperDate
          this.form.putOffMethod = this.curForm.channelCommoditySub.nextLowerDate ? 2 : 1
          this.form.putOffTime = this.curForm.channelCommoditySub.nextLowerDate
          this.form.unit = this.curForm.unit ? this.curForm.unit.value : 1
          this.form.storeNo = this.curForm.storeNo
          // 拼团城市
          this.form.cityCategory = []
          this.form.cityCategory.push(this.curForm.channelCommoditySub.provinceCode)
          this.form.cityCategory.push(this.curForm.channelCommoditySub.cityCode)
          // 解决级联选择器回显问题
          this.isShowCityCascader = false
          setTimeout(() => {
            this.isShowCityCascader = true
          }, 500)
          this.form.commissionType = this.curForm.channelCommoditySub.commissionType.value
          this.form.commissionValue = this.curForm.channelCommoditySub.commissionValue
          this.form.restrictionType = this.curForm.channelCommoditySub.restrictionType.value
          this.form.restrictionQuantity = this.curForm.channelCommoditySub.restrictionQuantity
          this.form.bundleType = this.curForm.channelCommoditySub.packageType.value
          this.form.offLine = this.curForm.channelCommoditySub.offLine
        } catch (err) {
          this.form = this.curForm
        }
      } else if (this.curForm) {
        this.form = this.curForm
      }
    })
  },
  methods: {
    ...mapActions('assembleGoods', ['setBundleMainGoods', 'setBundleRetinueGoods', 'setBundleFormData', 'setBundleMainGoods_Copy', 'setBundleRetinueGoods_Copy']),
    /**
     * @description: 改变佣金类型
     */
    onChangeCommissionType() {
      this.form.commissionValue = 0
      this.$refs['form'].clearValidate('commissionValue')
    },
    /**
     * @description: 改变限购方式
     */
    onChangeRestrictionType() {
      this.form.restrictionQuantity = 0
      this.$refs['form'].clearValidate('restrictionQuantity')
    },
    onClosedDialog() {
      if (this.curBundleDetail) {
        this.curEditGoods['channelCommoditySpecificationList']
          ? (this.curEditGoods['channelCommoditySpecificationList'] = [...this.curEditGoods['channelCommoditySpecificationList']])
          : (this.curEditGoods['baseCommoditySpecificationList'] = [...this.curEditGoods['baseCommoditySpecificationList']])
      } else {
        this.curEditGoods['baseCommoditySpecificationList'] = [...this.curEditGoods['baseCommoditySpecificationList']]
      }
    },
    /**
     * @description: 格式化搭配价
     */
    formatCollocationPrice(row) {
      const fn = val => Number(val).toFixed(2)
      if (row['collocationPrice']) null
      else if (row.minCollocationPrice && row.maxCollocationPrice) {
        if (row.minCollocationPrice === row.maxCollocationPrice) {
          row['collocationPrice'] = `${fn(row.minCollocationPrice)}`
        } else {
          row['collocationPrice'] = `${fn(row.minCollocationPrice)}~${fn(row.maxCollocationPrice)}`
        }
      } else {
        row['collocationPrice'] = fn(0)
      }
      return row['collocationPrice']
    },
    /**
     * @description: 格式化搭配数量
     */
    formatLimitCount(row) {
      if (row['matchNum']) {
        return row['matchNum']
      } else if (row.limitCount) {
        row['matchNum'] = row.limitCount
        return row['matchNum']
      } else {
        row['matchNum'] = 1
        return row['matchNum']
      }
    },
    showPriceDialog(row) {
      this.priceSettingDialogVisible = true
      this.curEditGoods = row
      if (this.curBundleDetail) {
        if (this.curEditGoods['channelCommoditySpecificationList']) {
          this.curEditGoods['channelCommoditySpecificationList'] = this.curEditGoods['channelCommoditySpecificationList'].map(item => {
            return {
              ...item,
              skuNo: item.baseSkuNo
            }
          })
        } else {
          this.curEditGoods['baseCommoditySpecificationList'] = this.curEditGoods['baseCommoditySpecificationList'].map(item => {
            return {
              ...item
            }
          })
        }
      }
    },
    showNumDialog(row) {
      this.numSettingDialogVisible = true
      this.curEditGoods = row
    },
    /**
     * @description: 搭配价校验器
     */
    priceValidator(price) {
      if (!price && price !== 0) {
        return { res: false, text: '请输入100万以内的两位小数或0' }
      }
      if (!/^\d+(\.\d{1,2})?$/.test(price)) {
        return { res: false, text: '请输入100万以内的两位小数或0' }
      }
      if (Number(price) >= 1000000) {
        return { res: false, text: '请输入100万以内的两位小数或0' }
      }
      return { res: true }
    },
    /**
     * @description: 更新搭配价
     */
    onUpdatePrice() {
      const { priceSettingDialog: dialog } = this.$refs
      dialog.$refs['skuTable'].updateDataSource(
        this.curBundleDetail
          ? this.curEditGoods['channelCommoditySpecificationList']
            ? this.curEditGoods['channelCommoditySpecificationList']
            : this.curEditGoods['baseCommoditySpecificationList']
          : this.curEditGoods['baseCommoditySpecificationList'],
        (dataList, status) => {
          if (status) {
            let res = false
            dataList.forEach(item => {
              if (item.collocationPrice && item.collocationPrice !== '0') res = true
            })
            if (res) {
              this.priceSettingDialogVisible = false
              return { res: true }
            } else return { res: false, text: '搭配商品中至少有一个SKU价格不为0，请重新设置' }
          } else {
            return { res: false }
          }
        }
      )
      let min, max
      let specificationList = this.curBundleDetail
        ? this.curEditGoods['channelCommoditySpecificationList']
          ? this.curEditGoods['channelCommoditySpecificationList']
          : this.curEditGoods['baseCommoditySpecificationList']
        : this.curEditGoods['baseCommoditySpecificationList']
      specificationList.forEach(item => {
        if (item.collocationPrice && item.collocationPrice !== '0') {
          if (!min || Number(item.collocationPrice) < Number(min)) min = item.collocationPrice
          if (!max || Number(item.collocationPrice) > Number(max)) max = item.collocationPrice
        }
      })
      if (!min && min !== 0) min = 0
      if (!max && max !== 0) max = 0
      const fn = val => Number(val).toFixed(2)
      Number(min) === Number(max) ? (this.curEditGoods['collocationPrice'] = `${fn(min)}`) : (this.curEditGoods['collocationPrice'] = `${fn(min)}~${fn(max)}`)
    },
    disabledPutOffDate(time) {
      if (this.form.putOnTime) {
        let putOnDate = new Date(this.form.putOnTime)
        this.defaultPutOffTime = putOnDate.getTime() + 1 * 1000
        let putOnTime = (putOnDate.getHours() * 60 * 60 + putOnDate.getMinutes() * 60 + putOnDate.getSeconds()) * 1000
        if (time.getTime() + putOnTime < putOnDate.getTime()) {
          return true
        }
        const endTime = (23 * 60 * 60 + 59 * 60 + 59) * 1000
        if (time.getTime() + putOnTime === putOnDate.getTime() && putOnDate.getTime() === time.getTime() + endTime) {
          return true
        }
        return false
      }
      return false
    },
    disabledPutOnDate(time) {
      if (this.form.putOffTime) {
        let putOffDate = new Date(this.form.putOffTime)
        this.defaultPutOnTime = putOffDate.getTime() - 1 * 1000
        let putOffTime = (putOffDate.getHours() * 60 * 60 + putOffDate.getMinutes() * 60 + putOffDate.getSeconds()) * 1000
        if (time.getTime() + putOffTime > putOffDate.getTime()) {
          return true
        }

        if (time.getTime() + putOffTime === putOffDate.getTime() && putOffDate.getTime() === time.getTime()) {
          return true
        }
        return false
      }
      return false
    },
    handlePutOnMethodChange(val) {
      if (val === 1) this.form.putOnTime = ''
    },
    handlePutOffMethodChange(val) {
      if (val === 1) this.form.putOffTime = ''
    },
    handleChangeGoods() {
      this.$emit('on-pre', true)
    },
    handleChangeCategory(val) {
      console.log('handleChangeCategory', val) // eslint-disable-line
    },
    /**
     * @description: 添加展示分类
     */
    handleAddCategory() {
      if (!this.form.curCategory || this.form.curCategory.length === 0) {
        return
      }
      // console.log(this.form.showCategoryList)
      let repeatList = this.form.showCategoryList.filter(item => {
        let res = false
        item.forEach(it => {
          if (!it.children) {
            if (it.value === this.form.curCategory[this.form.curCategory.length - 1]) res = true
          }
        })
        return res
      })
      // console.log('repeatList  ', repeatList)
      if (repeatList && repeatList.length) {
        this.$message('不能添加重复的展示分类')
        return
      }
      let tempList = this.form.curCategory.map(item => {
        this.cateOptions.forEach(cate => {
          if (cate.value === item) {
            item = { ...cate }
            return
          }
          if (cate.children) {
            cate.children.forEach(cateChild => {
              if (cateChild.value === item) {
                item = { ...cateChild }
              }
            })
          }
        })
        return item
      })
      this.form.showCategoryList.push(tempList)
      // console.log(this.form.showCategoryList)
      this.$refs['form'].validateField(['curCategory'], errorMessage => {
        console.log(errorMessage) // eslint-disable-line
      })
    },
    /**
     * @description: 移除展示分类
     */
    handleRemoveCategory(idx) {
      const h = this.$createElement
      this.$msgbox({
        title: '警告',
        message: h('p', null, '移除展示分类后可以重新再添加该分类，确定要移除吗？'),
        showCancelButton: true,
        confirmButtonText: '确定移除',
        cancelButtonText: '我再想想'
      })
        .then(() => {
          this.form.showCategoryList.splice(idx, 1)
          this.$refs['form'].validateField(['curCategory'], errorMessage => {
            console.log(errorMessage) // eslint-disable-line
          })
        })
        .catch(() => {})
    },
    /**
     * @description: 校验商品名称
     */
    validateGoodsName(rule, name, callback) {
      if (!name) {
        callback(new Error('请输入商品名称'))
      } else if (name.length < 3) {
        callback(new Error('商品名称最少3个汉字'))
      } else if (name.length > 50) {
        callback(new Error('商品名称最多50个汉字'))
      } else {
        callback()
      }
    },
    /**
     * @description: 校验商品简介
     */
    validateGoodsBrief(rule, brief, callback) {
      if (!brief) {
        callback(new Error('请输入商品简介'))
      } else if (brief.length < 3) {
        callback(new Error('商品简介最少3个汉字'))
      } else if (brief.length > 200) {
        callback(new Error('商品简介最多200个汉字'))
      } else {
        callback()
      }
    },
    /**
     * @description: 校验展示分类
     */
    validateShowCategoryList(rule, val, callback) {
      if (!this.form.showCategoryList || !this.form.showCategoryList.length) {
        callback(new Error('请添加一个展示分类'))
      } else if (this.form.showCategoryList.length > 10) {
        callback(new Error('最多只能设置10个展示分类'))
        this.$message('最多只能设置10个展示分类')
      } else {
        callback()
      }
      // callback()
    },
    /**
     * @description: 校验基础销售
     */
    validateBaseSellCount(rule, count, callback) {
      if (!count) {
        callback()
      } else if (/\D/.test(count)) {
        callback('基础销售为100万以内的整数')
      } else if (Number(count) >= 1000000) {
        callback('基础销售为100万以内的整数')
      } else {
        callback()
      }
    },
    /**
     * @description: 校验展示排序
     */
    validateSort(rule, sort, callback) {
      if (!sort) {
        callback()
      } else if (/\D/.test(sort)) {
        callback('展示排序为100万以内的整数')
      } else if (Number(sort) >= 1000000) {
        callback('展示排序为100万以内的整数')
      } else {
        callback()
      }
    },
    /**
     * @description: 校验团长佣金
     */
    validateCommission(rule, commission, callback) {
      if (!commission) {
        callback()
      } else if (this.form.commissionType === 1) {
        if (!/^\d+(\.\d{1,2})?$/.test(commission)) {
          callback('请输入0~10000（不含）之间的两位小数')
        } else {
          callback()
        }
      } else if (this.form.commissionType === 2) {
        if (/\D/.test(commission)) {
          callback('请输入0~100（含）之间的整数')
        } else if (Number(commission) < 0 || Number(commission) > 100) {
          callback('请输入0~100（含）之间的整数')
        } else {
          callback()
        }
      }
    },
    /**
     * @description: 校验限购数量
     */
    validateLimitNum(rule, limitNum, callback) {
      if (!limitNum) {
        callback()
      } else if (/\D/.test(limitNum)) {
        callback('请输入0~10000（不含）之间的整数')
      } else if (Number(limitNum) < 0 || Number(limitNum) >= 10000) {
        callback('请输入0~10000（不含）之间的整数')
      } else {
        callback()
      }
    },
    /**
     * @description: 校验表单，判断能否进入下一步
     */
    validateNext() {
      let res = true
      this.tableData.map(item => {
        if (!item.collocationPrice || item.collocationPrice === '0' || item.collocationPrice === '0.00') {
          res = false
        }
        return item
      })
      if (!res) {
        this.$message('搭配商品中至少有一个SKU价格不为0，请重新设置')
        return
      }
      if (!this.form.cityCategory || !this.form.cityCategory.length) {
        this.$message('请选择拼团城市')
        return
      }
      if (!this.form.baseSale && this.form.baseSale !== 0) {
        this.$message('请填写基础销售')
        return
      }
      if (!this.form.sort && this.form.sort !== 0) {
        this.$message('请填写展示排序')
        return
      }
      if (this.form.transfer === 0 && !this.form.freightId && this.form.freightId !== 0) {
        this.$message('请选择运费模板')
        return
      }
      if (this.form.putOnMethod === 2 && !this.form.putOnTime) {
        this.$message('请设置上架时间')
        return
      }
      if (this.form.putOffMethod === 2 && !this.form.putOffTime) {
        this.$message('请设置下架时间')
        return
      }
      this.$refs['form'].validate(isSuccess => {
        if (isSuccess) {
          console.log('通过校验') // eslint-disable-line
          let tableData = JSON.parse(JSON.stringify(this.tableData))
          this.setBundleMainGoods_Copy(tableData.shift())
          this.setBundleRetinueGoods_Copy(tableData)
          this.setBundleFormData({ form: this.form })
          this.$emit('on-next', true)
        } else {
          console.log('未通过校验') // eslint-disable-line
          // this.$emit('on-next', true)
        }
      })
    },
    lazyLoadCategory(node, resolve) {
      if (node.root) {
        this._reqCategorySub({ parentId: node.value, businessNo: 2 }).then(nodes => {
          resolve(nodes)
        })
      } else {
        this._reqCategorySub({ parentId: node.value, businessNo: 2 }).then(nodes => {
          this.cateOptions.map(item => {
            if (item.value === node.value) {
              item.children = nodes
            }
          })
          resolve(nodes)
        })
      }
    },
    // ***请求处理***
    _reqCategorySub(data) {
      if (!data || data.parentId === undefined) {
        return reqCategorySub(data)
          .then(res => {
            let result = []
            if (res.code === 200) {
              result = res.result || []
              result = result.map(item => {
                return {
                  value: item.id,
                  label: item.name,
                  leaf: false
                }
              })
              this.cateOptions = result || []
            }
            return result
          })
          .catch(() => {
            // console.log(err)
          })
      } else {
        return reqCategorySub(data)
          .then(res => {
            let result = []
            if (res.code === 200) {
              result = res.result || []
              result = result.map(item => {
                return {
                  value: item.id,
                  label: item.name,
                  leaf: true
                }
              })
            }
            return result
          })
          .catch(() => {
            // console.log(err)
          })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  @import '@/assets/style/common.scss';
.app-container {
  .form {
    margin-top: 10px;
  }
  .title-main {
    font-weight: bold;
  }
  .text-second {
    color: rgb(215, 215, 215);
  }
  .info-style {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-align: start;
    /deep/ .el-image {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
      margin-right: 5px;
    }
    .text-info {
      .text-info-child {
        display: flex;
        flex-direction: row;
        div:first-child {
          flex-shrink: 0;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
