<template>
  <div class="app-container">
    <search-area
      :isShowTab="false"
      :isModifyStatus='true'
      @resetFields="onResetFields"
      @on-set-service="handleSetService"
      @on-edit-business="handleEditBusiness"
      @on-download-qr-code="handleDownloadQrCode"
      @on-edit-devops="handleEditDevops"
      @onSearch="onQuery"
      @onExport="onExport">
      <search ref="search" />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <table-area
        ref="list"
        :tableData="tableData"
        @update-shop-status='handleChangeShopStatus'
        @update-batch-shop-status='handleChangeBatchShopStatus'
        @update-set-service-free='handleSetServiceFee'
        @update-download-qr-code='handleDoDownloadQr'/>
      <pagination
        :current="currentPage"
        :total="totalCount"
        :pageSize="pageSize"
        @onPageChange="onPageChange"
        @onSizeChange="onSizeChange" />
    </content-area>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { Common, ShopList } from './components'
import searchTool from '@/utils/searchTool'
import { reqShopList, asyncShopEnable, asyncShopDisable, asyncBatchShopEnable, asyncBatchShopDisable, asyncSetShopFee, asyncDownloadQrCode, reqExportShopList } from '@/api/seller'
export default {
  name: 'shopList',
  components: { Pagination, ...Common, ...ShopList },
  data() {
    return {
      contentTitle: '门店列表',
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: []
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!from.name) {
      next(vm => {
        vm.onSearch()
      })
    } else {
      next()
    }
  },
  activated() {
    this.onSearch()
  },
  methods: {
    onResetFields() {
      this.$refs['search'].$refs['form'].resetFields()
    },
    onPageChange(page) {
      this.currentPage = page
      this.onSearch()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.onSearch()
    },
    handleSetService() {
      this.$refs['list'].handleSetService()
    },
    handleDownloadQrCode() {
      this.$refs['list'].handleDownloadQrCode()
    },
    handleEditBusiness() {
      this.$refs['list'].handleEditBusiness()
    },
    handleEditDevops() {
      this.$refs['list'].handleEditDevops()
    },
    onQuery() {
      this.currentPage = 1
      this.onSearch()
    },
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this._reqShopList(searchTool(req))
    },
    onExport() {
      const req = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this._reqExportShopList(searchTool(req))
    },
    // ***请求处理***
    _reqShopList(form) {
      return reqShopList({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          } else {
            this.tableData = []
            this.currentPage = 1
            this.totalCount = 0
          }
        })
        .catch(() => {
          this.tableData = []
          this.currentPage = 1
          this.totalCount = 0
        })
    },
    _reqExportShopList(form) {
      return reqExportShopList({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            this.$message.success('导出成功')
          }
        })
    },
    // 启用/禁用门店
    handleChangeShopStatus(code, status) {
      let fn = status === 1 ? asyncShopDisable : asyncShopEnable
      fn(code).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '更新状态成功')
          this.onSearch()
        }
      })
    },
    // 批量启用/禁用门店
    handleChangeBatchShopStatus(code, status) {
      let fn = status === 1 ? asyncBatchShopEnable : asyncBatchShopDisable
      let list = code ? code.map(item => item.shopCode) : []
      fn(list).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '更新状态成功')
          this.onSearch()
        }
      })
    },
    // 设置门店服务费
    handleSetServiceFee(code, free) {
      let data = {
        'fee': free,
        'operator': 'string',
        'operatorName': 'string',
        'shopCodes': code ? code.map(item => item.shopCode) : []
      }
      asyncSetShopFee(data).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '更新状态成功')
          this.onSearch()
        }
      })
    },
    // 下载二维码
    handleDoDownloadQr(code) {
      let shopCodes = code ? code.map(item => item.shopCode) : []
      asyncDownloadQrCode(shopCodes).then(res => {
        if (res.code === 200) {
          this.$message.success('下载成功！')
          window.location.href = res.result
          this.onSearch()
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.app-container {
}
</style>
