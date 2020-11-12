<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
      <el-form-item label="优惠券名称" class="">
        <el-input v-model="form.couponName.value" placeholder="请选择优惠券名称"></el-input>
      </el-form-item>
      <el-form-item label="优惠券码">
        <el-input v-model="form.couponCode.value" placeholder="请选择优惠券码"></el-input>
      </el-form-item>
      <!-- <el-form-item label="日期选择">
        <el-date-picker
          v-model="form.date.value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item> -->
      <el-form-item label="优惠券类型">
        <el-select v-model="form.couponType.value" placeholder="请选择优惠券类型">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in option.type" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="投放目标">
        <el-select v-model="form.sceneType.value" placeholder="请选择投放目标">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in option.sceneType" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生效状态">
        <el-select v-model="form.status.value" placeholder="请选择生效状态">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务终端">
        <el-select v-model="form.channelType.value" placeholder="请选择业务终端">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in option.channelType" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用业务">
        <el-select v-model="form.businessTypes.value" placeholder="请选择适用业务">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in option.work" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="handleSubmit">查询</el-button>
      <el-button type="default" size="mini" @click="reset">清空</el-button>
    </div>
  </el-card>
</template>

<script>
  // import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  export default {
    name: 'Search',
    data() {
      return {
        form: {
          couponName: { value: '', name: 'couponName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          couponCode: { value: '', name: 'couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          couponType: { value: '', name: 'couponType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          sceneType: { value: '', name: 'scene.sceneType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM },
          channelType: { value: '', name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          businessTypes: { value: '', name: 'businessTypes.type', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        option: {
          type: [
            { id: 'coupon.CouponType_1', value: '满减券' },
            { id: 'coupon.CouponType_2', value: '折扣券' }
          ],
          status: [
            { id: 'coupon.CouponStatus_10', value: '待审核' },
            { id: 'coupon.CouponStatus_20', value: '审核中' },
            { id: 'coupon.CouponStatus_25', value: '未开始' },
            { id: 'coupon.CouponStatus_30', value: '发布中' },
            { id: 'coupon.CouponStatus_40', value: '已驳回' },
            { id: 'coupon.CouponStatus_50', value: '变更审核中' },
            { id: 'coupon.CouponStatus_60', value: '已过期' },
            { id: 'coupon.CouponStatus_70', value: '已作废' },
            { id: 'coupon.CouponStatus_80', value: '已领完' }
          ],
          channelType: [
            { id: 'ChannelType_1', value: '通用' },
            { id: 'ChannelType_2', value: '天呈生活APP' },
            { id: 'ChannelType_3', value: '天呈生活小程序' },
            { id: 'ChannelType_4', value: '天呈净菜小程序' }
          ],
          work: [
            { id: 'BusinessType_1', value: '通用' },
            { id: 'BusinessType_2', value: '快递到家' },
            { id: 'BusinessType_3', value: '净菜' },
            { id: 'BusinessType_4', value: '爆款预售' },
            { id: 'BusinessType_5', value: '社区超市' }
          ],
          sceneType: [
            { id: 'coupon.SceneType_1', value: '商详页' },
            { id: 'coupon.SceneType_2', value: '领券中心' },
            { id: 'coupon.SceneType_3', value: '人工发券' },
            { id: 'coupon.SceneType_4', value: '新人礼' },
            { id: 'coupon.SceneType_5', value: '满赠活动' },
            { id: 'coupon.SceneType_6', value: '售后专用' },
            { id: 'coupon.SceneType_7', value: '邀请有礼' }
          ]
        }
      }
    },
    methods: {
      handleSubmit() {
        this.$emit('on-search')
      },
      reset() {
        this.form = {
          couponName: { value: '', name: 'couponName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          couponCode: { value: '', name: 'couponCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          couponType: { value: '', name: 'couponType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          sceneType: { value: '', name: 'scene.sceneType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM },
          channelType: { value: '', name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          businessTypes: { value: '', name: 'businessTypes.type', matchType: MatchType.EQUAL, type: DataType.ENUM }
        }
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
