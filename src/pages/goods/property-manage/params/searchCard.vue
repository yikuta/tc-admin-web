<template>
  <el-form size="small" label-width="100px">
    <el-row>
      <el-col :span="6">
        <el-form-item label="参数名称">
          <el-input type="text" v-model="form.name.value" placeholder="请输入参数名称" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="输入类型">
          <el-select v-model="form.paramType.value" placeholder="请选择输入类型">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in option.params" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="状态">
          <el-select v-model="form.enable.value" placeholder="请选择状态">
            <el-option v-for="(item, index) in option.status" :label="item.name" :value="item.type" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="search-btn">
          <el-button type="default" size="small" @click="handleResetForm">重置</el-button>
          <el-button type="primary" size="small" @click="submitQueryForm">查询</el-button>
          <el-button v-np="'PARAM_OPTION_ADD'" type="primary" size="small" @click="$router.push('/goods/propertyMange/params/publish')">添加参数</el-button>
        </div>
      </el-col>

    </el-row>

  </el-form>
</template>
<script>
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'searchCard',
  data() {
    return {
      option: {
        params: [
          { id: 'ParamInputType_1', name: '单选框', type: 'RADIO' },
          { id: 'ParamInputType_2', name: '复选框', type: 'CHECKBOX' },
          { id: 'ParamInputType_3', name: '下拉选择', type: 'SELECT' },
          { id: 'ParamInputType_4', name: '单行输入框', type: 'TEXT' },
          { id: 'ParamInputType_5', name: '多行输入框', type: 'TEXTAREA' }
          // { id: 'ParamInputType_6', name: '下拉输入框', type: 'SELECT_TEXT' },
          // { id: 'ParamInputType_7', name: '搜索下拉框', type: 'SEARCH_TEXT' }
        ],
        status: [
          { name: '全部', type: '' },
          { name: '启用', type: true },
          { name: '停用', type: false }
        ]
      },
      form: {
        name: { value: '', name: 'name', matchType: MatchType.CONTAIN }, // 参数名称
        paramType: { value: '', name: 'paramType', matchType: MatchType.EQUAL, type: DataType.ENUM }, // 输入类型
        enable: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLEAN } // 状态
      }
    }
  },
  methods: {
    submitQueryForm() {
      this.$emit('query', searchTool(this.form))
    },
    handleResetForm() {
      Object.keys(this.form).forEach(key => {
        this.form[key].value = ''
      })
    },
    handleTabClick(e) {
      let orderState = {
        value: 'OrderState_' + e.name,
        name: 'orderState',
        matchType: MatchType.EQUAL,
        type: DataType.ENUM
      }
      if (e.name) {
        this.form.orderState = orderState
      } else {
        delete this.form.orderState
      }
      this.$emit('query', searchTool(this.form))
    }
  }
}
</script>

<style lang="scss" scoped>
.search-form .el-form-item,.search-form .el-form-item .el-select {
  display: inline-block;
  width: 100%
}

.search-btn{
  text-align: right;
}

</style>
