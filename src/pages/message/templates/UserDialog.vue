<template>
  <div class="userDialog">
    <el-dialog
      title="上传查看"
      :visible.sync="dialogVisible"
      width="75%">
      <div class="body">
        <p>成功：{{uploadResult.successNum}}&nbsp;&nbsp;失败：{{uploadResult.failedNum}}</p>
        <el-table :data="dataList" size="mini">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="memberPhone" label="手机号"></el-table-column>
          <el-table-column prop="nickName" label="用户名">
            <template v-slot:default='{row}'>{{row.memberName?row.memberName:'用户不存在'}}</template>
          </el-table-column>
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
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import searchTool from '@/utils/searchTool'
import { deepClone } from '@/utils/util'
import { fetchAddMessageMembers } from '@/api/message'
import { MatchType, DataType } from '@/constants/search'
export default {
  components: {
    Pagination
  },
  props: {
    uploadResult: {
      type: Object,
      default: () => {
        return {
          totalNum: 0,
          successNum: 0,
          failedNum: 0
        }
      }
    },
    identifier: {
      type: Number,
      default: 0
    },
    channelType: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      dialogVisible: false,
      currentPage: 1,
      pageSize: 20,
      totalCount: 0,
      dataList: []
    }
  },
  watch: {
    dialogVisible(n) {
      if (n) {
        this.handleDataList()
      }
    }
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.handleDataList()
    },
    onSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.handleDataList()
    },
    handleDataList() {
      let obj = {
        channelType: { value: this.channelType, name: 'channelType', matchType: MatchType.CONTAIN, type: DataType.STRING },
        identifier: { value: this.identifier, name: 'identifier', matchType: MatchType.CONTAIN, type: DataType.STRING }
      }
      const searches = searchTool(deepClone(obj))
      fetchAddMessageMembers({
        searchs: searches.length ? JSON.stringify(searches) : null,
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        orderby: 'createTime',
        sort: 'desc',
        templateType: this.$route.query.type
      }).then(res => {
        if (res.code === 200) {
          this.dataList = res.result.itemVOs
          this.totalCount = res.result.totalCount
        }
      })
    },
    showDialog() {
      this.dialogVisible = true
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