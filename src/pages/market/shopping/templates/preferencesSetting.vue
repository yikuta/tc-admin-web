<template>
  <div>
    <div class="setting">优惠设置</div>
    <el-divider></el-divider>
    <el-form ref="preferencesSettingForm" :model="form" :rules="rules" label-width="120px" size="mini" class="app-form" :disabled="showDisabled">
      <el-form-item label="满额类型：" prop="deductionUnitType">
        <el-radio-group v-model="form.deductionUnitType" :disabled="releaseDisabled">
          <el-radio v-for="(item, index) in options.deductionUnitType" :label="item.label" :key="index">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="赠品内容：" prop="giftType">
        <el-radio-group v-model="form.giftType" :disabled="releaseDisabled">
          <el-radio v-for="(item, index) in options.giftType" :label="item.label" :key="index">{{ item.value }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-for="(gift, index) in form.fullGiveItemForDisCountList" :key="index" :prop="'fullGiveItemForDisCountList.' + index + '.singleUserLimitNum'" :rules="rules.singleUserLimitNums" class="gift-item">
        <div>
          满
          <el-input v-show="form.deductionUnitType == 'MONEY'" v-model="gift.satisfyMoney" :disabled="releaseDisabled" class="input-gift" placeholder="满额条件" />
          <span v-show="form.deductionUnitType == 'MONEY'">元</span>
          <el-input v-show="form.deductionUnitType == 'PIECE'" v-model="gift.satisfyPiece" :disabled="releaseDisabled" class="input-gift" placeholder="满件条件" />
          <span v-show="form.deductionUnitType == 'PIECE'">件</span>
          赠
          <!-- <el-autocomplete v-model="gift.couponCode" :fetch-suggestions="querySearch" :trigger-on-focus="false" value-key="couponCode" value="couponName" class="input-gift" :debounce="500" @select="handleSelect" placeholder="输入筛选优惠券"></el-autocomplete> -->
          <el-select v-model="gift.couponCode" :disabled="releaseDisabled" filterable placeholder="输入筛选优惠券" class="input-gift" @change="giftCouponChange(index)">
            <el-option
              v-for="item in couponOptions"
              :key="item.couponCode"
              :label="item.couponName"
              :value="item.couponCode">
            </el-option>
          </el-select>
          总限量
          <el-input v-model="gift.totalCount" placeholder="总限量" class="input-gift" />
          张，单用户单次赠送
          <el-input v-model="gift.userSingleCount" :disabled="releaseDisabled" placeholder="单用户单次赠送" class="input-gift" />
          张
        </div>
        <div v-show="!(showDisabled || releaseDisabled)">
          <el-button v-if="form.fullGiveItemForDisCountList.length < 5" type="primary" icon="el-icon-plus" circle @click="handleAddDiscount(index)"></el-button>
          <el-button v-if="form.fullGiveItemForDisCountList.length > 1" type="danger" icon="el-icon-delete" circle @click="handleRemoveDiscount(index)"></el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
// import searchTool from '@/utils/searchTool'
// import { MatchType, DataType } from '@/constants/search'
import { reqActivityCouponOptional } from '@/api/coupon'
export default {
  name: 'preferencesSetting',
  props: {
    form: {
      type: Object,
      default: () => {}
    },
    rules: {
      type: Object,
      default: () => {}
    },
    showDisabled: {
      type: Boolean,
      default: false
    },
    releaseDisabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: {
        deductionUnitType: [
          { value: '满金额', label: 'MONEY' },
          { value: '满件数', label: 'PIECE' }
        ],
        giftType: [
          { value: '优惠券', label: 'COUPON' }
        ]
      },
      couponOptions: []
    }
  },
  mounted() {
    this._reqActivityCouponOptional()
  },
  methods: {
    giftCouponChange(index) {
      this.couponOptions.map((item) => {
        if (item.couponCode === this.form.fullGiveItemForDisCountList[index].couponCode) {
          this.form.fullGiveItemForDisCountList[index].couponName = item.couponName
          this.form.fullGiveItemForDisCountList[index].upperLimitMoney = item.upperLimitMoney
        }
      })
    },
    validateFn() {
      this.$refs['preferencesSettingForm'].validate((valid) => {
        if (valid) {
          this.$emit('on-validate')
        } else {
          return false
        }
      })
    },
    handleAddDiscount(index) {
      this.$emit('on-add-discount', index)
    },
    handleRemoveDiscount(index) {
      this.$emit('on-remove-discount', index)
    },
    // querySearch(queryString, cb) {
    //   let obj = {}
    //   obj.value = { value: queryString, name: 'couponName', matchType: MatchType.CONTAIN, type: DataType.STRING }
    //   let req = searchTool(JSON.parse(JSON.stringify(obj)))
    //   this._reqActivityCouponOptional(req, cb)
    // },
    // handleSelect() {
    //   // 选择结果
    // },
    // _reqActivityCouponOptional(data, cb) {
    //   return reqActivityCouponOptional({
    //     searchs: JSON.stringify(data),
    //     pageNo: 5,
    //     pageSize: 1,
    //     orderby: 'createTime',
    //     sort: 'desc'
    //   })
    //     .then(res => {
    //       if (res.code === 200) {
    //         cb(res.result.itemVOs)
    //       }
    //     })
    // }
    _reqActivityCouponOptional() {
      return reqActivityCouponOptional().then((res) => {
        if (res.code === 200) {
          this.couponOptions = res.result
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.setting ::before {
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
/deep/ .gift-item .el-form-item__content {
  display: flex;
}
/deep/ .input-gift {
  width: 100px;
}
</style>
