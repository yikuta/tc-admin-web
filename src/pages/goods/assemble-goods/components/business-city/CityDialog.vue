<template>
  <div class="wrapper">
    <el-dialog title="开通拼团城市" :visible="visible" @update:visible="onChange">
      <div class="text">
        <p>拼团城市用于该城市业务的开通，开通区域范围内的商家可以入驻自提点，且用户可以在该区域内购买拼团商品，并到自提点进行提货，开通拼团城市请与公司业务实际业务开通情况操作。</p>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" size="mini" :hide-required-asterisk="true">
        <el-row>
          <el-col :span="12">
            <el-form-item label="省份" prop="provinceCode">
              <el-select v-model="form.provinceCode" placeholder="请选择" @change="val=>handleChange(val,'city')" :disabled="disabled">
                <el-option v-for="item in provinceList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="城市" prop="cityCode">
              <el-select v-model="form.cityCode" placeholder="请选择" style="margin-left:10px" @change="val=>handleChange(val, 'area')" :disabled="disabled">
                <el-option v-for="item in cityList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="开通区域" prop="businessAreaList">
              <el-checkbox-group v-model="form.businessAreaList" class="areas">
                <el-checkbox v-for="item in areaList" :key="item.code" :label="item.code" name="areas">{{item.name}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="onChange(false)">我再想想</el-button>
        <el-button size="mini" type="primary" @click="handleUpdatePrice('form')" :loading="loading">确定开通</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { findAllProvince, findAreasByCode } from '@/api/common'
export default {
  name: 'CityDialog',
  props: {
    visible: Boolean,
    fetchData: { type: Object, default: () => {} }
  },
  watch: {
    fetchData: {
      handler: function(newVal) {
        if (newVal.id) {
          newVal.businessAreaList = newVal.businessAreaList.map(item => {
            return String(item.areaCode)
          })
          this.handleChange(newVal.provinceCode, 'city').then(() => {
            this.handleChange(newVal.cityCode, 'area')
          })
          newVal.provinceCode = String(newVal.provinceCode)
          newVal.cityCode = String(newVal.cityCode)
          this.form = JSON.parse(JSON.stringify(newVal))
          this.disabled = true
        } else {
          this.disabled = false
        }
      }
    }
  },
  data() {
    return {
      disabled: false, // 编辑时是否可用
      loading: false,
      provinceList: [],
      cityList: [],
      areaList: [],
      form: {
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        cityNumber: '',
        businessAreaList: []
      },
      rules: {
        businessAreaList: [{ type: 'array', required: true, message: '请至少选择一个开通区域', trigger: 'change' }]
      }
    }
  },
  mounted() {
    this.handleReceiveProvinceList()
  },
  methods: {
    handleUpdatePrice(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let req = JSON.parse(JSON.stringify(this.form))
          let tempList = this.areaList.filter(area => {
            let temp = false
            req.businessAreaList.map(item => {
              if (item === area.code) {
                temp = true
              }
              return item
            })
            return temp
          })
          req.businessAreaList = tempList.map(item => {
            return {
              areaCode: item.code,
              areaName: item.name
            }
          })
          this.$emit('on-update-service', req)
        } else {
          return false
        }
      })
    },
    onChange(visible) {
      this.$emit('update:visible', visible)
      this.$refs['form'].resetFields()
      this.areaList = []
    },
    handleReceiveProvinceList() {
      findAllProvince().then(res => {
        if (res.code === 200) {
          this.provinceList = res.result || []
        } else {
          this.provinceList = []
        }
      })
    },
    handleChange(code, name) {
      code = String(code)
      if (name === 'city') {
        this.form.provinceName = this.provinceList.filter(item => {
          if (item.code === code) return true
          return false
        })[0].name
      }
      if (name === 'area') {
        let curCity = this.cityList.filter(item => {
          if (item.code === code) return true
          return false
        })[0]
        this.form.cityName = curCity.name
        this.form.cityNumber = curCity.number
      }
      if (code && name) {
        return findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []
            if (name === 'city') {
              this.form.cityCode = ''
              // this.form.districtId = ''
              this.areaList = []
            } else {
              this.form.cityCode = code
              // this.form.districtId = ''
            }
          } else {
            this[`${name}List`] = []
          }
        })
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.text {
  margin-bottom: 20px;
  p {
    margin: 0;
  }
}
.areas {
  /deep/ .el-checkbox {
    min-width: 100px;
  }
}
</style>
