<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
      <el-form-item label="队列编码" class="">
        <el-input v-model="form.queueCode.value" placeholder="请输入队列编码"></el-input>
      </el-form-item>
      <el-form-item label="队列名称">
        <el-input v-model="form.queueName.value" placeholder="请输入队列名称"></el-input>
      </el-form-item>
      <el-form-item label="队列状态">
        <el-select v-model="form.status.value" placeholder="请选择队列状态">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="handleAdd">新建队列</el-button>
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
          queueName: { value: '', name: 'queueName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          queueCode: { value: '', name: 'queueCode', matchType: MatchType.EQUAL, type: DataType.STRING },
          status: { value: '', name: 'status', matchType: MatchType.EQUAL, type: DataType.ENUM }
        },
        option: {
          status: [
            { id: 'coupon.CouponQueueStatus_30', value: '待执行' },
            { id: 'coupon.CouponQueueStatus_50', value: '执行中' },
            { id: 'coupon.CouponQueueStatus_60', value: '已执行' }
          ]
        }
      }
    },
    methods: {
      handleAdd() {
        this.$router.push({ path: '/market/manMade/add', query: { type: 'add' }})
      },
      handleSubmit() {
        // let searchParam = searchTool(this.form)
        this.$emit('on-search')
      },
      reset() {
        this.form = {
          queueName: { value: '', name: 'queueName', matchType: MatchType.CONTAIN, type: DataType.STRING },
          queueCode: { value: '', name: 'queueCode', matchType: MatchType.EQUAL, type: DataType.STRING },
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
