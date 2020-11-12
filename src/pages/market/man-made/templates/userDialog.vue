<template>
  <div class="userDialog">
    <el-dialog
      title="用户选择"
      :visible.sync="dialogVisible"
      width="75%">
      <div class="body">
        <el-card class="search-content">
          <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
            <el-form-item label="用户编号" class="" prop="memberCode.value">
              <el-input v-model="form.memberCode.value" placeholder="用户编号"></el-input>
            </el-form-item>
            <el-form-item label="用户手机" prop="memberPhone.value">
              <el-input v-model="form.memberPhone.value" placeholder="用户手机"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickName.value">
              <el-input v-model="form.nickName.value" placeholder="昵称"></el-input>
            </el-form-item>
            <el-form-item label="用户标签" prop="tag">
              <el-select v-model="form.tag" multiple clearable placeholder="请选择" :multiple-limit='3' @change="handleChangeTags">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="item in labelOptions" :key="item.value" :label="item.describe" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="search-btn">
            <el-button type="primary" size="mini" @click="handleSearch">搜索</el-button>
            <el-button type="default" size="mini" @click="handleReset">重置</el-button>
          </div>
        </el-card>
        <el-table :data="dataList" size="mini" @selection-change="handleSelectionChange" ref="multipleTable">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="memberCode" label="用户编号"></el-table-column>
          <el-table-column prop="memberPhone" label="用户手机"></el-table-column>
          <el-table-column prop="nickName" label="昵称"></el-table-column>
          <el-table-column label="终端来源" prop="terminalType" >
            <template v-slot:default="{row}">{{row['terminalType'] | statusDescrible}}</template>
          </el-table-column>
          <el-table-column prop="label" label="用户标签" :formatter="(row)=>formatNoneValue(row['label'])">
            <template v-slot:default="{ row }">{{row.labels | labels}}</template>
          </el-table-column>
          <el-table-column label="注册时间" prop="createTime" />
          <el-table-column label="最后登录时间" prop="updateTime"></el-table-column>
        </el-table>
        <pagination
          :current="currentPage"
          :total="totalCount"
          :pageSize="pageSize"
          @onPageChange="onPageChange"
          @onSizeChange="onSizeChange"
        />
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="onChange">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import searchTool from '@/utils/searchTool'
import Pagination from '@/components/Pagination'
import { MatchType, DataType } from '@/constants/search'
import { deepClone } from '@/utils/util'
import { reqUserList, fetchUserLabesList } from '@/api/user'
function getTimestamp() {
  const date = new Date().getTime() / 1000
  return parseInt(date.toString(), 10)
}
export default {
  components: { Pagination },
  data() {
    return {
      dialogVisible: false,
      labelOptions: [],
      form: {
        memberCode: { value: '', name: 'memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        nickName: { value: '', name: 'nickName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        label: { value: '', name: 'memberLabels.labelType', matchType: MatchType.IN, type: DataType.LISTENUM },
        tag: []
      },
      dataList: [],
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      searches: [],
      multipleSelection: []
    }
  },
  created() {
    this.identifier = getTimestamp()
  },
  mounted() {
    this.handleDataList()
    this.handleTags()
  },
  filters: {
    labels(label) {
      let str = ''
      if (label && label.length) {
        let arr = label.filter(item => item.describe !== '无' && item.describe !== '未知' && item.describe !== undefined)
        arr.map((item, index) => {
          if (index < 3) {
            if (index === 0) {
              str += item.describe
            } else {
              str += ',' + item.describe
            }
          }
        })
        if (arr.length > 3) str += ',...'
        return str
      } else {
        return '-'
      }
    }
  },
  methods: {
    handleSearch() {
      this.currentPage = 1
      this.searches = searchTool(deepClone(this.form))
      this.handleDataList()
    },
    handleDataList() {
      reqUserList({
        searchs: this.searches.length ? JSON.stringify(this.searches) : null,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc'
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs
          this.totalCount = res.result.totalCount
        }
      })
    },
    onPageChange(page) {
      this.currentPage = page
      this.handleDataList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleDataList()
    },
    handleTags() {
      fetchUserLabesList().then(res => {
        if (res.code === 200) {
          this.labelOptions = res.result || []
        } else {
          this.labelOptions = []
        }
      })
    },
    handleChangeTags(val) {
      if (val && val.length) {
        this.form.label.value = 'member.LabelType_' + val.join(',')
      }
    },
    showDialog() {
      this.dialogVisible = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleReset() {
      this.form.label.value = ''
      this.$refs['form'].resetFields()
    },
    onChange() {
      this.$refs['multipleTable'].clearSelection()
      this.dialogVisible = false
    },
    handleAdd() {
      this.$emit('add', this.multipleSelection)
    }
  }
}
</script>
<style scoped lang="scss">
.search-content{
  /deep/ .el-form{display: flex;flex-wrap: wrap;
    .el-form-item{width:33%;
      .el-select{width:100%;}
    }
  }
  .search-btn{text-align: right;}
}
</style>