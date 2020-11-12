<template>
  <div class="app-container">
    <el-form class="form" ref="form" size="small" :model="form" :rules="rules" label-width="80px">
      <el-row class="title-main">基本信息</el-row>

      <el-form-item label="展示分类" class="required-form-item">
        <cascader
          class="cascader"
          v-model="currentCategoryPath"
          :ajax="fetchBaseCategoryList"
          :leafLevel="1" clearable
          placeholder="请选择展示分类"
          @on-change-cascader="handleCategoryChange"
        />
        <el-link :underline="false" type="primary" @click="handleAddCategory">添加</el-link>
      </el-form-item>

      <el-form-item v-if="form.categoryList.length">
        <div v-for="(item, index) of form.categoriesList" :key="index">
          <span class="category-item" v-for="(node, i) of item" :key="node.id">
            <span v-if="i !== 0"> <i class="el-icon-arrow-right"/> </span>
            <span>{{node.label}}</span>
          </span>
          <el-link :underline="false" type="primary" @click="handleRemoveCategory(index)">&nbsp;&nbsp;移除</el-link>
        </div>
      </el-form-item>

      <el-form-item label="套餐名称" prop="commodityName">
        <el-input v-model="form.commodityName" placeholder="请输入商品名称"></el-input>
      </el-form-item>

      <el-form-item label="套餐简介" prop="introduction">
        <el-input
          type="textarea"
          :autosize="{ minRows: 4 }"
          placeholder="请输入商品简介"
          v-model="form.introduction"
        ></el-input>
      </el-form-item>

      <el-form-item label="物流信息" prop="transfer">
        <el-radio-group v-model="form.transfer">
          <el-radio :label="1">包邮</el-radio>
          <el-radio :label="0">不包邮</el-radio>
          <el-select v-if="form.transfer === 0" v-model="form.freightId" placeholder="请选择运费模板" clearable>
            <el-option v-for="item in expressTemplateList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="套餐类型" prop="packageType">
        <el-radio-group v-model="form.packageType">
          <el-radio :label="2">固定组合套餐</el-radio>
          <el-radio :label="1">自由组合套餐</el-radio>
        </el-radio-group>
        <el-alert
          title="*固定组合套餐是指套餐内商品必须购买，自由组合套餐是指套餐内的商品用户可以选择性的购买"
          type="success"
          :closable="false"
        />
      </el-form-item>

      <el-form-item label="使用优惠" prop="discount">
        <el-switch v-model="form.discount" />
      </el-form-item>

      <el-form-item label="基础销售" prop="baseSale">
        <el-input v-model="form.baseSale" placeholder="请填写基础销量" />
      </el-form-item>

      <el-form-item label="展示排序" prop="sort">
        <el-input-number v-model="form.sort" :min="0" :max="1000000" label="展示排序"></el-input-number>
      </el-form-item>

      <el-row class="title-main">销售配置</el-row>

      <base-good-table class="good-list-table" :list="allBaseGoods" />

      <el-row class="title-main">上下架配置</el-row>

      <el-form-item label="上架时间" prop="shelfOnMode">
        <el-radio-group v-model="form.shelfOnMode">
          <el-radio :label="1">手动上架</el-radio>
          <el-radio :label="2">定时上架</el-radio>
          <el-date-picker
            v-if="form.shelfOnMode === 2"
            v-model="form.nextUpperDate"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="{ disabledDate: disabledStartDate }"
          />
        </el-radio-group>
      </el-form-item>

      <el-form-item label="下架时间" prop="shelfOffMode">
        <el-radio-group v-model="form.shelfOffMode">
          <el-radio :label="1">手动下架</el-radio>
          <el-radio :label="2">定时下架</el-radio>
          <el-date-picker
            v-if="form.shelfOffMode === 2"
            v-model="form.nextLowerDate"
            type="datetime"
            placeholder="选择日期"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="{ disabledDate: disabledEndDate }"
          />
        </el-radio-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import dayjs from 'dayjs'
  import Cascader from '@/components/Cascader'
  import BaseGoodTable from './baseGoodTable'
  import { reqCategorySub } from '@/api/mallGoods'
  import { formRules } from '../constant'
  const templateList = [{ label: '默认模板', value: 1 }]

  function parentNodes(node, pathNodes = []) {
    pathNodes.unshift(node.data)
    if (node.parent) {
      parentNodes(node.parent, pathNodes)
    }
    return pathNodes
  }

  export default {
    name: 'publishGoodsInfo',
    components: { Cascader, BaseGoodTable },
    props: {
      businessNo: {
        type: Number,
        default: 1
      },
      form: {
        type: Object,
        default: () => ({})
      }
    },
    computed: {
      allBaseGoods: function() {
        return [this.$parent.mainGood, ...this.$parent.mealGoods]
      }
    },
    data() {
      return {
        rules: formRules,
        currentCategoryPath: [],
        currentCategories: [],
        expressTemplateList: templateList
      }
    },
    mounted() {},
    methods: {
      fetchBaseCategoryList(id) {
        return reqCategorySub({ parentId: id, businessNo: 1 })
      },
      handleCategoryChange(path, nodes) {
        this.currentCategoryPath = path
        this.currentCategories = parentNodes(nodes[0])
      },
      // 添加分类到列表
      handleAddCategory() {
        if (!this.currentCategoryPath.length) {
          this.$message.warning('请先选择展示分类')
          return
        }
        if (this.form.categoryList.length >= 10) {
          this.$alert('每个套餐最多只允许添加10个展示分类', '提示', {
            confirmButtonText: '关闭'
          })
        } else {
          const existPath = []
          this.form.categoryList.forEach(item => {
            const path = []
            item.forEach(node => { path.push(node.id) })
            existPath.push(path.join('-'))
          })
          if (existPath.includes(this.currentCategoryPath.join('-'))) {
            this.$message('不能添加重复的展示分类')
            return
          }
          this.form.categoryList.push(this.currentCategoryPath)
          this.form.categoriesList.push(this.currentCategories)
          this.currentCategoryPath = []
          this.currentCategories = []
        }
      },
      // 移除展示分类
      handleRemoveCategory(index) {
        this.$confirm('移除展示分类后可以重新再添加该分类，确定要移除吗？', '提示', {
          confirmButtonText: '确定移除',
          cancelButtonText: '我再想想'
        }).then(() => {
          this.form.categoryList.splice(index, 1)
          this.form.categoriesList.splice(index, 1)
        })
      },
      disabledStartDate(time) {
        const newDate = dayjs(time).format('YYYY-MM-DD')
        if (this.form.nextLowerDate) {
          const endDate = dayjs(this.form.nextLowerDate).format('YYYY-MM-DD')
          return dayjs(newDate).unix() > dayjs(endDate).unix()
        }
        return false
      },
      disabledEndDate(time) {
        const newDate = dayjs(time).format('YYYY-MM-DD')
        if (this.form.nextUpperDate) {
          const startDate = dayjs(this.form.nextUpperDate).format('YYYY-MM-DD')
          return dayjs(newDate).unix() < dayjs(startDate).unix()
        }
        return false
      },
      validateInfoForm() {
        if (!this.form.categoryList.length) {
          this.$message.warning('请添加展示分类')
          return false
        }
        let flag = true
        this.$refs.form.validate(validate => {
          if (validate) {
            for (let i = 0; i < this.allBaseGoods.length; i++) {
              if (!this.allBaseGoods[i].collocationPrice) {
                this.$message.warning(`请填写商品：${this.allBaseGoods[i].commodityName}搭配价`)
                flag = false
              }
              if (!this.allBaseGoods[i].limitCount) {
                this.$message.warning(`请填写商品：${this.allBaseGoods[i].commodityName}搭配数量`)
                flag = false
              }
            }
            if ((this.form.nextLowerDate && this.form.nextUpperDate) && dayjs(this.form.nextLowerDate).unix() < dayjs(this.form.nextUpperDate).unix()) {
              this.$message.warning('下架时间不能小于上架时间')
              flag = false
            }
          } else { // 验证失败
            flag = false
          }
        })

        return flag
      }
    }
  }
</script>

<style lang='scss' scoped>
  .app-container {
    padding: 10px 20px 20px;

    .required-form-item >>> .el-form-item__label:before {
      content: '*';
      color: #F56C6C;
      margin-right: 4px;
    }

    .cascader {
      display: inline-block;
      margin-right: 10px;
    }

    .form {
      margin-top: 10px;
    }

    .title-main {
      font-weight: bold;
      padding-bottom: 12px;
    }

    .good-list-table {
      padding: 0 10px 24px;
    }

    .category-item {
      line-height: 32px;
      vertical-align: middle;
    }

    .text-second {
      color: rgb(215, 215, 215);
    }
  }
</style>
