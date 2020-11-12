<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="80px" inline size="mini">
      <el-form-item label="状态" prop="status.value" v-if="activeTab==='1'">
        <el-select v-model="form.status.value" placeholder="请选择" clearable>
          <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status.value" v-if="activeTab==='2'">
        <el-select v-model="form.status.value" placeholder="请选择" clearable>
          <el-option v-for="item in statusOption1" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店名称" prop="name.value">
        <el-input v-model="form.name.value" placeholder="门店名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="门店编码" prop="shopCode.value">
        <el-input v-model="form.shopCode.value" placeholder="门店编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="bossAccount.value">
        <el-input v-model="form.bossAccount.value" placeholder="登录账号" clearable></el-input>
      </el-form-item>
      <el-form-item label="运维人员" prop="operationName.value">
        <el-input v-model="form.operationName.value" placeholder="运维人员" clearable></el-input>
      </el-form-item>
      <el-form-item label="地址" prop="address">
        <el-row>
          <el-col :span="8">
            <el-form-item prop="provinceId.value">
              <el-select
                v-model="form.provinceId.value"
                placeholder="请选择"
                @change='val=>handleChange(val,"city")'
              >
                <el-option
                  v-for="item in provinceList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="cityId.value">
              <el-select
                v-model="form.cityId.value"
                placeholder="请选择"
                @change='val=>handleChange(val, "area")'
              >
                <el-option
                  v-for="item in cityList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="districtId.value">
              <el-select
                v-model="form.districtId.value"
                placeholder="请选择"
                @change='val=>handleChange(val,"")'
              >
                <el-option
                  v-for="item in areaList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { Cascader } from '../common'
import { MatchType, DataType } from '@/constants/search'
import { findAllProvince, findAreasByCode } from '@/api/common'
export default {
  name: 'Search',
  // components: { Cascader },
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        status: { value: '', name: 'enterStatus', matchType: MatchType.EQUAL, type: DataType.STRING },
        name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
        shopCode: { value: '', name: 'shopCode', matchType: MatchType.EQUAL, type: DataType.STRING },
        bossAccount: { value: '', name: 'bossAccount', matchType: MatchType.EQUAL, type: DataType.STRING },
        operationName: { value: '', name: 'operationName', matchType: MatchType.EQUAL, type: DataType.STRING },
        provinceId: { value: '', name: 'provinceId', matchType: MatchType.EQUAL, type: DataType.LONG },
        cityId: { value: '', name: 'cityId', matchType: MatchType.EQUAL, type: DataType.LONG },
        districtId: { value: '', name: 'districtId', matchType: MatchType.EQUAL, type: DataType.LONG }
      },
      statusOption: [
        { value: '', label: '全部' },
        { value: '6', label: '被驳回' },
        { value: '1', label: '审核通过' }
      ],
      statusOption1: [
        { value: '', label: '全部' },
        { value: '0', label: '待入驻' },
        { value: '6', label: '被驳回' }
      ],
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  mounted() {
    this.handleReceiveProvinceList()
  },
  methods: {
    // _reqAddressCategory(code) {
    //   return code ? findAreasByCode({ code }) : code !== 0 ? findAllProvince() : findAreasByCode({ code })
    // },
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
      if (code && name) {
        findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []
            if (name === 'city') {
              this.form.cityId.value = ''
              this.form.districtId.value = ''
            } else {
              this.form.districtId.value = ''
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
</style>
