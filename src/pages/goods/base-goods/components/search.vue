<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini" class>
      <el-form-item label="所属分类" prop="category.value">
        <cascader v-model="form.category.value" :checkStrictly="true" :ajax="_getBaseCategoryList" :leafLevel="2" clearable></cascader>
      </el-form-item>
      <el-form-item label="商品编码" prop="code.value">
        <el-input v-model="form.code.value" clearable placeholder="请输入商品编码"></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="name.value">
        <el-input v-model="form.name.value" clearable placeholder="请输入商品名称"></el-input>
      </el-form-item>
      <!-- <el-form-item label="商品类型">
        <el-select v-model="form.type" placeholder="请选择商品类型">
          <el-option label="全部" :value="0"></el-option>
          <el-option v-for="(item, index) in option.type" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="商品状态" prop="status.value">
        <el-select v-model="form.status.value" placeholder="请选择商品状态">
          <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="handleSubmit">查询</el-button>
      <el-button type="default" size="mini" @click="handleClear">清空</el-button>
      <el-button v-np="'BASE_GOODS_ENABLE'" type="primary" size="mini" @click="handleBatchOpen">批量启用</el-button>
      <el-button v-np="'BASE_GOODS_DISABLE'" type="primary" size="mini" @click="handleBatchStop">批量停用</el-button>
      <el-button v-np="'BASE_GOODS_ADD'" type="primary" size="mini" @click="$router.push('/goods/baseGoods/publish')">发布商品</el-button>
      <el-button v-np="'BASE_GOODS_FAST_ADD'" type="primary" size="mini" @click="$router.push('/goods/baseGoods/fastPublish')">快速发布商品</el-button>
    </div>
  </el-card>
</template>

<script>
import Cascader from '@/components/Cascader/index'
import { getBaseCategoryList } from '@/api/baseCategory'
import { MatchType, DataType } from '@/constants/search'

export default {
  name: 'Search',
  components: { Cascader },
  data() {
    return {
      form: {
        category: { value: [], name: 'baseCategory', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        name: { value: '', name: 'commodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        code: { value: '', name: 'commodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
        // type: 0,
        status: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAM }
      },
      option: {
        type: [
          { id: 1, value: '实物商品' },
          { id: 2, value: '虚拟商品' }
        ],
        status: [
          { id: '', value: '全部' },
          { id: true, value: '启用' },
          { id: false, value: '停用' }
        ]
      }
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('change')
    },
    // 清空
    handleClear() {
      this.$refs['form'].resetFields()
    },
    /**
     * @description: 批量启用
     */
    handleBatchOpen() {
      this.$emit('on-batch-open')
    },
    /**
     * @description: 批量停用
     */
    handleBatchStop() {
      this.$emit('on-batch-stop')
    },
    _getBaseCategoryList(id) {
      return id ? getBaseCategoryList({ parentId: id }) : id !== 0 ? getBaseCategoryList() : getBaseCategoryList({ parentId: id })
    }
  }
}
</script>

<style scoped lang="scss">
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
