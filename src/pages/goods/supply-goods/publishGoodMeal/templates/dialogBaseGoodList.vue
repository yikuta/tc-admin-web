<template>
  <el-dialog
    title="添加套餐商品"
    :center="true"
    :visible="visible"
    @open="handleOpen"
    @close="handleCancel"
    width="80%"
  >
    <el-row :gutter="20">
      <el-form ref="form" :model="form" label-width="70px" size="mini">
        <el-col :span="8">
          <el-form-item label="商品分类" prop="category.value">
            <cascader v-model="form.category.value" :checkStrictly="true" :ajax="fetchBaseCategoryList" :leafLevel="2" clearable/>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="基础商品编码" prop="code.value" label-width="100px">
            <el-input v-model="form.code.value" placeholder="请输入商品编码" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="商品名称" prop="name.value">
            <el-input v-model="form.name.value" placeholder="请输入商品名称" clearable></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="商品状态" prop="status.value">
            <el-select v-model="form.status.value" placeholder="请选择" clearable style="width: 100%">
              <el-option v-for="item of statusOptions" :key="item.key" :label="item.key"
                         :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
      </div>
    </el-row>

    <el-table
      class="table-wrapper"
      ref="mainTable"
      v-show="addType == 'main'"
      :data="list"
      :cell-style="{ textAlign:'center', height:'60px' }"
      :header-cell-style="{ textAlign:'center' }"
      highlight-current-row
      @current-change="handleCurrentChange"
      size="mini"
      max-height="320"
      v-table-infinite-scroll="fetchBaseGoodList"
    >
      <el-table-column width="30">
        <template slot-scope="{ row }">
          <el-radio v-model="selectedRow.id" :label="row['id']" @change="handleCurrentChange(row)"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="commodityNo" label="基础商品编码"></el-table-column>
      <el-table-column prop="commodityName" label="商品名称"></el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="{ row, index, column }">
          <el-badge is-dot class="badge-item" :type="row.enable ? 'success' : 'danger'"/>
          <span>{{row.enable ? '启用' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="税后供货价" :formatter="(row)=>formatNoneValue(row['costPrice'])"></el-table-column>
      <el-table-column prop="marketPrice" label="市场价" :formatter="(row)=>formatNoneValue(row['marketPrice'])"></el-table-column>
    </el-table>

    <el-table
      class="table-wrapper"
      ref="multipleTable"
      v-show="addType == 'meal'"
      :data="list"
      :cell-style="{ textAlign:'center', height:'60px' }"
      :header-cell-style="{ textAlign:'center' }"
      highlight-current-row
      @selection-change="handleSelectionChange"
      size="mini"
      max-height="320"
      v-table-infinite-scroll="fetchBaseGoodList"
    >
      <el-table-column type="selection" width="100" :selectable="handleSelectable" />
      <el-table-column prop="commodityNo" label="基础商品编码"></el-table-column>
      <el-table-column prop="commodityName" label="商品名称"></el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="{ row, index, column }">
          <el-badge is-dot class="badge-item" :type="row.enable ? 'success' : 'danger'"/>
          <span>{{row.enable ? '启用' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="税后供货价" :formatter="(row)=>formatNoneValue(row['costPrice'])"></el-table-column>
      <el-table-column prop="marketPrice" label="市场价" :formatter="(row)=>formatNoneValue(row['marketPrice'])"></el-table-column>
    </el-table>

    <div class="current-goods" style="margin-top: 16px">
      您当前选择的商品是：<span v-if="addType === 'main'">{{selectedRow.commodityName}}</span>
      <span v-if="addType === 'meal'">{{selectedRowsName}}</span>
    </div>

    <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="handleCancel">我再想想</el-button>
        <el-button size="small" type="primary" @click="handleSubmit">确定添加</el-button>
      </span>
  </el-dialog>
</template>
<script>
  import Pagination from '@/components/Pagination'
  import Cascader from '@/components/Cascader'
  import { queryBaseCategory } from '@/api/baseCategory'
  import { reqBaseGoodsList } from '@/api/mallGoods'
  import searchFormat from '@/utils/searchFormat'
  import { deepClone } from '@/utils/util'
  const statusOptions = [{
    key: '启用',
    value: true
  }, {
    key: '停用',
    value: false
  }]
  export default {
    name: 'dialogTable',
    components: { Pagination, Cascader },
    props: {
      addType: {
        type: String,
        default: 'main'
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      selectedIds: function() {
        const results = [this.$parent.mainGood.commodityId]
        this.$parent.mealGoods.forEach(item => {
          results.push(item.commodityId)
        })
        return results
      },
      selectedRowsName: function() {
        const results = []
        this.selectedRows.forEach(item => {
          results.push(item.commodityName)
        })
        return results.join('、')
      }
    },
    data() {
      return {
        statusOptions,
        categoryOptions: [],
        list: [],
        pagination: {
          pageNo: 1,
          pageSize: 10,
          total: 0
        },
        form: {
          category: { value: [], name: 'baseCategory', matchType: 'EQUAL', type: 'INTEGER' },
          code: { value: '', name: 'commodityNo', matchType: 'CONTAIN', type: 'STRING' },
          name: { value: '', name: 'commodityName', matchType: 'CONTAIN', type: 'STRING' },
          status: { value: '', name: 'enable', matchType: 'EQUAL', type: 'BOOLEAN' }
        },
        selectedRow: {},
        selectedRows: []
      }
    },
    methods: {
      handleOpen() {
        this.selectedRow = {}
        this.selectedRows = []
        if (this.pagination.pageNo === 1) {
          this.list = []
          this.fetchBaseGoodList()
        }
        if (this.addType === 'meal') {
          this.$refs.multipleTable && this.$refs.multipleTable.clearSelection()
        }
      },
      handleCancel() {
        this.$emit('close')
      },
      // 是否可选
      handleSelectable(row) {
        return !this.selectedIds.includes(row.id)
      },
      // 查询分类
      fetchBaseCategoryList(id) {
        return queryBaseCategory({ parentId: id })
        // return reqCategorySub({ parentId: id, businessNo: 1 })
      },
      formatSearch() {
        const searches = deepClone(this.form)
        if (searches.category.value && searches.category.value.length) {
          const count = searches.category.value.length
          if (count === 1) {
            searches.category.name += '.parent.parent'
          } else if (count === 2) {
            searches.category.name += '.parent'
          }
          searches.category.value = searches.category.value.pop()
        } else {
          delete searches.category
        }
        return searches
      },
      // 获取基础商品列表
      fetchBaseGoodList() {
        const searches = searchFormat(this.formatSearch())
        reqBaseGoodsList({
          searchs: searches.length ? JSON.stringify(searches) : null,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }).then(res => {
          if (this.pagination.pageNo === 1) {
            this.$set(this, 'list', res.result.itemVOs)
          } else {
            this.$set(this, 'list', [...this.list, ...res.result.itemVOs])
          }
          this.pagination.pageNo += 1
          this.totalCount = res.result.totalCount
        })
      },
      handleSearch() {
        this.pagination.pageNo = 1
        this.fetchBaseGoodList()
      },
      handleCurrentChange(currentRow) {
        this.selectedRow = deepClone(currentRow) || {}
      },
      handlePageChange(page) {
        this.pagination.pageNo = page
        this.fetchBaseGoodList()
      },
      handleSizeChange(size) {
        this.pagination.pageSize = size
        this.pagination.pageNo = 1
        this.fetchBaseGoodList()
      },
      handleSelectionChange(value) {
        this.selectedRows = value
      },
      handleSubmit() {
        if (this.addType === 'meal' && (this.selectedRows.length + this.$parent.mealGoods.length) > 25) {
          this.$message.error('至多选择25个搭配商品')
          return
        }
        this.$emit('submit', this.addType === 'main' ? [this.selectedRow] : this.selectedRows)
      }
    }
  }
</script>
<style lang="scss" scoped>
  .table-wrapper {
    width: 100%;
    margin-top: 10px;
  }
  /deep/ .el-dialog.el-dialog--center {
    margin-top: 5vh !important;
  }
</style>
