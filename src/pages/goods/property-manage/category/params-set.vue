<template>
  <div class="app-container">
    <div class="top-line">
      <el-button v-np="'CATEGORY_PARAM_GROUP_ADD'" type="primary" @click="handleAdd" size="mini">添加新的分组</el-button>
    </div>
    <el-row :gutter='10'>
      <vue-draggable v-model="groupList" :move="onMove" @end='onEnd'>
        <el-col v-for="item in groupList" :key="item.id" :span="8">
          <el-card class="card-list">
            <div slot="header">
              <span>{{item.name}}</span>
              <el-button v-np="'CATEGORY_PARAM_GROUP_DEL'" style="float: right; padding: 3px 0" type="text" icon="el-icon-delete" @click="handleDelete(item)"></el-button>
              <el-button v-np="'CATEGORY_PARAM_GROUP_NAME_UPDATE'" style="float: right; padding: 3px 5px" type="text" icon="el-icon-edit" @click="handleUpdateName(item)"></el-button>
            </div>
            <div class="list-box">
              <div class="item" v-for="(i, d) in item.baseParamOptionList" :key="d">
                <div class="item-name" :title="i.paramType | paramTypeDescrible(i.name)">{{i.paramType | paramTypeDescrible(i.name)}}</div>
                <div class="item-operation">
                  <el-button v-np="'CATEGORY_PARAM_OPTION_UP'" type="text" size="mini" :disabled="d===0" @click="handleSort(item.id,item.baseParamOptionList,d,'up')">上移</el-button>
                  <el-button v-np="'CATEGORY_PARAM_OPTION_DOWN'" type="text" size="mini" :disabled="item.baseParamOptionList&&d===item.baseParamOptionList.length-1" @click="handleSort(item.id,item.baseParamOptionList,d,'down')">下移</el-button>
                  <el-button v-np="'CATEGORY_PARAM_OPTION_DEL'" type="text" size="mini" style="color:#D9001B" @click="handleDeleteParams(item.id, i.id)">删除</el-button>
                </div>
              </div>
            </div>
            <div class="btn-box">
              <el-button v-np="'CATEGORY_PARAM_OPTION_ADD'" type="primary" size="mini" @click="handleRelation(item.baseParamOptionList,item)">关联参数</el-button>
            </div>
          </el-card>
        </el-col>
      </vue-draggable>
    </el-row>
    <params-dialog :dialogSupVisible.sync="paramsDialogVisible" @update='handleDataList' :groupId='info.id' :maxParamSort='maxParamSort' :len='len'></params-dialog>
    <update-params-name :dialogSupVisible.sync="updateParamsDialogVisible" :info.sync='info' @update='handleDataList' :maxSort='maxSort'></update-params-name>
  </div>
</template>

<script>
  import ParamsDialog from './components/paramsDialog.vue'
  import UpdateParamsName from './components/updateParamsName'
  import VueDraggable from 'vuedraggable'
  import { findBaseParamGroup, delBaseParamGroup, asyncBaseCategorySort, deleteParamGroupOption, paramGroupOptionSort } from '@/api/baseCategory'
  export default {
    name: 'ParamsSet',
    components: {
      ParamsDialog,
      UpdateParamsName,
      VueDraggable
    },
    data() {
      return {
        paramsDialogVisible: false,
        groupList: [],
        updateParamsDialogVisible: false,
        info: {},
        maxSort: 0,
        maxParamSort: 0,
        movedId: '',
        len: 0
      }
    },
    mounted() {
      // 解决在Firefox中拖拽新开窗口的问题
      document.body.ondrop = function(event) {
        event.preventDefault()
        event.stopPropagation()
      }
      this.handleDataList()
    },
    filters: {
      paramTypeDescrible(value, name) {
        return value || value === 0 ? name + '【' + value.describe + '】' : '-'
      }
    },
    methods: {
      handleDataList() {
        findBaseParamGroup(this.$route.query.id).then(res => {
          if (res.code === 200) {
            this.groupList = JSON.parse(JSON.stringify(res.result))
            if (this.groupList.length > 0) {
              this.maxSort = this.groupList[0].sort * 1
            }
          } else {
            this.groupList = []
          }
        })
      },
      handleAdd() {
        if (this.groupList.length >= 10) {
          this.$confirm('每个分类最多只允许10个分组哦~', '提示', {
            showConfirmButton: false,
            cancelButtonText: '关闭'
          })
        } else {
          this.updateParamsDialogVisible = true
          this.info = {
            id: '',
            name: ''
          }
        }
      },
      handleUpdateName(row) {
        this.updateParamsDialogVisible = true
        this.info = row
      },
      handleDelete(row) {
        if (!row.baseParamOptionList || row.baseParamOptionList.length === 0) {
          this.$confirm('删除分组后将不能恢复，确定要删除该分组吗？', '删除分组', {
            confirmButtonText: '确定删除',
            cancelButtonText: '我再想想'
          }).then(() => {
            delBaseParamGroup(row.id).then(res => {
              if (res.code === 200) {
                this.$message.success('操作成功')
                this.handleDataList()
              }
            })
          })
        } else {
          this.$confirm(' 分组有关联参数，请先删除关联参数后才能删除分组，谢谢！', '删除分组', {
            showConfirmButton: false,
            cancelButtonText: '关闭'
          })
        }
      },
      // 保存拖动后的顺序
      onMove({ draggedContext }) {
        const draggedElement = draggedContext.element
        this.movedId = draggedElement && draggedElement.id
        // return draggedElement && draggedElement.id
      },
      onEnd({ oldIndex, newIndex }) {
        const { id } = this.$route.query
        let sort = 0
        if (oldIndex < newIndex) {
          sort = this.groupList[newIndex - 1].sort
        } else if (oldIndex > newIndex) {
          sort = this.groupList[newIndex + 1].sort
        }
        if (oldIndex === newIndex) {
          return
        }
        asyncBaseCategorySort({ id: this.movedId, sort, baseCategoryId: id }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '操作成功')
          }
          this.handleDataList()
        })
      },
      handleRelation(list, row) {
        this.len = list.length
        if (list.length >= 20) {
          this.$confirm('每个分组最多只能添加20个参数哦~', '提示', {
            showConfirmButton: false,
            cancelButtonText: '关闭'
          })
        } else {
          this.paramsDialogVisible = true
          this.info = row
          if (list && list.length > 0) {
            this.maxParamSort = list[0].sort * 1
          }
        }
      },
      handleDeleteParams(groupId, id) {
        this.$confirm('参数删除后该分类下商品的参数项也将删除，确定要删除该参数吗？', '删除参数', {
          confirmButtonText: '确定删除',
          cancelButtonText: '我再想想'
        }).then(() => {
          deleteParamGroupOption({
            paramGroupId: groupId,
            id
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('关联参数删除成功~')
              this.handleDataList()
            }
          })
        })
      },
      // 上移/下移
      handleSort(groupId, list, index, type) {
        let sourceId = type === 'up' ? list[index - 1].id : list[index + 1].id
        paramGroupOptionSort({
          paramGroupId: groupId,
          sourceId,
          targetId: list[index].id
        }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message || '操作成功~')
            this.handleDataList()
          }
        })
      },
      dragDrop(ev) {
        ev.stopPropagation()
        ev.preventDefault()
        ev.dataTransfer = ev.originalEvent.dataTransfer
      }
    }
  }
</script>

<style lang="scss" scoped>
  .top-line{padding-bottom:20px;}
  .card-list{
    margin-bottom: 10px;
    .list-box{
      height:300px;
      overflow: auto;
      .item{
        display: flex;
        align-items: center;
        justify-content: space-between;
        .item-name{
          font-size:14px;
          width: calc(100% - 140px);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .item-operation{
          width: 110px;
        }
      }
    }
    .btn-box{padding-top:20px;}
  }
</style>
