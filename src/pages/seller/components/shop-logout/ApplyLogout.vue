<template>
  <el-dialog :visible.sync="dialogFormVisible" title="申请注销" @close='handleCancel("ruleForm")' :close-on-click-modal='false'>
    <el-form :model="form" :rules='rules' ref="ruleForm" label-width="100px" size="mini" class="logout-form">
      <el-row>
        <el-col :span="24">
          <el-form-item label="门店编码：" prop="shopCode">
            <el-row>
              <el-col :span="20">
                <el-input v-model="queryForm.shopCode.value" clearable></el-input>
              </el-col>
              <el-col :span="3" :offset="1">
                <el-button type="primary" @click="onSearch">查询</el-button>
              </el-col>
            </el-row>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="hasSeller === 2">
        <el-col :span="24">
          <el-form-item label="门店状态：">
            <p class="formText">{{status}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="门店名称：">
            <p class="formText">{{info.name}}</p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="门店地址：">
            <p class="formText">{{info.address}}</p>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="运维人员：" prop="user">
            <p class="formText"></p>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="运维手机：" prop="phone">
            <p class="formText"></p>
          </el-form-item>
        </el-col> -->
      </el-row>
      <el-row v-if="hasSeller === 1">
        <p class="no-seller">暂无此编码的门店</p>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="注销原因：" prop="applyReason">
            <el-select v-model="form.applyReason" placeholder="请选择" style="width:100%">
              <el-option v-for="item in logoutOption" :key="item.code" :label="item.name" :value="item.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="详细说明：" prop="applyDetails">
            <el-input
              type="textarea"
              placeholder="请输入详细说明"
              v-model="form.applyDetails"
              maxlength="200"
              show-word-limit
            >
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="上传图片：" prop="img">
            <p class="tip">支持jpg、png格式的文件，最多支持3张，单文件大小不超过1M</p>
            <upload-file
              type="IMAGE"
              :limit="3"
              :fileList="form.applyImgsList"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <el-button size="mini" style="width:108px" type="primary" @click="handleSubmit('ruleForm')" :loading="loading">申请注销</el-button>
      <el-button size="mini" style="width:108px" @click="handleCancel('ruleForm')">取消</el-button>
    </div>
  </el-dialog>
</template>
<script>
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
import { reqShopList, asyncWithdrawShopsLogout } from '@/api/seller'
import { findDataListByCode } from '@/api/common'
export default {
  props: ['visible'],
  components: {
    UploadFile: resolve => {
      return require(['@/components/UploadFile/index'], resolve)
    }
  },
  data() {
    return {
      queryForm: {
        enterStatus: { value: '1', name: 'enterStatus', matchType: MatchType.EQUAL, type: DataType.STRING }, // 查询审核通过的门店
        shopCode: { value: '', name: 'shopCode', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      info: {
        name: '',
        address: '',
        shopStatus: 0,
        enterStatus: 5
      },
      form: {
        applyDetails: '',
        applyImgs: [],
        applyReason: '',
        applyImgsList: []
      },
      rules: {
        applyReason: [
          { required: true, message: '请选择注销原因', trigger: 'change' }
        ],
        applyDetails: [
          { required: true, message: '请输入详细说明', trigger: 'blur' }
        ]
      },
      dialogFormVisible: false,
      logoutOption: [],
      loading: false,
      hasSeller: 0
    }
  },
  watch: {
    visible(n) {
      this.dialogFormVisible = n
    },
    dialogFormVisible(n) {
      this.$emit('update:visible', n)
    }
  },
  mounted() {
    this.handleReasonList()
  },
  computed: {
    status() {
      return this.formatEnterStatus(this.info.enterStatus) + '/' + this.formatAuditStatus(this.info.shopStatus)
    }
  },
  methods: {
    formatAuditStatus(auditStatus) {
      const status = {
        0: '待审核',
        1: '已启用',
        2: '已禁用',
        3: '销店中'
      }
      return status[auditStatus] || ''
    },
    formatEnterStatus(auditStatus) {
      const status = {
        5: '待审核',
        1: '审核通过',
        6: '被驳回'
      }
      return status[auditStatus] || ''
    },
    handleCancel(formName) {
      this.dialogFormVisible = false
      Object.keys(this.info).forEach(key => {
        this.info[key] = ''
      })
      this.$refs[formName].resetFields()
      this.hasSeller = 0
      // this.$set(this.queryForm.shopCode, 'va', '')
      this.queryForm.shopCode.value = ''
    },
    onSearch() {
      if (!this.queryForm.shopCode.value) return
      this._reqShopList(searchTool(this.queryForm))
    },
    // ***请求处理***
    _reqShopList(form) {
      return reqShopList({
        searchs: JSON.stringify(form),
        pageNo: 1,
        pageSize: 10000,
        orderby: 'createTime',
        sort: 'desc'
      })
        .then(res => {
          if (res.code === 200) {
            if (res.result && res.result.itemVOs && res.result.itemVOs[0]) {
              Object.keys(this.info).forEach(key => {
                this.info[key] = res.result.itemVOs[0][key]
              })
              this.hasSeller = 2
            } else {
              this.hasSeller = 1
            }
          }
        })
        .catch(() => {
          this.tableData = []
          this.currentPage = 1
          this.totalCount = 0
          this.hasSeller = 1
        })
    },
    handleSubmit(formName) {
      if (this.queryForm.shopCode.value) {
        const { applyDetails, applyReason, applyImgsList } = this.form
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.loading = true
            asyncWithdrawShopsLogout({
              shopCode: this.queryForm.shopCode.value,
              applyDetails,
              applyReason,
              applyImgs: applyImgsList.map(item => item.fileUrl)
            }).then(res => {
              this.loading = false
              if (res.code === 200) {
                this.$message.success(res.message || '申请注销成功')
                this.handleCancel('ruleForm')
                this.$emit('update')
              }
            }).catch(() => {
              this.loading = false
            })
          } else {
            return false
          }
        })
      } else {
        this.$message.error('请输入门店编码进行查询')
      }
    },
    // 获取注销原因
    handleReasonList() {
      findDataListByCode('shop_withdraw_apply').then(res => {
        if (res.code === 200) {
          this.logoutOption = res.result || []
        } else {
          this.logoutOption = []
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.formText{
  margin: 0;
}
.tip{
  margin: 0;
  font-size: 12px;
  color: #999999;
}
.btns{
  text-align: center;
}
.logout-form{
  position: relative;
}
.no-seller{
  position: absolute;
  left: 100px;
  top: -30px;
  color: #F56C6C;
}
</style>
