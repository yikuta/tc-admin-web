<template>
  <div class="review-detail">
    <content-area contentTitle="当前状态">
      <template v-if="status === REVIEW_STATUS.wait">
        <span class="red">已提交入驻资料，等待审核</span>
        <p class="ft-13">请核对入驻资料是否符合要求</p>
        <el-button
          size="small"
          type="primary"
          plain
          @click="handleAgree"
        >同意</el-button>
        <el-button size="small" type="primary" plain @click="dialogVisible = true">拒绝</el-button>
      </template>
      <template v-if="status === REVIEW_STATUS.pass">
        <span class="red">审核成功</span>
      </template>
      <template v-if="status === REVIEW_STATUS.refuse">
        <p class="red">审核拒绝</p>
        <span>拒绝原因：{{fetchInfo.cause || '无'}}</span>
      </template>
    </content-area>
    <content-area contentTitle="团长信息">
      <column-table :configList="baseInfo" :fetchInfo="fetchInfo"></column-table>
    </content-area>
    <content-area contentTitle="自提信息">
      <column-table :configList="selfInfo" :fetchInfo="fetchInfo"></column-table>
    </content-area>
    <content-area contentTitle="申请说明">
      <column-table :configList="applyInfo" :fetchInfo="fetchInfo"></column-table>
    </content-area>
    <content-area contentTitle="BD人员" v-if="fetchInfo.regimentalAuditType && fetchInfo.regimentalAuditType.value === 2">
      <column-table :configList="BDInfo" :fetchInfo="fetchInfo"></column-table>
    </content-area>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <p>请填写审核拒绝的原因：</p>
      <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="cause" maxlength="50"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="small" @click="confirmRefuse" :loading="loadingRefuse">确 定</el-button>
        <el-button @click="handleClose" size="small">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="审核" :visible.sync="dialogSuccessVisible" width="30%" :before-close="handleSuccessClose">
      <p>绑定BD人员：</p>
      <el-select
        v-model="selectedId"
        filterable
        clearable
        remote
        style="width:100%"
        reserve-keyword
        placeholder="请输入"
        :remote-method="remoteMethod"
        :loading="loading"
        ref='select'>
        <el-option
          v-for="item in options"
          :key="item.id"
          :label="item.fullName"
          :value="item.id">
          <span>{{ item.fullName }} ({{item.phone}})</span>
        </el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleSuccessClose" size="small">取 消</el-button>
        <el-button type="primary" size="small" @click="confirmChange" :loading="btnLoading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ContentArea from '@/components/ContentArea'
import ColumnTable from '@/components/ColumnTable'
import { REVIEW_STATUS } from './config'
import {
  updateAuditRegimental_api,
  regimental_findInfo_api,
  regimental_findUsers_api
} from '@/api/leader'
export default {
  components: {
    ContentArea,
    ColumnTable
  },
  data() {
    return {
      REVIEW_STATUS,
      dialogVisible: false,
      dialogSuccessVisible: false,
      cause: '',
      loadingRefuse: false,
      loading: false,
      btnLoading: false,
      options: [],
      fetchInfo: {},
      baseInfo: [
        {
          label: '团长姓名',
          key: 'name'
        },
        {
          label: '团长手机号',
          key: 'phoneNumber'
        },
        {
          label: '身份证照片',
          key: ['idCardFront', 'idCardContrary'],
          type: 'img'
        },
        {
          label: '微信号',
          key: 'wxChatNumber'
        },
        {
          label: '群人数',
          key: 'groupNum',
          unit: '人'
        }
      ],
      selfInfo: [
        {
          label: '自提点名称',
          key: 'locationName'
        },
        {
          label: '自提点门头照',
          key: ['locationHead'],
          type: 'img'
        },
        {
          label: '入驻城市',
          key: ['province', 'city', 'district'],
          type: 'concat'
        },
        {
          label: '自提点地址',
          key: 'site'
        }
      ],
      applyInfo: [
        {
          label: '申请说明',
          key: 'remark'
        }
      ],
      BDInfo: [
        {
          label: 'BD人员',
          key: ['employee', 'employeePhone'],
          type: 'brackets'
        }
      ],
      selectedId: ''
    }
  },
  computed: {
    status() {
      return this.$route.query.status
    },
    id() {
      return this.$route.query.id
    }
  },
  methods: {
    handleAgree() {
      this.dialogSuccessVisible = true
    },
    confirmAgree(info) {
      this.btnLoading = true
      return updateAuditRegimental_api({
        id: this.id,
        regimentalAuditType: 'SUCCESS',
        employee: info[0].fullName,
        employeePhone: info[0].phone
      })
        .then(res => {
          this.btnLoading = false
          if (res.code === 200) {
            this.fetchDetail()
            this.handleSuccessClose()
            this.$message.success('完成通过')
            this.$router.go(-1)
          }
        })
        .finally(() => {
          this.loadingConfirm = false
          this.btnLoading = false
        })
    },
    confirmRefuse() {
      if (!this.cause) {
        this.$message.error('请填写拒绝审核的原因')
        return
      }
      this.loadingRefuse = true
      let { id, cause } = this
      return updateAuditRegimental_api({
        id,
        cause,
        regimentalAuditType: 'FAILURE'
      })
        .then(res => {
          if (res.code === 200) {
            this.fetchDetail()
            this.$message.success('已拒绝')
            this.$router.go(-1)
            this.handleClose()
          }
        })
        .finally(() => {
          this.loadingRefuse = false
        })
    },
    fetchDetail() {
      return regimental_findInfo_api({ memberId: this.id }).then(res => {
        let { result, code } = res
        if (code === 200) {
          result.idCardContrary = result.idCardContrary.fullPath
          result.idCardFront = result.idCardFront.fullPath
          result.locationHead = result.locationHead.fullPath
          this.fetchInfo = result || {}
        }
      })
    },
    handleClose() {
      this.cause = ''
      this.dialogVisible = false
    },
    handleSuccessClose() {
      this.selectedId = ''
      this.dialogSuccessVisible = false
    },
    remoteMethod(query) {
      if (query !== '') {
        this.handleUsersList(query)
      }
    },
    handleUsersList(query) {
      this.loading = true
      regimental_findUsers_api(query).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.options = res.result
        } else {
          this.options = []
        }
      }).catch(() => {
        this.loading = false
      })
    },
    confirmChange() {
      let info = this.options.filter(item => item.id === this.selectedId) || []
      if (info.length) {
        this.confirmAgree(info)
        // updateAuditRegimental_api({
        //   employee: info[0].fullName,
        //   employeePhone: info[0].phone,
        //   id: this.id
        // }).then(res => {
        //   this.btnLoading = false
        //   if (res.code === 200) {
        //     this.handleClose()
        //     this.$message.success('BD变更成功')
        //     if (this.$refs.tableRef) {
        //       this.$refs.tableRef.getList()
        //     }
        //   }
        // }).catch(() => {
        //   this.btnLoading = false
        // })
      }
    }
  },
  created() {
    this.fetchDetail()
  }
}
</script>

<style lang="scss" scoped>
.red {
  color: red;
  font-weight: bold;
}
.ft-13 {
  font-size: 13px;
}
</style>