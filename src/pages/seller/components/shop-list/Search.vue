<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="80px" inline size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item label="类型" prop="type.value">
            <el-select v-model="form.type.value" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in typeOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门店名称" prop="name.value">
            <el-input v-model="form.name.value" placeholder="门店名称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门店编码" prop="shopCode.value">
            <el-input v-model="form.shopCode.value" placeholder="门店编码" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="登录账号" prop="bossAccount.value">
            <el-input v-model="form.bossAccount.value" placeholder="登录账号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="门店状态" prop="status.value">
            <el-select v-model="form.status.value" placeholder="请选择" clearable>
              <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="地址" prop="address">
            <!-- <cascader v-model="form.address" :ajax="_reqAddressCategory" /> -->
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
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Cascader from '@/components/Cascader'
import { MatchType, DataType } from '@/constants/search'
import { findAllProvince, findAreasByCode, findDataListByCode } from '@/api/common'
export default {
  name: 'Search',
  components: { Cascader },
  data() {
    return {
      form: {
        enterStatus: { value: '1', name: 'enterStatus', matchType: MatchType.EQUAL, type: DataType.STRING }, // 查询审核通过的门店
        type: { value: '', name: 'shopType', matchType: MatchType.EQUAL, type: DataType.STRING },
        name: { value: '', name: 'name', matchType: MatchType.CONTAIN, type: DataType.STRING },
        shopCode: { value: '', name: 'shopCode', matchType: MatchType.EQUAL, type: DataType.STRING },
        bossAccount: { value: '', name: 'bossAccount', matchType: MatchType.EQUAL, type: DataType.STRING },
        status: { value: '', name: 'shopStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        provinceId: { value: '', name: 'provinceId', matchType: MatchType.EQUAL, type: DataType.LONG },
        cityId: { value: '', name: 'cityId', matchType: MatchType.EQUAL, type: DataType.LONG },
        districtId: { value: '', name: 'districtId', matchType: MatchType.EQUAL, type: DataType.LONG }
      },
      typeOption: [],
      statusOption: [
        { value: '', label: '全部' },
        { value: '1', label: '已启用' },
        { value: '2', label: '已禁用' },
        { value: '3', label: '销店中' }
      ],
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  mounted() {
    // this._reqAddressCategory()
    this.handleReceiveProvinceList()
    this.handleTypeList()
  },
  methods: {
    // _reqAddressCategory(code) {
    //   return code ? findAreasByCode({ code }) : code !== 0 ? this.handleReceiveProvinceList() : findAreasByCode({ code })
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
    },
    // 查询门店类型
    handleTypeList() {
      findDataListByCode('shop_code_type').then(res => {
        if (res.code === 200 && res.result) {
          this.typeOption = res.result
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
