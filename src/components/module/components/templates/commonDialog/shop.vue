<template>
  <div class="">
    <div class="search-bar">
      <el-form :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店编码" prop="shopCode.value">
              <el-input v-model="form.shopCode.value" placeholder="门店编码" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店名称" prop="name.value">
              <el-input v-model="form.name.value" placeholder="门店名称" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item>
              <el-button type="primary" size="mini" @click="getList">查询</el-button>
              <el-button type="default" size="mini" @click="handleReset">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="">
      <el-table size="mini" :data="tableData">
        <el-table-column label="店铺编码" prop="shopCode"></el-table-column>
        <el-table-column label="店铺名称" prop="name"></el-table-column>
        <el-table-column label="店铺状态">
          <template slot-scope="{ row }">
            <el-badge is-dot class="badge-item" type="success"/>
            <span>启用</span>
          </template>
        </el-table-column>
        <el-table-column>
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="handleSelect(row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination :current="pagination.pageNo" :total="pagination.totalCount" :pageSize="pagination.pageSize" @onPageChange="onPageChange" @onSizeChange="onSizeChange"/>
    </div>
  </div>
</template>

<script>
  import { MatchType, DataType } from '@/constants/search'
  import { reqShopList } from '@/api/seller'
  import searchTool from '@/utils/searchTool'
  export default {
    name: 'ShopList',
    components: {
      Pagination: resolve => {
        return require(['@/components/Pagination'], resolve)
      }
    },
    data() {
      return {
        form: {
          name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
          shopCode: { value: '', name: 'shopCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          enterStatus: { value: '1', name: 'enterStatus', matchType: MatchType.EQUAL, type: DataType.STRING },
          status: { value: '1', name: 'shopStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER }
        },
        tableData: [],
        pagination: {
          pageSize: 10,
          pageNo: 1,
          totalCount: 0
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        reqShopList({
          searchs: JSON.stringify(searchTool(this.form)),
          ...this.pagination,
          distinct: true, // 去重
          orderby: 'createTime',
          sort: 'desc'
        }).then(res => {
          this.tableData = res.result.itemVOs || []
        })
      },
      handleSelect(item) {
        // 用户选择了商品，调用上级成功方法
        this.$emit('success', {
          shopId: item.shopCode,
          baseData: item
        })
      },
      getData() {
        this.$message.error('请选择店铺')
        return false
      },
      handleReset() {
        this.form.name.value = ''
        this.form.shopCode.value = ''
        this.pagination.pageNo = 1
        this.pagination.pageSize = 10
      },
      onPageChange(page) {
        this.pagination.pageNo = page
        this.getList()
      },
      onSizeChange(size) {
        this.pagination.pageSize = size
        this.pagination.pageNo = 1
        this.getList()
      }
    }
  }
</script>

<style lang="scss" scoped></style>
