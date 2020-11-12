<template>
  <div class="app-container">
    <el-row :gutter="8">
      <el-col :span="8" v-for="(box, j) in ['一', '二', '三']" :key="j">
        <el-card class="card-">
          <div class="top-search-bar">
            <el-input placeholder="请输入搜索关键字" class="input-with-select" size="mini" v-model='keyword[j]' clearable>
              <el-button slot="append" icon="el-icon-search" @click="handleSearch(j)"></el-button>
            </el-input>
            <el-button
              type="primary"
              size="mini"
              @click="handleAdd(j)"
              v-np="j === 0 ?'CATEGORY_LEV_ONE_ADD':( j === 1 ? 'CATEGORY_LEV_TWO_ADD':'CATEGORY_LEV_TRD_ADD')"
              :disabled="j !== 0 && !classList[j - 1] || (j > 0 && !disabledList[j - 1])"
              style="margin-left:8px;width:104px">添加{{ box }}级分类</el-button>
          </div>
          <div class="list-box" v-if="transfer[j]&&transfer[j].length>0">
            <div v-for="(item, index) in transfer[j]" :key="index" class="text item" :class="[{'active': classList[j] && item.id === classList[j]}]"
                 @click="handleClass(item, j)">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-status" :style="{'color':item.enable?'#95F204':'#D9001B'}">{{item.enable?'启用':'停用'}} <span style="color:#169BD5">{{item.merchantCategoryFlag ? '第三方' : ''}}</span></div>
              <div class="btn-box">
                <template v-if="j === 2">
                  <el-button v-np="'CATEGORY_SPEC_LIST'" type="text" @click="$router.push(`/goods/propertyMange/category/specs?id=${item.id}`)">规格</el-button>
                  <el-button v-np="'CATEGORY_PARAM_GROUP_LIST'" type="text" @click="$router.push(`/goods/propertyMange/category/params?id=${item.id}`)">参数</el-button>
                </template>
                <el-button type="text" @click.stop="handleDetail(item, j)">详情</el-button>
                <el-button v-np="'CATEGORY_UPDATE'" type="text" @click.stop="handleEdit(item, j)">编辑</el-button>
                <el-button v-np="item.enable ? 'CATEGORY_DISABLE' : 'CATEGORY_ENABLE'" type="text" @click.stop="handleStatus(item,j)">{{item.enable?'停用':'启用'}}</el-button>
                <el-button v-np="'CATEGORY_DEL'" type="text" @click.stop="handleDelete(item, j)" style="color:#D9001B">删除</el-button>
              </div>
            </div>
          </div>
          <div v-else class="no-data">
            暂无分类
          </div>
        </el-card>
      </el-col>
      <el-col :span="24" class="is-select">
        当前选择：
        <template v-for="(item, index) in selectName">
          <span v-if="index !== 0" :key="index"> &gt; </span>
          {{ item }}
        </template>
      </el-col>
    </el-row>
    <edit-category-dialog :visible.sync="dialogCateVisible" :formInfo="dialogForm" :option="dialogCateOption" @update='getList'></edit-category-dialog>
    <detail-category-dialog :visible.sync="dialogCateVisibleDetail" :formInfo="dialogForm" :option="dialogCateOption"></detail-category-dialog>
  </div>
</template>

<script>
  import EditCategoryDialog from './components/editCategory.vue'
  import DetailCategoryDialog from './components/detailCategory.vue'
  import { queryBaseCategory, updateBaseCategoryStatus, deleteBaseCategory } from '@/api/baseCategory'
  export default {
    name: 'ClassifyList',
    components: {
      EditCategoryDialog,
      DetailCategoryDialog
    },
    data() {
      return {
        classList: [], // 已选分类 id
        disabledList: [], // 已选分类是否启用
        transfer: [], // 分类列表
        selectName: [], // 已选分类名称
        dialogForm: {}, // 弹窗信息
        dialogCateVisible: false, // 弹窗状态
        dialogCateVisibleDetail: false,
        dialogCateOption: [], // 弹窗的下拉框
        keyword: ['', '', '']
      }
    },
    created() {
      this.getList(0)
    },
    methods: {
      async getList(index, id) {
        await queryBaseCategory({
          parentId: id || null
        }).then(res => {
          if (res.code === 200) {
            this.$set(this.transfer, [index], res.result)
          }
          if (res.result && res.result.length > 0) {
            this.$set(this.classList, [index], this.transfer[index][0].id)
            this.$set(this.selectName, [index], this.transfer[index][0].name)
            this.$set(this.disabledList, [index], this.transfer[index][0].enable)
          }
          if (index > 2) {
            return
          } else {
            if (this.transfer[index] && this.transfer[index].length > 0) {
              this.getList(index + 1, this.transfer[index][0].id)
            } else {
              return
            }
          }
        })
        return this.transfer
      },
      // 新建分类
      handleAdd(index) {
        if (index > 0) {
          this.dialogCateOption = this.transfer[index - 1]
        }
        this.dialogCateVisible = true
        // 获取父级分类信息
        let parentInfo = this.dialogCateOption.filter(item => item.id === this.classList[index - 1])
        this.dialogForm = {
          id: '',
          parentId: this.classList[index - 1] || '',
          name: '',
          sort: 0,
          index: index,
          merchantCategoryFlag: false,
          groupReceiveTime: parentInfo.length > 0 ? parentInfo[0].groupReceiveTime : 24,
          groupAfterSaleTime: parentInfo.length > 0 ? parentInfo[0].groupAfterSaleTime : 24
        }
      },
      // 选择了选项
      handleClass(item, index) {
        if (this.classList[index] === item.id) return
        // 删除后面的已选数据
        this.classList.splice(index, 3)
        this.selectName.splice(index, 3)
        this.disabledList.splice(index, 3)
        this.transfer.splice(index + 1, 3)
        // 设置对应选择的ID
        this.$set(this.classList, [index], item.id)
        this.$set(this.selectName, [index], item.name)
        this.$set(this.disabledList, [index], item.enable)
        if (index === 2) return
        this.getList(index + 1, item.id)
      },
      // 停用和启用
      handleStatus(item, index) {
        this.$confirm(item.enable ? '停用后该分类下的商品和分类将不会展示，确定要停用吗？' : '启用分类后将会在前端展示分类，确定要启用分类吗？', '提示', {
          confirmButtonText: item.enable ? '确定停用' : '确定启用',
          cancelButtonText: '我再想想'
        }).then(() => {
          updateBaseCategoryStatus({ id: item.id, status: !item.enable }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message)
              item.enable = !item.enable
              this.$set(this.disabledList, [index], item.enable)
            }
          })
        })
      },
      // 详情
      handleDetail(item, index) {
        if (index > 0) {
          this.dialogCateOption = this.transfer[index - 1]
        }
        this.dialogForm = Object.assign(item, { parentId: this.classList[index - 1] || '', index })
        this.dialogCateVisibleDetail = true
      },
      // 编辑
      handleEdit(item, index) {
        if (index > 0) {
          this.dialogCateOption = this.transfer[index - 1]
        }
        this.dialogForm = Object.assign(item, { parentId: this.classList[index - 1] || '', index })
        this.dialogCateVisible = true
      },
      // 删除
      handleDelete(row, index) {
        this.$confirm('删除后该分类不恢复，确定要删除分类吗？', '提示', {}).then(() => {
          deleteBaseCategory(row.id).then(res => {
            if (res.code === 200) {
              let parentId = this.classList[index - 1]
              this.$message.success(res.message)
              this.getList(index, parentId)
            }
          })
        })
      },
      // 搜索
      handleSearch(index) {
        const { keyword, classList } = this
        let parentId = index === 0 ? '' : classList[index - 1]
        queryBaseCategory({ parentId, keyword: keyword[index] }).then(res => {
          if (res.code === 200) {
            this.$set(this.transfer, [index], res.result)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .app-container{
    .top-search-bar{
      display: flex;
      /deep/ .el-input-group{
        width: calc(100% - 112px);
      }
    }
    .list-box{height:500px;overflow: auto;margin-top:20px;
      .item {
        padding: 5px 10px;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        /deep/ .el-button{padding: 0;}
        .item-name{width:33%;}
        .item-status{width:22%;}
        .btn-box{width:50%;flex-grow:1;text-align: right;
          button{display: none;}
        }
        &:hover {
          background: #EBEEF5;
          color: #409eff;
          .btn-box{
            button{display: inline;}
          }
        }

        &.active {
          background: #EBEEF5;
          color: #409eff;
          .btn-box{display: block;}
        }
      }
    }
    .is-select{font-size:14px;color:#909399;margin-bottom:10px;padding-top:20px;}
  }
  .no-data{
    height:520px;
    text-align: center;
    padding: 20px 0;
    color: #999;
  }
  .el-button+.el-button{
    margin-left: 0;
  }
</style>
