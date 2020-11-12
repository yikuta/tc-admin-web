<template>
  <div class="app-container">
    <el-form label-width="100px" :rules="rules" ref="manMade" :model="form">
      <div class="title">队列基本信息</div>
      <el-form-item label="队列名称" prop="queueName">
        <el-input class="input-width" size="small" v-model="form.queueName" :disabled="showDisabled" placeholder="请输入队列名称"></el-input>
      </el-form-item>
      <el-form-item label="发券说明" prop="instructions">
        <el-input class="input-width" type="textarea" :rows="4" size="small" v-model="form.instructions" :disabled="showDisabled" placeholder="请说明审核原因/目的，便于审核人员决策"></el-input>
      </el-form-item>
      <div class="title">选择优惠券</div>
      <template v-for="(item, index) in form.queueRuleDetails">
        <div class="discountItem" :key="index">
          <el-form-item :prop="'queueRuleDetails.'+index+'.coupon'" :rules="rules.coupon" label="设置优惠券">
            <el-select size="small" v-model="item.couponCode" filterable placeholder="请选择发放优惠券" :disabled="showDisabled">
              <el-option v-for="(coupon, i) in couponData" :key="i" :label="coupon.couponName" :value="coupon.couponCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :prop="'queueRuleDetails.'+index+'.num'" :rules="rules.num" label-width="5px">
            <el-input class="input-num" size="small" v-model="item.num" :disabled="showDisabled" placeholder="请输入发放数量" />
          </el-form-item>
          <div class="el-form-item">
            张
            <i class="el-icon-plus" @click="add" v-show="form.queueRuleDetails.length < 5"></i>
            <i class="el-icon-minus" @click="del(index)" v-show="form.queueRuleDetails.length > 1"></i>
          </div>
        </div>
      </template>
      <!-- <el-form-item label="设置优惠券" prop="discountList">
        <div v-for="(item, index) in form.discountList" :key="index">
          <el-select placeholder="" size="small" v-model="form.discountList[index].coupon">
            <el-option v-for="(coupon, i) in couponData" :key="i" :label="coupon.name" :value="coupon.code"></el-option>
          </el-select>
          <el-input class="input-num" size="small" placeholder="" v-model="form.discountList[index].num" />
          张
          <i class="el-icon-plus" @click="add"></i>
          <i class="el-icon-minus" @click="del(index)" v-show="form.discountList > 1"></i>
        </div>
      </el-form-item> -->
      <div class="title">选择用户范围</div>
      <el-form-item label="用户信息">
        <el-radio-group v-model="userInfo" @change="tableData = []" :disabled="showDisabled">
          <el-radio label="1">筛选用户</el-radio>
          <el-radio label="2">文件上传</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label=" " v-show="userInfo == '1'">
        <el-button v-show="!showDisabled" size="mini" type="primary" @click="showUserDialog">点击选择</el-button>
        <UserDialog ref="userDialog" @add='handleAdd'/>
      </el-form-item>
      <el-form-item label=" " v-show="userInfo == '2'">
        <el-button v-show="!showDisabled" size="mini" type="primary" @click="showDialog">上传文件</el-button>
        <a ref="download" target="_blank" download="" href="" v-show="2<1"></a>
        <el-link v-show="!showDisabled" type="primary" :disabled="downloadBtn" @click="_reqDownloadMemberTemplate">下载模板</el-link>
        <!-- <div v-show="successNum">
          {{file}} &nbsp;&nbsp; 实际导入用户数：{{successNum}}
        </div> -->
        <!-- <div class="table" v-show="dataList == 'list'">
          <el-table :data="tableData" size="mini">
            <el-table-column
              type="index"
              label="序号"
              width="50">
            </el-table-column>
            <el-table-column prop="memberPhone" label="手机号"></el-table-column>
            <el-table-column prop="nickName" label="用户名"></el-table-column>
          </el-table>
          <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
        </div> -->
        <!-- <div v-show="dataList == 'nothing'">导入数据无效，请重新导入</div> -->
      </el-form-item>
      <el-form-item label=" " v-show="tableData.length">
        <div class="table" v-show="dataList == 'list'">
          <el-table :data="tableData" size="mini">
            <el-table-column prop="memberCode" label="用户编号"></el-table-column>
            <el-table-column prop="memberPhone" label="用户手机"></el-table-column>
            <el-table-column prop="nickName" label="昵称"></el-table-column>
            <el-table-column label="终端来源" prop="terminalType" >
            <template v-slot:default="{row}">{{row['terminalType'] | statusDescrible}}</template>
            </el-table-column>
            <el-table-column prop="label" label="用户标签">
              <template v-slot:default="{ row }">{{row.labels | labels}}</template>
            </el-table-column>
            <el-table-column label="注册时间" prop="createTime" />
            <el-table-column label="最后登录时间" prop="updateTime"></el-table-column>
            <el-table-column label="操作" v-if="!showDisabled">
              <template slot-scope="scope">
                <el-link type="primary" @click="remove(scope.row, scope.$index)">移除</el-link>
              </template>
            </el-table-column>
          </el-table>
          <pagination :current="currentPage" :total="totalCount" :pageSize="pageSize" @onPageChange="handleCurrentChange" @onSizeChange="handleSizeChange" />
        </div>
        <div v-show="dataList == 'nothing'">导入数据无效，请重新导入</div>
      </el-form-item>
      <el-form-item>
        <el-button v-show="!showDisabled" v-if="$route.query.type == 'add'" type="primary" @click="save" :loading="saveLoading" v-np="'CPN_MANUAL_QUEUE_CREATE'">保 存</el-button>
        <el-button v-show="!showDisabled" v-else type="primary" @click="save" :loading="saveLoading" v-np="'CPN_MANUAL_QUEUE_UPDATE'">保 存</el-button>
        <el-button @click="$router.go(-1)">返 回</el-button>
      </el-form-item>
    </el-form>
    <upload-dialog ref="uploadDialog" @on-save-user="onSaveUser"/>
  </div>
</template>

<script>
  import Pagination from '@/components/Pagination'
  import UploadDialog from './templates/uploadDialog'
  import UserDialog from './templates/userDialog'
  import { reqCouponOptional, reqCreateCouponOptional, reqQueueInfo, reqUpdateQueue, reqDownloadMemberTemplate } from '@/api/coupon'
  // import { asyncMessageMembersAdd } from '@/api/message'
  // function getTimestamp() {
  //   const date = new Date().getTime() / 1000
  //   return parseInt(date.toString(), 10)
  // }

  export default {
    name: 'man-made',
    components: {
      Pagination,
      UploadDialog,
      UserDialog
    },
    data() {
      return {
        saveLoading: false,
        couponData: [],
        form: {
          queueName: '',
          instructions: '',
          queueRuleDetails: [
            { couponCode: '', num: '' }
          ],
          memberPhoneSet: []
        },
        rules: this.ruleFn(),
        dataList: '',
        canUsePhoneList: [],
        data: [],
        tableData: [],
        currentPage: 1,
        pageSize: 20,
        pagePhase: [10, 20, 30, 50],
        totalCount: 0,
        showDisabled: false,
        downloadBtn: false,
        successNum: '',
        file: '',
        userInfo: '1'
      }
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
    mounted() {
      if (this.$route.query.type === 'show') {
        this.showDisabled = true
      }
      if (this.$route.query.queueCode) {
        this.getQueueInfo()
      }
      this._reqCouponOptional()
    },
    methods: {
      getQueueInfo() {
        // 获取队列信息
        let query = {
          queueCode: this.$route.query.queueCode,
          version: this.$route.query.version
        }
        this._reqQueueInfo(query)
      },
      add() {
        if (this.showDisabled) {
          return false
        }
        this.form.queueRuleDetails.push({ couponCode: '', num: '' })
      },
      del(index) {
        if (this.showDisabled) {
          return false
        }
        this.form.queueRuleDetails.splice(index, 1)
      },
      onSaveUser(allList, canUser, totalCount, successNum, failedNum, fileName) {
        this.file = fileName
        // this.tableData = allList
        if (successNum > 0) {
          this.dataList = 'list'
        } else {
          this.dataList = 'nothing'
        }
        this.canUsePhoneList = canUser
        this.data = allList.slice(failedNum)
        this.tableData = this.data.slice(0, this.pageSize)
        this.totalCount = successNum
        this.successNum = successNum
      },
      handleAdd(val) {
        this.$refs.userDialog.onChange(false)
        this.dataList = 'list'
        this.tableData = val
      },
      remove(row, index) {
        this.$confirm('是否移除该用户', '提示', {}).then(() => {
          this.tableData.splice(index, 1)
        })
      },
      save() {
        this.$refs['manMade'].validate((valid) => {
          if (valid) {
            // 通过验证
            let addList = []
            this.form.queueRuleDetails.map((item) => {
              if (item.couponCode) {
                addList.push(item)
              }
            })
            let hash = {}
            let arr = addList.reduce(function(item, next) { // 去重
              hash[next.couponCode] ? '' : hash[next.couponCode] = true && item.push(next)
              return item
            }, [])
            if (arr.length < addList.length) {
              this.$message({
                type: 'error',
                message: '请勿重复选择同一优惠券'
              })
              return false
            }
            if ((this.userInfo === '1' && this.tableData.length) || (this.userInfo === '2' && this.canUsePhoneList.length)) {
              this.saveLoading = true
              let arr = this.tableData.length ? this.tableData.map(item => item.memberPhone) : []
              this.form.memberPhoneSet = this.userInfo === '1' ? arr : this.canUsePhoneList
              this.form.memberList = this.tableData
              if (this.$route.query.type === 'edit') {
                this._reqUpdateQueue(this.form, this.$route.query.queueCode)
              } else {
                this._reqCreateCouponOptional(this.form)
              }
            } else {
              this.$message({
                type: 'error',
                message: '请导入至少一条有效的优惠券发放的用户'
              })
            }
          }
        })
      },
      showUserDialog() {
        this.$refs.userDialog.showDialog()
      },
      showDialog() {
        this.$refs.uploadDialog.showDialog()
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
      _reqCreateCouponOptional(data) {
        // 保存队列
        return reqCreateCouponOptional(data).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
          this.saveLoading = false
        }).catch(() => {
          this.saveLoading = false
        })
      },
      _reqUpdateQueue(data, queueCode) {
        return reqUpdateQueue(data, queueCode).then((res) => {
          if (res.code === 200) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            this.$router.go(-1)
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
          this.saveLoading = false
        }).catch(() => {
          this.saveLoading = false
        })
      },
      _reqQueueInfo(data) {
        return reqQueueInfo(data).then((res) => {
          if (res.code === 200) {
            let result = res.result || {}
            this.form = result
            this.dataList = 'list'
            let arr = []
            result.memberList.map((item) => {
              arr.push(item.memberPhone)
            })
            this.canUsePhoneList = result.memberPhoneSet.length ? result.memberPhoneSet : arr
            this.tableData = result.memberList.slice(0, this.pageSize)
            this.data = result.memberList
            this.totalCount = result.memberList.length
            this.totalNum = result.memberList.length
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        })
      },
      _reqCouponOptional(data) {
        return reqCouponOptional(data).then((res) => {
          if (res.code === 200) {
            let result = res.result || []
            this.couponData = result
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
        })
      },
      _reqDownloadMemberTemplate() {
        this.downloadBtn = true
        return reqDownloadMemberTemplate().then((res) => {
          if (res) {
            let url = window.URL.createObjectURL(new Blob([res], { type: 'application/vnd.ms-excel' }))
            let node = this.$refs.download
            node.download = '用户范围上传模板.xlsx'
            node.target = '_blank'
            node.href = url
            node.click()
          } else {
            // this.$message({
            //   message: res.message,
            //   type: 'error'
            // })
          }
          this.downloadBtn = false
        })
      },
      ruleFn() {
        // 规则
        let positive_integer = /^\+?[1-9][0-9]*$/
        let queueName = (rule, value, callback) => {
          if (value.match(/^[ ]*$/)) {
            callback(new Error('请勿只输入空格'))
          } else {
            callback()
          }
        }
        return {
          queueName: [
            { required: true, message: '请输入队列名称', trigger: 'blur' },
            { min: 1, max: 20, message: '队列名称长度最大20字符', trigger: 'blur' },
            { validator: queueName }
          ],
          instructions: [
            { required: true, message: '请输入发券说明', trigger: 'blur' },
            { min: 1, max: 200, message: '发券说明长度最大200字符', trigger: 'blur' }
          ],
          // discountList: [
          //   { required: true, validator: (rule, value, callback) => {} }
          // ],
          couponCode: [
            { required: true, message: '请选择优惠券', trigger: 'blur' }
          ],
          num: [
            { required: true, message: '请优惠券发放数量', trigger: 'blur' },
            { validator: (rule, value, callback) => {
              if ((value < 1 || value >= 1000000) || (!positive_integer.test(value))) {
                callback(new Error('请输入1000000以内的正整数'))
              } else {
                callback()
              }
            } }
          ]
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .app-container{
    > div {
      padding: 5px 8px;
    }
    .title {

    }
    .input-width{width:250px;}
    .input-num{width:160px;}
    .discountItem {
      display: flex;
      align-items: center;
    }
  }
</style>
