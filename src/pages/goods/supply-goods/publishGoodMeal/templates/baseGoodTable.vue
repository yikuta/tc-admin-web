<template>
  <div class="wrapper">
    <el-table :data="list" border style="width: 100%" max-height="500">
      <el-table-column label="商品信息">
        <template slot-scope="{ row }">
          <div class="good-info">
            <el-image
              class="info-left"
              :src="row.thumbnailImage"
              fit="cover"
            >
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="info-right">
              <div class="title">{{row['price']}}</div>
              <div class="code">{{row['commodityName']}}<span>{{row['price']}}</span></div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="salePrice" label="原价"></el-table-column>

      <el-table-column label="搭配价">
        <template slot-scope="{ row }">
          <span>{{row.collocationPrice}}</span><i class="el-icon-edit table-edit" @click="handleOpenPrice(row)"></i>
        </template>
      </el-table-column>

      <el-table-column label="搭配数量">
        <template slot-scope="{ row }">
          <span>{{row.limitCount}}</span><i class="el-icon-edit table-edit" @click="handleOpenQuantity(row)"></i>
        </template>
      </el-table-column>
    </el-table>
    <dialog-price-setting :list="currentRow.baseCommoditySpecificationList" :visible="priceDialogVisible" @close="handleCloseDialog" />
    <dialog-quantity-setting :quantity="currentRow.limitCount" :visible="dialogVisible" @close="handleCloseDialog1" />
  </div>
</template>

<script>
  import DialogPriceSetting from './dialogPriceSetting'
  import DialogQuantitySetting from './dialogQuantitySetting'
  // import { notEmptyStr } from '@/utils/util'
  export default {
    name: 'BaseGoodTable',
    components: { DialogPriceSetting, DialogQuantitySetting },
    props: {
      list: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        priceDialogVisible: false,
        dialogVisible: false,
        currentRow: {}
      }
    },
    methods: {
      handleOpenPrice(row) {
        this.priceDialogVisible = true
        this.currentRow = row
      },
      handleCloseDialog(isSuccess, newData = []) {
        if (isSuccess) {
          let prices = []
          this.currentRow.baseCommoditySpecificationList.forEach(item => {
            for (let i = 0; i < newData.length; i++) {
              if (item.id === newData[i].id) {
                item['collocationPrice'] = newData[i].collocationPrice
              }
            }
          })
          newData.forEach(item => prices.push(item.collocationPrice))
          // prices = prices.filter(item => notEmptyStr(item))
          let collocationPrice = 0
          if (prices.length === 1) {
            collocationPrice = prices[0]
          } else if (prices.length > 1) {
            prices.sort((a, b) => a - b)
            collocationPrice = `${prices[0]}-${prices.slice(-1)[0]}`
          }
          this.$set(this.currentRow, 'collocationPrice', collocationPrice)
          this.$forceUpdate()
        }
        this.priceDialogVisible = false
        this.currentRow = {}
      },
      // 设置搭配数量
      handleOpenQuantity(row) {
        this.dialogVisible = true
        this.currentRow = row
      },
      handleCloseDialog1(isSuccess, quantity) {
        if (isSuccess) {
          this.$set(this.currentRow, 'limitCount', quantity)
        }
        this.dialogVisible = false
        this.currentRow = {}
      }
    }
  }
</script>

<style lang='scss' scoped>
  .wrapper {
    margin-top: 10px;
    line-height: 16px;

    .good-info {
      .info-left {
        display: inline-block;
        width: 40px;
        height: 40px;
        vertical-align: middle;
      }
      .info-right {
        display: inline-block;
        margin-left: 5px;
        font-size: 14px;
        line-height: 23px;

        .title {
          margin-bottom: 5px;
        }

        .code {
          color: #606266;
          padding-bottom: 15px;
        }
      }
    }

    /deep/ .image-slot, .demo-image__placeholder .image-slot {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #f5f7fa;
      color: #909399;
      font-size: 20px;
    }

    .table-edit {
      margin-left: 15px;
    }

    .dialogNumInput {
      display: flex;
      align-items: center;

      :last-child {
        flex: 1;
      }
    }
  }
</style>
