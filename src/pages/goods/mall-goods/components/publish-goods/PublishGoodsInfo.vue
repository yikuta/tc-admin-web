<template>
  <div class="app-container">
    <el-row class="title">
      <span :style="{ fontSize:'14px', paddingLeft:'32px' }">
        <span>原始商品:</span>
        <el-link type="primary" :underline="false">{{curGoodsInfo.commodityName}}</el-link>
      </span>
      <el-button v-if="isShowChangeGoodsBtn" size="mini" type="success" @click="handleChangeGoods">更换其他商品</el-button>
    </el-row>
    <el-form class="form" ref="form" size="mini" :model="form" :rules="rules" label-width="100px">
      <el-row class="title-main">基本信息</el-row>
      <el-form-item label="展示分类" prop="curCategory">
        <!-- <el-cascader v-model="form.curCategory" :options="cateOptions" @change="handleChangeCategory" clearable :props="cascaderProps"></el-cascader> -->
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
          <el-select v-if="form.transfer === 0" v-model="form.freightId" placeholder="请选择运费模板" clearable>
            <el-option v-for="item in expressTemplateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="特殊商品" prop="special">
        <el-switch v-model="form.special" active-color="#13ce66"></el-switch>
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
import { fetchAllLogisticsModuleList } from '@/api/logistics'
import { reqBaseGoodsList, reqCategorySub, reqAddMallGoods, reqMallGoodsById, reqMallGoodsInfoById } from '@/api/mallGoods'

export default {
  name: 'publishGoodsInfo',
  components: { SkuTable },
  props: ['currentGoodsId', 'curSkuTable', 'curForm', 'curGoodsDetail'],
  watch: {
    curGoodsInfo: {
      handler: function() {
        if (this.isChannel) {
          reqMallGoodsById(this.curGoodsInfo.baseCommodityId)
            .then(res => {
              // console.log('reqMallGoodsById')
              if (res.code === 200) {
                let result = res.result || {}
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
        sort: '', // 展示排序
        transfer: 1, // 是否包邮
        freightId: '', // 运费模板id
        special: false, // 是否特殊商品
        putOnMethod: 1, // 上架方式
        putOnTime: '', // 上架时间
        putOffMethod: 1, // 下架方式
        putOffTime: '', // 下架时间
        unit: 1, // 单位
        storeNo: '' // 门店编码
      },
      cateOptions: [],
      rules: {
        commodityName: [{ required: true, validator: this.validateGoodsName, trigger: 'blur' }],
        introduction: [{ required: true, validator: this.validateGoodsBrief, trigger: 'blur' }],
        curCategory: [{ required: true, validator: this.validateShowCategoryList, trigger: 'blur' }],
        baseSale: [{ required: true, validator: this.validateBaseSellCount, trigger: 'blur' }],
        sort: [{ required: true, validator: this.validateSort, trigger: 'blur' }],
        transfer: [{ required: true, message: '请设置是否包邮', trigger: 'change' }],
        putOnMethod: [{ required: true, message: '请选择上架时间', trigger: 'change' }],
        putOffMethod: [{ required: true, message: '请选择下架时间', trigger: 'change' }]
      },
      tableData: [],
      expressTemplateList: [],
      baseGoodsList: [
        {
          label: '手机',
          value: 'phone'
        }
      ],
      defaultPutOnTime: new Date(),
      defaultPutOffTime: new Date(),
      skuTableConfig: [
        // skuTable的列配置
        { prop: 'platformDelivery', label: '中台发货', formatter: function(row) { return row['platformDelivery'] ? '是' : '否' } },
        { prop: 'weight', label: '重量(Kg)' },
        { prop: 'stock', label: '库存总量' },
        { prop: 'costPrice', label: '税后供货价' },
        { prop: 'marketPrice', label: '市场价' },
        { prop: 'salePrice', label: '销售价', useComponent: 'input' }
      ]
    }
  },
  computed: {
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
      if (!this.currentGoodsId) {
        const { id } = this.$route.query
        // console.log('_reqMallGoods Info ById', id)
        this.$emit('set-current-id', id)
        this.$emit('on-change-pre-visible')
        this.isShowChangeGoodsBtn = false
        this.isChannel = true
        this._reqMallGoodsInfoById(id)
      } else if (this.curForm && this.curSkuTable && this.curGoodsDetail) {
        // console.log('publishGoodsInfo1 ', this.curForm)
        // console.log('publishGoodsInfo2 ', this.curSkuTable)
        // console.log('publishGoodsInfo3 ', this.curGoodsDetail)
        this.form = JSON.parse(JSON.stringify(this.curForm))
        this.tableData = JSON.parse(JSON.stringify(this.curSkuTable))
        this.curGoodsInfo = JSON.parse(JSON.stringify(this.curGoodsDetail))
        if (this.curGoodsInfo.baseCommodityId || this.curGoodsInfo.baseCommodityId === 0) {
          this.isShowChangeGoodsBtn = false
          this.isChannel = true
        }
      } else {
        // console.log('_reqMallGoodsById')
        this._reqMallGoodsById(this.currentGoodsId)
      }
    })
    this.fetchAllLogisticsModuleList()
  },
  methods: {
    fetchAllLogisticsModuleList() {
      fetchAllLogisticsModuleList({}).then(res => {
        if (res.code === 200) {
          this.expressTemplateList = res.result
        }
      })
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
        if (errorMessage === '最多只能设置10个展示分类') this.form.showCategoryList.pop()
      })
    },
    /**
     * @description: 移除展示分类
     */
    handleRemoveCategory(idx) {
      this.form.showCategoryList.splice(idx, 1)
      this.$refs['form'].validateField(['curCategory'], errorMessage => {
        console.log(errorMessage) // eslint-disable-line
      })
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
      // console.log('validateGoodsBrief')
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
      // console.log('validateShowCategoryList')
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
      if (!count && count !== 0) {
        callback('基础销售为100万以内的整数')
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
      if (!sort && sort !== 0) {
        callback('展示排序为100万以内的整数')
      } else if (/\D/.test(sort)) {
        callback('展示排序为100万以内的整数')
      } else if (Number(sort) >= 1000000) {
        callback('展示排序为100万以内的整数')
      } else {
        callback()
      }
    },
    /**
     * @description: 校验表单，判断能否进入下一步
     */
    validateNext() {
      this.$refs['skuTable'].updateDataSource(this.tableData)
      let hasNotZero = 0 // 记录数字不等于0的数字
      let priceList = this.tableData.filter(item => {
        console.log(item) // eslint-disable-line
        if (!/^\d+(\.\d{1,2})?$/.test(item.salePrice)) {
          // 数据不是数字返回true
          return true
        }
        if (item.salePrice && item.salePrice !== '0') {
          if (Number(item.salePrice) >= 1000000) {
            return true
          }
          hasNotZero = hasNotZero + 1
          // 有数据且不等于 0
          return false
        }
        return false
      })
      if (priceList.length > 0) {
        this.$message.error('请正确设置销售价，销售价为100万元以内的两位小数！')
        return
      }
      if (!priceList.length && !hasNotZero) {
        // 验证通过但是没有数字不等于0的，也抛出错误
        this.$message.error('请正确设置销售价，至少一个商品价格不能为0！')
        return
      }
      if (this.form.transfer === 0 && !this.form.freightId && this.form.freightId !== 0) {
        this.$message.error('请选择运费模板')
        return
      }
      if (this.form.putOnMethod === 2 && !this.form.putOnTime) {
        this.$message.error('请设置上架时间')
        return
      }
      if (this.form.putOffMethod === 2 && !this.form.putOffTime) {
        this.$message.error('请设置下架时间')
        return
      }
      this.$refs['form'].validate(isSuccess => {
        if (isSuccess) {
          console.log('通过校验') // eslint-disable-line
          this.$emit('on-cache', this.form, this.tableData, this.curGoodsInfo)
          this.$emit('on-next', true)
        } else {
          console.log('未通过校验') // eslint-disable-line
        }
        // console.log(this.form)
        // console.log(this.tableData)
      })
    },
    lazyLoadCategory(node, resolve) {
      // console.log(node)
      if (node.root) {
        this._reqCategorySub({ parentId: node.value, businessNo: 1 }).then(nodes => {
          resolve(nodes)
        })
      } else {
        this._reqCategorySub({ parentId: node.value, businessNo: 1 }).then(nodes => {
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
    _reqBaseGoodsList(data) {
      return reqBaseGoodsList(data)
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.baseGoodsList = result.items || []
          }
        })
        .catch(() => {
          // console.log(err)
        })
    },
    _reqMallGoodsById(id) {
      // console.log('_reqMallGoodsById')
      return reqMallGoodsById(id).then(res => {
        if (res.code === 200) {
          let result = res.result || {}
          this.curGoodsInfo = result || {}
          this.form.introduction = this.curGoodsInfo.introduction
          this.form.commodityName = this.curGoodsInfo.commodityName
          if (this.curGoodsInfo.unit) this.form.unit = this.curGoodsInfo.unit.value
          this.form.storeNo = '1'
          this.tableData = this.curGoodsInfo.baseCommoditySpecificationList || []
          this.tableData = this.tableData.map(item => {
            if (!item.price) {
              return {
                ...item,
                price: 0
              }
            } else {
              return item
            }
          })
          // console.log('curGoodsInfo', this.tableData)
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
    _reqAddMallGoods(form) {
      return reqAddMallGoods(form)
        .then(res => {
          if (res.code === 200) {
            // let result = res.result || {}
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.push({ path: '/goods/mallGoods' })
          }
        })
        .catch(() => {
        })
    },
    _reqMallGoodsInfoById(id) {
      return reqMallGoodsInfoById({ id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.curGoodsInfo = result || {}
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
            this.tableData = this.curGoodsInfo.channelCommoditySpecificationList || []
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
