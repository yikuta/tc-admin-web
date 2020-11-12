<template>
  <div class="app-container">
    <el-row class="title">
      <span :style="{ fontSize:'14px', paddingLeft:'32px' }">
        <span>原始商品:</span>
        <el-link type="primary" :underline="false">{{curGoodsInfo.commodityName}}</el-link>
      </span>
      <el-button v-if="isShowChangeGoodsBtn" size="mini" type="success" @click="handleChangeGoods">更换其他商品</el-button>
    </el-row>
    <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px" size="mini">
      <el-row class="title-main">基本信息</el-row>
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
      <el-form-item label="商品名称" prop="commodityName">
        <el-input v-model="form.commodityName" placeholder="请输入商品名称"></el-input>
        <!-- <div class="text-second">*该名称用于实际展示，可以与基础商品名称不一致，最长允许50个汉字</div> -->
      </el-form-item>
      <el-form-item label="商品简介" prop="introduction">
        <el-input type="textarea" :autosize="{ minRows: 4 }" placeholder="请输入商品简介" v-model="form.introduction"></el-input>
        <!-- <div class="text-second">*该名称用于商品详情与商品列表的商品介绍说明，最长允许200个汉字</div> -->
      </el-form-item>
      <el-form-item label="拼团城市" prop="cityCategory">
        <el-cascader v-if="isShowCityCascader" ref="cascader" v-model="form.cityCategory" :props="props" clearable :placeholder="'请选择拼团城市'"></el-cascader>
      </el-form-item>
      <el-row class="title-main">规格信息</el-row>
      <el-form-item>
        <sku-table ref="skuTable" :tableData="tableData" :colsMap="skuTableConfig" />
      </el-form-item>
      <el-row class="title-main">基础信息</el-row>
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
      <el-form-item label="特殊商品" prop="special">
        <el-switch v-model="form.special" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-form-item label="地推商品" prop="offLine">
        <el-switch v-model="form.offLine" active-color="#13ce66"></el-switch>
      </el-form-item>
      <el-row class="title-main">佣金配置</el-row>
      <el-form-item label="佣金类型" prop='commissionType'>
        <el-radio-group v-model="form.commissionType">
          <el-radio :label="1">固定佣金</el-radio>
          <el-radio :label="2">比例佣金</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="团长佣金" prop="commissionValue">
        <el-input v-model="form.commissionValue" placeholder="请填写团长佣金" clearable>
          <template #append>{{form.commissionType===2?'%':'元'}}</template>
        </el-input>
      </el-form-item>
      <el-row class="title-main">限购配置</el-row>
      <el-form-item label="限购方式" prop='restrictionType'>
        <el-radio-group v-model="form.restrictionType">
          <el-radio :label="1">活动限购</el-radio>
          <el-radio :label="2">累积限购</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="限购数量" prop="restrictionQuantity">
        <el-input v-model="form.restrictionQuantity" placeholder="请填写限购数量" clearable />
      </el-form-item>
      <el-row class="title-main">上下架配置</el-row>
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
  </div>
</template>

<script>
import SkuTable from '@/components/SkuTable/index'
import { reqCategorySub, reqMallGoodsById, reqMallGoodsInfoById } from '@/api/mallGoods'
import { reqBusinessCityByCode } from '@/api/assembleGoods'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'publishGoodsInfo',
  components: { SkuTable },
  watch: {
    curGoodsInfo: {
      handler: function() {
        if (this.isChannel) {
          reqMallGoodsById(this.curGoodsInfo.baseCommodityId)
            .then(res => {
              if (res.code === 200) {
                let result = res.result || {}
                this.setBaseGoods(result) // 设置关联的基础商品
                this.$set(this.curGoodsInfo, 'commodityName', result.commodityName)
              }
            })
            .catch(() => {})
        }
      }
    }
  },
  data() {
    return {
      isShowCityCascader: true,
      isShowChangeGoodsBtn: true,
      isChannel: false,
      cascaderProps: {
        lazy: true,
        lazyLoad: this.lazyLoadCategory
      },
      curGoodsInfo: '',
      title: '',
      form: {
        commodityName: '', // 商品名
        introduction: '', // 商品简介
        curCategory: [],
        showCategoryList: [], // 已经添加的展示分类
        baseSale: 0, // 基础销售
        sort: 0, // 展示排序
        transfer: 1, // 是否包邮
        freightId: '', // 运费模板id
        special: false, // 是否特殊商品
        offLine: false, // 是否地推商品
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
        restrictionQuantity: '' // 限购数量
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
        putOnMethod: [{ required: true, message: '请设置上架方式', trigger: 'change' }],
        putOffMethod: [{ required: true, message: '请设置下架方式', trigger: 'change' }],
        cityCategory: [{ required: true, message: '请选择拼团城市', trigger: 'change' }],
        transfer: [{ required: true, message: '请选择是否包邮', trigger: 'change' }],
        restrictionType: [{ required: true, message: '请选择限购方式', trigger: 'change' }],
        commissionType: [{ required: true, message: '请选择佣金类型', trigger: 'change' }]
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
      skuTableConfig: [
        // skuTable的列配置
        { prop: 'platformDelivery', label: '中台发货', formatter: row => (row['platformDelivery'] ? '是' : '否') },
        { prop: 'weight', label: '重量(Kg)' },
        { prop: 'stock', label: '库存总量' },
        { prop: 'costPrice', label: '税后供货价' },
        { prop: 'marketPrice', label: '市场价' },
        { prop: 'salePrice', label: '销售价', useComponent: 'input' }
      ],
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
      },
      cityOption: []
    }
  },
  computed: {
    ...mapState('assembleGoods', ['curBaseGoods', 'curAssembleGoods', 'curForm', 'curSkuTable', 'curGoodsDetail']),
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
    this.$nextTick(() => {
      if (!this.curBaseGoods.id) {
        const { id } = this.$route.query
        this.isShowChangeGoodsBtn = false
        this.isChannel = true
        this._reqMallGoodsInfoById(id)
      } else if (this.curForm && this.curSkuTable && this.curGoodsDetail) {
        this.form = JSON.parse(JSON.stringify(this.curForm))
        this.tableData = JSON.parse(JSON.stringify(this.curSkuTable))
        this.curGoodsInfo = JSON.parse(JSON.stringify(this.curGoodsDetail))
        if (this.curGoodsInfo.baseCommodityId || this.curGoodsInfo.baseCommodityId === 0) {
          this.isShowChangeGoodsBtn = false
          this.isChannel = true
        }
      } else {
        this._reqMallGoodsById(this.curBaseGoods.id)
      }
    })
  },
  methods: {
    ...mapActions('assembleGoods', ['setBaseGoods', 'clearBaseGoods', 'setAssembleGoods', 'clearAssembleGoods', 'setSingleItemData']),
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
      let repeatList = this.form.showCategoryList.filter(item => {
        let res = false
        item.forEach(it => {
          if (!it.children) {
            if (it.value === this.form.curCategory[this.form.curCategory.length - 1]) res = true
          }
        })
        return res
      })
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
      this.$refs['skuTable'].updateDataSource(this.tableData)
      let priceList = this.tableData.filter(item => {
        // if (!item.salePrice && item.salePrice !== '0') {
        //   return false
        // }
        if (!/^\d+(\.\d{1,2})?$/.test(item.salePrice)) {
          return true
        }
        if (Number(item.salePrice) === 0) {
          return false
        }
        if (Number(item.salePrice) >= 1000000) {
          return true
        }
        return false
      })
      if (priceList.length > 0) {
        this.$message('请正确设置销售价，销售价为100万元以内的两位小数')
        return
      }
      if (!this.form.cityCategory.length) {
        this.$message('请选择拼团城市')
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
          this.setSingleItemData({ form: this.form, skuTable: this.tableData, goodsDetail: this.curGoodsInfo })
          this.$emit('on-next', true)
        } else {
          console.log('未通过校验') // eslint-disable-line
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
    _reqMallGoodsById(id) {
      return reqMallGoodsById(id).then(res => {
        if (res.code === 200) {
          let result = res.result || {}
          this.curGoodsInfo = result || {}
          this.form.introduction = this.curGoodsInfo.introduction
          this.form.commodityName = this.curGoodsInfo.commodityName
          if (this.curGoodsInfo.unit) this.form.unit = this.curGoodsInfo.unit.value
          this.form.storeNo = '1'
          this.tableData = this.curGoodsInfo.baseCommoditySpecificationList
        }
      })
    },
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
          })
      }
    },
    /**
     * @description: 渠道商品详细信息
     */
    _reqMallGoodsInfoById(id) {
      return reqMallGoodsInfoById({ id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.curGoodsInfo = result || {}
            this.setAssembleGoods(this.curGoodsInfo) // 设置当前拼团商品
            this.form.introduction = this.curGoodsInfo.introduction
            this.form.commodityName = this.curGoodsInfo.channelCommodityName
            this.form.baseSale = this.curGoodsInfo.baseSale
            this.form.sort = this.curGoodsInfo.sort
            this.form.transfer = this.curGoodsInfo.transfer ? 1 : 0
            this.form.special = this.curGoodsInfo.special
            this.form.putOnMethod = this.curGoodsInfo.channelCommoditySub.nextUpperDate ? 2 : 1
            this.form.putOnTime = this.curGoodsInfo.channelCommoditySub.nextUpperDate
            this.form.putOffMethod = this.curGoodsInfo.channelCommoditySub.nextLowerDate ? 2 : 1
            this.form.putOffTime = this.curGoodsInfo.channelCommoditySub.nextLowerDate
            this.form.freightId = this.curGoodsInfo.freightId
            this.form.offLine = result.channelCommoditySub.offLine // 地推
            // 拼团城市
            this.form.cityCategory = []
            this.form.cityCategory.push(this.curGoodsInfo.channelCommoditySub.provinceCode)
            this.form.cityCategory.push(this.curGoodsInfo.channelCommoditySub.cityCode)
            // 解决级联选择器回显问题
            this.isShowCityCascader = false
            setTimeout(() => {
              this.isShowCityCascader = true
            }, 500)
            // 佣金配置 限购配置
            this.form.commissionType = this.curGoodsInfo.channelCommoditySub.commissionType.value
            this.form.commissionValue =
              this.curGoodsInfo.channelCommoditySub.commissionType.value === 2 ? this.curGoodsInfo.channelCommoditySub.commissionValue * 100 : this.curGoodsInfo.channelCommoditySub.commissionValue
            this.form.restrictionType = this.curGoodsInfo.channelCommoditySub.restrictionType.value
            this.form.restrictionQuantity = this.curGoodsInfo.channelCommoditySub.restrictionQuantity
            this.curGoodsInfo.channelCategoryList.map(item => {
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
            // console.log('======', this.form.showCategoryList)
            this.tableData = this.curGoodsInfo.channelCommoditySpecificationList
            this.tableData = this.tableData.map(item => {
              if (!item.price) {
                return {
                  ...item,
                  price: item.salePrice
                }
              } else {
                return item
              }
            })
          }
        })
        .then(() => {})
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
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
}
</style>
