<template>
  <div class="app-main">
    <div class="wrapper">
      <el-card>
        <search-card @query='handleQueryParams'/>
      </el-card>
    </div>
    <div class="wrapper">
      <el-card>
        <el-table :data="tableData.data" v-loading="loading">
          <el-table-column label="参数编码" prop="id" align='center'></el-table-column>
          <el-table-column label="参数名称" prop="name"></el-table-column>
          <el-table-column label="输入类型" prop="type">
            <template slot-scope="scope">
              {{scope.row.paramType | statusDescrible}}
            </template>
          </el-table-column>
          <el-table-column label="状态" width="80">
            <template slot-scope="scope">
              <span>{{scope.row.enable ? '启用' : '停用'}}</span>
              <!-- <el-switch v-model="scope.row.status" :active-value="1" :inactive-value="0" disabled></el-switch> -->
            </template>
          </el-table-column>
          <el-table-column label="添加时间" prop="time" width="150">
            <template slot-scope="scope">
              {{scope.row.createTime | format('yyyy-MM-dd HH:mm:ss')}}
            </template>
          </el-table-column>
          <el-table-column label="添加人" prop="operation" align='center'>-</el-table-column>
          <el-table-column label="操作" width="180px">
            <template slot-scope="scope">
              <el-button v-np="'PARAM_OPTION_UPDATE'" type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button v-np="scope.row.enable ? 'PARAM_OPTION_DISABLE' : 'PARAM_OPTION_ENABLE'" type="text" @click="handleStatus(scope.row)">{{scope.row.enable ? '停用' : '启用'}}</el-button>
              <el-button v-np="'PARAM_OPTION_VALUE_UPDATE'" type="text" v-show="scope.row.paramType.value!==4&&scope.row.paramType.value!==5" @click="handleParams(scope.row)">参数值</el-button>
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
        <span>参数值管理</span>
        <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd"></el-button>
      </span>
      <el-table :data="paramsData" size="small">
        <el-table-column label="属性值名称">
          <template slot-scope="scope">
            <el-input size="small" type="text" placeholder="请输入属性值名称" maxlength="20" v-model="scope.row.name"/>
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
          <template slot-scope="scope">{{scope.row.status?'显示':'隐藏'}}</template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button type="text" @click='handleToggle(scope.row)'>{{scope.row.status?'隐藏':'显示'}}</el-button>
            <el-button type="text" @click="handleDelete(scope)">删除</el-button>
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
  import Pagination from '@/components/Pagination'
  import { getBaseParamsList, asyncBaseParamsEnable, asyncBaseParamsUpdate } from '@/api/baseCategory'
  import SearchCard from './searchCard'
  export default {
    name: 'ParamsList',
    components: {
      Pagination,
      SearchCard
    },
    data() {
      return {
        tableData: {
          pageSize: 20,
          pageNo: 1,
          total: 0,
          data: []
        },
        queryForm: [],
        loading: false,
        paramsData: [],
        dialogVisible: false,
        btnLoading: false,
        info: {},
        paramsList: [
          { id: 1, name: '单选框', type: 'RADIO' },
          { id: 2, name: '复选框', type: 'CHECKBOX' },
          { id: 3, name: '下拉选择', type: 'SELECT' },
          { id: 4, name: '单行输入框', type: 'TEXT' },
          { id: 5, name: '多行输入框', type: 'TEXTAREA' }
          // { id: '6', name: '下拉输入框', type: 'SELECT_TEXT' },
          // { id: '7', name: '搜索下拉框', type: 'SEARCH_TEXT' }
        ]
      }
    },
    created() {
      this.handleParamsList()
    },
    methods: {
      // 添加属性值
      handleAdd() {
        this.paramsData.push({
          name: '',
          sort: '',
          status: true
        })
      },
      handleParamsList() {
        const { pageNo, pageSize } = this.tableData
        this.loading = true
        getBaseParamsList({
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
      handleQueryParams(form) {
        this.tableData.pageNo = 1
        this.queryForm = form
        this.handleParamsList()
      },
      // 编辑
      handleEdit(row) {
        this.$router.push('/goods/propertyMange/params/publish?id=' + row.id)
      },
      // 启用/停用
      handleStatus(row) {
        let str = row.enable ? '参数停用后将不能选择，前端也将不在展示，确定要停用吗？' : '参数启用后将可以在添加商品时选择，且前端也可以查看该属性，确定要启用吗？'
        let confirmText = row.enable ? '停用确认' : '启用确认'
        this.$confirm(str, confirmText, {
          confirmButtonText: `确定${row.enable ? '停用' : '启用'}`,
          cancelButtonText: '我再想想'
        }).then(() => {
          asyncBaseParamsEnable({ id: row.id, status: !row.enable }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              row.enable = !row.enable
            }
          })
        })
      },
      handlePageChange(page) {
        this.tableData.pageNo = page
        this.handleParamsList()
      },
      handleSizeChange(size) {
        this.tableData.pageNo = 1
        this.tableData.pageSize = size
        this.handleParamsList()
      },
      handleParams(row) {
        this.dialogVisible = true
        this.info = row
        this.paramsData = row.value ? JSON.parse(row.value) : []
      },
      // 隐藏/显示
      handleToggle(row) {
        row.status = !row.status
      },
      // 删除
      handleDelete(row) {
        this.paramsData.splice(row.$index, 1)
      },
      // 修改参数值
      handleSave() {
        // let flag = this.paramsData.find(item => item.name)
        const { id, name, paramType } = this.info
        let value = JSON.stringify(this.paramsData)
        let params = this.paramsList.filter(item => item.id === paramType.value)
        this.btnLoading = true
        asyncBaseParamsUpdate({ id, name, paramType: params ? params[0].type : '', value }).then(res => {
          this.btnLoading = false
          if (res.code === 200) {
            this.$message.success(res.result)
            this.dialogVisible = false
            this.tableData.pageNo = 1
            this.handleParamsList()
          }
        }).catch(() => {
          this.btnLoading = false
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .wrapper {
    margin: 10px;
  }
  /deep/ .params-dialog .el-dialog__header{
    border-bottom: 1px solid #ebeef5;
  }
</style>
