<template>
  <div>
    <el-form ref="queryForm" :model="form" size="mini" :rules="rules">
      <el-row>
        <el-col :span="7">
          <el-form-item :label-width="labelWidth" label="基础商品编码" prop="commodityNo.value">
            <el-input
              v-model="form.commodityNo.value"
              placeholder="基础商品编码"
              size="small"
              :maxlength='50'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="17">
          <el-form-item label-width="20px" style="margin-bottom:0">
            <div class="search-form-btn">
              <el-button type="primary" size="small" @click="submitQueryForm('queryForm')">查询</el-button>
              <el-button type="success" size="small" @click="handleResetForm('queryForm')">清空</el-button>
            </div>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'searchCard',
  data() {
    return {
      labelWidth: '120px',
      name: '',
      form: {
        commodityNo: { value: '', name: 'commodityNo', matchType: MatchType.EQUAL, type: DataType.STRING } // 总仓id
      },
      rules: {
        'commodityNo.value': [
          { required: true, message: '请输入基础商品编码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitQueryForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$emit('query', this.form)
        }
      })
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
