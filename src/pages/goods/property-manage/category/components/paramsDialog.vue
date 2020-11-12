<template>
  <el-dialog title="关联参数" :visible.sync="dialogVisible" @close='handleCancel' :close-on-click-modal='false'>
    <el-form class="" size="small" label-width="100px">
      <el-form-item label="搜索参数">
        <el-select
          v-model="selectedId"
          filterable
          clearable
          remote
          style="width:100%"
          reserve-keyword
          placeholder="请输入参数名称进行搜索"
          :remote-method="remoteMethod"
          @change='handleChange'
          :loading="loading"
          ref='select'>
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
            <span>{{ item.paramType | paramTypeDescrible(item.name) }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <div class="items">
          <ul>
            <li v-for="(item,index) in groups" :key="item.id">
              <span class="text" :title="item.paramType | paramTypeDescrible(item.name)">{{item.paramType | paramTypeDescrible(item.name)}}</span>
              <span class="move" @click="handleRemove(item,index)">移除</span>
            </li>
          </ul>
        </div>
      </el-form-item>
    </el-form>
    <div class="btns">
      <el-button type="primary" size="small" @click="handleSave" :loading='btnLoading'>确定关联</el-button>
      <el-button type="default" size="small" @click="handleCancel">我再想想</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import { getBaseParamsList, addBaseParamOptionToCategory } from '@/api/baseCategory'
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  // 关联参数
  export default {
    name: 'paramsDialog',
    props: {
      dialogSupVisible: {
        type: Boolean,
        default: false
      },
      groupId: '',
      maxParamSort: {
        type: Number,
        default: 0
      },
      len: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        dialogVisible: false,
        loading: false,
        options: [],
        pageNo: 1,
        pageSize: 10,
        form: {
          name: { value: '', name: 'name', matchType: MatchType.CONTAIN }, // 参数名称
          enable: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN } // 启用的状态
        },
        groups: [],
        selectedId: '',
        btnLoading: false
      }
    },
    watch: {
      dialogVisible(n) {
        this.$emit('update:dialogSupVisible', n)
      },
      dialogSupVisible(n) {
        this.dialogVisible = n
        this.$nextTick(() => {
          const { select } = this.$refs
          const { debouncedOnInputChange } = select
          select.$el.querySelector('.el-input__inner').oninput = () => {
            debouncedOnInputChange()
            this.$once('hook:beforeDestory', () => {
              select.$el.querySelector('.el-input__inner').oninput = null
            })
          }
        })
      }
    },
    // mounted() {
    //   // 修复elementUI select远程搜索鼠标选择无法触发搜索的bug
    // },
    filters: {
      paramTypeDescrible(value, name) {
        return value || value === 0 ? name + '【' + value.describe + '】' : '-'
      }
    },
    methods: {
      handleParamsList() {
        const { pageNo, pageSize } = this
        this.loading = true
        getBaseParamsList({
          pageNo,
          pageSize,
          searchs: JSON.stringify(searchTool(this.form))
        }).then(res => {
          this.loading = false
          if (res.code === 200) {
            this.options = res.result.itemVOs
          } else {
            this.options = []
          }
        }).catch(() => {
          this.loading = false
        })
      },
      remoteMethod(query) {
        if (query !== '') {
          this.form.name.value = query
          this.handleParamsList()
        } else {
          this.options = []
        }
      },
      handleChange(value) {
        if (value) {
          let item = this.options.filter(item => item.id === value)
          let row = this.groups.find(item => item.id === value)
          if (row) {
            return
          }
          if (this.groups.length + this.len >= 20) {
            this.$message.error('每个分组最多只能添加20个参数哦~')
          } else {
            this.groups = this.groups.concat(item)
          }
        }
      },
      // 移除
      handleRemove(row, index) {
        this.groups.splice(index, 1)
        let item = this.options.find(item => item.id === row.id)
        if (item) {
          row.disabled = false
          if (item.id === this.selectedId) {
            this.selectedId = ''
          }
        }
      },
      handleCancel() {
        this.groups = []
        this.selectedId = ''
        this.dialogVisible = false
      },
      // 确认关联
      handleSave() {
        let ids = this.groups.map(item => item.id)
        let sorts = this.groups.map((item, index) => this.maxParamSort + index + 1)
        if (ids && ids.length > 0) {
          this.btnLoading = true
          addBaseParamOptionToCategory({
            baseParamGroupId: this.groupId,
            baseParamOptionIds: ids,
            sorts
          }).then(res => {
            this.btnLoading = false
            if (res.code === 200) {
              this.$message.success('关联参数成功~')
              this.handleCancel()
              this.$emit('update')
            }
          }).catch(() => {
            this.btnLoading = false
          })
        } else {
          this.$message.error('请选择需要关联的参数~')
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .card-list{margin: 20px 0;}
  .is-select-list{display: flex;
    .list-name{width:50%;}
    .list-op{}
  }
  .btns{
    text-align: center;
  }
  .items{
    ul{
      margin: 0;
      padding: 0;
    }
    li{
      list-style: none;
      height: 28px;
      line-height: 28px;
      .text{
        display: inline-block;
        max-width: 420px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .move{
        float: right;
        color: #169BD5;
        cursor: pointer;
      }
    }
  }
</style>
