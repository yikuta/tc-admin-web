<template>
  <div class="wrapper">
    <el-table :data="tableData" style="width: 100%" :cell-style="{ textAlign:'center' }" :header-cell-style="{ textAlign:'center' }" @selection-change="handleSelectionChange" size="mini">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column label="商品信息" width="300">
        <template v-slot:default="{ row }">
          <div class="info-style">
            <el-image :src="row['thumbnailImage']" fit="center" />
            <div class="text-info">
              <div class="text-info-child">
                <span style="white-space: pre-wrap">{{row['channelCommodityName']}}</span>
              </div>
              <!-- <div class="text-info-child">
                <div>商品分类</div>
                <div>{{row['channelCategoryList'] | formatCommodityCategory}}</div>
              </div>-->
              <div class="text-info-child">
                <div>拼团城市</div>
                <div>{{row.cityStr}}</div>
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
      <el-table-column label="价格信息">
        <template v-slot:default="{ row }">
          <div>
            <div>拼团价:{{ priceSection(row.minSalePrice,row.maxSalePrice) }}</div>
            <div>市场价:{{ priceSection(row['minMarketPrice'], row['maxMarketPrice']) }}</div>
            <div>税后供货价:{{ priceSection(row['minCostPrice'], row['maxCostPrice']) }}</div>
            <div>佣&emsp;金:{{ row['channelCommoditySub']['commissionType'] | formatCommission(row['channelCommoditySub']['commissionValue']) }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="销量信息">
        <template v-slot:default="{ row }">
          <div>
            <div>可售量:{{formatNoneValue(row['availableStock'])}}</div>
            <div>待发货数量:{{formatNoneValue(row['waitPayOrderNum'])}}</div>
            <div>基础销量:{{formatNoneValue(row['baseSale'])}}</div>
            <div>真实销量:{{formatNoneValue(row['realSale'])}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上下架信息">
        <template v-slot:default="{ row }">
          <div>
            <div>上架时间:{{row['channelCommoditySub']['nextUpperDate']?row['channelCommoditySub']['nextUpperDate']:'手动上架'}}</div>
            <div>下架时间:{{row['channelCommoditySub']['nextLowerDate']?row['channelCommoditySub']['nextLowerDate']:'手动下架'}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="地推商品">
        <template slot-scope="{row}">{{row['channelCommoditySub']['offLine'] ? '是' : '否'}}</template>
      </el-table-column>
      <el-table-column label="商品排序">
        <template slot-scope="{row}">
          <el-input size="mini" :maxLength="6" v-model="row.sort" @blur="handleBlur(row)" />
        </template>
      </el-table-column>
      <el-table-column label="商品类型">
        <template v-slot:default="{row}">{{row.commodityType.value===1?'单品':'套餐'}}</template>
      </el-table-column>
      <el-table-column label="状态">
        <template v-slot:default="{row}">{{row.commodityStatus | statusDescrible}}</template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template v-slot:default="{ row }">
          <el-link type="primary" @click="handleEdit(row)" v-np="'PT_CHANNEL_GOODS_EDIT'">编辑</el-link>
          <el-link type="primary" @click="handlePutOn(false,row)" v-if="isAbledPutOn(row)" v-np="'PT_CHANNEL_GOODS_SHELF_ON'">上架</el-link>
          <el-link type="primary" @click="handlePutOff(false,row)" v-else v-np="'PT_CHANNEL_GOODS_SHELF_OFF'">下架</el-link>
          <el-link type="danger" @click="handleRemove(row)" v-np="'PT_CHANNEL_GOODS_DEL'">删除</el-link>
          <el-link type="primary" v-if="row['commodityType'].value!==2" @click="handlePriceSetting(row)" v-np="'PT_CHANNEL_GOODS_PRICE_EDIT'">价格设置</el-link>
          <el-link type="primary" v-if="row['commodityType'].value!==2" @click="handleStoreSetting(row)" v-np="'PT_CHANNEL_GOODS_STORE_EDIT'">库存设置</el-link>
          <el-link type="primary" v-np="'CHANNEL_GOODS_COMMISSION'" @click="handleCommission(row)">佣金配置</el-link>
          <el-link type="primary" v-np="'COMMON_OPERATE_LOG'" @click="handleCheckLog(row)">操作日志</el-link>
        </template>
      </el-table-column>
      <template #empty>没有查询到商品数据！</template>
    </el-table>

    <price-setting-dialog ref="priceSettingDialog" :visible.sync="priceSettingVisible" :tableData="settingTableData" @on-update-price="onUpdatePrice" />
    <store-setting-dialog ref="storeSettingDialog" :visible.sync="storeSettingVisible" :tableData="settingStoreTableData" :systemStock.sync="systemStock" @on-update-store="onUpdateStore" />
    <commission-dialog ref="commissionSettingDialog" :visible.sync="commissionSettingVisible" :fetchData="commissionData" @on-update-commission="onUpdateCommission" />
  </div>
</template>

<script>
import Common from '../common'
import CommissionDialog from './CommissionDialog'
import { reqShelfOnOrOff, reqDeleteGoodsById, reqQueryPrice, reqUpdatePrice, reqQueryInventory, reqUpdateInventory, reqQueryCommission, reqUpdateCommission, updateAssembleGoodSort } from '@/api/assembleGoods'

export default {
  name: 'TableArea',
  components: { ...Common, CommissionDialog },
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      settingTableData: [],
      settingStoreTableData: [],
      commissionData: {},
      multipleSelection: [],
      systemStock: true,
      priceSettingVisible: false, // 价格设置dialog
      storeSettingVisible: false, // 库存设置dialog
      commissionSettingVisible: false // 佣金配置dialog
    }
  },
  filters: {
    /**
     * @description: 格式化商品分类
     */
    formatCommodityCategory(cateList) {
      if (cateList && cateList.length) {
        const parent = cateList[0].parent || {}
        return `${parent.name}-${cateList[0].name}`
      } else {
        return '-'
      }
    },
    /**
     * @description: 格式化佣金
     */
    formatCommission(type, value) {
      if (!type) return '-'
      return type.value === 1 ? `${value}元` : `${value}%`
    }
  },
  methods: {
    /**
     * @description: 格式化价格
     */
    priceSection(minPrice, maxPrice) {
      let result = minPrice || maxPrice
      if (minPrice && maxPrice && minPrice !== maxPrice) {
        result = `${minPrice}-${maxPrice}`
      }
      if (!result && result !== 0) result = '-'
      return result
    },
    handleSelectionChange(selection) {
      // console.log(selection)
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
    handleBlur(row) {
      if (!/^(([1-9]\d{0,5})|0|999999)$/.test(row.sort)) {
        this.$message.error('请输入100万以内的整数')
      } else {
        updateAssembleGoodSort({
          id: row.id,
          sort: Number(row.sort)
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('商品排序修改成功')
          }
        })
      }
    },
    handleEdit(row) {
      if (row['commodityStatus'].value !== 3) {
        this.$message('只能对下架的商品的进行编辑，请先将商品进行下架吧')
        return
      }
      if (row['commodityType'].value === 1) {
        this.$router.push({
          path: '/goods/assembleGoods/publishAssembleGoods',
          query: {
            id: row['id'],
            active: 1
          }
        })
      } else {
        this.$router.push({
          path: '/goods/assembleGoods/publishAssembleBundle',
          query: {
            id: row['id']
          }
        })
      }
    },
    /**
     * @description: 判断能否上架
     */
    isAbledPutOn(row) {
      return row.commodityStatus.value !== 1
    },
    /**
     * @description: 批量/上架操作
     */
    handlePutOn(isBatch, row) {
      if (isBatch) {
        // 批量上架
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
        }).catch(() => {})
      } else {
        // 单一上架
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
        }).catch(() => {})
      }
    },
    /**
     * @description: 批量/下架操作
     */
    handlePutOff(isBatch, row) {
      if (isBatch) {
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
        }).catch(() => {})
      } else {
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
        }).catch(() => {})
      }
    },
    /**
     * @description: 删除操作
     */
    handleRemove(row) {
      if (row['commodityStatus'].value !== 3) {
        this.$confirm('非下架商品不能删除，请先将商品下架后再删除，谢谢！', '删除商品', {
          cancelButtonText: '关闭',
          showConfirmButton: false
        }).catch(() => {})
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
        }).catch(() => {})
      }
    },
    /**
     * @description: 更新价格
     */
    onUpdatePrice() {
      const { priceSettingDialog: dialog } = this.$refs
      dialog.$refs['skuTable'].updateDataSource(this.settingTableData)
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
      dialog.loading = true
      let req = JSON.parse(JSON.stringify(this.settingTableData))
      reqUpdatePrice(req)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              type: 'success',
              message: '商品价格设置成功'
            })
            this.priceSettingVisible = false
            this.$emit('on-search')
          }
        })
        .catch(() => {})
        .finally(() => (dialog.loading = false))
    },
    /**
     * @description: 价格设置
     */
    handlePriceSetting(row) {
      this.priceSettingVisible = true
      reqQueryPrice({ id: row['id'] })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || []
            this.settingTableData = result
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 更新库存
     */
    onUpdateStore() {
      const { storeSettingDialog: dialog } = this.$refs
      dialog.$refs['storeTable'].updateDataSource(this.settingStoreTableData)
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
      dialog.loading = true
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
            this.storeSettingVisible = false
            this.$emit('on-search')
          }
        })
        .catch(() => {})
        .finally(() => (dialog.loading = false))
    },
    /**
     * @description: 库存设置
     */
    handleStoreSetting(row) {
      this.storeSettingVisible = true
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
    },
    /**
     * @description: 更新佣金配置
     */
    onUpdateCommission() {
      const { commissionSettingDialog: dialog } = this.$refs
      dialog.$refs['form']
        .validate()
        .then(() => {
          let req = JSON.parse(JSON.stringify(this.commissionData))
          req.commissionValue = req.masterCommission
          dialog.loading = true
          reqUpdateCommission({ id: req.id, commissionType: req.commissionType, commissionValue: req.commissionValue })
            .then(res => {
              if (res.code === 200) {
                this.$message({
                  type: 'success',
                  message: '商品佣金设置成功'
                })
                this.$emit('on-search')
              }
              this.commissionSettingVisible = false
            })
            .catch(() => {})
            .finally(() => (dialog.loading = false))
        })
        .catch(() => {})
    },
    /**
     * @description: 佣金配置
     */
    handleCommission(row) {
      this.commissionSettingVisible = true
      reqQueryCommission({ id: row['channelCommoditySub']['id'], businessNo: 2 })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            result.commissionType.value === 2 ? (result.masterCommission = result.commissionValue * 100) : (result.masterCommission = result.commissionValue)
            result.commissionType = result.commissionType.value
            this.commissionData = { ...result }
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 查看操作日志
     */
    handleCheckLog(row) {
      this.$router.push({
        name: 'assembleGoodsLog',
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
