<template>
  <div class="app-container">
    <el-steps :active="currentStep" finish-status="success" simple style="margin: 20px 0;">
      <el-step title="选择套餐商品"></el-step>
      <el-step title="设置套餐信息"></el-step>
      <el-step title="套餐预览确认"></el-step>
    </el-steps>

    <template v-if="currentStep === 0">
      <good-choices ref="goodChoices" :mainGood="mainGood" :mealGoods="mealGoods" />
    </template>

    <template v-else-if="currentStep === 1">
      <good-form ref="goodForm" :businessNo="businessNo" :form="form" />
    </template>

    <template v-else-if="currentStep === 2">
      <good-media
        ref="goodMedia"
        :businessNo="businessNo"
        :goodImages="goodImages"
        :videoImages="videoImages"
        :videoList="videoList"
        :detailList="detailList"
      />
    </template>

    <div class="action-area">
      <el-button v-if="currentStep !== 0" type="primary" @click="handlePrev(false)">上一步</el-button>
      <el-button v-if="currentStep !== 2" type="primary" @click="handleNext(false)">下一步</el-button>
      <el-button v-if="currentStep === 2" type="primary" @click="handleSave">保存</el-button>
    </div>
  </div>
</template>

<script>
  import GoodChoices from './templates/goodChoices'
  import GoodForm from './templates/goodForm'
  import GoodMedia from './templates/goodMedia'
  import { reqAddMallGoods, reqUpdateMallGoods, fetchGoodMealById } from '@/api/mallGoods'
  import { filterEmptyParams, notEmptyStr } from '@/utils/util'

  function parentNodes(data, results = { nodes: [], path: [] }) {
    results.nodes.unshift({ id: data.id, label: data.name })
    results.path.unshift(data.id)
    if (data.parent) {
      results = parentNodes(data.parent, results)
    }
    return results
  }

  function priceSection(minPrice, maxPrice) {
    let result = notEmptyStr(minPrice) ? minPrice : maxPrice
    if (notEmptyStr(minPrice) && notEmptyStr(maxPrice) && minPrice !== maxPrice) {
      result = `${minPrice}-${maxPrice}`
    }
    return result
  }

  export default {
    name: 'publishMealGood',
    components: { GoodChoices, GoodForm, GoodMedia },
    computed: {
      key() {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      }
    },
    data() {
      return {
        goodId: null,
        commodityType: 2, // 1-普通商品 | 2-套餐商品
        businessNo: 1, // 是否渠道商品 1-商城商品 ｜ 2-拼团商品 ｜ 3-供应商品 ｜ 4-商家商品
        currentStep: 0, // 当前步骤
        mainGood: {}, // 基础商品列表选择的基础商品
        mealGoods: [], // 基础商品列表选择的搭配商品
        channelCommoditySubId: null,
        form: {
          categoryList: [], // 展示分类路径
          categoriesList: [],
          commodityName: '', // 商品名称
          introduction: '', // 商品简介
          transfer: 1, // 是否包邮 0-不包邮 ｜ 1-包邮
          freightId: '', // 物流模板
          packageType: 1, // 1-自由组合套餐 ｜ 2-固定组合套餐
          discount: false, // 是否折扣
          baseSale: 0, // 基础销量
          sort: 0, // 展示排序
          shelfOnMode: 1, // 上架模式
          nextUpperDate: null, // 上架时间
          shelfOffMode: 1, // 下架模式
          nextLowerDate: null // 下架时间
        },
        goodImages: [],
        videoImages: [],
        videoList: [],
        detailList: [],
        detail: {} // 编辑时信息
      }
    },
    beforeMount() {
      let { step, id } = this.$route.query
      this.goodId = parseInt(id, 10)
      if (step >= 0 && step <= 2) {
        this.currentStep = parseInt(step, 10)
      }
      if (this.goodId) {
        this.fetchGoodMealById()
      }
    },
    methods: {
      handlePrev() {
        if (this.currentStep > 0) {
          this.currentStep -= 1
        }
      },
      handleNext() {
        if (this.currentStep === 0 && !this.mainGood.commodityId) {
          this.$message.warning('请添加套餐主商品')
          return
        }
        if (this.currentStep === 1 && !this.$refs.goodForm.validateInfoForm()) {
          return
        }
        this.currentStep += 1
      },
      // 获取商品详情
      fetchGoodMealById() {
        fetchGoodMealById(this.goodId).then(res => {
          this.detail = res.result
          const {
            channelCategoryList, channelCommodityName, introduction, sort, transfer,
            freightId, commodityType, baseSale, channelCommodityPackageList, channelCommodityMediaList,
            channelCommoditySub: {
              id: channelCommoditySubId, shelfOnMode, nextUpperDate,
              shelfOffMode, nextLowerDate, packageType, discount
            }
          } = res.result
          this.channelCommoditySubId = channelCommoditySubId
          const categoriesList = []
          const categoryList = []
          channelCategoryList.forEach(item => {
            const results = parentNodes(item)
            categoriesList.push(results.nodes)
            categoryList.push(results.path)
          })
          this.form = {
            categoriesList, categoryList, introduction, sort,
            commodityName: channelCommodityName,
            commodityType: commodityType.value,
            transfer: transfer ? 1 : 0,
            freightId, baseSale,
            packageType: packageType.value,
            shelfOnMode: shelfOnMode.value,
            shelfOffMode: shelfOffMode.value,
            nextUpperDate, nextLowerDate, discount
          }

          channelCommodityPackageList.forEach(item => {
            const {
              id, commodityName, commodityNo, baseCommodityId, channelCommoditySpecificationList,
              limitCount, main, maxCostPrice, minCostPrice, minMarketPrice, maxMarketPrice, thumbnailImage,
              minCollocationPrice, maxCollocationPrice
            } = item
            const newItem = {
              id, limitCount, thumbnailImage, commodityName, baseCommodityId, commodityNo,
              commodityId: baseCommodityId,
              baseCommoditySpecificationList: channelCommoditySpecificationList,
              costPrice: priceSection(minCostPrice, maxCostPrice),
              marketPrice: priceSection(minMarketPrice, maxMarketPrice),
              collocationPrice: priceSection(minCollocationPrice, maxCollocationPrice)
            }
            if (main) {
              this.mainGood = newItem
            } else {
              this.mealGoods.push(newItem)
            }
          })

          channelCommodityMediaList.forEach(item => {
            if (item.type.value === 3) { // 详情-富文本
              this.detailList.push({ ...item })
            } else if (item.type.value === 1) { // 商品图片
              this.goodImages.push({
                ...item, type: item.value,
                fileUrl: item.typeValue
              })
            } else if (item.type.value === 2) { // 视频
              if (item.cover) { // 视频封面
                this.videoImages.push({
                  ...item, type: item.value,
                  fileUrl: item.typeValue
                })
              } else {
                this.videoList.push({
                  ...item, type: item.value,
                  fileUrl: item.typeValue
                })
              }
            }
          })
        })
      },
      formatMediaList() {
        const channelCommodityMediaList = []
        this.goodImages.forEach((item, index) => {
          channelCommodityMediaList.push({
            channelCommodityId: this.goodId,
            cover: index === 0,
            generalModuleId: item.generalModuleId,
            id: item.id,
            type: 1, // 1-图片,2-视频,3-详情,4-头部详情,5-尾部详情,
            typeValue: item.fileUrl
          })
        })

        this.videoImages.forEach(item => {
          channelCommodityMediaList.push({
            channelCommodityId: this.goodId,
            cover: true,
            generalModuleId: item.generalModuleId,
            id: item.id,
            type: 2, // 1-图片,2-视频,3-详情,4-头部详情,5-尾部详情,
            typeValue: item.fileUrl
          })
        })

        this.videoList.forEach(item => {
          channelCommodityMediaList.push({
            channelCommodityId: this.goodId,
            cover: false,
            generalModuleId: item.generalModuleId,
            id: item.id,
            type: 2, // 1-图片,2-视频,3-详情,4-头部详情,5-尾部详情,
            typeValue: item.fileUrl
          })
        })

        this.detailList.forEach(item => {
          channelCommodityMediaList.push({
            channelCommodityId: this.goodId,
            cover: false,
            generalModuleId: item.generalModuleId,
            id: item.id,
            type: 3, // 1-图片,2-视频,3-详情,4-头部详情,5-尾部详情,
            typeValue: item.typeValue
          })
        })
        return channelCommodityMediaList
      },
      // 保存提交信息
      handleSave() {
        if (!this.$refs.goodMedia.validateMediaList()) {
          return false
        }
        const {
          categoryList, commodityName, introduction, transfer, freightId,
          packageType, discount, baseSale, sort, shelfOnMode, nextUpperDate,
          shelfOffMode, nextLowerDate
        } = this.form
        // 展示分类
        const channelCategoryIdList = []
        categoryList.forEach(item => {
          channelCategoryIdList.push(item.slice(-1)[0])
        })
        // 基础商品集合
        const channelCommodityPackageList = [{
          id: this.mainGood.id,
          baseCommodityId: this.mainGood.commodityId,
          baseCommodityNo: this.mainGood.commodityNo,
          collocationPrice: this.mainGood.collocationPrice,
          channelCommoditySpecificationList: this.mainGood.baseCommoditySpecificationList.map(item => {
            item.baseSkuId = item.id
            item.baseSkuNo = item.skuNo
            return item
          }),
          limitCount: parseInt(this.mainGood.limitCount, 10),
          main: true
        }]
        this.mealGoods.forEach(good => {
          const { id, commodityId, commodityNo, baseCommoditySpecificationList, collocationPrice, limitCount } = good
          channelCommodityPackageList.push({
            id,
            baseCommodityId: commodityId,
            baseCommodityNo: commodityNo,
            collocationPrice: collocationPrice,
            channelCommoditySpecificationList: baseCommoditySpecificationList.map(item => {
              item.baseSkuId = item.id
              item.baseSkuNo = item.skuNo
              return item
            }),
            limitCount: parseInt(limitCount, 10),
            main: false
          })
        })
        const postData = {
          id: parseInt(this.goodId, 10),
          // createUser: 1, // 创建人 --- 这个不是后端根据token判断用户么? 算了，暂时这么写，毕竟杠不过
          channelCommodityName: commodityName,
          introduction, transfer, freightId, sort,
          baseSale: parseInt(baseSale, 10),
          businessNo: 1, // 商城商品
          commodityType: 2, // 套餐商品
          baseCommodityId: this.mainGood.commodityId, // 基础商品ID
          baseCommodityNo: this.mainGood.commodityNo, // 基础商品编号
          channelCategoryIdList, // 展示分类
          channelCommodityPackageList, // 套餐商品package
          channelCommoditySub: {
            id: this.channelCommoditySubId,
            discount, packageType, shelfOffMode, nextLowerDate, nextUpperDate, shelfOnMode
          },
          channelCommodityMediaList: this.formatMediaList()
        }
        this.mallMealGoodRequest(filterEmptyParams(postData))
      },
      mallMealGoodRequest(data) {
        const promise = this.goodId ? reqUpdateMallGoods(data) : reqAddMallGoods(data)
        promise.then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            this.$router.push({ path: '/goods/mallGoods' })
          }
        })
      }
    }
  }
</script>

<style lang='scss' scoped>
  .app-container {
    .action-area {
      padding-top: 10px;
      display: flex;
      flex-direction: row;
      justify-content: center;
    }
  }
</style>
