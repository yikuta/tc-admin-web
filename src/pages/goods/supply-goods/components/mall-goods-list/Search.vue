<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="商品分类" prop="category.value">
        <cascader v-model="form.category.value" :checkStrictly="true" :ajax="_reqCategorySub" :leafLevel="1" clearable></cascader>
      </el-form-item>
      <el-form-item label="基础商品编码" prop="baseCode.value">
        <el-input v-model="form.baseCode.value" placeholder="请输入基础商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="业务商品编码" prop="channelCode.value">
        <el-input v-model="form.channelCode.value" placeholder="请输入业务商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="name.value">
        <el-input v-model="form.name.value" placeholder="请输入商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="status.value">
        <el-select v-model="form.status.value">
          <el-option v-for="item of putOnStatusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
      <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
      <el-button type="primary" size="mini" @click="handlePublishGoods" v-np="'GYS_CHANNEL_GOODS_ADD'">发布商品</el-button>
      <!-- <el-button type="primary" size="mini" @click="handlePublishGoodsMeal">发布套餐</el-button> -->
    </div>
  </el-card>
</template>

<script>
import Cascader from '@/components/Cascader'
import { MatchType, DataType } from '@/constants/search'
import { reqCategorySub } from '@/api/mallGoods'

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
        status: { value: '', name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      },
      putOnStatusOptions: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '待上架',
          value: 2
        },
        {
          key: '上架',
          value: 1
        },
        {
          key: '下架',
          value: 3
        }
      ],
      expressStatus: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '是',
          value: true
        },
        {
          key: '否',
          value: false
        }
      ],
      specialStatusOptions: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '是',
          value: true
        },
        {
          key: '否',
          value: false
        }
      ],
      goodsTypeOptions: [
        {
          key: '全部',
          value: ''
        },
        {
          key: '单品',
          value: 1
        },
        {
          key: '套餐',
          value: 2
        }
      ]
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
      this.$router.push({ name: 'publishSupplyGoods' })
    },
    handlePublishGoodsMeal() {
      this.$router.push({ name: 'publishGoodMeal' })
    },
    handleReset() {
      this.$refs['form'].resetFields()
    },
    _reqCategorySub(id) {
      return id ? reqCategorySub({ parentId: id, businessNo: 3 }) : id !== 0 ? reqCategorySub({ businessNo: 3 }) : reqCategorySub({ parentId: id, businessNo: 3 })
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
