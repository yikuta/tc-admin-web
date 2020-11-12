<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" @selection-change="handleSelectionChange" size="mini">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="商品信息" width="300">
        <template v-slot:default="{ row }">
          <div class="info-style">
            <el-image :src="row['thumbnailImage']" fit="center" />
            <div class="text-info">
              <!-- <div class="text-info-child">
                <div>编码</div>
                <el-link type="primary" :underline="false" @click="handlePreview(row)">{{row['channelCommodityNo']}}</el-link>
              </div>-->
              <div class="text-info-child">
                <div>名称</div>
                <el-link type="primary" :underline="false" @click="handlePreview(row)">
                  <span style="white-space: pre-wrap">{{row['channelCommodityName']}}</span>
                </el-link>
              </div>
              <div class="text-info-child">
                <div>基础商品编码</div>
                <div>{{row['baseCommodityNo']}}</div>
              </div>
              <div class="text-info-child">
                <div>业务商品编码</div>
                <div>{{row['channelCommodityNo']}}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="价格">
        <template slot-scope="{ row }">
          <div>
            <div>税后供货价:{{ priceSection(row['minCostPrice'], row['maxCostPrice']) }}</div>
            <div>销售价:{{ priceSection(row['minSalePrice'], row['maxSalePrice']) }}</div>
            <div>市场价:{{ priceSection(row['minMarketPrice'], row['maxMarketPrice']) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="stock" label="库存">
        <template slot-scope="{ row }">
          <div>
            <!-- <div>方式:{{row['store'] && row['store'].method}}</div> -->
            <div>库存:{{formatNoneValue(row['availableStock'])}}</div>
            <div>限卖量:{{formatNoneValue(row['totalSaleLimit'])}}</div>
            <div>基础销量:{{formatNoneValue(row['baseSale'])}}</div>
            <div>真实销量:{{formatNoneValue(row['realSale'])}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上架信息">
        <template v-slot:default="{ row }">
          <div>
            <div v-if="row['channelCommoditySub']['shelfOnMode'].value === 2">上架时间:{{row['channelCommoditySub']['nextUpperDate']}}</div>
            <div v-else>上架时间:{{row['channelCommoditySub']['shelfOnMode'].describe}}</div>
            <div v-if="row['channelCommoditySub']['shelfOffMode'].value === 2">下架时间:{{row['channelCommoditySub']['nextLowerDate']}}</div>
            <div v-else>下架时间:{{row['channelCommoditySub']['shelfOffMode'].describe}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort"></el-table-column>
      <!-- <el-table-column prop="freight" label="物流模板" :formatter="formateExpressTemplate"></el-table-column> -->
      <el-table-column prop="commodityStatus" label="状态">
        <template v-slot:default="{row}">{{row['commodityStatus'] | statusDescrible}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleEdit(row)" v-np="'GYS_CHANNEL_GOODS_EDIT'">编辑</el-link>
          <el-link type="primary" @click="handlePutOn(row)" v-if="isAbledPutOn(row)" v-np="'GYS_CHANNEL_GOODS_SHELF_ON'">上架</el-link>
          <el-link type="primary" @click="handlePutOff(row)" v-else v-np="'GYS_CHANNEL_GOODS_SHELF_OFF'">下架</el-link>
          <el-link type="danger" @click="handleRemove(row)" v-np="'GYS_CHANNEL_GOODS_DEL'">删除</el-link>
          <el-link type="primary" v-if="row.commodityType.value === 1" @click="handlePriceSetting(row)" v-np="'GYS_CHANNEL_GOODS_PRICE_EDIT'">价格设置</el-link>
          <el-link type="primary" v-if="row.commodityType.value === 1" @click="handleStoreSetting(row)" v-np="'GYS_CHANNEL_GOODS_STORE_EDIT'">库存设置</el-link>
          <!-- <el-link type="primary" @click="handlePreview(row)">商品预览</el-link> -->
          <el-link type="primary" v-np="'COMMON_OPERATE_LOG'" @click="handleCheckLog(row)">操作日志</el-link>
        </template>
      </el-table-column>
      <template #empty>没有查询到商品数据！</template>
    </el-table>
    <div class="action-area">
      <el-button type="primary" size="mini" @click="handleBatchPutOn" v-np="'GYS_CHANNEL_GOODS_SHELF_BATCH_ON'">批量上架</el-button>
      <el-button type="primary" size="mini" @click="handleBatchPutOff" v-np="'GYS_CHANNEL_GOODS_SHELF_BATCH_OFF'">批量下架</el-button>
    </div>
    <!-- <price-model :priceModelVisible="priceModelVisible" :tableData="settingTableData" /> -->
    <el-dialog title="库存设置" :visible.sync="dialogVisible" width="900px">
      <div>
        <store-setting-switch ref="storeTable" :systemStock="systemStock" @storeSettingSwitchChange="(disabled)=>{
          if (this.$refs['storeTable']) {
            this.$refs['storeTable'].disabled = disabled
          }
          this.systemStock = disabled
        }" />
        <p>库存总量是指所有供应商能够提供的总库存；</p>
        <p>待发货数量是指目前已下单还未发货的商品数量；</p>
        <p>可用库存是指库存问题减去待发货数量后的可以实际使用的库存</p>
        <sku-table ref="storeTable" :tableData="settingStoreTableData" :colsMap="storeTableConfig" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">我再想想</el-button>
        <el-button type="primary" @click="handleUpdateStore">确定设置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import SkuTable from '@/components/SkuTable/index'
import StoreSettingSwitch from './StoreSettingSwitch'
import { reqQueryPrice, reqUpdatePrice, reqQueryInventory, reqUpdateInventory, reqShelfOnOrOff, reqDeleteGoodsById } from '@/api/mallGoods'
import { notEmptyStr } from '@/utils/util'

export default {
  name: 'TableArea',
  components: { SkuTable, StoreSettingSwitch },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    // 格式化物流模板信息
    this.formateExpressTemplate = val => {
      const templateList = {
        1: '默认模板'
      }
      return this.formatNoneValue(templateList[val['freight']])
    }
    // 格式化 是否特殊商品
    this.formateSpecial = val => {
      return val['special'] ? '是' : '否'
    }
    // 格式化上下架状态
    this.formatStatus = val => {
      let status = {
        ON: '上架',
        WAIT: '待上架',
        OFF: '下架'
      }
      return status[val['commodityStatus']]
      // return val['commodityStatus'] && val['commodityStatus'].describe
    }
    return {
      settingTableData: [],
      settingStoreTableData: [],
      multipleSelection: [],
      systemStock: true,
      dialogVisible: false,
      skuTableConfig: [
        { prop: 'platformDelivery', label: '中台发货', formatter: row => (row['platformDelivery'] ? '是' : '否') },
        { prop: 'costPrice', label: '税后供货价' },
        { prop: 'marketPrice', label: '市场价' },
        { prop: 'salePrice', label: '销售价', useComponent: 'input' }
      ],
      storeTableConfig: [
        { prop: 'platformDelivery', label: '中台发货', formatter: row => (row['platformDelivery'] ? '是' : '否') },
        { prop: 'totalStockNum', label: '库存总量' },
        { prop: 'availableStockNum', label: '可用库存' },
        { prop: 'waitDeliveryNum', label: '待发货数量' },
        { prop: 'saleLimit', label: '限卖量', useComponent: 'input' }
      ]
    }
  },
  methods: {
    /**
     * @description: 格式化价格
     */
    priceSection(minPrice, maxPrice) {
      let result = notEmptyStr(minPrice) ? minPrice : maxPrice
      if (notEmptyStr(minPrice) && notEmptyStr(maxPrice) && minPrice !== maxPrice) {
        result = `${minPrice}-${maxPrice}`
      }
      if (!result && result !== 0) result = '-'
      return result
    },
    handleSelectionChange(selection) {
      this.multipleSelection = selection
    },
    handleCheckDetail(row) {
      this.$router.push({
        path: '/goods/mallGoods/publishMallGoods',
        query: {
          id: row['commodityNo'],
          active: 1
        }
      })
    },
    handleEdit(row) {
      if (row['commodityStatus'].value !== 3) {
        this.$message('只能对下架的商品的进行编辑，请先将商品进行下架吧')
        return
      }
      if (row.commodityType.value === 1) {
        // 单品
        this.$router.push({
          path: '/goods/supplyGoods/publishSupplyGoods',
          query: {
            id: row['id'],
            active: 1
          }
        })
      } else if (row.commodityType.value === 2) {
        // 套餐
        this.$router.push({
          name: 'publishGoodMeal',
          query: { step: 1, id: row.id }
        })
      }
    },
    /**
     * @description: 判断能否上架
     */
    isAbledPutOn(row) {
      if (!row['commodityStatus']) return true
      return row['commodityStatus'].value !== 1
    },
    /**
     * @description: 上架操作
     */
    handlePutOn(row) {
      this.$confirm('上架成功后，5分钟内将可以正常购买，确定要上架吗?', '上架商品', {
        confirmButtonText: '确定上架',
        cancelButtonText: '我再想想',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            reqShelfOnOrOff({ ids: [row['id']], flag: true, mode: false })
              .then(res => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '商品上架成功'
                  })
                  done()
                  this.$emit('on-search')
                }
              })
              .catch(() => {})
              .finally(() => (instance.confirmButtonLoading = false))
          } else {
            done()
          }
        }
      })
        .then(() => {
        })
        .catch(() => {
        })
    },
    /**
     * @description: 下架操作
     */
    handlePutOff(row) {
      this.$confirm('商品下架后将不能再进行购买，但已提交订单的需要正常处理，确定要下架吗?', '下架商品', {
        confirmButtonText: '确定下架',
        cancelButtonText: '我再想想',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            reqShelfOnOrOff({ ids: [row['id']], flag: false, mode: false })
              .then(res => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '商品下架成功'
                  })
                  done()
                  this.$emit('on-search')
                }
              })
              .catch(() => {})
              .finally(() => (instance.confirmButtonLoading = false))
          } else {
            done()
          }
        }
      })
        .then(() => {
        })
        .catch(() => {
        })
    },
    /**
     * @description: 删除操作
     */
    handleRemove(row) {
      if (!row['commodityStatus']) {
        this.$message('商品上下架状态异常')
        return
      }
      if (row['commodityStatus'].value !== 3) {
        this.$confirm('非下架商品不能删除，请先将商品下架后再删除，谢谢！', '删除商品', {
          cancelButtonText: '关闭',
          showConfirmButton: false
        }).catch(() => {
        })
      } else {
        this.$confirm('商品删除后将不能恢复，且已提交的订单不受影响，确定要删除商品吗?', '删除商品', {
          confirmButtonText: '确定删除',
          cancelButtonText: '我再想想',
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action === 'confirm') {
              instance.confirmButtonLoading = true
              reqDeleteGoodsById({ id: row['id'] })
                .then(res => {
                  if (res.code === 200) {
                    this.$message({
                      type: 'success',
                      message: '删除商品成功'
                    })
                    done()
                    this.$emit('on-search')
                  }
                })
                .catch(() => {})
                .finally(() => (instance.confirmButtonLoading = false))
            } else {
              done()
            }
          }
        })
          .then(() => {
          })
          .catch(() => {
          })
      }
    },
    /**
     * @description: 价格设置
     */
    handlePriceSetting(row) {
      const h = this.$createElement
      // 请求获取table数据 settingTableData
      reqQueryPrice({ id: row['id'] })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || []
            this.settingTableData = result
            this.settingTableData = this.settingTableData.map(item => {
              return { ...item, price: item.salePrice }
            })
          }
        })
        .catch(() => {})
        .finally(() => {
          this.$msgbox({
            customClass: 'setting-model-style',
            title: '价格设置',
            message: h(
              'div',
              {
                style: {
                  overflow: 'auto'
                }
              },
              [
                h(
                  'p',
                  null,
                  '建议销售价为公司对销售价格建议区间，其中最低价为公司核算不亏本的价格，最高价为目前大部分用户可接受的最高价格；销售价为在该渠道实际的销售价格，可根据实际情况设置，建议在建议销售价范围内设置'
                ),
                h(
                  'SkuTable',
                  {
                    props: {
                      tableData: this.settingTableData,
                      colsMap: this.skuTableConfig
                    },
                    ref: 'skuTable'
                  },
                  null
                )
              ]
            ),
            showCancelButton: true,
            confirmButtonText: '确定设置',
            cancelButtonText: '我再想想',
            beforeClose: (action, instance, done) => {
              if (action === 'confirm') {
                this.$refs['skuTable'].updateDataSource(this.settingTableData)
                let priceList = this.settingTableData.filter(item => {
                  if (!item.salePrice) {
                    return false
                  }
                  if (!/^\d+(\.\d{1,2})?$/.test(item.salePrice)) {
                    return true
                  }
                  if (Number(item.salePrice) === 0) {
                    return false
                  }
                  if (Number(item.salePrice) >= 1000000) {
                    return true
                  }
                  return false
                })
                if (priceList.length > 0) {
                  this.$message('请正确设置销售价，销售价为100万元以内的两位小数')
                  return
                }
                instance.confirmButtonLoading = true
                let req = JSON.parse(JSON.stringify(this.settingTableData))
                reqUpdatePrice(req)
                  .then(res => {
                    if (res.code === 200) {
                      this.$message({
                        type: 'success',
                        message: '商品价格设置成功'
                      })
                      done()
                      this.$emit('on-search')
                    }
                  })
                  .catch(() => {})
                  .finally(() => (instance.confirmButtonLoading = false))
              } else {
                done()
              }
            }
          })
            .then(() => {
            })
            .catch(() => {
            })
        })
    },
    /**
     * @description: 更新库存
     */
    handleUpdateStore() {
      this.$refs['storeTable'].updateDataSource(this.settingStoreTableData)
      let saleLimitNumList = this.settingStoreTableData.filter(item => {
        if (!item.saleLimit) {
          return false
        }
        if (!/^\d+$/.test(item.saleLimit)) {
          return true
        }
        if (Number(item.saleLimit) === 0) {
          return false
        }
        if (Number(item.saleLimit) >= 1000000) {
          return true
        }
        return false
      })
      if (saleLimitNumList.length > 0) {
        this.$message('请正确设置限卖量，限卖量为100万以内的整数')
        return
      }
      let req = JSON.parse(JSON.stringify(this.settingStoreTableData))
      req = req.map(item => {
        return {
          ...item,
          saleLimit: item ? Number(item.saleLimit) : item,
          systemStock: this.systemStock
        }
      })
      reqUpdateInventory(req)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '商品库存设置成功'
            })
            this.dialogVisible = false
            this.$emit('on-search')
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 库存设置
     */
    handleStoreSetting(row) {
      reqQueryInventory({ id: row['id'], channelCommodityName: row['channelCommodityName'] })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || []
            this.settingStoreTableData = result
            if (this.settingStoreTableData.length) {
              this.systemStock = Boolean(this.settingStoreTableData[0].systemStock)
            }
          }
        })
        .catch(() => {})
        .finally(() => {
          this.dialogVisible = true
        })
    },
    /**
     * @description: 批量上架
     */
    handleBatchPutOn() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message('请至少选择一件商品')
        return
      }
      this.$confirm('批量上架商品将把您选择所有商品执行上架操作，上架成功后5分钟内即可进行购买，确定要上架吗？', '批量上架', {
        confirmButtonText: '确定上架',
        cancelButtonText: '我再想想',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const ids = this.multipleSelection.map(item => {
              return item.id
            })
            reqShelfOnOrOff({ ids, flag: true, mode: false })
              .then(res => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '商品批量上架成功'
                  })
                  done()
                  this.$emit('on-search')
                }
              })
              .catch(() => {})
              .finally(() => (instance.confirmButtonLoading = false))
          } else {
            done()
          }
        }
      })
        .then(() => {
        })
        .catch(() => {
        })
    },
    /**
     * @description: 批量下架
     */
    handleBatchPutOff() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message('请至少选择一件商品')
        return
      }
      this.$confirm('批量下架将对您 选择的商品执行下架操作，下架后将不能购买，但不影响已经提交的订单进行后续操作，确定要下架吗？', '批量下架', {
        confirmButtonText: '确定下架',
        cancelButtonText: '我再想想',
        type: 'warning',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const ids = this.multipleSelection.map(item => {
              return item.id
            })
            reqShelfOnOrOff({ ids, flag: false, mode: false })
              .then(res => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '批量下架商品成功'
                  })
                  done()
                  this.$emit('on-search')
                }
              })
              .catch(() => {})
              .finally(() => (instance.confirmButtonLoading = false))
          } else {
            done()
          }
        }
      })
        .then(() => {
        })
        .catch(() => {
        })
    },
    /**
     * @description: 商品预览
     */
    handlePreview(row) {
      this.$router.push({
        path: '/goods/supplyGoods/supplyGoodsPreview',
        query: { id: row['id'] }
      })
    },
    /**
     * @description: 查看操作日志
     */
    handleCheckLog(row) {
      this.$router.push({
        path: '/goods/supplyGoods/log',
        query: { id: row['id'] }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .info-style {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    text-align: start;
    /deep/ .el-image {
      width: 100px;
      height: 100px;
      flex-shrink: 0;
      margin-right: 5px;
    }
    .text-info {
      .text-info-child {
        display: flex;
        flex-direction: row;
        div:first-child {
          flex-shrink: 0;
          margin-right: 5px;
        }
      }
    }
  }
  .action-area {
    margin-top: 15px;
    float: left;
  }
}
</style>
<style lang='scss'>
.setting-model-style {
  width: 900px;
  max-height: 700px;
}
</style>
