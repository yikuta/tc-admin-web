<template>
  <div class="app-container">
    <el-card class="search-content">
      <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
        <el-form-item label="发起人">
          <!-- <el-input v-model="form.initiator.value"></el-input> -->
          <el-autocomplete v-model="form.sponsor.value" :fetch-suggestions="querySearch" :trigger-on-focus="false" value-key="fullName" value="fullName" :debounce="500" @select="handleSelect" placeholder="请输入发起人"></el-autocomplete>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="form.status.value" placeholder="请选择审核状态">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button type="primary" size="mini" @click="hanldeBatch" v-np="'CPN_MANUAL_QUEUE_BATCH_AUDIT'">批量处理</el-button>
        <el-button type="primary" size="mini" @click="handleSubmit">查询</el-button>
        <el-button type="default" size="mini" @click="reset">清空</el-button>
      </div>
    </el-card>
    <el-table :data="tableData" size="mini" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" :selectable="selectable"></el-table-column>
      <el-table-column prop="auditCode" label="审核编号"></el-table-column>
      <el-table-column prop="sourceCode" label="队列编号"></el-table-column>
      <el-table-column prop="queueRuleNum" label="发放券码数"></el-table-column>
      <el-table-column prop="memberTotal" label="发券对象"></el-table-column>
      <el-table-column prop="totalAmount" label="总优惠金额"></el-table-column>
      <el-table-column prop="instructions" label="发券说明"></el-table-column>
      <el-table-column label="查看详情">
        <template slot-scope="scope">
          <el-button type="text" @click="$router.push({ path: '/market/manMade/add', query: { type: 'show', queueCode: scope.row.sourceCode, version: scope.row.version }})">点击查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="sponsor" label="发起人">
        <template slot-scope="scope">
          <span v-show="scope.row.sponsor">{{scope.row.sponsor}}</span>
          <span v-show="!scope.row.sponsor">——</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="发起时间"></el-table-column>
      <el-table-column prop="auditor" label="审核人">
        <template slot-scope="scope">
          <span v-show="scope.row.auditor">{{scope.row.auditor}}</span>
          <span v-show="!scope.row.auditor">——</span>
        </template>
      </el-table-column>
      <el-table-column prop="auditStatus.describe" label="审核状态"></el-table-column>
      <el-table-column prop="auditTime" label="处理时间">
        <template slot-scope="scope">
          <span v-show="scope.row.auditTime">{{scope.row.auditTime}}</span>
          <span v-show="!scope.row.auditTime">——</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-link v-show="row.auditStatus.value == 1" :disabled="disabledBtn" type="primary" @click="pass(row)" v-np="'CPN_MANUAL_QUEUE_BATCH_PASS'">通过</el-link>
          <el-link v-show="row.auditStatus.value == 1" :disabled="disabledBtn" type="primary" @click="reject(row)" v-np="'CPN_MANUAL_QUEUE_BATCH_REJECT'">驳回</el-link>
        </template>
      </el-table-column>
    </el-table>
    <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
    <div class="verify-dialog">
      <el-dialog
        :title="verify == 'AGREED' ? '审核通过' : '审核驳回'"
        :visible.sync="dialogVisible"
        destroy-on-close
        width="30%">
          <div v-if="verify == 'AGREED'">
            请确认是否通过审核
          </div>
          <div v-else>
            请输入驳回原因
            <el-input type="textarea" :rows="5" placeholder="请输入驳回原因" maxlength="200" v-model="rejectReason"></el-input>
          </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="disabledBtn" @click="save">{{verify == 'AGREED' ? '通 过' : '驳 回'}}</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="批量审核"
        :visible.sync="batchDialogVisible"
        destroy-on-close
        width="30%">
          <div>
            批量审核风险较大，请慎重操作
          </div>
          <div class="auditRadio">
            操作：
            <el-radio v-model="batchRadio" label="AGREED">通过</el-radio>
            <el-radio v-model="batchRadio" label="REJECTED">驳回</el-radio>
          </div>
          <div>
            <el-input v-show="batchRadio == 'REJECTED'" type="textarea" :rows="5" placeholder="请输入驳回原因" maxlength="200" v-model="rejectReason"></el-input>
          </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="batchDialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="disabledBtn" @click="batchSave">{{batchRadio == 'AGREED' ? '通 过' : '驳 回'}}</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  import Pagination from '@/components/Pagination'
  import { reqUserList, reqQueueAudit, reqQueueBatchAudit } from '@/api/coupon'
  export default {
    name: 'man-made',
    components: {
      Pagination
    },
    data() {
      return {
        couponData: [],
        form: {
          sponsor: { value: '', name: 'sponsor', matchType: MatchType.CONTAIN, type: DataType.STRING },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        option: {
          status: [
            { id: 'promotion.AuditStatus_1', value: '待审核' },
            { id: 'promotion.AuditStatus_2', value: '通过' },
            { id: 'promotion.AuditStatus_3', value: '驳回' }
          ]
        },
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        pagePhase: [10, 20, 30, 50],
        totalCount: 0,
        selection: [],
        verify: '', // 通过或者驳回
        dialogVisible: false,
        batchDialogVisible: false,
        rejectReason: '', // 驳回理由
        batchRadio: 'AGREED', // 批量审核通过或驳回
        clickBtnItem: {},
        disabledBtn: false
      }
    },
    mounted() {
      this.$nextTick(() => {
        // 获取商品商品列表
        this.handleSubmit()
      })
    },
    methods: {
      handleSubmit() {
        let req = searchTool(JSON.parse(JSON.stringify(this.form)))
        this._reqQueueAudit(req)
      },
      reset() {
        this.form = {
          sponsor: { value: '', name: 'sponsor', matchType: MatchType.CONTAIN, type: DataType.STRING },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM }
        }
      },
      pass(item) {
        this.verify = 'AGREED'
        this.dialogVisible = true
        this.clickBtnItem = item
      },
      reject(item) {
        this.verify = 'REJECTED'
        this.dialogVisible = true
        this.clickBtnItem = item
      },
      save() {
        // 请求通过或驳回接口
        if (this.verify === 'REJECTED' && this.rejectReason === '') {
          this.$message({
            message: '请填写驳回原因',
            type: 'error'
          })
          return false
        }
        let auditCodes = []
        auditCodes.push(this.clickBtnItem.auditCode)
        let data = {
          auditCodes: auditCodes,
          auditStatus: this.verify,
          auditor: '',
          auditorId: 1,
          reason: this.rejectReason
        }
        this._reqQueueBatchAudit(data)
      },
      batchSave() {
        // 请求通过或驳回接口
        if (this.batchRadio === 'REJECTED' && this.rejectReason === '') {
          this.$message({
            message: '请填写驳回原因',
            type: 'error'
          })
          return false
        }
        let auditCodes = []
        this.selection.map((item) => {
          auditCodes.push(item.auditCode)
        })
        let data = {
          auditCodes: auditCodes,
          auditStatus: this.batchRadio,
          auditor: '',
          auditorId: 1,
          reason: this.rejectReason
        }
        this._reqQueueBatchAudit(data)
      },
      hanldeBatch() {
        // console.log('批量处理')
        if (this.selection.length === 0) {
          this.$message({
            message: '请选择需求审核的优惠券',
            type: 'error'
          })
          return false
        }
        this.batchDialogVisible = true
      },
      handleSelectionChange(val) {
        this.selection = val
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.currentPage = 1
        this.handleSubmit()
      },
      handleCurrentChange(page) {
        this.currentPage = page
        this.handleSubmit()
      },
      querySearch(queryString, cb) {
        let obj = {}
        obj.value = { value: queryString, name: 'fullName', matchType: MatchType.CONTAIN, type: DataType.STRING }
        let req = searchTool(JSON.parse(JSON.stringify(obj)))
        this._reqUserList(req, cb)
      },
      handleSelect() {
        // 选择结果
      },
      _reqQueueBatchAudit(data) {
        // 审核
        this.disabledBtn = true
        return reqQueueBatchAudit(data).then((res) => {
          if (res.code === 200) {
            this.handleSubmit()
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.rejectReason = ''
            this.batchRadio = 'AGREED'
            this.dialogVisible = false
            this.batchDialogVisible = false
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
          this.disabledBtn = false
        })
      },
      _reqQueueAudit(data) {
        return reqQueueAudit({
          searchs: JSON.stringify(data),
          pageNo: this.currentPage,
          pageSize: this.pageSize,
          orderby: 'createTime',
          sort: 'desc'
        }).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.currentPage = result.pageNo
            this.totalCount = result.totalCount
            this.tableData = result.itemVOs || []
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        })
      },
      _reqUserList(data, cb) {
        return reqUserList({
          searchs: JSON.stringify(data),
          pageSize: 5,
          pageNo: 1,
          orderby: 'createTime',
          sort: 'desc'
        })
          .then(res => {
            if (res.code === 200) {
              this.restaurants = res.result.itemVOs
              cb(res.result.itemVOs)
            } else {
              // this.$message({
              //   message: res.message,
              //   type: 'error'
              // })
            }
          })
      },
      selectable(row) {
        if (row.auditStatus.value === 1) {
          return 1
        } else {
          return 0
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .coupon-content {
    margin-bottom: 8px;
  }
  .title {
    margin-bottom: 12px;
  }
  .search-content{
    margin:20px 0;
    /deep/ .el-form{display: flex;flex-wrap: wrap;
      .el-form-item{width:33%;
        .el-select{width:100%;}
      }
      .el-autocomplete {width: 100%;}
    }
    .search-btn{
      text-align: right;
    }
  }
</style>
