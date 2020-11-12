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
          <el-form-item label="门店标签" prop="shopTag.value">
            <el-select v-model="form.shopTag.value" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in tagOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="店招标签" prop="shopLogoTag.value">
            <el-select v-model="form.shopLogoTag.value" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in showTagOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="特色标签" prop="characteristicTag.value">
            <el-select v-model="form.characteristicTag.value" placeholder="请选择" clearable>
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in featureTagOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
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
        shopTag: { value: '', name: 'shopTagList.dictCode', matchType: MatchType.EQUAL, type: DataType.STRING },
        shopLogoTag: { value: '', name: 'shopLogoTag', matchType: MatchType.EQUAL, type: DataType.STRING },
        characteristicTag: { value: '', name: 'characteristicTag', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      typeOption: [],
      tagOption: [],
      showTagOption: [],
      featureTagOption: [],
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  mounted() {
    // this._reqAddressCategory()
    this.handleReceiveProvinceList()
    this.handleTypeList()
    this.handleTagList()
  },
  methods: {
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
    },
    handleTagList() {
      findDataListByCode('shop_tag_type').then(res => {
        if (res.code === 200) {
          this.tagOption = res.result || []
        } else {
          this.tagOption = []
        }
      })
      findDataListByCode('shop_logo_tag').then(res => {
        if (res.code === 200) {
          this.showTagOption = res.result || []
        } else {
          this.showTagOption = []
        }
      })
      findDataListByCode('characteristic_tag').then(res => {
        if (res.code === 200) {
          this.featureTagOption = res.result || []
        } else {
          this.featureTagOption = []
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
