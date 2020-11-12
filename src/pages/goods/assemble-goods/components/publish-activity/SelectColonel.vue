<template>
  <div class="wrapper">
    <el-tabs v-model="activeName" type="card" @tab-click="handleChangeTab">
      <el-tab-pane label="可选择团长" name="optional">
        <search :form="context.optional.form" @on-batch-add="onBatchAdd" activeName="optional" />
        <colonel-table ref="colonelTable" :tableData="context.optional.list" />
        <pagination :current="context.optional.currentPage" :total="context.optional.totalCount" :pageSize="context.optional.pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
      </el-tab-pane>
      <el-tab-pane label="已选择团长" name="selected">
        <search :form="context.selected.form" activeName="selected" @on-batch-rm="onBatchRemove" />
        <colonel-table ref="colonelSelectedTable" :tableData="context.selected.pageList" />
        <pagination :current="context.selected.currentPage" :total="context.selected.totalCount" :pageSize="context.selected.pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import ColonelTable from './ColonelTable'
import Search from './Search'

export default {
  name: 'SelectColonel',
  components: { Pagination, ColonelTable, Search },
  inject: ['context'],
  data() {
    return {
      activeName: 'optional'
    }
  },
  methods: {
    onPageChange(page) {
      if (this.activeName === 'optional') {
        this.context.optional.currentPage = page
        this.context.optional.onSearch()
      } else {
        this.context.selected.currentPage = page
        this.context.selected.onSearch()
      }
    },
    onSizeChange(size) {
      if (this.activeName === 'optional') {
        this.context.optional.currentPage = 1
        this.context.optional.pageSize = size
        this.context.optional.onSearch()
      } else {
        this.context.selected.currentPage = 1
        this.context.selected.pageSize = size
        this.context.selected.onSearch()
      }
    },
    handleChangeTab(instance) {
      if (instance.name === 'selected') {
        this.context.selected.totalCount = this.context.selected.list.length
        this.context.selected.currentPage = 1
        this.context.selected.reqForm = JSON.parse(JSON.stringify(this.context.selected.form))
        this.context.selected.onSearch()
      } else {
        this.context.optional.currentPage = 1
        this.context.optional.reqForm = JSON.parse(JSON.stringify(this.context.optional.form))
        this.context.optional.onSearch()
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
        let tempList = JSON.parse(JSON.stringify(this.$refs['colonelTable'].multipleSelection))
        tempList.reverse()
        tempList = tempList.filter(item => {
          let res = this.context.selected.list.some(citem => citem.id === item.id)
          return !res
        })
        this.context.selected.list = [...tempList, ...this.context.selected.list]
        this.context.optional.onSearch()
      } else {
        this.$message('只能选择已经启用的团长')
      }
    },
    /**
     * @description: 批量移除
     */
    onBatchRemove() {
      if (!this.$refs['colonelSelectedTable'].multipleSelection.length) {
        this.$message('请选择至少一项')
        return
      }
      const h = this.$createElement
      this.$msgbox({
        title: '移除团长',
        message: h('p', null, '团长移除后可重新添加，确定要移除吗？'),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          this.$refs['colonelSelectedTable'].multipleSelection.map(item => {
            this.context.selected.list.splice(this.context.selected.list.indexOf(item), 1)
            return item
          })
          this.context.selected.currentPage = 1
          this.context.selected.onSearch()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
