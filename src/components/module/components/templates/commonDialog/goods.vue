<template>
  <div class="">
    <div class="search-bar">
      <el-form :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="商品类型">
              <el-select v-model="form.businessNo.value" placeholder="请选择商品类型">
                <el-option v-for="(item, index) in option.types" :label="item.value" :value="item.id" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品编码">
              <el-input v-model="form.channelCommodityNo.value" clearable placeholder="请输入商品编码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="商品名称">
              <el-input v-model="form.channelCommodityName.value" clearable placeholder="请输入商品名称"></el-input>
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
        <el-table-column label="商品编码" prop="channelCommodityNo"></el-table-column>
        <el-table-column label="商品名称" prop="channelCommodityName"></el-table-column>
        <el-table-column label="商品状态">
          <template slot-scope="{ row }">{{ row.commodityStatus.describe }}</template>
        </el-table-column>
        <el-table-column label="售价">
          <template slot-scope="{ row }">
            {{ row.minSalePrice | getPrice(row.maxSalePrice) }}
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
  import { cmsCommodity } from '@/api/mallGoods'
  import searchTool from '@/utils/searchTool'
  export default {
    name: 'GoodsList',
    components: {
      Pagination: resolve => {
        return require(['@/components/Pagination'], resolve)
      }
    },
    data() {
      return {
        form: {
          channelCommodityName: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          channelCommodityNo: { value: '', name: 'channelCommodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
          businessNo: { value: 1, name: 'businessNo', matchType: MatchType.EQUAL, type: DataType.BOOLEAM },
          commodityStatus: { value: 1, name: 'commodityStatus', matchType: MatchType.EQUAL, type: DataType.BOOLEAM }
        },
        option: {
          types: [
            { id: 1, value: '快递到家' },
            { id: 2, value: '爆品预售' },
            { id: 4, value: '净菜' }
          ]
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
    filters: {
      getPrice(min, max) {
        if (min === max) {
          return min
        } else {
          return `${min}-${max}`
        }
      }
    },
    methods: {
      getList() {
        cmsCommodity({
          searchs: JSON.stringify(searchTool(this.form)),
          ...this.pagination
        }).then(res => {
          this.tableData = res.result.itemVOs
          this.pagination = {
            pageNo: res.result.pageNo,
            pageSize: res.result.pageSize,
            totalCount: res.result.totalCount
          }
        })
      },
      handleSelect(item) {
        // 用户选择了商品，调用上级成功方法
        this.$emit('success', this.form.businessNo.value === 4 ? {
          goodsTypeId: this.form.businessNo.value,
          goodsId: item.id,
          baseData: item,
          shopId: item.storeNo
        } : {
          goodsTypeId: this.form.businessNo.value,
          goodsId: item.id,
          baseData: item
        })
      },
      handleReset() {
        this.form.businessNo.value = 1
        this.form.channelCommodityNo.value = ''
        this.form.channelCommodityName.value = ''
        this.pagination.pageNo = 1
        this.pagination.pageSize = 10
      },
      handleSearch() {
        this.pagination.pageNo = 1
        this.pagination.pageSize = 10
      },
      getData() {
        this.$message.error('请选择商品')
        return false
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
