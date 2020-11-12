<template>
  <div class="uploadDialog">
    <el-dialog
      title="选择文件"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="60%">
      <div class="body">
        <div>
          <div class="top">
            <el-upload
              class="upload-demo"
              action="upload"
              :http-request="uploadRequest"
              multiple
              :show-file-list="false">
                <el-button size="small" type="primary">选择文件</el-button>
            </el-upload>
            <span>{{file}}</span>
          </div>
          <div v-show="successNum || failedNum">
            成功：{{successNum}}
            失败：{{failedNum}}
          </div>
        </div>
        <el-progress v-show="progressShow" :text-inside="true" :stroke-width="12" :percentage="percentage" :status="status"></el-progress>
        <span v-show="dataList == 'nothing'">没有读取到有效数据</span>
        <div class="table" v-show="successNum || failedNum">
          <el-table :data="tableData" size="mini">
            <el-table-column prop="memberCode" label="用户编号" :formatter="(row)=>formatNoneValue(row['memberCode'])"></el-table-column>
            <el-table-column prop="memberPhone" label="用户手机"></el-table-column>
            <el-table-column prop="nickName" label="昵称" :formatter="(row)=>formatNoneValue(row['nickName'])"></el-table-column>
            <el-table-column label="终端来源" prop="terminalType" >
            <template v-slot:default="{row}">{{row['terminalType'] | statusDescrible}}</template>
            </el-table-column>
            <el-table-column prop="label" label="用户标签">
              <template v-slot:default="{ row }">{{row.lables | labels}}</template>
            </el-table-column>
            <el-table-column label="注册时间" prop="createTime" :formatter="(row)=>formatNoneValue(row['createTime'])"/>
            <el-table-column label="最后登录时间" prop="updateTime" :formatter="(row)=>formatNoneValue(row['updateTime'])"></el-table-column>
          </el-table>
          <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="emitAdd" v-show="percentage == 100">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import { reqUpload } from '@/api/mallGoods'
import Pagination from '@/components/Pagination'
import { reqImportMemberList } from '@/api/coupon'

function getTimestamp() {
  const date = new Date().getTime() / 1000
  return parseInt(date.toString(), 10)
}

export default {
  name: 'uploadDialog',
  components: {
    Pagination
  },
  data() {
    return {
      dialogVisible: false,
      file: '',
      dataList: '',
      data: [],
      tableData: [],
      canUsePhoneList: [],
      currentPage: 1,
      pageSize: 20,
      pagePhase: [10, 20, 30, 50],
      totalCount: 0,
      progressShow: false,
      percentage: 0, // 进度条
      status: 'warning', // 进度条状态
      successNum: '',
      failedNum: ''
    }
  },
  mounted() {
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
    emitAdd() {
      // 上传确定
      this.$emit('on-save-user', this.data, this.canUsePhoneList, this.totalCount, this.successNum, this.failedNum, this.file)
      this.dialogVisible = false
      // this.file = ''
      // this.dataList = ''
      // this.data = []
      // this.tableData = []
      // this.canUsePhoneList = []
      // this.currentPage = 1
      // this.totalCount = 0
      // this.progressShow = false
      // this.percentage = 0 // 进度条
      // this.status = 'warning' // 进度条状态
      // this.successNum = ''
      // this.failedNum = ''
    },
    cancel() {
      this.dialogVisible = false
      // this.file = ''
      // this.dataList = ''
      // this.data = []
      // this.tableData = []
      // this.canUsePhoneList = []
      // this.currentPage = 1
      // this.totalCount = 0
      // this.progressShow = false
      // this.percentage = 0 // 进度条
      // this.status = 'warning' // 进度条状态
      // this.successNum = ''
      // this.failedNum = ''
    },
    showDialog() {
      this.dialogVisible = true
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
      this.getList()
    },
    handleCurrentChange(page) {
      this.currentPage = page
      this.getList()
    },
    getList() {
      this.tableData = this.data.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize)
    },
    uploadRequest(data) {
      this.progressShow = true
      this.file = data.file.name
      let reader = new FileReader()
      reader.readAsArrayBuffer(data.file)
      const _this = this
      reader.onload = function() {
        let timeout = _this.countdown()
        reqImportMemberList({ file: data.file }, { identifier: getTimestamp() }).then(res => {
          if (res.code === 200) {
            clearInterval(timeout)
            _this.percentage = 100
            _this.status = 'success'
            let result = res.result
            if (result.successNum > 0) {
              _this.dataList = 'list'
            } else {
              _this.dataList = 'nothing'
            }
            _this.canUsePhoneList = result.canUsePhoneList
            _this.tableData = result.couponQueueMemberVoList.slice(0, this.pageSize)
            _this.data = result.couponQueueMemberVoList
            _this.totalCount = result.totalNum
            _this.successNum = result.successNum
            _this.failedNum = result.failedNum
            _this.$message({
              message: '上传成功',
              type: 'success'
            })
          } else {
            _this.status = 'exception'
            clearInterval(timeout)
          }
        }).catch(() => {
          _this.status = 'exception'
          clearInterval(timeout)
          // _this.$message({
          //   type: 'error',
          //   message: '上传失败'
          // })
        })
      }
    },
    countdown() {
      let point = 90
      let _this = this
      let timeout = setInterval(() => {
        if (_this.percentage < point) {
          _this.percentage += 10
        } else {
          _this.percentage = 99
          clearInterval(timeout)
        }
      }, 1000)
      return timeout
    }
  }
}
</script>
<style scoped lang="scss">
  .uploadDialog{
    /deep/ .top {
      display: flex;
      align-items: center;
    }
  }
</style>
