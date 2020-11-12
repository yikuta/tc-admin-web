<template>
  <div class="app-container">
    <div class="describe-header" style="padding: 0 20px">
      <el-row>
        <el-col :span='8' v-for="(item, index) in describeHeader" :key="index">
          {{item.title}} {{collection[item.prop]}}
        </el-col>
      </el-row>
    </div>

    <search-form
      :buttons="['reset', 'search']"
      :formConfig="frozenForm"
      :form="form"
      @change="handleSearch"
    >
      <template slot="createTime">
        <date-range
          label="冻结日期"
          prop="createTime"
          :startTime.sync="form.createTime.value[0]"
          :endTime.sync="form.createTime.value[1]"
        />
      </template>
    </search-form>

    <base-table
      :list="list"
      :pagination="pagination"
      :columns="frozenTableColumns"
      @change="handleTableChange"
    ></base-table>
  </div>
</template>
<script>
  import { mergeObject, filterEmptyParams } from '@/utils/util'
  import searchFormat from '@/utils/searchFormat'
  import { describeHeader, frozenForm, frozenTableColumns } from './const/frozen'
  import { fetchFinancialFrozenShopDetail } from '@/api/financial/shop'

  function resetFields(data) {
    for (let key in data) {
      data[key].value = ''
    }
  }

  export default {
    name: 'ShopFundDetail',
    components: {
      SearchForm: () => import('@/components/SearchForm'),
      BaseTable: () => import('@/components/BaseTable'),
      DateRange: () => import('../../templates/DateRange')
    },
    data() {
      return {
        frozenForm,
        describeHeader,
        frozenTableColumns,
        shopCode: null,
        form: {
          frozenType: { value: '', matchType: 'EQUAL', name: 'frozenType', tempType: 'enum' }, // 冻结类型
          frozenStatus: { value: '', matchType: 'EQUAL', name: 'frozenStatus', tempType: 'enum' }, // 冻结状态
          createTime: { value: [], matchType: 'BETWEEN', name: 'createTime', tempType: 'Date' }
        },
        pagination: {
          total: 0,
          pageSize: 20,
          pageNo: 1
        },
        list: [],
        collection: {},
        dialogVisible: false
      }
    },
    mounted() {
      this.shopCode = this.$route.query.shopCode
      this.fetchTableList()
    },
    methods: {
      fetchTableList() {
        const searches = searchFormat(this.form)
        const postData = filterEmptyParams({
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          shopCode: this.shopCode,
          orderby: 'createTime',
          sort: 'desc',
          searchs: searches.length ? JSON.stringify(searches) : null
        })
        fetchFinancialFrozenShopDetail(postData).then(res => {
          if (res.code === 200) {
            const { bossAccount, shopCode, shopName, pageObj: { itemVOs, totalCount }} = res.result
            this.collection = { bossAccount, shopCode, shopName }
            this.list = itemVOs
            this.pagination.total = totalCount
          }
        })
      },
      handleSearch(type) {
        if (type === 'search') {
          this.pagination.pageNo = 1
          this.fetchTableList()
        } else if (type === 'reset') {
          this.pagination.pageNo = 1
          resetFields(this.form)
          this.form.createTime.value = []
          this.fetchTableList()
        }
      },
      handleTableChange(data) {
        mergeObject(this.pagination, data)
        this.fetchTableList()
      }
    }
  }
</script>
<style scoped lang="scss">
  .describe-header {
    padding: 4px 20px;
    margin-bottom: 20px;
    border-bottom: 1px solid #e4e4e4;
    color: #606266;
    line-height: 40px;
    font-size: 14px;
    background: #f9fafc;
  }
</style>
