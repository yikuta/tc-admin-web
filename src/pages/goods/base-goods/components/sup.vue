<template>
  <el-dialog title="供应商" :visible.sync="dialogVisible" @open='handleOpen'>
    <sku-table ref="skuTable" :tableData="tableData" :colsMap="skuTableConfig" :showSkuNo='false' :mergeProps='mergeProps'/>
  </el-dialog>
</template>

<script>
  import SkuTable from '@/components/SkuTable/index'
  import { fetchBaseCommoditySupplier } from '@/api/baseGoods'
  // 供应商
  export default {
    name: 'supDialog',
    components: {
      SkuTable
    },
    props: {
      dialogSupVisible: {
        type: Boolean,
        default: false
      },
      supplierId: {
        type: String,
        default: () => {
          return ''
        }
      }
    },
    data() {
      return {
        dialogVisible: false,
        skuTableConfig: [
          {
            prop: 'supplierName',
            label: '供应商'
          },
          { prop: 'afterTaxPrice', label: '税前供货价' },
          { prop: 'preTaxPrice', label: '税后供货价' },
          { prop: 'supplyTaxRate', label: '供货税率' },
          { prop: 'salesTaxRate', label: '销售税率' }
        ],
        tableData: [],
        mergeProps: ['supplierName']
      }
    },
    watch: {
      dialogVisible(n) {
        this.$emit('update:dialogSupVisible', n)
      },
      dialogSupVisible(n) {
        this.dialogVisible = n
      }
    },
    methods: {
      changeTableData(data = []) {
        if (data && data.length) {
          let arr = []
          data.map(item => {
            if (item.supplierList && item.supplierList.length) {
              for (let i in item.supplierList) {
                arr = arr.concat({ ...item, ...item.supplierList[i] })
              }
            } else {
              arr = arr.concat({ ...item })
            }
          })
          return arr
        }
      },
      handleOpen() {
        fetchBaseCommoditySupplier(this.supplierId).then(res => {
          if (res.code === 200) {
            this.tableData = this.changeTableData(res.result || [])
          } else {
            this.tableData = []
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped></style>
