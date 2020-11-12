<template>
  <div>
    <el-form ref="queryForm" :model="form" size="mini" :rules="rules">
      <el-row>
        <el-col :span="8">
          <el-form-item :label-width="labelWidth" label="基础商品编码" prop="commodityNo.value">
            <el-input
              v-model="form.commodityNo.value"
              placeholder="基础商品编码"
              size="small"
              :maxlength='20'
              clearable
            ></el-input>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="8">
          <el-form-item :label-width="labelWidth" label="所属总仓" prop="storeCode">
            <el-select
              v-model="form.storeCode.value"
              placeholder="请选择"
              size="small"
              clearable
              style="width:100%"
            >
              <el-option label="全部" value="" />
              <el-option label="虚拟仓" value="______" />
              <el-option label="成都01仓" value="CEN000" />
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item :label-width="labelWidth" label="变动类型" prop="stockChangeType">
            <el-select
              v-model="form.stockChangeType.value"
              placeholder="请选择"
              size="small"
              clearable
              style="width:100%"
            >
              <el-option label="全部" value="" />
              <el-option label="增加" value="StockChangeType_1" />
              <el-option label="扣减" value="StockChangeType_2" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label-width="labelWidth" label="变动来源" prop="stockChangeSource">
            <el-select
              v-model="form.stockChangeSource.value"
              placeholder="请选择"
              size="small"
              clearable
              style="width:100%"
            >
              <el-option label="全部" value="" />
              <el-option label="订单" value="StockChangeSource_1" />
              <el-option label="商品" value="StockChangeSource_2" />
              <el-option label="OMS" value="StockChangeSource_3" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
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
        commodityNo: { value: '', name: 'commodityNo', matchType: MatchType.EQUAL, type: DataType.STRING }, // 基础商品编码
        // storeCode: { value: '', name: 'storeCode', matchType: MatchType.EQUAL, type: DataType.STRING }, // 所属总仓
        stockChangeType: { value: '', name: 'stockChangeType', matchType: MatchType.EQUAL, type: DataType.ENUM }, // 变动类型
        stockChangeSource: { value: '', name: 'stockChangeSource', matchType: MatchType.EQUAL, type: DataType.ENUM } // 变动来源
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
