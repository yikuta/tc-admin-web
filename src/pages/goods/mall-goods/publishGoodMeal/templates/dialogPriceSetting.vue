<template>
  <el-dialog
    title="搭配价设置"
    :visible="visible"
    @open="handleOpen"
    @close="handleCancel(false)"
    :close-on-click-modal="false"
    width="80%"
    style="min-width:600px"
  >
    <sku-table
      ref="priceSettingTable"
      :tableData="list"
      :colsMap="tableColumns"
      :isOpenValidator="true"
      :validator="priceValidator"
    />
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" @click="handleSubmit">确定设置</el-button>
      <el-button size="mini" @click="handleCancel(false)">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import SkuTable from '@/components/SkuTable/index'
  export default {
    name: 'PriceTable',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      list: {
        type: Array,
        default: () => []
      },
      actionLabel: {
        type: String,
        default: '搭配价'
      }
    },
    components: {
      SkuTable
    },
    data() {
      return {
        tableColumns: [
          {
            prop: 'platformDelivery',
            label: '中台发货',
            formatter: function(row) {
              return row['platformDelivery'] ? '是' : '否'
            }
          },
          { prop: 'costPrice', label: '税后供货价' },
          { prop: 'marketPrice', label: '市场价' },
          { prop: 'collocationPrice', label: '搭配价', useComponent: 'input' }
        ]
      }
    },
    methods: {
      handleOpen() {},
      priceValidator(price) {
        if (!/^((([1-9]\d{0,5})(\.\d{1,2})?)|(0.\d{1,2})|0)$/.test(price)) {
          return { res: false, text: '请输入100万以内的两位小数或0' }
        }
        return { res: true }
      },
      handleSubmit() {
        let allUnset = true
        let emptyData = false
        const newList = this.$refs.priceSettingTable.getInnerData()
        newList.forEach(item => {
          if (item.collocationPrice === '') {
            emptyData = true
          }
          if (item.collocationPrice !== 0 && item.collocationPrice !== '0') {
            allUnset = false
          }
        })
        if (emptyData) {
          this.$message.error('搭配价设置不能为空')
        } else if (allUnset) {
          this.$message.error('搭配商品中至少有一个SKU价格不为0，请重新设置')
        } else if (!this.$refs.priceSettingTable.validateStatus) {
          this.$message.error('搭配价数据格式错误')
        } else {
          this.$emit('close', true, newList)
        }
      },
      handleCancel(isSuccess) {
        this.$emit('close', isSuccess)
      }
    }
  }
</script>

<style lang='scss' scoped>
  .wrapper {
    margin-top: 10px;
  }
</style>
