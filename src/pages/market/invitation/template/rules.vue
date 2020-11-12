<template>
  <div class="rules">
    <el-card v-if="!loading">
      <div class="search-btn">
        <el-button type="primary" size="mini" v-show="status == 'show'" @click="edit" v-np="'SCENARIO_INVITE_GIFT_COUPON_CREATE'">编辑</el-button>
        <el-button type="primary" size="mini" v-show="status == 'edit'" @click="submitQuery" v-np="'SCENARIO_INVITE_GIFT_COUPON_SAVE'">保存</el-button>
        <el-button type="plain" size="mini" v-show="status == 'edit'" @click="status = 'show'">取消</el-button>
        <el-button type="primary" size="mini" v-np="'COMMON_OPERATE_LOG'" @click="$router.push({ path: '/market/log', query: { title: '邀请有礼操作日志', code: 'coupon_invite_' + form.id }})">操作日志</el-button>
      </div>
      <el-form ref="form" :model="form" label-width="150px" size="mini" v-show="status == 'show'">
				<el-form-item label="邀请人奖励">
          <div v-if="!form.inviteCoupon.length"></div>
          <div v-else>
            <div v-for="(item, index) in form.inviteCoupon" :key="index" class="123">
              {{ item.couponCode + ' ' + item.couponName + ' 总限量' + item.launchNum + ' 已发放' + item.claimedNum }}
            </div>
          </div>
				</el-form-item>
				<el-form-item label="被邀请人奖励">
          <div v-if="!form.isPresented">不赠送</div>
          <div v-else>
            <div v-if="!form.beInvitedCoupon.length"></div>
            <div v-else>
              <div v-for="(item, index) in form.beInvitedCoupon" :key="index">
                {{ item.couponCode + ' ' + item.couponName + ' 总限量' + item.launchNum + ' 已发放' + item.claimedNum }}
              </div>
            </div>
          </div>
				</el-form-item>
				<el-form-item label="活动说明">
          <div>{{form.remark}}</div>
				</el-form-item>
			</el-form>
      <el-form ref="editForm" :model="editForm" label-width="150px" size="mini" v-show="status == 'edit'">
				<el-form-item label="邀请人奖励">
          <div v-for="(item, index) in editForm.inviteCoupon" :key="index">
            <el-select v-model="item.couponCode" filterable placeholder="输入筛选优惠券" class="input-gift" @change="inviteCouponChange(item)">
              <el-option
                v-for="coupon in couponOptions"
                :key="coupon.id"
                :label="coupon.couponName"
                :value="coupon.couponCode">
              </el-option>
            </el-select>
            发放总限量{{editForm.inviteCoupon[index].launchNum}}张
            <el-button type="primary" v-show="editForm.inviteCoupon.length < 5" icon="el-icon-plus" circle @click="handleAddInviteCoupon(index)"></el-button>
            <el-button type="danger" v-show="editForm.inviteCoupon.length > 1" icon="el-icon-delete" circle @click="handleRemoveInviteCoupon(index)"></el-button>
          </div>
				</el-form-item>
				<el-form-item label="被邀请人奖励">
          <div>
            <el-radio v-model="editForm.isPresented" :label="0">不赠送</el-radio>
          </div>
          <div>
            <el-radio v-model="editForm.isPresented" :label="1">赠送优惠券</el-radio>
            <div v-if="editForm.isPresented">
              <div v-for="(item, index) in editForm.beInvitedCoupon" :key="index">
                <el-select v-model="item.couponCode" filterable placeholder="输入筛选优惠券" class="input-gift" @change="beInvitedCouponChange(item)">
                  <el-option
                    v-for="coupon in couponOptions"
                    :key="coupon.id"
                    :label="coupon.couponName"
                    :value="coupon.couponCode">
                  </el-option>
                </el-select>
                <el-button type="primary" v-show="editForm.beInvitedCoupon.length < 5" icon="el-icon-plus" circle @click="handleAddBeInvitedCoupon(index)"></el-button>
                <el-button type="danger" v-show="editForm.beInvitedCoupon.length > 1" icon="el-icon-delete" circle @click="handleRemoveBeInvitedCoupon(index)"></el-button>
              </div>
            </div>
          </div>
				</el-form-item>
				<el-form-item label="活动说明">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入活动说明，用于C端展示"
            v-model.trim="editForm.remark">
          </el-input>
				</el-form-item>
			</el-form>
    </el-card>
  </div>
</template>
<script>
import { reqCouponRuleDetail, reqSaveCouponRule, reqInviteCouponList } from '@/api/coupon'
export default {
  data() {
    return {
      status: 'show',
      couponOptions: [],
      launchNum: '',
      form: {
        beInvitedCoupon: [{
          couponCode: '',
          couponName: ''
        }],
        inviteCoupon: [{
          couponCode: '',
          couponName: ''
        }],
        isPresented: 0,
        remark: ''
      },
      editForm: {},
      loading: true
    }
  },
  mounted() {
    this._reqCouponRuleDetail()
    this._reqInviteCouponList()
  },
  methods: {
    edit() {
      this.status = 'edit'
      this.editForm = JSON.parse(JSON.stringify(this.form))
      this.editForm.isPresented ? this.editForm.isPresented = 1 : this.editForm.isPresented = 0
      this.editForm.beInvitedCoupon.push({
        couponCode: '',
        couponName: ''
      })
      this.editForm.inviteCoupon.push({
        couponCode: '',
        couponName: ''
      })
    },
    submitQuery() {
      // 1
      let form = {
        beInvitedCouponCodeList: [],
        beInvitedCouponNameList: [],
        inviteCouponCodeList: [],
        inviteCouponNameList: [],
        remark: '',
        id: '',
        isPresented: false
      }
      this.editForm.inviteCoupon.map((item) => {
        if (item.couponCode) {
          form.inviteCouponCodeList.push(item.couponCode)
          form.inviteCouponNameList.push(item.couponName)
        }
      })
      if (this.editForm.isPresented) {
        this.editForm.beInvitedCoupon.map((item) => {
          if (item.couponCode) {
            form.beInvitedCouponCodeList.push(item.couponCode)
            form.beInvitedCouponNameList.push(item.couponName)
          }
        })
      }
      form.id = this.editForm.id
      if (this.editForm.remark.length > 200) {
        this.$message({
          message: '请输入200字符以内的活动说明',
          type: 'error'
        })
        return false
      }
      form.remark = this.editForm.remark
      this.editForm.isPresented ? form.isPresented = true : form.isPresented = false
      this._reqSaveCouponRule(form)
    },
    handleAddInviteCoupon(index) {
      this.editForm.inviteCoupon.splice(index + 1, 0, {
        couponCode: '',
        couponName: ''
      })
    },
    handleRemoveInviteCoupon(index) {
      this.editForm.inviteCoupon.splice(index, 1)
    },
    handleAddBeInvitedCoupon(index) {
      this.editForm.beInvitedCoupon.splice(index + 1, 0, {
        couponCode: '',
        couponName: ''
      })
    },
    handleRemoveBeInvitedCoupon(index) {
      this.editForm.beInvitedCoupon.splice(index, 1)
    },
    inviteCouponChange(val) {
      this.couponOptions.map((item) => {
        if (val.couponCode === item.couponCode) {
          val.launchNum = item.launchNum
          val.couponName = item.couponName
        }
      })
    },
    beInvitedCouponChange(val) {
      this.couponOptions.map((item) => {
        if (val.couponCode === item.couponCode) {
          val.couponName = item.couponName
        }
      })
    },
    _reqCouponRuleDetail() {
      return reqCouponRuleDetail().then(res => {
        if (res.code === 200) {
          if (res.result) {
            this.form = res.result
          } else {
            this.form = {
              beInvitedCoupon: [],
              inviteCoupon: [],
              isPresented: 0,
              remark: ''
            }
          }
          this.loading = false
        }
      })
    },
    _reqSaveCouponRule(data) {
      return reqSaveCouponRule(data).then(res => {
        if (res.code === 200) {
          this.$message({
            message: res.message,
            type: 'success'
          })
          this._reqCouponRuleDetail()
          this.status = 'show'
        }
      })
    },
    _reqInviteCouponList() {
      return reqInviteCouponList().then(res => {
        if (res.code === 200) {
          // 3
          this.couponOptions = res.result
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
  .rules {
    .search-btn {
      text-align: right;
    }
  }
</style>
