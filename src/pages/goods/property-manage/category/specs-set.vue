<template>
  <div class="app-container">
    <el-table size="mini" :data="tableData" empty-text='分类还没有关联任何规格，赶紧去关联吧' v-loading="loading">
      <el-table-column label="规格名称" prop="name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div class="item-operation">
            <el-button type="text" size="mini" :disabled="scope.$index===0" @click="handleSort(scope.$index,'up')">上移</el-button>
            <el-button type="text" size="mini" :disabled="scope.$index===tableData.length-1" @click="handleSort(scope.$index,'down')">下移</el-button>
            <el-button v-np="'CATEGORY_SPEC_DEL'" type="text" size="mini" style="color:#D9001B" @click="handleDeleteSpecs(scope.row)">删除</el-button>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="规格值">
        <template slot-scope="scope">
          <el-checkbox-group v-model="scope.row.checkList">
            <el-checkbox
              v-show="item.enable"
              :label="item.id"
              v-for="item in scope.row.specificationValueList"
              :key="item.id"
              :checked='item.checked'>{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column label="" width='80px'>
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAdd(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="btn-box">
      <el-button v-np="'PARAM_GROUP_OPTION_ADD'" type="primary" size="small" @click="handleRelation()">关联新规格</el-button>
      <el-button type="primary" size="small" @click="handleSave()">保存</el-button>
      <el-button type="default" size="small" @click="$router.go(-1)">返回</el-button>
    </div>
    <params-dialog :dialogSupVisible.sync="specsDialogVisible" @update='handleDataList' :maxSpecsSort='maxSpecsSort' :len='tableData.length'></params-dialog>
    <add-specs-value :dialogSupVisible.sync="addSpecsDialogVisible" @update='handleDataList' :info='info'></add-specs-value>
  </div>
</template>

<script>
  import ParamsDialog from './components/specsDialog'
  import AddSpecsValue from './components/addSpecsValue'
  import { findBaseCategorySpecification, addSpecificationValue, delCategorySpecificationById, asyncBaseSpecificationCategorySort } from '@/api/baseCategory'
  export default {
    name: 'SpecsSet',
    components: {
      ParamsDialog,
      AddSpecsValue
    },
    data() {
      return {
        specsDialogVisible: false,
        tableData: [],
        checkList: [],
        addSpecsDialogVisible: false,
        info: {},
        loading: false,
        maxSpecsSort: 0
      }
    },
    mounted() {
      this.handleDataList()
    },
    methods: {
      handleDataList() {
        this.loading = true
        findBaseCategorySpecification(this.$route.query.id).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.tableData = res.result.map(item => {
              let arr = []
              if (item.value) {
                arr = JSON.parse(item.value).map(item => item.id)
              }
              return {
                id: item.baseSpecification.id,
                targetId: item.id,
                name: item.baseSpecification.name,
                specificationValueList: item.baseSpecification.specificationValueList,
                checkList: arr.map(item => item * 1),
                sort: item.sort
              }
            })
          } else {
            this.tableData = []
          }
        }).catch(() => {
          this.tableData = []
          this.loading = false
        })
      },
      handleRelation() {
        if (this.tableData.length > 0) {
          this.maxSpecsSort = this.tableData[0].sort
        } else {
          this.maxSpecsSort = 0
        }
        this.specsDialogVisible = true
      },
      handleSave() {
        let arr = []
        this.tableData.map(item => {
          if (item && item.specificationValueList && item.specificationValueList.length > 0) {
            let str = item.checkList.map(item => {
              return {
                id: item,
                enable: true
              }
            })
            arr.push({
              baseCategoryId: this.$route.query.id,
              baseCategorySpecificationId: item.id,
              specificationValueId: JSON.stringify(str)
            })
          }
        })
        addSpecificationValue(arr).then(res => {
          if (res.code === 200) {
            this.$message.success('保存成功~')
          }
        })
      },
      handleDeleteSpecs(row) {
        this.$confirm('规格删除后新增的商品将无法直接使用该规格生成SKU，确定要删除吗？', '删除规格', {
          confirmButtonText: '确定删除',
          cancelButtonText: '我再想想'
        }).then(() => {
          delCategorySpecificationById(row.targetId).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message || '删除成功')
              this.handleDataList()
            }
          })
        })
      },
      // 上移/下移
      handleSort(index, type) {
        const { tableData } = this
        let sourceId = type === 'up' ? tableData[index - 1].targetId : tableData[index + 1].targetId
        asyncBaseSpecificationCategorySort({
          baseCategoryId: this.$route.query.id,
          sourceId,
          targetId: tableData[index].targetId
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '操作成功~')
            this.handleDataList()
          }
        })
      },
      handleAdd(row) {
        this.addSpecsDialogVisible = true
        this.info = row
      }
    }
  }
</script>

<style lang="scss" scoped>
  .btn-box{
    padding-top:20px;
    text-align: center;
  }
</style>
