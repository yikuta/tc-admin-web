<template>
  <div class="app-main">
    <div class="wrapper">
      <el-card>
        <search-card @query='handleQueryParams'/>
      </el-card>
    </div>
    <div class="wrapper">
      <el-card>
        <el-table :data="tableData.data">
          <el-table-column label="规格编码" prop="id"></el-table-column>
          <el-table-column label="规格名称" prop="name"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">{{scope.row.enable?'启用':'停用'}}</template>
          </el-table-column>
          <el-table-column label="添加时间" prop="createTime">
            <template slot-scope="scope">
              {{scope.row.createTime | format('yyyy-MM-dd HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column label="添加人" prop="createUser" align='center'>-</el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button v-np="'BASE_SPEC_UPDATE'" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-np="scope.row.enable ? 'BASE_SPEC_DISABLE' : 'BASE_SPEC_ENABLE'" type="text" @click="handleStatus(scope.row)">{{scope.row.enable?'停用':'启用'}}</el-button>
              <el-button v-np="'BASE_SPEC_VALUE_UPDATE'" type="text" @click="handleSpecs(scope.row)">规格值</el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :current="tableData.pageNo"
          :total="tableData.total"
          :page-size='tableData.pageSize'
          @onPageChange='handlePageChange'
          @onSizeChange='handleSizeChange'
        />
      </el-card>
    </div>
    <el-dialog :visible.sync="dialogVisible" custom-class="params-dialog" :close-on-click-modal='false'>
      <span slot="title" class="dialog-header">
        <span>规格值管理</span>
        <el-button v-np="'BASE_SPEC_ADD'" type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"></el-button>
      </span>
      <el-table :data="specsData" size="small">
        <el-table-column label="规格值名称">
          <template slot-scope="scope">
            <el-input size="small" type="text" placeholder="请输入规格值名称" maxlength="20" v-model="scope.row.name"/>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.sort"
              :min="0"
              :max="9999"
              placeholder="请输入序号"
              step-strictly
              size="small"></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="100px">
          <template slot-scope="scope">{{scope.row.enable?'显示':'隐藏'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click='handleToggle(scope.row)'>{{scope.row.enable?'隐藏':'显示'}}</el-button>
            <el-button v-np="'CATEGORY_SPEC_DEL'" type="text" @click="handleDelete(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="handleSave" :loading="btnLoading">确定修改</el-button>
        <el-button size="small" @click="dialogVisible = false">我再想想</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { fetchBaseSpecificationList, asyncBaseSpecsEnable, asyncBaseSpecsUpdate, findBaseSpecsById } from '@/api/baseCategory'
  import SearchCard from './searchCard'
  import Pagination from '@/components/Pagination'
  export default {
    name: 'SpecsList',
    components: {
      SearchCard,
      Pagination
    },
    data() {
      return {
        tableData: {
          pageSize: 10,
          pageNo: 1,
          total: 0,
          data: []
        },
        loading: false,
        specsData: [],
        dialogVisible: false,
        btnLoading: false
      }
    },
    created() {
      this.handleSpecsList()
    },
    methods: {
      handleSpecsList() {
        const { pageNo, pageSize } = this.tableData
        this.loading = true
        fetchBaseSpecificationList({
          pageNo,
          pageSize,
          // distinct: true, // 去重
          orderby: 'createTime',
          sort: 'desc',
          searchs: JSON.stringify(this.queryForm)
        }).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.tableData.data = res.result.itemVOs
            this.tableData.total = res.result.totalCount
          } else {
            this.tableData.data = []
            this.tableData.total = 0
          }
        }).catch(() => {
          this.loading = false
        })
      },
      handleSpecsInfo(id) {
        findBaseSpecsById(id).then(res => {
          if (res.code === 200) {
            this.specsData = res.result.specificationValueList || []
          } else {
            this.specsData = []
          }
        })
      },
      handleQueryParams(form) {
        this.tableData.pageNo = 1
        this.queryForm = form
        this.handleSpecsList()
      },
      handlePageChange(page) {
        this.tableData.pageNo = page
        this.handleSpecsList()
      },
      handleSizeChange(size) {
        this.tableData.pageNo = 1
        this.tableData.pageSize = size
        this.handleSpecsList()
      },
      handleEdit(row) {
        this.$router.push('specs/publish?id=' + row.id)
      },
      // 启用/停用
      handleStatus(row) {
        let str = row.enable ? '规格停用后将不能选择，但不影响已选择的商品展示，确定要停用吗？' : '规格启用后可以有添加商品时选择，确定要启用吗？'
        let confirmText = row.enable ? '停用确认' : '启用确认'
        this.$confirm(str, confirmText, {
          confirmButtonText: `确定${row.enable ? '停用' : '启用'}`,
          cancelButtonText: '我再想想'
        }).then(() => {
          asyncBaseSpecsEnable({ id: row.id, status: !row.enable }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              row.enable = !row.enable
            }
          })
        })
      },
      // 属性值
      handleSpecs(row) {
        this.dialogVisible = true
        this.info = row
        this.handleSpecsInfo(row.id)
      },
      // 添加规格值
      handleAdd() {
        this.specsData.push({
          name: '',
          sort: '',
          enable: true
        })
      },
      // 隐藏/显示
      handleToggle(row) {
        row.enable = !row.enable
      },
      // 删除
      handleDelete(row) {
        this.specsData.splice(row.$index, 1)
      },
      // 修改参数值
      handleSave() {
        // let flag = this.specsData.find(item => item.name)
        const { id, name } = this.info
        this.btnLoading = true
        asyncBaseSpecsUpdate({ id, name, specificationValueList: this.specsData }).then(res => {
          this.btnLoading = false
          if (res.code === 200) {
            this.$message.success(res.result || '更新成功')
            this.dialogVisible = false
            this.handleSpecsList()
          }
        }).catch(() => {
          this.btnLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-main{
    .search-btn{text-align: right;}
  }
  .wrapper {
    margin: 10px;
  }
</style>
