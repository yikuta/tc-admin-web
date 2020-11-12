<template>
  <div class="wrapper">
    <el-tabs v-model="activeName" type="card" @tab-click="handleChangeTab">
      <el-tab-pane label="可选商品" name="optional">
        <search-goods :form="context.goods.optional.form" @on-batch-add="onBatchAdd" :activeName="activeName" />
        <goods-table ref="goodsEnabledTable" :tableData="context.goods.optional.list" :activeName="activeName"/>
        <pagination :current="context.goods.optional.currentPage" :total="context.goods.optional.totalCount" :pageSize="context.goods.optional.pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
      </el-tab-pane>
      <el-tab-pane label="已选商品" name="selected">
        <search-goods :form="context.goods.selected.form" @on-batch-rm="onBatchRemove" :activeName="activeName" />
        <goods-table ref="goodsSelectedTable" :tableData="context.goods.selected.pageList" :activeName="activeName" />
        <pagination :current="context.goods.selected.currentPage" :total="context.goods.selected.totalCount" :pageSize="context.goods.selected.pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
      </el-tab-pane>
      <el-tab-pane label="不可选商品" name="disabled">
        <search-goods :form="context.goods.disabled.form" :activeName="activeName" />
        <goods-table :tableData="context.goods.disabled.list" :activeName="activeName" />
        <pagination :current="context.goods.disabled.currentPage" :total="context.goods.disabled.totalCount" :pageSize="context.goods.disabled.pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import SearchGoods from './SearchGoods'
import GoodsTable from './GoodsTable'

export default {
  name: 'SetGoods',
  components: { Pagination, SearchGoods, GoodsTable },
  inject: ['context'],
  data() {
    return {
      activeName: 'optional'
    }
  },
  mounted() {
    this.context.goods.optional.onSearch()
    if (this.context.goods.selected.list.length) {
      this.activeName = 'selected'
      this.context.isUpdate ? this.context.goods.selected.onSearch() : null
    }
  },
  methods: {
    onPageChange(page) {
      if (this.activeName === 'optional') {
        this.context.goods.optional.currentPage = page
        this.context.goods.optional.onSearch()
      } else if (this.activeName === 'selected') {
        this.context.goods.selected.currentPage = page
        this.context.goods.selected.onSearch()
      } else {
        this.context.goods.disabled.currentPage = page
        this.context.goods.disabled.onSearch()
      }
    },
    onSizeChange(size) {
      if (this.activeName === 'optional') {
        this.context.goods.optional.currentPage = 1
        this.context.goods.optional.pageSize = size
        this.context.goods.optional.onSearch()
      } else if (this.activeName === 'selected') {
        this.context.goods.selected.currentPage = 1
        this.context.goods.selected.pageSize = size
        this.context.goods.selected.onSearch()
      } else {
        this.context.goods.disabled.currentPage = 1
        this.context.goods.disabled.pageSize = size
        this.context.goods.disabled.onSearch()
      }
    },
    handleChangeTab(instance) {
      if (instance.name === 'selected') {
        this.context.goods.selected.totalCount = this.context.goods.selected.list.length
        this.context.goods.selected.currentPage = 1
        this.context.goods.selected.reqForm = JSON.parse(JSON.stringify(this.context.goods.selected.form))
        this.context.goods.selected.onSearch()
      } else if (instance.name === 'optional') {
        this.context.goods.optional.currentPage = 1
        this.context.goods.optional.reqForm = JSON.parse(JSON.stringify(this.context.goods.optional.form))
        this.context.goods.optional.onSearch()
      } else {
        this.context.goods.disabled.currentPage = 1
        this.context.goods.disabled.reqForm = JSON.parse(JSON.stringify(this.context.goods.disabled.form))
        this.context.goods.disabled.onSearch()
      }
    },
    /**
     * @description: 批量添加
     */
    onBatchAdd() {
      let res = true
      // 判断团长是否停用

      // this.$refs['colonelTable'].multipleSelection.map(item => {
      //   if (item.status.value === 2) {
      //     res = false
      //   }
      //   return item
      // })
      if (res) {
        let tempList = JSON.parse(JSON.stringify(this.$refs['goodsEnabledTable'].multipleSelection))
        tempList.reverse()
        tempList = tempList.filter(item => {
          let res = this.context.goods.selected.list.some(citem => citem.id === item.id)
          return !res
        })
        this.context.goods.selected.list = [...tempList, ...this.context.goods.selected.list]
        this.context.goods.optional.onSearch()
        // 批量添加商品后跳转到已选商品页面
        this.activeName = 'selected'
        this.context.goods.selected.totalCount = this.context.goods.selected.list.length
        this.context.goods.selected.currentPage = 1
        this.context.goods.selected.reqForm = JSON.parse(JSON.stringify(this.context.goods.selected.form))
        this.context.goods.selected.onSearch()
      } else {
        this.$message('只能选择已上架的商品')
      }
    },
    /**
     * @description: 批量移除
     */
    onBatchRemove() {
      if (!this.$refs['goodsSelectedTable'].multipleSelection.length) {
        this.$message('请选择至少一项')
        return
      }
      const h = this.$createElement
      this.$msgbox({
        title: '移除商品',
        message: h('p', null, '商品移除后可以被其他活动所引用，确定要移除吗？'),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$refs['goodsSelectedTable'].multipleSelection.map(item => {
            this.context.goods.selected.list.splice(this.context.goods.selected.list.indexOf(item), 1)
            return item
          })
          this.context.goods.selected.currentPage = 1
          this.context.goods.selected.onSearch()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  margin-top: 10px;
}
</style>
