<template>
  <div>
    <el-form ref="queryForm" :model="form" label-width="100px" size="mini" class="">
      <el-row>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="总仓ID" prop="orderNum">
            <el-input
              v-model="form.num.value"
              placeholder="总仓ID"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="总仓名称" prop="orderName">
            <el-input
              v-model="form.name.value"
              placeholder="总仓名称"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        
        <el-col :span="10">
          <el-form-item label-width="20px" style="margin-bottom:0">
            <div class="search-form-btn">
              <el-button type="primary" size="small" @click="submitQueryForm">查询</el-button>
              <el-button type="success" size="small" @click="handleResetForm('queryForm')">清空</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import searchTool from '@/utils/searchTool'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'searchCard',
  data() {
    return {
      labelWidth: '90px',
      name: '',
      form: {
        num: { value: '', name: 'orderNum', matchType: MatchType.EQUAL, type: DataType.STRING }, // 总仓id
        name: { value: '', name: 'orderInfo.name', matchType: MatchType.CONTAIN } // 总仓名称
      }
    }
  },
  methods: {
    submitQueryForm() {
      this.$emit('query', searchTool(this.form))
    },
    handleResetForm() {
      Object.keys(this.form).forEach(key => {
        if (key !== 'orderState') {
          this.form[key].value = ''
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.search-form-btn{
  float: right
}
</style>
