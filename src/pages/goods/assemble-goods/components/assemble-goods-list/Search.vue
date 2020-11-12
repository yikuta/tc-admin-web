<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="基础商品编码" prop="baseCode.value">
        <el-input v-model="form.baseCode.value" placeholder="请输入基础商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="业务商品编码" prop="channelCode.value">
        <el-input v-model="form.channelCode.value" placeholder="请输入业务商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="name.value">
        <el-input v-model="form.name.value" placeholder="请输入商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="category.value">
        <cascader v-model="form.category.value" :checkStrictly="true" :ajax="_reqCategorySub" :leafLevel="1" clearable></cascader>
      </el-form-item>
      <el-form-item label="拼团城市" prop="cityCategory.value">
        <el-cascader v-model="form.cityCategory.value" :props="props" clearable :placeholder="'请选择拼团城市'"></el-cascader>
      </el-form-item>
      <el-form-item label="商品状态" prop="status.value">
        <el-select v-model="form.status.value">
          <el-option v-for="item of goodsStatusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类型" prop="goodsType.value">
        <el-select v-model="form.goodsType.value">
          <el-option v-for="item of goodsTypeOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地推商品" prop="offLine.value">
        <el-select v-model="form.offLine.value" clearable>
          <el-option v-for="item of goodsOffLineOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="包邮" prop="express.value">
        <el-select v-model="form.express.value">
          <el-option v-for="item of expressStatus" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="特殊商品" prop="special.value">
        <el-select v-model="form.special.value">
          <el-option v-for="item of specialStatusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
      <el-button type="primary" size="mini" @click="handlePutOn" v-np="'PT_CHANNEL_GOODS_SHELF_BATCH_ON'">批量上架</el-button>
      <el-button type="primary" size="mini" @click="handlePutOff" v-np="'PT_CHANNEL_GOODS_SHELF_BATCH_OFF'">批量下架</el-button>
      <el-button type="primary" size="mini" @click="handlePublishGoods" v-np="'PT_CHANNEL_GOODS_ADD'">发布商品</el-button>
      <el-button type="primary" size="mini" @click="handlePublishBundle" v-np="'PT_CHANNEL_GOODS_PUBLISH'">发布套餐</el-button>
    </div>
  </el-card>
</template>

<script>
import Cascader from '@/components/Cascader'
import { MatchType, DataType } from '@/constants/search'
import { reqCategorySub, reqBusinessCityByCode } from '@/api/assembleGoods'

export default {
  name: 'Search',
  components: { Cascader },
  data() {
    return {
      form: {
        baseCode: { value: '', name: 'baseCommodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
        channelCode: { value: '', name: 'channelCommodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
        name: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        category: { value: [], name: 'channelCategoryList.id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        cityCategory: { value: [], name: 'channelCategories.id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        status: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        goodsType: { value: '', name: 'commodityType', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        express: { value: '', name: 'transfer', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
        offLine: { value: '', name: 'channelCommoditySub.offLine', matchType: MatchType.EQUAL, type: DataType.BOOLEAN },
        special: { value: '', name: 'special', matchType: MatchType.EQUAL, type: DataType.BOOLEAN }
      },
      goodsStatusOptions: [
        { key: '全部', value: '' },
        { key: '上架', value: 1 },
        { key: '下架', value: 3 },
        { key: '待上架', value: 2 }
      ],
      goodsTypeOptions: [
        { key: '全部', value: '' },
        { key: '单品', value: 1 },
        { key: '套餐', value: 2 }
      ],
      expressStatus: [
        { key: '全部', value: '' },
        { key: '是', value: true },
        { key: '否', value: false }
      ],
      specialStatusOptions: [
        { key: '全部', value: '' },
        { key: '是', value: true },
        { key: '否', value: false }
      ],
      goodsOffLineOptions: [
        { key: '全部', value: '' },
        { key: '是', value: 1 },
        { key: '否', value: 0 }
      ],
      props: {
        // 级联prop
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          if (node.root) {
            reqBusinessCityByCode({ status: false })
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
            reqBusinessCityByCode({ id: node.value, status: false })
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
  methods: {
    submitQuery() {
      this.$emit('on-search')
    },
    /**
     * @description: 发布商品
     */
    handlePublishGoods() {
      this.$router.push({ name: 'publishAssembleGoods' })
    },
    /**
     * @description: 发布套餐
     */
    handlePublishBundle() {
      this.$router.push({ name: 'publishAssembleBundle' })
    },
    /**
     * @description: 重置
     */
    handleReset() {
      this.$refs['form'].resetFields()
    },
    /**
     * @description: 批量上架
     */
    handlePutOn() {
      this.$emit('on-batch-put-on')
    },
    /**
     * @description: 批量下架
     */
    handlePutOff() {
      this.$emit('on-batch-put-off')
    },
    /**
     * @description: 请求商品分类
     */
    _reqCategorySub(id) {
      return id ? reqCategorySub({ parentId: id, businessNo: 2 }) : id !== 0 ? reqCategorySub({ businessNo: 2 }) : reqCategorySub({ parentId: id, businessNo: 2 })
    }
  }
}
</script>

<style lang='scss' scoped>
.search-content {
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 33%;
      .el-select {
        width: 100%;
      }
    }
  }
  .search-btn {
    text-align: right;
  }
}
</style>
