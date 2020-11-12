<template>
  <div class="order-detail-list">
    <p class="order-text">{{title}}
      <el-button
        size="small"
        type="primary"
        @click="handleEditBtn"
        v-np='"ORDER_EDIT"'
        v-if="isExpressService&&(orderState.value&&orderState.value===10 || orderState.value===20 ||(orderState.value==30&&orderShipmentState&&orderShipmentState.value===1))"
      >修改信息</el-button>
    </p>
    <div class="order-list">
      <el-row>
        <el-col
          :span='12'
          v-for="(item,index) in deliveryInfo"
          :key="index"
        >
          <dl>
            <dt>{{item.label}}</dt>
            <dd 
              :style="`${item.key === 'memberPhone'||item.key==='storeName'||item.key==='regimentalPhone'?'color:#409EFF;cursor:pointer':''}`" 
              
              @click="handleClick(item.value, item.key)"
              :title='typeof item.value === "object" ? (item.value&&item.value["describe"]) : item.value'>
              {{typeof item.value === 'object' ? (item.value&&item.value['describe']) : item.value}}
            </dd>
          </dl>
        </el-col>
        <el-col :span='12' v-if="deliveryInfo.length%2===1">
          <dl>
            <dt></dt>
            <dd></dd>
          </dl>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="修改收货信息"
      :visible.sync="dialogFormVisible"
      width='720px'
      :close-on-click-modal='false'
    >
      <p style="color:#D9001B;font-size:18px;margin:0 0 18px">注意：为维护平台良好信用度，防止用户投诉，请务必与客户沟通后才修改收货信息！</p>
      <el-form
        :model="form"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        @close="handleClose('editForm')"
      >
        <el-form-item
          label="收货人姓名"
          prop='orderReceiver'
        >
          <el-input v-model="form.orderReceiver"></el-input>
        </el-form-item>
        <el-form-item
          label="收货人电话"
          prop='contactInformation'
        >
          <el-input v-model="form.contactInformation" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item
          label="收货人地址"
          prop='receiveAddress'
        >
          <el-row
            type="flex"
            justify="space-between"
          >
            <el-col :span="7">
              <el-form-item prop="receiveProvinceCode">
                <el-select
                  v-model="form.receiveProvinceCode"
                  placeholder="请选择"
                  @change='val=>handleChange(val,"receiveCity")'
                >
                  <el-option
                    v-for="item in receiveProvinceList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="receiveCityCode">
                <el-select
                  v-model="form.receiveCityCode"
                  placeholder="请选择"
                  @change='val=>handleChange(val, "receiveArea")'
                >
                  <el-option
                    v-for="item in receiveCityList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item prop="receiveAreaCode">
                <el-select
                  v-model="form.receiveAreaCode"
                  placeholder="请选择"
                  @change='val=>handleChange(val,"")'
                >
                  <el-option
                    v-for="item in receiveAreaList"
                    :key="item.code"
                    :label="item.name"
                    :value="item.code"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row 
            style="margin-top:20px" 
            type="flex"
            justify="space-between">
            <el-col :span="14">
              <el-form-item prop="receiveStreetName">
                <el-input v-model="form.receiveStreetName" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item prop="houseNum">
                <el-input v-model="form.houseNum" maxlength="20"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="handleClose('editForm')">取 消</el-button>
        <el-button
          type="primary"
          @click="handleEdit('editForm')"
        >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { asyncOrderInfoUpdate } from '@/api/order'
import { findAllProvince, findAreasByCode } from '@/api/common'
export default {
  props: {
    deliveryInfo: Array,
    orderState: {
      type: Object,
      default: () => {}
    },
    memberCode: {
      type: String,
      default: () => ''
    },
    regimentalCode: {
      type: String,
      default: () => ''
    },
    addressInfo: {
      type: Object,
      default: () => {}
    },
    title: String,
    orderShipmentState: {
      type: Object,
      default: () => {}
    },
    isExpressService: Boolean
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        orderReceiver: '',
        receiveAddress: '',
        houseNum: '',
        receiveStreetName: '',
        contactInformation: '',
        receiveProvinceCode: '',
        receiveCityCode: '',
        receiveAreaCode: '',
        receiveProvinceName: '',
        receiveCityName: '',
        receiveAreaName: ''
      },
      rules: {
        orderReceiver: [
          { required: true, message: '请输入收货人姓名', trigger: 'blur' }
        ],
        contactInformation: [
          { required: true, message: '请输入收货人电话', trigger: 'blur' }
        ],
        receiveProvinceCode: [{ required: true, message: '请选择省份', trigger: 'change' }],
        receiveCityCode: [{ required: true, message: '请选择市', trigger: 'change' }],
        receiveAreaCode: [{ required: true, message: '请选择区', trigger: 'change' }],
        receiveStreetName: [
          { required: true, message: '请输入收货人街道名称', trigger: 'blur' }
        ],
        houseNum: [
          { required: true, message: '请输入收货人门牌号', trigger: 'blur' }
        ]
      },
      receiveProvinceList: [],
      receiveCityList: [],
      receiveAreaList: []
    }
  },
  mounted() {
    this.handleProvices()
  },
  methods: {
    handleEditBtn() {
      this.dialogFormVisible = true
      this.deliveryInfo.map(item => {
        if (item.key === 'orderReceiver' || item.key === 'contactInformation' || item.key === 'receiveAddress') {
          this.form[item.key] = item.value
        }
      })
      Object.keys(this.addressInfo).forEach(key => {
        this.form[key] = this.addressInfo[key]
      })
      this.handleInitCode(this.form.receiveProvinceCode, 'receiveCity')
      this.handleInitCode(this.form.receiveCityCode, 'receiveArea')
    },
    handleEdit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { orderNum } = this.$route.query
          this.form.receiveAddress = this.form.receiveProvinceName + this.form.receiveCityName + this.form.receiveAreaName + this.form.receiveStreetName + this.form.houseNum
          asyncOrderInfoUpdate({ ...this.form, orderNum }).then(res => {
            if (res.code === 200) {
              this.$message.success(res.message || '修改成功')
              this.dialogFormVisible = false
              this.$emit('update')
            }
          })
        } else {
          return false
        }
      })
    },
    handleClose(formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    handleProvices() {
      findAllProvince().then(res => {
        if (res.code === 200) {
          this.receiveProvinceList = res.result || []
        } else {
          this.receiveProvinceList = []
        }
      })
    },
    handleInitCode(code, name) {
      if (code) {
        findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []
          } else {
            this[`${name}List`] = []
          }
        })
      }
    },
    handleChange(code, name) {
      if (code && name) {
        findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []
            if (name === 'receiveCity') {
              this.form.receiveCityCode = ''
              this.form.receiveAreaCode = ''
              this.form.receiveProvinceName = this.receiveProvinceList.filter(item => item.code === code)[0].name
            } else {
              this.form.receiveAreaCode = ''
              this.form.receiveCityName = this.receiveCityList.filter(item => item.code === code)[0].name
            }
          } else {
            this[`${name}List`] = []
          }
        })
      } else if (code && !name) {
        this.form.receiveAreaName = this.receiveAreaList.filter(item => item.code === code)[0].name
      }
    },
    handleClick(value, key) {
      if (key === 'memberPhone') {
        this.$router.push({ path: '/user/detail', query: { memberCode: this.memberCode, memberPhone: value }})
      } else if (key === 'regimentalPhone') {
        this.$router.push({ path: '/user/detail', query: { memberCode: this.regimentalCode, memberPhone: value }})
      } else if (key === 'storeName') {
        let code = ''
        this.deliveryInfo.map(item => {
          if (item.key === 'storeCode') {
            code = item.value
          }
        })
        this.$router.push({ path: '/seller/shopDetail', query: { code }})
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import url('../index.scss');
.delivery-info {
  display: flex;
  dl {
    width: 50%;
  }
}
</style>