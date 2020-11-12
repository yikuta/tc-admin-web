<template>
  <div class="app-container">
    <el-row class="title">分类信息</el-row>
    <el-row class="content">
      <el-row>
        <category-show :id="baseCategoryPath" />
      </el-row>
    </el-row>
    <el-row class="title">商品信息</el-row>
    <el-row class="content">
      <el-row>
        <el-col :span="12">商品编码：{{curGoods['commodityNo']}}</el-col>
        <el-col :span="12">商品名称：{{curGoods['commodityName']}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">商品简介：{{curGoods['introduction']}}</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">商品单位：{{curGoods['unit']?curGoods['unit'].describe:'-'}}</el-col>
      </el-row>
    </el-row>
    <el-row class="title">库存信息</el-row>
    <el-row class="content">
      <el-row>
        <el-col :span="24">可用库存=销售库存+虚拟库存</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">虚拟库存是运营设置的中台可售量，指可以售卖超过销售库存部分（允许超卖部分）</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">销售库存是指仓库或供应商实际可以销售的库存，数据来源于WMS或供应端管理系统</el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <sku-table ref="skuTable" :tableData="curGoods['baseCommoditySpecificationList'] || []" :colsMap="skuTableConfig" :isOpenValidator="true" :validator="storeValidator" />
        </el-col>
      </el-row>
      <el-row :style="{textAlign:'center'}">
        <el-button type="primary" size="mini" @click="handleSure">确定</el-button>
      </el-row>
    </el-row>
  </div>
</template>

<script>
import CategoryShow from './components/CategoryShow'
import SkuTable from '@/components/SkuTable/index'
import { reqBaseInventory, reqUpdateInventory } from '@/api/baseGoods'

export default {
  name: 'storeManage',
  components: { SkuTable, CategoryShow },
  data() {
    return {
      id: 0,
      baseCategoryPath: '',
      curGoods: '',
      skuTableConfig: [
        { prop: 'platformDelivery', label: '中台发货', formatter: row => (row['platformDelivery'] ? '是' : '否') },
        { prop: 'saleStock', label: '销售库存' },
        { prop: 'stock', label: '虚拟库存', useComponent: 'input' },
        { prop: 'availableStock', label: '可用库存' }
      ]
    }
  },
  beforeMount() {
    const { id } = this.$route.query
    this.id = id
  },
  mounted() {
    this.$nextTick(() => {
      this._reqBaseInventory(this.id)
    })
  },
  methods: {
    /**
     * @description: 虚拟库存校验器
     */
    storeValidator(store) {
      if (!store && store !== 0) {
        return { res: false, text: '请填写100万以内的整数' }
      }
      if (!/^\d+?$/.test(store)) {
        return { res: false, text: '请填写100万以内的整数' }
      }
      if (Number(store) >= 1000000) {
        return { res: false, text: '请填写100万以内的整数' }
      }
      return { res: true }
    },
    handleSure() {
      const res = this.$refs['skuTable'].updateDataSource(this.curGoods['baseCommoditySpecificationList'], (dataList, status) => {
        if (status) {
          return { res: true }
        } else {
          return { res: false, text: '请填写100万以内的整数' }
        }
      })
      if (res) this._reqUpdateInventory()
    },
    // *** 网络请求 ***
    _reqBaseInventory(id) {
      return reqBaseInventory({ id })
        .then(res => {
          if (res.code === 200) {
            this.curGoods = res.result || {}
            this.baseCategoryPath = this.curGoods.baseCategoryPath || ''
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 更新库存
     */
    _reqUpdateInventory() {
      let req = {}
      req.baseCommoditySpecificationList = JSON.parse(JSON.stringify(this.curGoods['baseCommoditySpecificationList']))
      req.commodityId = this.curGoods.id
      reqUpdateInventory(req)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '商品库存设置成功'
            })
            this.$router.push({ name: 'baseGoods' })
          }
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
  font-size: 15px;
  .title {
    border-left: 6px solid rgba(64, 158, 255, 1);
    padding-left: 10px;
    font-size: 17px;
  }
  .content {
    padding: 30px;
  }
  .el-col {
    margin-bottom: 30px;
  }
}
</style>
