<template>
  <div class="wrapper">
    <el-card class="search-content">
      <template #header>
        <span>筛选商品</span>
      </template>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-form-item label="基础分类" prop="category.value">
          <cascader v-model="form.category.value" :checkStrictly="true" :ajax="_getBaseCategoryList" :leafLevel="2" clearable></cascader>
        </el-form-item>
        <el-form-item label="基础商品编码" prop="code.value">
          <el-input v-model="form.code.value" placeholder="请输入商品编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="name.value">
          <el-input v-model="form.name.value" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品状态" prop="status.value">
          <el-select v-model="form.status.value" placeholder="请选择" clearable>
            <el-option v-for="item of statusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="onQuery">查询</el-button>
      </div>
    </el-card>
    <el-table :data="tableData" style="width: 100%;margin-top: 10px;" :cell-style="{ textAlign:'center', height:'60px' }" :header-cell-style="{ textAlign:'center' }" highlight-current-row @current-change="handleCurrentChange" size="mini">
      <el-table-column width="30">
        <template v-slot:default="{ row }">
          <el-radio v-model="currentSelected.id" :label="row['id']"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="commodityNo" label="基础商品编码"></el-table-column>
      <el-table-column prop="commodityName" label="商品名称"></el-table-column>
      <el-table-column prop="enable" label="状态">
        <template slot-scope="{ row }">
          <el-badge is-dot class="badge-item" :type="row.enable ? 'success' : 'danger'" />
          <span>{{row.enable ? '正常' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="costPrice" label="税后供货价" :formatter="(row)=>formatNoneValue(row['costPrice'])"></el-table-column>
      <el-table-column prop="marketPrice" label="市场价" :formatter="(row)=>formatNoneValue(row['marketPrice'])"></el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange" />
    <div class="current-goods">
      您当前选择的商品是：
      <span>{{curBaseGoods.commodityName}}</span>
    </div>
  </div>
</template>

<script>
import { reqBaseGoodsList } from '@/api/mallGoods'
import Pagination from '@/components/Pagination'
import Cascader from '@/components/Cascader'
import { getBaseCategoryList } from '@/api/baseCategory'
import { MatchType, DataType } from '@/constants/search'
import searchTool from '@/utils/searchTool'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'publishGoodsChoice',
  components: { Pagination, Cascader },
  computed: {
    ...mapState('assembleGoods', ['curBaseGoods'])
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      form: {
        category: { value: [], name: 'baseCategory', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        code: { value: '', name: 'commodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
        name: { value: '', name: 'commodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        status: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAM }
      },
      reqForm: {},
      statusOptions: [
        {
          key: '启用',
          value: true
        },
        {
          key: '停用',
          value: false
        }
      ],
      tableData: [],
      currentSelected: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._reqBaseGoodsList()
    })
  },
  methods: {
    ...mapActions('assembleGoods', ['setBaseGoods', 'clearBaseGoods']),
    submitQuery() {
      const req = this.handleReqForm()
      this._reqBaseGoodsList(searchTool(req))
    },
    onPageChange(page) {
      this.currentPage = page
      this.submitQuery()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.submitQuery()
    },
    handleCurrentChange(currentRow) {
      if (currentRow) {
        this.currentSelected = currentRow
        this.setBaseGoods(currentRow)
      }
    },
    onQuery() {
      this.currentPage = 1
      this.reqForm = JSON.parse(JSON.stringify(this.form))
      const req = searchTool(this.handleReqForm())
      if (!req || !req.length) {
        this.clearBaseGoods()
        this.currentSelected = ''
      }
      this.submitQuery()
    },
    /**
     * @description: 处理queryDto
     */
    handleReqForm() {
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
      req.storeNo = { value: 1, name: 'storeNo', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      return req
    },
    // ***请求处理***
    _reqBaseGoodsList(data) {
      return reqBaseGoodsList({
        searchs: JSON.stringify(data),
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          }
        })
        .then(() => {
          if (this.curBaseGoods.id || this.curBaseGoods.id === 0) {
            this.currentSelected =
              this.tableData.filter(item => {
                if (item.id === this.curBaseGoods.id) {
                  return true
                }
                return false
              })[0] || ''
          }
        })
        .catch(() => {})
    },
    _getBaseCategoryList(id) {
      return id ? getBaseCategoryList({ parentId: id }) : id !== 0 ? getBaseCategoryList() : getBaseCategoryList({ parentId: id })
    }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  margin-top: 10px;
  .search-content {
    /deep/ .el-form {
      display: flex;
      flex-wrap: wrap;
      .el-form-item {
        width: 33%;
        .el-select {
          width: 100%;
        }
      }
    }
    .search-btn {
      text-align: right;
    }
  }
  .current-goods {
    margin: 10px 0 20px 0;
    text-align: center;
    color: #606266;
    font-size: 14px;
  }
}
</style>
