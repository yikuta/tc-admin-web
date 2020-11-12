<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
      <el-form-item label="活动名称" class="">
        <el-input v-model="form.couponName.value" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="活动编码">
        <el-input v-model="form.couponCode.value" placeholder="请输入活动编码"></el-input>
      </el-form-item>
      <el-form-item label="生效状态">
        <el-select v-model="form.status.value" placeholder="请选择生效状态">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="goto">新建</el-button>
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
          couponName: { value: '', name: 'groupBuyActivityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          couponCode: { value: '', name: 'groupBuyActivityCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        option: {
          status: [
            { id: 'groupbuyactivity.GroupBuyActivityStatus_10', value: '待审核' },
            { id: 'groupbuyactivity.GroupBuyActivityStatus_20', value: '审核中' },
            { id: 'groupbuyactivity.GroupBuyActivityStatus_25', value: '未开始' },
            { id: 'groupbuyactivity.GroupBuyActivityStatus_30', value: '发布中' },
            { id: 'groupbuyactivity.GroupBuyActivityStatus_40', value: '审核驳回' },
            { id: 'groupbuyactivity.GroupBuyActivityStatus_50', value: '已领完' },
            { id: 'groupbuyactivity.GroupBuyActivityStatus_60', value: '已过期' },
            { id: 'groupbuyactivity.GroupBuyActivityStatus_70', value: '已作废' }
          ]
        }
      }
    },
    methods: {
      goto() {
        this.$router.push({ path: '/active/shopping/group_booking_form', query: { type: 'add' }})
      },
      handleSubmit() {
        this.$emit('on-search')
      },
      reset() {
        this.form = {
          couponName: { value: '', name: 'groupBuyActivityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          couponCode: { value: '', name: 'groupBuyActivityCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM }
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
