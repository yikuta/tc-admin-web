<template>
  <div class="app-container">
    <set-activity ref="setActivity" v-if="currentStep===0" />
    <set-goods v-if="currentStep===1" ref="setGoods"/>
    <div class="action-area">
      <template v-if="isShowSaveAndPre">
        <el-button type="primary" @click="handlePre(false)">上一步</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </template>
      <el-button v-else type="primary" @click="handleNext(false)">下一步</el-button>
    </div>
  </div>
</template>

<script>
import { PublishActivity } from './components'
import { MatchType, DataType } from '@/constants/search'
import searchTool from '@/utils/searchTool'
import {
  reqColonelList,
  reqAssembleGoodsEnabledList,
  reqAddActivity,
  reqAssembleActivityById,
  reqUpdateActivity,
  reqAssembleGoodsList,
  reqBusinessCityByCode,
  reqBusinessCityById
} from '@/api/assembleGoods'

export default {
  name: 'publishActivity',
  components: { ...PublishActivity },
  computed: {
    isShowSaveAndPre() {
      return this.currentStep === 1
    }
  },
  provide() {
    return {
      context: this
    }
  },
  data() {
    let colonelForm = {
      // 团长列表的search form
      colonelCode: { value: '', name: 'regimentalCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
      account: { value: '', name: 'phoneNumber', matchType: MatchType.CONTAIN, type: DataType.STRING },
      colonelName: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
      status: { value: '', name: 'colonelStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER },
      joinTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
      area: { value: '', name: 'regimentalLocation.districtCode', matchType: MatchType.EQUAL, type: DataType.STRING }
    }
    let goodsForm = {
      // 商品列表的search form
      category: { value: [], name: 'channelCategoryList.id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
      goodsCode: { value: '', name: 'channelCommodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
      baseGoodsCode: { value: '', name: 'baseCommodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
      goodsName: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
      offLine: { value: '', name: 'channelCommoditySub.offLine', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
      status: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER },
      type: { value: '', name: 'commodityType', matchType: MatchType.EQUAL, type: DataType.INTEGER }
    }
    return {
      activityId: 0, // 活动id
      isCopy: false, // 是否复制
      isUpdate: false, // 是否更新
      isEditAbled: true, // 能否编辑某个字段
      isFirstEnter: false, // 是否第一次进入获取活动详情
      currentStep: 0,
      // 用于穿透给子组件的数据
      selectedCity: '', // 选择的拼团城市
      selectedCityCode: [], // 选择的拼团城市Code
      areaOption: [], // 选择团长时，可以筛选的区域
      form: {
        // 设置活动表单
        activityName: '',
        businessCityId: [],
        groupActivityType: 1,
        assembleTime: [],
        cutoff: { day: '', time: '' },
        extractDay: '',
        sort: 0,
        groupType: 1
      },
      optional: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        list: [], // 可选团长列表
        reqForm: {}, // 用于网络请求的form
        form: {
          // 可选团长列表的search form
          ...colonelForm,
          ids: { value: [], name: 'id', matchType: MatchType.CONTAIN, type: DataType.LISTLONG }
        },
        onSearch: this.onOptionalSearch
      },
      selected: {
        currentPage: 1,
        pageSize: 20,
        totalCount: 0,
        list: [], // 已选团长列表
        filterList: [], // 过滤列表
        pageList: [], // 分页列表
        reqForm: {},
        form: {
          // 已选团长列表的search form
          ...colonelForm
        },
        onSearch: this.onSelectedSearch,
        handleCurrentPageList: this.handleCurrentPageList
      },
      goods: {
        optional: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0,
          reqForm: {},
          form: {
            ...goodsForm
          },
          list: [], // 可选商品
          onSearch: this.onOptionalGoodsSearch
        },
        selected: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0,
          reqForm: {},
          form: {
            ...goodsForm
          },
          list: [], // 已选商品
          filterList: [], // 过滤列表
          pageList: [], // 分页列表
          onSearch: this.onSelectedGoodsSearch,
          handleCurrentPageList: this.handleCurrentPageListForGoods
        },
        disabled: {
          currentPage: 1,
          pageSize: 20,
          totalCount: 0,
          reqForm: {},
          form: {
            ...goodsForm
          },
          ids: [], // 不可选id集合
          list: [], // 不可选商品
          unusableIdMap: null, // 包含不可选原因映射
          onSearch: this.onDisabledGoodsSearch
        }
      }
    }
  },
  beforeMount() {
    const { id, cp } = this.$route.query
    if (id && cp) {
      this.isCopy = true
      this._reqAssembleActivityById(id)
    } else if (id) {
      this.isCopy = false
      this.isUpdate = true
      this.activityId = id
      this._reqAssembleActivityById(id)
    } else {
      this.isCopy = false
      this.isUpdate = false
    }
  },
  methods: {
    handlePre() {
      this.$confirm('返回上一步将清空本页已填写的所有信息，确定要返回吗？', '提示', {
        confirmButtonText: '确定返回',
        cancelButtonText: '我再想想'
      })
        .then(() => {
          if (this.currentStep === 1) {
            this.goods.selected.list = []
          }
          this.currentStep -= 1
        })
        .catch(() => {})
    },
    handleNext() {
      if (this.currentStep === 0) {
        this.$refs['setActivity'].validateNext().then(res => {
          if (res) {
            this.currentStep += 1
          }
        })
      }
    },
    /**
     * @description: 保存
     */
    handleSave() {
      if (!this.goods.selected.list.length) {
        this.$message('活动至少需要添加1个商品')
        return
      }
      const req = JSON.parse(JSON.stringify(this.form))
      req.activityStartTime = req.assembleTime[0]
      req.activityEndTime = req.assembleTime[1]
      delete req.assembleTime
      req.businessCityId = req.businessCityId[req.businessCityId.length - 1]
      req.groupActivityCommodityList = this.goods.selected.list.map(item => {
        return {
          channelCommodityId: item.id,
          id: item.id,
          sort: item.sort ? (isNaN(Number(item.sort)) ? 0 : item.sort) : 0
        }
      })
      req.groupActivityRegimentalList = this.selected.list.map(item => {
        return {
          regimentalId: item.id,
          regimentalName: item.name,
          regimentalNo: item.regimentalCode
        }
      })
      // 判断已选商品排序是否符合校验
      if (this.$refs['setGoods'] && this.$refs['setGoods'].$refs['goodsSelectedTable'] && this.$refs['setGoods'].$refs['goodsSelectedTable'].$refs['form']) {
        this.$refs['setGoods'].$refs['goodsSelectedTable'].$refs['form'].validate((valid) => {
          if (valid) {
            if (this.isUpdate && !this.isCopy) {
              req.id = this.$route.query.id
              reqUpdateActivity(req)
                .then(res => {
                  if (res.code === 200) {
                    this.$message.success('编辑活动成功')
                    this.$router.push({ name: 'assembleActivityList' })
                  }
                })
                .catch(() => {})
            } else {
              reqAddActivity(req)
                .then(res => {
                  if (res.code === 200) {
                    this.$message.success('发布活动成功')
                    this.$router.push({ name: 'assembleActivityList' })
                  }
                })
                .catch(() => {})
            }
          }
        })
      }
    },
    /**
     * @description: 可选团长列表查询
     */
    onOptionalSearch() {
      console.log('可选列表查询') // eslint-disable-line
      if (this.selectedCityCode.length) {
        this.selectedCityCode = this.selectedCityCode.map(String)
      }
      this.optional.reqForm.ids = { value: this.selected.list.map(item => item.id).join(','), name: 'id', matchType: MatchType.NOT_IN, type: DataType.LISTLONG2 }
      this.optional.reqForm.city = { value: this.selectedCityCode[1], name: 'regimentalLocation.cityCode', matchType: MatchType.EQUAL, type: DataType.STRING }
      this.optional.reqForm.province = { value: this.selectedCityCode[0], name: 'regimentalLocation.provinceCode', matchType: MatchType.EQUAL, type: DataType.STRING }
      this.optional.reqForm.audit = { value: 2, name: 'regimentalAuditType', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      this.optional.reqForm.enable = { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
      this._reqColonelList(searchTool(this.optional.reqForm))
    },
    /**
     * @description: 已选团长列表查询
     */
    onSelectedSearch() {
      console.log('已选查询') // eslint-disable-line
      let filterList = this.selected.list
      if ((this.selected.reqForm.colonelCode || {}).value) {
        filterList = filterList.filter(item => {
          return item.regimentalCode.indexOf(this.selected.reqForm.colonelCode.value) >= 0
        })
      }
      if ((this.selected.reqForm.account || {}).value) {
        filterList = filterList.filter(item => {
          return item.phoneNumber.indexOf(this.selected.reqForm.account.value) >= 0
        })
      }
      if ((this.selected.reqForm.colonelName || {}).value) {
        filterList = filterList.filter(item => {
          return item.name.indexOf(this.selected.reqForm.colonelName.value) >= 0
        })
      }
      if ((this.selected.reqForm.status || {}).value) {
        filterList = filterList.filter(item => {
          return item.type === Number(this.selected.reqForm.status.value)
        })
      }
      if ((this.selected.reqForm.joinTime || {}).value && this.selected.reqForm.joinTime.value.length) {
        let startTime = new Date(this.selected.reqForm.joinTime.value[0]).getTime()
        let endTime = new Date(this.selected.reqForm.joinTime.value[1]).getTime()
        filterList = filterList.filter(item => {
          let joinTime = new Date(item.createTime).getTime()
          return startTime <= joinTime && joinTime <= endTime
        })
      }
      if ((this.selected.reqForm.area || {}).value) {
        let area =
          this.areaOption.filter(item => {
            return String(item.value) === String(this.selected.reqForm.area.value)
          })[0] || {}
        filterList = filterList.filter(item => {
          return item.districtCode === area.value
        })
      }
      this.selected.filterList = filterList
      this.handleCurrentPageList()
      console.log(this.selected.filterList) // eslint-disable-line
    },
    /**
     * @description: 已选团长列表处理出当前页数据
     */
    handleCurrentPageList() {
      const startIndex = (this.selected.currentPage - 1) * this.selected.pageSize
      const endIndex = startIndex + this.selected.pageSize
      this.selected.pageList = this.selected.filterList.slice(startIndex, endIndex)
    },
    /**
     * @description: 可选商品列表查询
     */
    onOptionalGoodsSearch() {
      this.goods.optional.reqForm.ids = { value: this.goods.selected.list.map(item => item.id).join(','), name: 'id', matchType: MatchType.NOT_IN, type: DataType.LISTLONG2 }
      this.goods.optional.reqForm.businessCityId = { value: this.form.businessCityId[1], name: 'businessCityId', matchType: MatchType.EQUAL, type: DataType.LONG }
      this.goods.optional.reqForm.channelCommoditySub = { value: this.selectedCityCode[1], name: 'channelCommoditySub.cityCode', matchType: MatchType.EQUAL, type: DataType.String }
      this.goods.optional.reqForm.groupActivityRegimentalType = {
        value: `GroupActivityRegimentalType_${this.form.groupType}`,
        name: 'groupActivityRegimentalType',
        matchType: MatchType.EQUAL,
        type: DataType.ENUM
      }
      this.goods.optional.reqForm.activityStartTime = { value: this.form.assembleTime[0], name: 'activityStartTime', matchType: MatchType.EQUAL, type: DataType.STRING }
      this.goods.optional.reqForm.activityEndTime = { value: this.form.assembleTime[1], name: 'activityEndTime', matchType: MatchType.EQUAL, type: DataType.STRING }
      this.goods.optional.reqForm.groupActivityRegimentalList = {
        value: this.selected.list.map(item => item.id).join(','),
        name: 'groupActivityRegimentalList',
        matchType: MatchType.NOT_IN,
        type: DataType.LISTLONG2
      }
      this.goods.optional.reqForm.businessNo = { value: 2, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      // 处理分类查询条件
      if (this.goods.optional.reqForm.category && this.goods.optional.reqForm.category.value && this.goods.optional.reqForm.category.value.length) {
        const count = this.goods.optional.reqForm.category.value.length
        if (count === 1) {
          this.goods.optional.reqForm.category.name += '.parent'
        }
        this.goods.optional.reqForm.category.value = this.goods.optional.reqForm.category.value.pop()
      } else {
        delete this.goods.optional.reqForm.category
      }
      if (this.isUpdate) {
        this.goods.optional.reqForm.activityId = { value: this.activityId, name: 'activityId', matchType: MatchType.EQUAL, type: DataType.LONG }
      }
      this._reqAssembleGoodsEnabledList(searchTool(this.goods.optional.reqForm))
    },
    /**
     * @description: 不可选商品列表查询
     */
    onDisabledGoodsSearch() {
      console.log('不可选查询') // eslint-disable-line
      if (this.goods.disabled.ids.length) {
        this.goods.disabled.reqForm.ids = { value: this.goods.disabled.ids.join(','), name: 'id', matchType: MatchType.IN, type: DataType.LISTLONG2 }
        // this.goods.disabled.reqForm.activityStartTime = { value: this.form.assembleTime[0], name: 'activityStartTime', matchType: MatchType.EQUAL, type: DataType.STRING }
        // this.goods.disabled.reqForm.activityEndTime = { value: this.form.assembleTime[1], name: 'activityEndTime', matchType: MatchType.EQUAL, type: DataType.STRING }
        this.goods.disabled.reqForm.businessNo = { value: 2, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
        // 处理分类查询条件
        if (this.goods.disabled.reqForm.category && this.goods.disabled.reqForm.category.value && this.goods.disabled.reqForm.category.value.length) {
          const count = this.goods.disabled.reqForm.category.value.length
          if (count === 1) {
            this.goods.disabled.reqForm.category.name += '.parent'
          }
          this.goods.disabled.reqForm.category.value = this.goods.disabled.reqForm.category.value.pop()
        } else {
          delete this.goods.disabled.reqForm.category
        }
        this._reqAssembleGoodsDisabledList(searchTool(this.goods.disabled.reqForm))
      }
    },
    /**
     * @description: 已选商品列表查询
     */
    onSelectedGoodsSearch() {
      console.log('已选查询') // eslint-disable-line
      let filterList = this.goods.selected.list
      if ((this.goods.selected.reqForm.category || {}).value) {
        let tempList = (this.goods.selected.reqForm.category || {}).value || []
        if (tempList.length && tempList.length === 2) {
          filterList = filterList.filter(item => {
            return item.channelCategoryList.some(citem => {
              return citem.id === tempList[1]
            })
          })
        } else if (tempList.length && tempList.length === 1) {
          filterList = filterList.filter(item => {
            return item.channelCategoryList.some(citem => {
              return citem.parent.id === tempList[0]
            })
          })
        }
      }
      if ((this.goods.selected.reqForm.goodsCode || {}).value) {
        filterList = filterList.filter(item => {
          return item.channelCommodityNo.indexOf(this.goods.selected.reqForm.goodsCode.value) >= 0
        })
      }
      if ((this.goods.selected.reqForm.baseGoodsCode || {}).value) {
        filterList = filterList.filter(item => {
          return item.baseCommodityNo.indexOf(this.goods.selected.reqForm.baseGoodsCode.value) >= 0
        })
      }
      if ((this.goods.selected.reqForm.goodsName || {}).value) {
        filterList = filterList.filter(item => {
          return item.channelCommodityName.indexOf(this.goods.selected.reqForm.goodsName.value) >= 0
        })
      }
      if ((this.goods.selected.reqForm.status || {}).value) {
        filterList = filterList.filter(item => {
          return item.commodityStatus.value === Number(this.goods.selected.reqForm.status.value)
        })
      }
      if ((this.goods.selected.reqForm.type || {}).value) {
        filterList = filterList.filter(item => {
          return item.commodityType.value === Number(this.goods.selected.reqForm.type.value)
        })
      }
      this.goods.selected.filterList = filterList
      this.handleCurrentPageListForGoods()
      console.log(this.goods.selected.filterList) // eslint-disable-line
    },
    /**
     * @description: 已选商品列表处理出当前页数据
     */
    handleCurrentPageListForGoods() {
      const startIndex = (this.goods.selected.currentPage - 1) * this.goods.selected.pageSize
      const endIndex = startIndex + this.goods.selected.pageSize
      this.goods.selected.pageList = this.goods.selected.filterList.slice(startIndex, endIndex)
    },
    // *** 网络请求 ***
    /**
     * @description: 请求可选的团长列表
     */
    _reqColonelList(data) {
      return reqColonelList({
        searchs: JSON.stringify(data),
        pageNo: this.optional.currentPage,
        pageSize: this.optional.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.optional.currentPage = result.pageNo
            this.optional.totalCount = result.totalCount
            this.optional.list = result.itemVOs || []
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 请求可选商品列表
     */
    _reqAssembleGoodsEnabledList(data) {
      return reqAssembleGoodsEnabledList({
        searchs: JSON.stringify(data),
        pageNo: this.goods.optional.currentPage,
        pageSize: this.goods.optional.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          try {
            let result = res.result || {}
            let resOptional = result.availableCommodityList || {}
            this.goods.optional.currentPage = resOptional.pageNo
            this.goods.optional.totalCount = resOptional.totalCount
            this.goods.optional.list = resOptional.itemVOs || []
            let unusableIdMap = result.unusableIdMap || {}
            this.goods.disabled.unusableIdMap = unusableIdMap
            this.goods.disabled.ids = Object.keys(unusableIdMap) || []
          } catch (err) {
            console.log(err) // eslint-disable-line
          }
          // 复制活动时，过滤已选商品
          if (this.isCopy) {
            this.goods.selected.list = this.goods.selected.list.filter(item => {
              let res = true
              this.goods.disabled.ids.map(id => {
                Number(id) === Number(item.id) ? (res = false) : null
                return id
              })
              return res
            })
            this.goods.selected.onSearch()
          }
        }
      })
    },
    /**
     * @description: 请求不可选商品列表
     */
    _reqAssembleGoodsDisabledList(data) {
      return reqAssembleGoodsList({
        searchs: JSON.stringify(data),
        pageNo: this.goods.disabled.currentPage,
        pageSize: this.goods.disabled.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          let result = res.result || {}
          this.goods.disabled.currentPage = result.pageNo
          this.goods.disabled.totalCount = result.totalCount
          this.goods.disabled.list = result.itemVOs || []
        }
      })
    },
    /**
     * @description: 请求活动详情
     */
    _reqAssembleActivityById(id) {
      return reqAssembleActivityById({ id })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.form.activityName = result.activityName
            this.form.businessCityId = []
            this.form.businessCityId.push(result.businessCity.provinceCode)
            this.form.businessCityId.push(result.businessCity.id)
            // 解决级联选择器回显问题
            this.$refs['setActivity'].isShowCityCascader = false
            setTimeout(() => {
              this.$refs['setActivity'].isShowCityCascader = true
            }, 500)
            this.form.groupActivityType = result.groupActivityType ? result.groupActivityType.value : 1

            if (!this.isCopy) {
              this.form.assembleTime = [result.activityStartTime, result.activityEndTime]
              if (!result.cutoff) {
                this.form.cutoff.day = ''
                this.form.cutoff.time = ''
              } else {
                this.form.cutoff.day = result.cutoff.day
                this.form.cutoff.time = result.cutoff.time
              }
            } else {
              this.form.cutoff.day = ''
              this.form.cutoff.time = ''
              this.form.extractDay = ''
              let isNullCity = true // 复制时 是否置空城市
              reqBusinessCityByCode()
                .then(res => {
                  if (res.code === 200) {
                    let result = res.result || []
                    result.map(item => {
                      item.cityList.map(citem => {
                        if (citem.id === this.form.businessCityId[1]) isNullCity = false
                        return citem
                      })
                    })
                    if (isNullCity) {
                      this.form.businessCityId = []
                      this.form.groupType === 1
                    }
                  }
                })
                .catch(() => {})
            }
            this.form.sort = result.sort
            this.form.groupType = result.groupActivityRegimentalType ? result.groupActivityRegimentalType.value : 1
            this.selected.list = result.regimentalByGoodsList || []
            this.goods.selected.list = result.channelCommodityList || []
            if (!this.isCopy && !this.isUpdate) {
              this.goods.selected.list = this.goods.selected.list.map(item => {
                return {
                  ...item,
                  sort: 0
                }
              })
            }
            if (!this.isCopy) {
              this.isEditAbled = result.groupActivityStatus ? result.groupActivityStatus.value === 1 : true
            }

            if (this.form.groupType === 2) {
              this.$refs['setActivity'].$refs['selectColonel'].activeName = 'selected'
              this.selected.onSearch()
            }
            this.isFirstEnter = true
            this.selectedCity = `${result.businessCity.provinceName}/${result.businessCity.cityName}`
            this.selectedCityCode = [result.businessCity.provinceCode, result.businessCity.cityCode]
            this.optional.onSearch()
            reqBusinessCityById({ id: result.businessCity.id })
              .then(res => {
                if (res.code === 200) {
                  let result = res.result || {}
                  let areaOption = result.businessAreaList || []
                  this.areaOption = areaOption.map(item => {
                    return {
                      key: item.areaName,
                      value: item.areaCode
                    }
                  })
                }
              })
              .catch(() => {})
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  .action-area {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
}
</style>
