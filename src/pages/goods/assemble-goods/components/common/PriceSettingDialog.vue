<template>
  <div class="wrapper">
    <el-dialog :title="title" :visible="visible" @update:visible="onChange" @closed="handleClosed" width="900px">
      <div>
        <p>{{info}}</p>
        <sku-table ref="skuTable" :tableData="tableData" :colsMap="skuTableConfig" :isOpenValidator="isOpenValidator" :validator="validator" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="onChange(false)">我再想想</el-button>
        <el-button size="mini" type="primary" @click="handleUpdatePrice" :loading="loading">确定设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SkuTable from '@/components/SkuTable/index'

export default {
  name: 'PriceSettingDialog',
  components: { SkuTable },
  props: {
    visible: Boolean,
    tableData: { type: Array, default: () => [] },
    title: { type: String, default: '价格设置' },
    info: { type: String, default: '销售价为在该渠道实际的销售价格，可根据实际情况设置，销售价本身不受其他条件约束' },
    skuTableConfig: {
      default: () => [
        { prop: 'platformDelivery', label: '中台发货', formatter: row => (row['platformDelivery'] ? '是' : '否') },
        { prop: 'costPrice', label: '税后供货价' },
        { prop: 'marketPrice', label: '市场价' },
        { prop: 'salePrice', label: '销售价', useComponent: 'input' }
      ]
    },
    isOpenValidator: { type: Boolean, default: false },
    validator: { type: Function, default: () => {} }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    handleUpdatePrice() {
      this.$emit('on-update-price')
    },
    onChange(visible) {
      this.$refs['skuTable'].resetValidate()
      this.$emit('update:visible', visible)
    },
    handleClosed() {
      this.$emit('closed')
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
