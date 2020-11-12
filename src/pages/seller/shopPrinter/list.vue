<template>
  <div class="app-container">
    <search-form :form="searchForm" :buttons="['search', 'add']" addButtonText="绑定打印机" labelWidth="90px" @change="handleSearch">
      <template slot="form">
        <el-form-item label="打印机终端号" prop="terminalNum.value">
          <el-input v-model="searchForm.terminalNum.value" placeholder="输入打印机终端号"/>
        </el-form-item>
        <el-form-item label="门店名称" prop="name.value">
          <el-input v-model="searchForm.name.value" placeholder="输入门店名称"/>
        </el-form-item>
        <el-form-item label="门店编码" prop="shopCode.value">
          <el-input v-model="searchForm.shopCode.value" placeholder="输入门店编码"/>
        </el-form-item>
      </template>
    </search-form>
    <div class="table-wrapper">
      <base-table :columns="columns" :pagination="pagination" :list="list" @change="handlePaginationChange">
        <template slot="terminalNum" slot-scope="{ row }">
          <div class="desc-item"><span>终端号：</span>{{row['terminalNum']}}</div>
          <div class="desc-item"><span>密钥：</span>{{row['terminalPassword']}}</div>
          <div class="desc-item"><span>类型：</span>{{row['terminalName']}} / {{row.terminalType}}</div>
        </template>

        <template slot="status" slot-scope="{ row }">
          <el-button v-if="!row.status" type="text" @click="handleFetchStatus(row)">获取状态</el-button>
          <template v-if="row.status">
            <el-badge is-dot class="badge-item" :type="row.status === '正常' ? 'success' : 'danger'"></el-badge>
            <span>{{row.status}}</span>
          </template>
        </template>

        <template slot="shopCode" slot-scope="{ row }">
          <div class="desc-item"><span>门店名称：</span>{{row.name}}</div>
          <div class="desc-item"><span>门店编码：</span>{{row.shopCode}}</div>
        </template>

        <template slot="managerName" slot-scope="{ row }">
          <div class="desc-item"><span>负责人：</span>{{row.managerName}}</div>
          <div class="desc-item"><span>负责人电话：</span>{{row.managerTel}}</div>
        </template>

        <template slot="createTime" slot-scope="{ row }">
          <div class="desc-item"><span>来源：</span>{{row.bossType === 1 ? '商家App' : '中台'}}</div>
          <div class="desc-item"><span>时间：</span>{{row.createTime}}</div>
        </template>

        <el-table-column slot="operates" label="操作" width="130px">
          <template slot-scope="{ row }">
            <el-button type="text" @click="handleCancelBind(row)">解绑</el-button>
            <el-button type="text" @click="handleBindNew(row)">重新绑定</el-button>
          </template>
        </el-table-column>
      </base-table>
    </div>
    <dialog-form :form="dialogForm" :visible="dialogVisible" @close="handleDialogClose" />
  </div>
</template>
<script>
  import { fetchShopPrinter, cancelBindPrinter, fetchPrintStatus } from '@/api/seller'
  import SearchForm from '@/components/SearchForm'
  import BaseTable from '@/components/BaseTable'
  import searchFormat from '@/utils/searchFormat'
  import DialogForm from './templates/dialogForm'
  const columns = [{
    title: '打印机信息',
    prop: 'terminalNum',
    slot: true
  }, {
    title: '状态',
    prop: 'status',
    slot: true
  }, {
    title: '门店信息',
    prop: 'shopCode',
    slot: true
  }, {
    title: '门店负责人',
    prop: 'managerName',
    slot: true
  }, {
    title: '添加时间',
    prop: 'createTime',
    slot: true
  }]
  const initDialogForm = {
    shopCode: '',
    terminalNum: '',
    terminalName: '',
    terminalType: '',
    terminalPassword: ''
  }
  export default {
    name: 'PrinterList',
    components: { SearchForm, BaseTable, DialogForm },
    data() {
      return {
        columns: columns,
        searchForm: {
          terminalNum: { value: '', name: 'shopTerminal.terminalNum', matchType: 'EQUAL', tempType: 'String' },
          name: { value: '', name: 'name', matchType: 'CONTAIN', tempType: 'String' },
          shopCode: { value: '', name: 'shopCode', matchType: 'EQUAL', tempType: 'String' }
        },
        dialogForm: { ...initDialogForm },
        list: [],
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: 0
        },
        form: {},
        dialogVisible: false,
        currentRow: {}
      }
    },
    mounted() {
      this.fetchShopPrinter()
    },
    methods: {
      handleDialogClose(type) {
        this.dialogForm = { ...initDialogForm }
        this.dialogVisible = false
        if (type === 'success') {
          this.fetchShopPrinter()
        }
      },
      handleFetchStatus(row) {
        fetchPrintStatus(row.shopCode).then(res => {
          this.$set(row, 'status', (res.code === 200 && res.result) ? '正常' : '异常')
        })
      },
      handleSearch(type) {
        if (type === 'search') {
          this.pagination.pageNo = 1
          this.fetchShopPrinter()
        } else if (type === 'add') {
          this.dialogVisible = true
        }
      },
      handlePaginationChange({ pageNo, pageSize }) {
        this.pagination.pageNo = pageNo
        this.pagination.pageSize = pageSize
        this.fetchShopPrinter()
      },
      fetchShopPrinter() {
        const searches = searchFormat(this.searchForm)
        fetchShopPrinter({
          orderby: 'createTime',
          sort: 'desc',
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          searchs: searches.length ? JSON.stringify(searches) : null
        }).then(res => {
          if (res.code === 200) {
            const { itemVOs, pageNo, pageSize, totalCount } = res.result
            this.pagination.pageNo = pageNo
            this.pagination.pageSize = pageSize
            this.pagination.total = totalCount
            this.list = itemVOs
          }
        })
      },
      handleCancelBind(row) {
        this.$confirm('确定要解除绑定？', '解绑确认', {}).then(() => {
          cancelBindPrinter(row.shopCode).then(res => {
            if (res.code === 200) {
              this.fetchShopPrinter()
            }
          })
        })
      },
      handleBindNew(row) {
        const { name, shopCode, address, terminalName, terminalType, terminalNum, terminalPassword } = row
        this.dialogForm = { name, shopCode, address, terminalName, terminalType, terminalNum, terminalPassword }
        this.dialogVisible = true
      }
    }
  }
</script>
<style lang="scss" scoped>
  .table-wrapper {
    .desc-item {
      font-size: 13px;
      color: rgb(96, 98, 102);
    }
  }
</style>
