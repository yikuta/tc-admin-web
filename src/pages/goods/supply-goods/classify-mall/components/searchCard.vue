<template>
  <div>
    <el-form
      ref="queryForm"
      :model="form"
      label-width="80px"
      size="small"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="变动类型" prop="businessNo">
            <el-select
              v-model="form.businessNo"
              placeholder="请选择"
              style="width:100%"
            >
              <el-option label="商城商品" :value="1"/>
              <el-option label="拼团商品" :value="2"/>
              <el-option label="供应商品" :value="3"/>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label-width="20px" style="margin-bottom:0">
            <div class="search-form-btn">
              <el-button type="primary" size="small" @click="submitQueryForm">查询</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
// import searchTool from '@/utils/searchTool'
// import { MatchType, DataType } from '@/constants/search'
export default {
  data() {
    return {
      labelWidth: '100px',
      name: '',
      form: {
        businessNo: 3
      }
    }
  },
  methods: {
    submitQueryForm() {
      this.$emit('query', this.form)
    }
  }
}
</script>
<style lang="scss" scoped>
.search-form-btn {
  float: right;
}
</style>
