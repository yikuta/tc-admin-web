<template>
  <div class="app-container">
    <search-bar ref="search" class="search-bar" @change="handleSearchChange" @on-batch-open="handleBatchOpen" @on-batch-stop="handleBatchStop"></search-bar>
    <el-table :data="tableData" @selection-change="handleSelectionChange" size="mini" empty-text="没有查询到商品数据！">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="commodityNo" label="商品编码"></el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <el-image style="width: 100px; height: 100px" :src="/gif|GIF$/.test(scope.row.thumbnailImage)?scope.row.thumbnailImage+'?x-oss-process=image/format,jpg':scope.row.thumbnailImage" :preview-src-list="[scope.row.thumbnailImage]"></el-image>
        </template>
      </el-table-column>
      <el-table-column prop="commodityName" label="商品名称">
        <template v-slot:default="{row}">
          <el-link type="primary" @click="goToDetail(row)">
            <span style="white-space: pre-wrap">{{row['commodityName']}}</span>
          </el-link>
        </template>
      </el-table-column>
      <el-table-column prop="supplier" label="供应商">
        <template slot-scope="scope">
          <el-tag type="info" v-if="!scope.row.supplierCount" size="mini">暂无供应商</el-tag>
          <el-button type="text" @click="handleOpen(scope.row.id)" v-if="scope.row.supplierCount">有{{scope.row.supplierCount}}个供应商</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="税后供货价"></el-table-column>
      <el-table-column prop="marketPrice" label="市场价"></el-table-column>
      <el-table-column prop="stock" label="可用库存"></el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.enable" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200px">
        <template slot-scope="scope">
          <el-button type="text" v-np="'BASE_GOODS_EDIT'" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" v-np="scope.row.enable ? 'BASE_GOODS_DISABLE' : 'BASE_GOODS_ENABLE'" @click="update(scope.row)">{{ scope.row.enable ? '停用' : '启用' }}</el-button>
          <el-button type="text" v-np="'BASE_GOODS_STOCK'" @click="handleStoreManage(scope.row)">库存管理</el-button>
          <el-button type="text" v-np="'BASE_GOODS_PRICE'" @click="handlePriceSetting(scope.row)">价格设置</el-button>
          <el-button type="text" v-np="'COMMON_OPERATE_LOG'" @click="goToLog(scope.row)">操作日志</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination :pageSize="listQuery.pageSize" :total="listQuery.totalCount" :current="listQuery.pageNo" @onSizeChange="handleSizeChange" @onPageChange="handleCurrentChange"></pagination>
    <sup-dialog :supplierId="supplierId" :dialogSupVisible.sync="dialogSupVisible"></sup-dialog>
  </div>
</template>

<script>
import { getBaseGoodsList, updateBaseGoodsListById, reqBaseGoodsById, reqUpdatePrice } from '@/api/baseGoods'
// import generateForm from '@/utils/form'
import Pagination from '@/components/Pagination/index'
import SkuTable from '@/components/SkuTable/index'
import SearchBar from './components/search'
import searchTool from '@/utils/searchTool'

export default {
  name: 'production',
  components: {
    SupDialog: resolve => {
      return require(['./components/sup.vue'], resolve)
    },
    SearchBar,
    // SearchBar: resolve => {
    //   return require(['./components/search.vue'], resolve)
    // },
    SkuTable,
    // 采用下面方式导入组件，没法通过$createElement()创建vnode
    // SkuTable: resolve => {
    //   return require(['./components/SkuTable'], resolve)
    // },
    Pagination
  },
  data() {
    return {
      tableData: [],
      dialogSupVisible: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        totalCount: 0,
        totalPage: 0,
        orderby: 'createTime',
        sort: 'desc'
      },
      priceTableData: [],
      multipleSelection: [],
      reqForm: {},
      skuTableConfig: [
        {
          prop: 'platformDelivery', label: '中台发货', formatter: row => row['platformDelivery'] ? '是' : '否'
        },
        // { prop: 'price', label: '税后供货价' },
        { prop: 'costPrice', label: '成本价(税后供货价)', useComponent: 'input' },
        { prop: 'marketPrice', label: '市场价', useComponent: 'input' }
      ],
      supplierId: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getList()
    })
  },
  methods: {
    goToDetail(row) {
      this.$router.push({
        name: 'baseGoodsDetail',
        query: { id: row['id'] }
      })
    },
    getList() {
      // const req = JSON.parse(JSON.stringify(this.$refs['search'].form))
      const req = JSON.parse(JSON.stringify(this.reqForm))
      if (req.category && req.category.value && req.category.value.length) {
        const count = req.category.value.length
        if (count === 1) {
          req.category.name += '.parent.parent'
        } else if (count === 2) {
          req.category.name += '.parent'
        }
        req.category.value = req.category.value.pop()
      } else {
        delete req.category
      }
      let query = JSON.parse(JSON.stringify(this.listQuery))
      delete query.totalCount
      delete query.totalPage
      getBaseGoodsList({ ...query, searchs: JSON.stringify(searchTool(req)) })
        .then(res => {
          if (res.code === 200) {
            const result = res.result
            this.tableData = res.result.itemVOs
            this.listQuery = {
              ...this.listQuery,
              pageNo: result.pageNo,
              pageSize: result.pageSize,
              totalCount: result.totalCount,
              totalPage: result.totalPageCount
            }
          }
        })
        .catch()
    },
    // 前置选项变化
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 更新商品状态
    update(row) {
      this.$confirm(`${row.enable ? '商品停用后所有引用该商品的渠道均会下架，确定要停用该商品吗？' : '商品启用后其他渠道可以引用该商品，确定要启用吗？'}`, '提示', {
        closeOnPressEscape: false, // 取消 esc 关闭窗口
        closeOnClickModal: false, // 取消点击 modal 关闭窗口
        confirmButtonText: row.enable ? '确定停用' : '确定启用',
        cancelButtonText: '我再想想',
        showClose: false // 取消关闭按钮
      })
        .then(() => {
          // const formData = generateForm([
          //   {
          //     ids: row.id,
          //     status: !row.enable
          //   }
          // ])
          updateBaseGoodsListById({
            ids: [row.id],
            status: !row.enable
          }).then(res => {
            if (res.code === 200) {
              this.$message.success(`${row.enable ? '停用' : '启用'}成功`)
              this.getList()
            }
          })
        })
        .catch(() => {
          this.$message.error('取消操作')
        })
    },
    // 分页变化
    handleSizeChange(val) {
      this.listQuery.pageNo = 1
      this.listQuery.pageSize = val
      this.getList()
    },
    // 分页变化
    handleCurrentChange(val) {
      this.listQuery.pageNo = val
      this.getList()
    },
    handleSearchChange() {
      this.reqForm = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this.listQuery.pageNo = 1
      this.getList()
    },
    /**
     * @description: 编辑
     */
    edit(row) {
      if (row.enable) {
        this.$message('该商品为启用状态，只能编辑停用状态的商品')
        return
      }
      this.$router.push({
        path: '/goods/baseGoods/publish',
        query: { id: row.id, step: 1 }
      })
    },
    /**
     * @description: 查看日志
     */
    goToLog(row) {
      this.$router.push({
        name: 'baseGoodsLog',
        params: { id: row['id'] }
      })
    },
    /**
     * @description: 批量启用
     */
    handleBatchOpen() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message('请至少选择一件商品')
        return
      }
      this.$confirm('您所选择的商品将执行启用操作，确定要启用这些商品吗？', '批量启用', {
        confirmButtonText: '确定启用',
        cancelButtonText: '我再想想',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const ids = this.multipleSelection.map(item => {
              return item.id
            })
            updateBaseGoodsListById({ ids, status: true })
              .then(res => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '启用商品成功'
                  })
                  done()
                  this.getList()
                }
              })
              .catch(() => {})
              .finally(() => (instance.confirmButtonLoading = false))
          } else {
            done()
          }
        }
      })
        .then(() => {})
        .catch(() => {})
    },
    /**
     * @description: 批量停用
     */
    handleBatchStop() {
      if (!this.multipleSelection || !this.multipleSelection.length) {
        this.$message('请至少选择一件商品')
        return
      }
      this.$confirm('您所选择的商品将执行停用操作，确定要停用这些商品吗？', '批量停用', {
        confirmButtonText: '确定停用',
        cancelButtonText: '我再想想',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            const ids = this.multipleSelection.map(item => {
              return item.id
            })
            updateBaseGoodsListById({ ids, status: false })
              .then(res => {
                if (res.code === 200) {
                  this.$message({
                    type: 'success',
                    message: '停用商品成功'
                  })
                  done()
                  this.getList()
                }
              })
              .catch(() => {})
              .finally(() => (instance.confirmButtonLoading = false))
          } else {
            done()
          }
        }
      })
        .then(() => {})
        .catch(() => {})
    },
    /**
     * @description: 库存管理
     */
    handleStoreManage(row) {
      this.$router.push({
        name: 'storeManage',
        query: { id: row['id'] }
      })
    },
    /**
     * @description: 价格设置
     */
    handlePriceSetting(row) {
      const h = this.$createElement
      reqBaseGoodsById(row['id'])
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.priceTableData = result.baseCommoditySpecificationList || []
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
                h('p', null, '供货价为供应商供货的价格，价格范围的表示可能有多个供应商对该商品供货;'),
                h('p', null, '成本价为销售中台自行根据供货价核算的成本价;'),
                h('p', null, '市场价用于页面展示的划线价，建议参考商品的吊牌价等;'),
                h(
                  'SkuTable',
                  {
                    props: {
                      tableData: this.priceTableData,
                      colsMap: this.skuTableConfig
                    },
                    ref: 'priceTable'
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
                this.$refs['priceTable'].updateDataSource(this.priceTableData)
                // 校验成本价
                let costPriceList = this.priceTableData.filter(item => {
                  if (!item.costPrice && item.costPrice === 0) {
                    return false
                  }
                  if (!item.costPrice) {
                    return true
                  }
                  if (!/^\d+(\.\d{1,2})?$/.test(item.costPrice)) {
                    return true
                  }
                  if (Number(item.costPrice) === 0) {
                    return false
                  }
                  if (Number(item.costPrice) >= 1000000) {
                    return true
                  }
                  return false
                })
                if (costPriceList.length > 0) {
                  this.$message('请正确设置成本价，成本价为100万元以内的两位小数')
                  return
                }
                // 校验市场价
                let marketPriceList = this.priceTableData.filter(item => {
                  if (!item.marketPrice && item.marketPrice === 0) {
                    return false
                  }
                  if (!item.marketPrice) {
                    return true
                  }
                  if (!/^\d+(\.\d{1,2})?$/.test(item.marketPrice)) {
                    return true
                  }
                  if (Number(item.marketPrice) === 0) {
                    return false
                  }
                  if (Number(item.marketPrice) >= 1000000) {
                    return true
                  }
                  return false
                })
                if (marketPriceList.length > 0) {
                  this.$message('请正确设置市场价，市场价为100万元以内的两位小数')
                  return
                }
                instance.confirmButtonLoading = true
                let req = {}
                req.baseCommoditySpecificationList = JSON.parse(JSON.stringify(this.priceTableData))
                req.baseCommodityId = row['id']
                reqUpdatePrice(req)
                  .then(res => {
                    if (res.code === 200) {
                      this.$message({
                        type: 'success',
                        message: '价格设置成功'
                      })
                      done()
                      this.getList()
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
              console.log('确定设置价格') // eslint-disable-line
            })
            .catch(() => {
              console.log('取消设置价格') // eslint-disable-line
            })
        })
    },
    handleOpen(id) {
      this.supplierId = id
      this.dialogSupVisible = true
    }
  }
}
</script>

<style type="text/scss" scoped>
.search-bar {
  margin: 0 0 20px 0;
}
</style>
<style lang='scss'>
// 价格设置弹窗样式 放入scoped中会失效
.setting-model-style {
  width: 900px;
  max-height: 700px;
}
</style>
