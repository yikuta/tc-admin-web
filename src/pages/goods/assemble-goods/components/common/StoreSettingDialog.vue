<template>
  <div class="wrapper">
    <el-dialog title="库存设置" :visible="visible" @update:visible="onChange" width="900px">
      <div>
        <store-setting-switch :systemStock="systemStock" @storeSettingSwitchChange="(disabled)=>{
          if (this.$refs['storeTable']) {
            this.$refs['storeTable'].disabled = disabled
          }
          this.onChangeSystemStock(disabled)
        }" />
        <p>库存总量是指所有供应商能够提供的总库存；</p>
        <p>待发货数量是指目前已下单还未发货的商品数量；</p>
        <p>可用库存是指库存问题减去待发货数量后的可以实际使用的库存</p>
        <sku-table ref="storeTable" :tableData="tableData" :colsMap="skuTableConfig" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="onChange(false)">我再想想</el-button>
        <el-button size="mini" type="primary" @click="handleUpdateStore" :loading="loading">确定设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import StoreSettingSwitch from './StoreSettingSwitch'
import SkuTable from '@/components/SkuTable/index'

export default {
  name: 'StoreSettingDialog',
  components: { SkuTable, StoreSettingSwitch },
  props: {
    visible: Boolean,
    tableData: { type: Array, default: () => [] },
    systemStock: { type: Boolean, default: true }
  },
  data() {
    return {
      loading: false,
      skuTableConfig: [
        { prop: 'platformDelivery', label: '中台发货', formatter: row => (row['platformDelivery'] ? '是' : '否') },
        { prop: 'totalStockNum', label: '库存总量' },
        { prop: 'availableStockNum', label: '可用库存' },
        { prop: 'waitDeliveryNum', label: '待发货数量' },
        { prop: 'saleLimit', label: '限卖量', useComponent: 'input' }
      ]
    }
  },
  methods: {
    handleUpdateStore() {
      this.$emit('on-update-store')
    },
    /**
     * @description: 改变dialog可见性
     */
    onChange(visible) {
      this.$emit('update:visible', visible)
    },
    /**
     * @description: 改变systemStock
     */
    onChangeSystemStock(val) {
      this.$emit('update:systemStock', val)
    }
  }
}
</script>

<style lang='scss' scoped>
</style>

