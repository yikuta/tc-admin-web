<template>
  <div class="wrapper">
    <el-dialog title="添加套餐商品" :visible="visible" @update:visible="onChangeVisible">
      <el-card class="search-content" shadow="never">
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
      <el-table
        ref="table"
        :data="tableData"
        style="width: 100%;margin-top: 10px;"
        :cell-style="{ textAlign:'center', height:'60px' }"
        :header-cell-style="{ textAlign:'center' }"
        highlight-current-row
        @current-change="handleCurrentChange"
        @row-click="handleRowClick"
        size="mini"
        max-height="300"
        v-table-infinite-scroll="loadMore"
      >
        <el-table-column width="30">
          <template v-slot:default="{ row }">
            <el-radio v-if="context.selectedType==='main'" :disabled="!row.enable" v-model="currentSelected.id" :label="row['id']"></el-radio>
            <el-checkbox-group v-else v-model="currentSelectedIds" @change="handleSelectionChange" @click.native="handleCheckClick" :disabled="isDisabledCheck(row)">
              <el-checkbox :label="row['id']" ></el-checkbox>
            </el-checkbox-group>
          </template>
        </el-table-column>
        <el-table-column prop="commodityNo" label="基础商品编码"></el-table-column>
        <el-table-column prop="commodityName" label="商品名称"></el-table-column>
        <el-table-column prop="enable" label="状态" :formatter="formateStatus"></el-table-column>
        <el-table-column prop="costPrice" label="税后供货价" :formatter="(row)=>formatNoneValue(row['costPrice'])"></el-table-column>
        <el-table-column prop="marketPrice" label="市场价" :formatter="(row)=>formatNoneValue(row['marketPrice'])"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onChangeVisible(false)">我再想想</el-button>
        <el-button type="primary" @click="sureAdd">确定添加</el-button>
      </div>
    </el-dialog>
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
  name: 'GoodsSelector',
  components: { Pagination, Cascader },
  props: {
    visible: Boolean
  },
  inject: {
    context: {
      from: 'vm',
      default: 'main'
    }
  },
  computed: {
    ...mapState('assembleGoods', ['bundleMainGoods', 'bundleRetinueGoods'])
  },
  watch: {
    visible: {
      handler: function(newVal) {
        if (newVal) {
          this.onQuery()
        }
      },
      immediate: true
    }
  },
  data() {
    this.formateStatus = row => {
      return row['enable'] ? '启用' : '停用'
    }
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
      currentSelected: '', // 当前单选中的商品
      currentSelectedList: [], // 当前选中的搭配商品列表
      currentSelectedIds: [] // 当前选中的搭配商品id列表
    }
  },
  methods: {
    ...mapActions('assembleGoods', ['clearBundleMainGoods', 'setBundleMainGoods', 'setBundleRetinueGoods']),
    isDisabledCheck(row) {
      const fn = () =>
        this.bundleRetinueGoods.map(item => (item.baseCommodityId ? item.baseCommodityId : item.id)).includes(row['id']) ||
        ((this.bundleMainGoods || {}).baseCommodityId ? this.bundleMainGoods.baseCommodityId === row['id'] : (this.bundleMainGoods || {}).id === row['id'])
      if (this.bundleRetinueGoods.length + this.currentSelectedIds.length < 25) {
        return fn()
      } else {
        return fn() || !this.currentSelectedIds.includes(row['id'])
      }
    },
    /**
     * @description: dialog visible的改变
     */
    onChangeVisible(visible) {
      this.$emit('update:visible', visible)
    },
    /**
     * @description: 滚动加载更多
     */
    loadMore() {
      console.log('loadMore---') // eslint-disable-line
      this.currentPage += 1
      reqBaseGoodsList({
        searchs: JSON.stringify(searchTool(this.handleReq())),
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
            const dataList = []
            Array.prototype.push.apply(dataList, this.tableData)
            Array.prototype.push.apply(dataList, result.itemVOs)
            this.$set(this, 'tableData', dataList)
            if (!result.itemVOs.length) {
              this.$message('没有更多数据了')
            }
          }
        })
        .catch(() => {})
    },
    /**
     * @description: 加工请求体
     */
    handleReq() {
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
    /**
     * @description: 获取列表
     */
    submitQuery() {
      const req = this.handleReq()
      this._reqBaseGoodsList(searchTool(req))
    },
    /**
     * @description: 查询
     */
    onQuery() {
      this.currentPage = 1
      this.reqForm = JSON.parse(JSON.stringify(this.form))
      this.submitQuery()
    },
    /**
     * @description: 单选的商品改变
     */
    handleCurrentChange(currentRow) {
      if (this.context.selectedType === 'main') {
        if (currentRow) {
          this.currentSelected = currentRow
        } else {
          this.currentSelected = ''
        }
      }
    },
    /**
     * @description: 处理表格单行点击
     */
    handleRowClick(currentRow) {
      if (this.context.selectedType === 'retinue') {
        if (currentRow) {
          if (this.bundleRetinueGoods.length + this.currentSelectedIds.length >= 25 && !this.currentSelectedIds.includes(currentRow.id)) {
            return
          }
          const repeatId = this.currentSelectedIds.filter(id => {
            if (currentRow.id === id) return true
            return false
          })
          if (repeatId.length > 0) {
            this.currentSelectedIds.splice(this.currentSelectedIds.indexOf(repeatId[0]), 1)
          } else {
            if (this.bundleMainGoods && (this.bundleMainGoods.baseCommodityId ? this.bundleMainGoods.baseCommodityId === currentRow.id : this.bundleMainGoods.id === currentRow.id)) return
            if (this.bundleRetinueGoods.some(item => (item.baseCommodityId ? item.baseCommodityId === currentRow.id : item.id === currentRow.id))) return
            this.currentSelectedIds.push(currentRow.id)
          }
        } else {
          this.currentSelectedIds = []
        }
      }
    },
    /**
     * @description: 直接点击clickbox，阻止冒泡，防止table的row-click事件被促发
     */
    handleCheckClick(e) {
      e.stopPropagation()
    },
    /**
     * @description: 多选商品
     */
    handleSelectionChange(selection) {
      console.log('handleSelectionChange ', selection) // eslint-disable-line
    },
    /**
     * @description: 确定添加
     */
    sureAdd() {
      if (this.context.selectedType === 'main' && this.currentSelected) {
        // const list = this.bundleRetinueGoods.filter(item => {
        //   if (item.id === this.currentSelected.id) return true
        //   return false
        // })
        // if (list.length > 0) {
        //   this.$message('该商品已经被添加到搭配商品中')
        //   return
        // }
        if (!this.currentSelected.enable) {
          this.$message('不能选择已经停用的商品')
          return
        }
        this.setBundleMainGoods(this.currentSelected)
      } else {
        // const list = this.currentSelectedIds.filter(id => {
        //   if (id === this.bundleMainGoods.id) return true
        //   return false
        // })
        // if (list.length > 0) {
        //   this.$message(`编码为${this.bundleMainGoods.commodityNo}的商品已经被添加到主商品中`)
        //   return
        // }
        this.currentSelectedList = this.currentSelectedIds.map(id => {
          this.tableData.map(data => {
            if (data.id === id) {
              id = data
            }
            return data
          })
          return id
        })
        let enable = true
        this.currentSelectedList.map(item => {
          if (!item.enable) enable = false
          return item
        })
        if (!enable) {
          this.$message('不能选择已经停用的商品')
          return
        }
        this.setBundleRetinueGoods(this.currentSelectedList)
      }
      this.onChangeVisible(false)
      this.currentSelectedIds = []
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
            this.$refs['table'].$el.querySelector('.el-table__body-wrapper,.is-scrolling-none').scrollTop = 0
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
            this.currentSelectedIds = []
            this.currentSelectedList = []
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
}
</style>
