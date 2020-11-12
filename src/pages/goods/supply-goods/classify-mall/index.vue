<template>
  <div class="app-container">
    <!-- <el-card style="margin-bottom:10px">
      <search-card @query='handleSearchType'/>
    </el-card> -->
    <el-row :gutter="8">
      <el-col :span="12" v-for="(box, j) in ['一', '二']" :key="j">
        <el-card class="card-">
          <div class="top-search-bar">
            <el-input placeholder="请输入搜索关键字" class="input-with-select" size="mini" v-model='keyword[j]' clearable>
              <el-button slot="append" icon="el-icon-search" @click="handleSearch(j)"></el-button>
            </el-input>
            <el-button
              type="primary"
              size="mini"
              @click="handleAdd(j)"
              v-np="j === 0 ?'GYS_CHANNEL_CATE_ONE_ADD':'GYS_CHANNEL_CATE_TWO_ADD'"
              :disabled="j !== 0 && !classList[j - 1] || (j > 0 && !disabledList[j - 1])"
              style="margin-left:8px;width:104px">添加{{ box }}级分类</el-button>
          </div>
          <div class="list-box" v-if="transfer.length>0 && transfer[j] && transfer[j].length>0">
            <div v-for="(item, index) in transfer[j]" :key="index" class="text item" :class="[{'active': classList[j] && item.id === classList[j]}]"
                 @click="handleClass(item, j)">
              <div class="item-name">{{ item.name }}</div>
              <div class="item-status" :style="{'color':item.enable?'#95F204':'#D9001B'}">{{item.enable?'启用':'停用'}}</div>
              <div class="btn-box">
                <template v-if="j === 2">
                  <el-button type="text" @click="$router.push(`/goods/propertyMange/category/specs?id=${item.id}`)">规格</el-button>
                  <el-button type="text" @click="$router.push(`/goods/propertyMange/category/params?id=${item.id}`)">参数</el-button>
                </template>
                <el-button v-np="'GYS_CHANNEL_CATE_UPDATE'" type="text" @click.stop="handleEdit(item, j)">编辑</el-button>
                <el-button v-np="item.enable ? 'GYS_CHANNEL_CATE_DISABLE' : 'GYS_CHANNEL_CATE_ENABLE'" type="text" @click.stop="handleStatus(item, j)">{{item.enable?'停用':'启用'}}</el-button>
                <el-button v-np="'GYS_CHANNEL_CATE_DEL'" type="text" @click.stop="handleDelete(item, j)" style="color:#D9001B">删除</el-button>
              </div>
            </div>
          </div>
          <div class="list-box" style="text-align:center" v-else>暂无分类</div>
        </el-card>
      </el-col>
      <el-col :span="24" class="is-select">
        当前选择：
        <template v-for="(item, index) in selectName">
          <span v-if="index !== 0"> &gt; </span>
          {{ item }}
        </template>
      </el-col>
    </el-row>
    <edit-category-dialog :visible.sync="dialogCateVisible" :formInfo="dialogForm" :option="dialogCateOption" @update='getList'></edit-category-dialog>
  </div>
</template>

<script>
  import EditCategoryDialog from './components/editCategory.vue'
  import SearchCard from './components/searchCard'
  import { getChannelCategoryList, updateChannelCategoryStatus, deleteChannelCategory } from '@/api/showClassify.js'
  export default {
    name: 'assembleGoodShowClassify',
    components: {
      EditCategoryDialog,
      SearchCard
    },
    data() {
      return {
        classList: [], // 已选分类 id
        transfer: [], // 分类查询列表
        dataList: [], // 所有的分类列表
        selectName: [], // 已选分类名称
        dialogForm: {}, // 弹窗信息
        dialogCateVisible: false, // 弹窗状态
        dialogCateOption: [], // 弹窗的下拉框
        keyword: ['', ''],
        businessNo: 3,
        disabledList: [] // 已选分类是否启用
      }
    },
    mounted() {
      this.getList(0)
    },
    methods: {
      async getList(index, id) {
        await getChannelCategoryList({
          parentId: id || null,
          businessNo: this.businessNo,
          disabled: true
        }).then(res => {
          if (res.code === 200) {
            this.$set(this.transfer, [index], res.result || [])
            this.$set(this.dataList, [index], res.result || [])
          }
          if (res.result && res.result.length > 0) {
            this.$set(this.classList, [index], this.transfer[index][0].id)
            this.$set(this.selectName, [index], this.transfer[index][0].name)
            this.$set(this.disabledList, [index], this.transfer[index][0].enable)
          }
          if (index > 1) {
            return
          } else {
            if (this.transfer[index] && this.transfer[index].length > 0) {
              this.getList(index + 1, this.transfer[index][0].id)
            } else {
              this.transfer.splice(index + 1)
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
        this.dialogForm = {
          id: '',
          parentId: this.classList[index - 1] || '',
          name: '',
          sort: 0,
          index
        }
      },
      // 选择了选项
      handleClass(item, index) {
        if (this.classList[index] === item.id) return
        // 删除后面的已选数据
        this.classList.splice(index, 3)
        this.selectName.splice(index, 3)
        this.disabledList.splice(index, 3)
        // 设置对应选择的ID
        this.$set(this.classList, [index], item.id)
        this.$set(this.selectName, [index], item.name)
        this.$set(this.disabledList, [index], item.enable)
        if (index === 2) return
        this.getList(index + 1, item.id)
      },
      // 停用和启用
      handleStatus(item, index) {
        updateChannelCategoryStatus({ id: item.id, status: !item.enable }).then(res => {
          if (res.code === 200) {
            this.$message.success(res.message)
            item.enable = !item.enable
            this.$set(this.disabledList, [index], item.enable)
          }
        })
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
        this.$confirm('删除后该分类不能恢复，确定要删除分类吗？', '提示', {}).then(() => {
          deleteChannelCategory(row.id).then(res => {
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
        const { keyword, dataList } = this
        if (keyword[index]) {
          if (dataList[index] && dataList[index].length > 0) {
            let arr = dataList[index].filter(item => item.name.includes(keyword[index])) || []
            this.$set(this.transfer, [index], arr)
          }
        } else {
          this.$set(this.transfer, [index], this.dataList[index])
        }
      },
      handleSearchType(form) {
        this.businessNo = form.businessNo
        this.getList(0)
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
        .item-status{width:10%;}
        .btn-box{width:33%;flex-grow:1;text-align: right;
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
</style>
