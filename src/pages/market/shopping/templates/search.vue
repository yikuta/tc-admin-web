<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
      <el-form-item label="活动名称" class="">
        <el-input v-model="form.couponName.value" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动编码">
        <el-input v-model="form.couponCode.value" placeholder="请输入活动编码"></el-input>
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
      <el-form-item label="活动类型">
        <el-select v-model="form.couponType.value" placeholder="请选择活动类型">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in option.type" :label="item.value" :value="item.id" :key="index"></el-option>
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
          couponName: { value: '', name: 'orderActivityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          couponCode: { value: '', name: 'orderActivityCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          couponType: { value: '', name: 'orderActivityType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM },
          channelType: { value: '', name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          businessTypes: { value: '', name: 'businessType', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        option: {
          type: [
            { id: 'orderactivity.OrderActivityType_1', value: '满赠活动' }
          ],
          status: [
            { id: 'promotion.OrderActivityStatus_10', value: '待审核' },
            { id: 'promotion.OrderActivityStatus_20', value: '审核中' },
            { id: 'promotion.OrderActivityStatus_30', value: '发布中' },
            { id: 'promotion.OrderActivityStatus_40', value: '已驳回' },
            { id: 'promotion.OrderActivityStatus_50', value: '变更审核中' },
            { id: 'promotion.OrderActivityStatus_60', value: '已过期' },
            { id: 'promotion.OrderActivityStatus_70', value: '已作废' }
          ],
          channelType: [
            // { id: 'ALL', value: '通用' },
            { id: 'ChannelType_2', value: '天呈生活APP' },
            { id: 'ChannelType_3', value: '天呈生活小程序' },
            { id: 'ChannelType_4', value: '天呈净菜小程序' }
          ],
          work: [
            // { id: 'ALL', value: '通用' },
            { id: 'BusinessType_2', value: '快递到家' },
            { id: 'BusinessType_3', value: '净菜' },
            { id: 'BusinessType_4', value: '爆款预售' },
            { id: 'BusinessType_5', value: '社区超市' }
          ],
          sceneType: [
            { id: 'SceneType_1', value: '商详页' },
            { id: 'SceneType_2', value: '领券中心' },
            { id: 'SceneType_3', value: '人工发券' }
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
          couponName: { value: '', name: 'orderActivityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          couponCode: { value: '', name: 'orderActivityCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          couponType: { value: '', name: 'orderActivityType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM },
          channelType: { value: '', name: 'channelType', matchType: MatchType.EQUAL, type: DataType.ENUM },
          businessTypes: { value: '', name: 'businessType', matchType: MatchType.EQUAL, type: DataType.ENUM }
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
