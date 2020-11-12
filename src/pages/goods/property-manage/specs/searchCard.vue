<template>
  <el-form size="small" label-width="100px">
    <el-row>
      <el-col :span="8">
        <el-form-item label="规格名称">
          <el-input type="text" v-model="form.name.value" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="状态">
          <el-select v-model="form.enable.value" placeholder="请选择规格状态" clearable>
            <el-option v-for="(item, index) in option.status" :label="item.name" :value="item.type" :key="index"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <div class="search-btn">
          <el-button type="default" size="small" @click="handleResetForm">重置</el-button>
          <el-button type="primary" size="small" @click="submitQueryForm">查询</el-button>
          <el-button v-np="'BASE_SPEC_ADD'" type="primary" size="small" @click="$router.push('/goods/propertyMange/specs/publish')">添加规格</el-button>
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
        status: [
          { name: '全部', type: '' },
          { name: '启用', type: true },
          { name: '停用', type: false }
        ]
      },
      form: {
        name: { value: '', name: 'name', matchType: MatchType.CONTAIN }, // 参数名称
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
