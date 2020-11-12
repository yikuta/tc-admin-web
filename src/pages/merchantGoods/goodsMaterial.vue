<template>
  <div class="app-container">
    <search-area 
      :isShowTab="false" 
      :isAdd='true'
      @resetFields="onResetFields"
      @onSearch="onSearch"
      @on-edit-add='onAdd'>
      <search ref="search" />
    </search-area>
    <content-area :contentTitle="contentTitle">
      <table-area 
        ref="list" 
        :tableData="tableData" 
        @update-status='handleStatus' 
        @delete='handleDelete'
        @on-preview="onShowEffect"/>
      <pagination 
        :current="currentPage" 
        :total="totalCount" 
        :pageSize="pageSize" 
        @onPageChange="onPageChange" 
        @onSizeChange="onSizeChange" />
    </content-area>
    <preview-box @on-close-preview="onCloseDetail" :previewVisible="previewVisible" :previewDetail="previewDetail"></preview-box>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import { Common, GoodsMaterial } from './templates'
import PreviewBox from './templates/goods-material/PreviewBox'
import searchTool from '@/utils/searchTool'
import { fetchGoodsSourceMaterial, asyncGoodsSourceMaterialEnable, asyncGoodsSourceMaterialDelete, fetchGoodsDetailById } from '@/api/merchantGoods'
export default {
  name: 'merchantGoodsMaterial',
  components: { Pagination, ...Common, ...GoodsMaterial, PreviewBox },
  data() {
    return {
      contentTitle: '商品素材库',
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      tableData: [],
      isAdd: false, // 是否是新增操作
      previewVisible: false,
      previewDetail: {}
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
    if (this.isAdd) {
      this.currentPage = 1
      this.isAdd = false
    }
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
    onSearch() {
      const req = JSON.parse(JSON.stringify(this.$refs['search'].form))
      this._reqGoodsSourceMaterialList(searchTool(req))
    },
    // ***请求处理***
    _reqGoodsSourceMaterialList(form) {
      return fetchGoodsSourceMaterial({
        searchs: JSON.stringify(form),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        distinct: true, // 去重
        orderbys: ['sort', 'createTime'],
        sorts: ['desc', 'desc']
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
    onAdd() {
      this.isAdd = true
      this.$router.push({ path: 'merchantGoodsMaterialDetail' })
    },
    handleStatus(id) {
      asyncGoodsSourceMaterialEnable(id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '状态修改成功')
          this.onSearch()
        }
      })
    },
    handleDelete(id) {
      asyncGoodsSourceMaterialDelete(id).then(res => {
        if (res.code === 200) {
          this.$message.success(res.message || '删除成功')
          this.currentPage = 1
          this.onSearch()
        }
      })
    },
    onCloseDetail() {
      this.previewVisible = false
    },
    onShowEffect(row) {
      fetchGoodsDetailById(row.id).then(res => {
        if (res.code === 200 && res.result) {
          this.previewDetail = {
            headImgs: res.result.imgVoList ? (res.result.imgVoList.filter(item => item.type === 1) ? res.result.imgVoList.filter(item => item.type === 1)[0].imageUrl : '') : '',
            channelCommodityName: res.result.goodsName,
            introduction: res.result.goodsInfo,
            img: res.result.imgUrl,
            detailImgs: res.result.imgVoList.filter(item => item.type === 3)
          }
          this.previewVisible = true
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
