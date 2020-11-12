<template>
  <div class="wrapper">
    <el-form ref="form" inline :model="form" label-width="100px" size="mini">
      <el-form-item label="商品分类" prop="category.value">
        <cascader v-model="form.category.value" :checkStrictly="true" :ajax="_reqCategorySub" :leafLevel="1" :placeholder="'请选择'" clearable></cascader>
      </el-form-item>
      <el-form-item label="业务商品编码" prop="goodsCode.value">
        <el-input v-model="form.goodsCode.value" placeholder="请输入业务商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="基础商品编码" prop="baseGoodsCode.value">
        <el-input v-model="form.baseGoodsCode.value" placeholder="请输入基础商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="goodsName.value">
        <el-input v-model="form.goodsName.value" placeholder="请输入商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品状态" prop="status.value">
        <el-select v-model="form.status.value" clearable>
          <el-option v-for="item of goodsStatusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地推商品" prop="offLine.value">
        <el-select v-model="form.offLine.value" clearable>
          <el-option v-for="item of goodsOffLineOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品类型" prop="type.value">
        <el-select v-model="form.type.value" clearable>
          <el-option v-for="item of goodsTypeOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
        <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
        <el-button type="primary" size="mini" v-if="checkActiveName===1" @click="handleAdd">批量添加</el-button>
        <el-button type="primary" size="mini" v-if="checkActiveName===2" @click="handleRemove">批量移除</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Cascader from '@/components/Cascader'
import { reqCategorySub } from '@/api/assembleGoods'

export default {
  name: 'Search',
  components: { Cascader },
  props: {
    activeName: String,
    form: { type: Object, default: () => ({}) }
  },
  inject: ['context'],
  computed: {
    checkActiveName() {
      const name = { optional: 1, selected: 2 }
      return name[this.activeName]
    }
  },
  data() {
    return {
      goodsStatusOptions: [
        { key: '上架', value: 1 },
        { key: '下架', value: 2 }
      ],
      goodsTypeOptions: [
        { key: '单品', value: 1 },
        { key: '套餐', value: 2 }
      ],
      goodsOffLineOptions: [
        { key: '全部', value: '' },
        { key: '是', value: 1 },
        { key: '否', value: 0 }
      ]
    }
  },
  methods: {
    submitQuery() {
      if (this.activeName === 'optional') {
        this.context.goods.optional.reqForm = JSON.parse(JSON.stringify(this.context.goods.optional.form))
        this.context.goods.optional.onSearch()
      } else if (this.activeName === 'selected') {
        this.context.goods.selected.reqForm = JSON.parse(JSON.stringify(this.context.goods.selected.form))
        this.context.goods.selected.onSearch()
      } else {
        this.context.goods.disabled.reqForm = JSON.parse(JSON.stringify(this.context.goods.disabled.form))
        this.context.goods.disabled.onSearch()
      }
    },
    handleAdd() {
      this.$emit('on-batch-add')
    },
    handleRemove() {
      this.$emit('on-batch-rm')
    },
    handleReset() {
      this.$refs['form'].resetFields()
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
.wrapper {
}
</style>
