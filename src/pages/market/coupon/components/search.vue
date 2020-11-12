<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini" class="">
      <el-form-item label="优惠券名称" class="">
        <el-input v-model="form.name.value"></el-input>
      </el-form-item>
      <el-form-item label="优惠券码">
        <el-input v-model="form.code.value"></el-input>
      </el-form-item>
      <el-form-item label="日期选择">
        <el-date-picker
          v-model="form.date.value"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="优惠券类型">
      <el-cascader
        v-model="form.cascader.value"
        :options="option.cascader"
      >
      </el-cascader>
      </el-form-item>
      <el-form-item label="优惠券类型">
        <el-select v-model="form.type.value" placeholder="请选择优惠券类型">
          <el-option label="全部" :value="0"></el-option>
          <el-option v-for="(item, index) in option.type" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生效状态">
        <el-select v-model="form.status.value" placeholder="请选择生效状态">
          <el-option label="全部" :value="0"></el-option>
          <el-option v-for="(item, index) in option.status" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务终端">
        <el-select v-model="form.term.value" placeholder="请选择业务终端">
          <el-option label="任意渠道" :value="0"></el-option>
          <el-option v-for="(item, index) in option.term" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="适用业务">
        <el-select v-model="form.work.value" placeholder="请选择适用业务">
          <el-option label="任意业务" :value="0"></el-option>
          <el-option v-for="(item, index) in option.work" :label="item.value" :value="item.id" :key="index"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="handleSubmit">查询</el-button>
      <el-button type="default" size="mini">清空</el-button>
    </div>
  </el-card>
</template>

<script>
  import searchTool from '@/utils/searchTool'
  import { MatchType, DataType } from '@/constants/search'
  export default {
    name: 'Search',
    data() {
      return {
        form: {
          name: { value: '', name: 'name' },
          code: { value: '', name: 'code' },
          type: { value: '', name: 'type', matchType: MatchType.ALL, type: DataType.STRING },
          date: { value: [], name: 'date', matchType: MatchType.ALL, type: DataType.DATE },
          cascader: { value: [], name: 'cascader', matchType: MatchType.ALL, type: DataType.STRING },
          status: { value: 0, name: 'status', matchType: MatchType.ALL, type: DataType.NUMBER },
          term: { value: 0, name: 'term', matchType: MatchType.ALL, type: DataType.NUMBER },
          work: { value: 0, name: 'work', matchType: MatchType.ALL, type: DataType.NUMBER }
        },
        option: {
          type: [
            { id: 1, value: '满减券' },
            { id: 2, value: '折扣券' }
          ],
          status: [
            { id: 1, value: '待审核' },
            { id: 2, value: '审核中' },
            { id: 3, value: '已驳回' },
            { id: 4, value: '发布中' },
            { id: 5, value: '已作废' }
          ],
          term: [
            { id: 2, value: '天呈生活APP' },
            { id: 3, value: '天呈生活小程序' },
            { id: 4, value: '天呈净菜小程序' }
          ],
          work: [
            { id: 2, value: '净菜' },
            { id: 3, value: '社区超市' },
            { id: 4, value: '爆款预售' },
            { id: 5, value: '快递到家' }
          ],
          cascader: [{
            value: 'zhinan',
            label: '指南',
            children: [{
              value: 'shejiyuanze',
              label: '设计原则',
              children: [{
                value: 'yizhi',
                label: '一致'
              }, {
                value: 'fankui',
                label: '反馈'
              }, {
                value: 'xiaolv',
                label: '效率'
              }, {
                value: 'kekong',
                label: '可控'
              }]
            }, {
              value: 'daohang',
              label: '导航',
              children: [{
                value: 'cexiangdaohang',
                label: '侧向导航'
              }, {
                value: 'dingbudaohang',
                label: '顶部导航'
              }]
            }]
          }]
        }
      }
    },
    methods: {
      handleSubmit() {
        let searchParam = searchTool(this.form)
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
