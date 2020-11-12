<template>
  <div class="app-container">
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" size="small">
      <el-row class="title">门店基本信息</el-row>
      <el-row class="content">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="门店编码：" prop="name">
              <el-input v-model="form.shopCode" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店名称：" prop="name">
              <el-input v-model="form.name" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店类型：" prop="shopType">
              <el-select v-model="form.shopType" placeholder="请选择门店类型" style="width:100%">
                <el-option v-for="item in typeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店电话：" prop="contactTel">
              <el-input v-model="form.contactTel"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="门店地址：" prop="address" class="no-bottom">
              <el-row>
                <el-col :span="8">
                  <el-form-item prop="provinceId">
                    <el-select
                      v-model="form.provinceId"
                      placeholder="请选择"
                      style="width:100%"
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
                  <el-form-item prop="cityId">
                    <el-select
                      v-model="form.cityId"
                      placeholder="请选择"
                      style="width:100%"
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
                  <el-form-item prop="districtId">
                    <el-select
                      v-model="form.districtId"
                      placeholder="请选择"
                      style="width:100%"
                      @change='val=>handleChange(val,"district")'
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
          <el-col :span="12">
            <el-form-item label="详细地址：" prop="address">
              <el-input v-model="form.address"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="地图定位：" prop="position">
              <el-row>
                <el-col :span="24">
                  <el-input v-model="form.position" id="pickerInput" @input='autoInput'></el-input>
                  <!-- <el-amap-search-box class="search-box" :search-option="searchOption" :on-search-result="onSearchResult"></el-amap-search-box> -->
                  <p class='tip'>提示：拖动图标修改地图定位</p>
                </el-col>
                <!-- <el-col :span="3" :offset="1">
                  <el-button type="primary" @click.prevent="handleSearch" style="width:100%">搜索</el-button>
                </el-col> -->
                <el-col :span="24" style="margin-top:18px">
                  <ali-map
                    ref="addmap"
                    :center="mapCenter"
                    :markers='markers'
                    :events='events'
                    :markerEvents='markerEvents'
                    width='100%'
                    height='300px'/>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>
      <el-row class="title">负责人信息</el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="负责人：" prop="managerName" :label-width="labelWidth">
            <el-input v-model="form.managerName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="负责人电话：" prop="managerTel" :label-width="labelWidth">
            <el-input v-model="form.managerTel"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <el-button size="small" style="width:108px" type="primary" @click="handleSubmit('ruleForm')" :loading="loading">保存</el-button>
    </div>
  </div>
</template>

<script>
import AliMap from '@/components/Map/AliMap.vue'
import { reqAuditDetail, asyncShopInfoUpdate } from '@/api/seller'
import { findAllProvince, findAreasByCode, findDataListByCode } from '@/api/common'
const map = new AMap.Map('container', {
  zoom: 10,
  resizeEnable: true
})
export default {
  name: 'shopDetail',
  components: { AliMap },
  data() {
    let _this = this
    return {
      form: {
        shopCode: '',
        name: '',
        shopType: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        districtId: '',
        districtName: '',
        address: '', // 详细地址
        shopLatitude: '', // 门店纬度
        shopLongitude: '', // 门店经度
        contactTel: '',
        managerName: '', // 负责人姓名
        managerTel: '' // 负责人电话
      },
      rules: {
        name: [
          { required: true, message: '请填写门店名称', trigger: 'blur' },
          { max: 30, message: '最多30个字符', trigger: 'blur' }
        ],
        shopType: [
          { required: true, message: '请选择门店类型', trigger: 'change' }
        ],
        provinceId: [{ required: true, message: '请选择省份', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }],
        districtId: [{ required: true, message: '请选择区', trigger: 'change' }],
        address: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
          { max: 50, message: '最多50个字符', trigger: 'blur' }
        ],
        contactTel: [
          { required: true, message: '请填写门店电话', trigger: 'blur' },
          { pattern: /^[0-9]{11}$/, message: '请输入11位数字', trigger: 'blur' }
        ],
        managerName: [
          { required: true, message: '请填写负责人', trigger: 'blur' },
          { max: 30, message: '最多30个字符', trigger: 'blur' }
        ],
        managerTel: [
          { required: true, message: '请填写负责人电话', trigger: 'blur' },
          { pattern: /^[0-9]{11}$/, message: '请输入11位数字', trigger: 'blur' }
        ]
      },
      provinceList: [],
      cityList: [],
      areaList: [],
      labelWidth: '140px',
      searchOption: {
        city: '成都',
        citylimit: false
      },
      markers: [[121.59996, 31.197646]],
      mapCenter: [121.59996, 31.197646],
      events: {
        'init': () => {
          AMap.plugin('AMap.Geolocation', function() {
            let geolocation = new AMap.Geolocation({
              enableHighAccuracy: true,
              timeout: 10000,
              buttonPosition: 'RB',
              buttonOffset: new AMap.Pixel(10, 20),
              zoomToAccuracy: true
            })
            map.addControl(geolocation)
            geolocation.getCurrentPosition(function(status, result) {
              if (status === 'complete') {
                if (result) {
                  let { lng, lat } = result.position
                  _this.markers = [[lng, lat]]
                  _this.mapCenter = [lng, lat]
                  if (_this.markers && _this.markers[0] && _this.markers[0].length > 0) {
                    _this.$set(_this.form, 'shopLatitude', _this.markers[0][1])
                    _this.$set(_this.form, 'shopLongitude', _this.markers[0][0])
                  }
                }
              } else {
                return false
              }
            })
          })
        }
      },
      markerEvents: {
        'dragend': (data) => {
          if (!data.lnglat) return
          let { lng, lat } = data.lnglat
          _this.markers = [[lng, lat]]
          _this.mapCenter = [lng, lat]
          // 通过经纬度查询详细地址信息
          AMap.plugin('AMap.Geocoder', function() {
            let geocoder = new AMap.Geocoder({
              // city 指定进行编码查询的城市，支持传入城市名、adcode 和 citycode
              // city: '010'
            })
            let lnglat = _this.markers[0]
            geocoder.getAddress(lnglat, function(status, result) {
              if (status === 'complete' && result.info === 'OK') {
                // result为对应的地理位置详细信息
                _this.$set(_this.form, 'position', result.regeocode.formattedAddress)
                if (_this.markers && _this.markers[0] && _this.markers[0].length > 0) {
                  _this.$set(_this.form, 'shopLatitude', _this.markers[0][1])
                  _this.$set(_this.form, 'shopLongitude', _this.markers[0][0])
                }
              }
            })
          })
        }
      },
      typeList: [],
      loading: false
    }
  },
  mounted() {
    const { code } = this.$route.query
    this.form.shopCode = code || ''
    this.handleReceiveProvinceList()
    this.handleTypeList()
    if (code) {
      this.handleDetail()
    }
  },
  methods: {
    // 查询门店类型
    handleTypeList() {
      findDataListByCode('shop_code_type').then(res => {
        if (res.code === 200 && res.result) {
          this.typeList = res.result
        }
      })
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
      if (code && name) {
        findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []
            if (name === 'city') {
              this.form.cityId = ''
              this.form.districtId = ''
              this.form.provinceName = this.provinceList.filter(item => item.code === code)[0].name
            } else if (name === 'district') {
              this.form.districtName = this.areaList.filter(item => item.code === code)[0].name
            } else {
              this.form.districtId = ''
              this.form.cityName = this.cityList.filter(item => item.code === code)[0].name
            }
          } else {
            this[`${name}List`] = []
          }
        })
      }
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          asyncShopInfoUpdate({ ...this.form }).then(res => {
            this.loading = false
            if (res.code === 200) {
              this.$message.success(res.message || '修改成功')
              this.$router.go(-1)
            }
          }).catch(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    // 获取搜索信息
    autoInput() {
      const _this = this
      AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {
        let poiPicker = new PoiPicker({
          input: 'pickerInput'
        })
        // 初始化poiPicker
        _this.poiPickerReady(poiPicker)
      })
    },
    poiPickerReady(poiPicker) {
      const _this = this
      const { position } = this.form
      window.poiPicker = poiPicker
      // 选取了某个POI
      poiPicker.on('poiPicked', function(poiResult) {
        // let source = poiResult.source
        let poi = poiResult.item
        let { lng, lat } = poi.location
        _this.markers = [[lng, lat]]
        _this.mapCenter = [lng, lat]
        _this.form.position = poi.name
        _this.$set(_this.form, 'shopLatitude', lat)
        _this.$set(_this.form, 'shopLongitude', lng)
      })
      poiPicker.onCityReady(function() {
        poiPicker.suggest(position)
      })
    },
    handleDetail() {
      const { code } = this.$route.query
      reqAuditDetail(code).then(res => {
        if (res.code === 200) {
          Object.keys(this.form).forEach(key => {
            if (key === 'provinceId' || key === 'cityId' || key === 'districtId') {
              this.form[key] = res.result[key].toString()
              if (key === 'provinceId') {
                this.handleInitCode(res.result[key], 'city')
              } else if (key === 'cityId') {
                this.handleInitCode(res.result[key], 'area')
              }
            } else {
              this.form[key] = res.result[key]
            }
          })
        }
      })
    },
    handleInitCode(code, name) {
      if (code) {
        findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []
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
@import './style/index.scss';
.app-container {
  font-size: 14px;
  .title {
    border-left: 6px solid rgba(64, 158, 255, 1);
    padding-left: 10px;
    font-size: 16px;
  }
  .label {
    color: $secondColor;
  }
  .content {
    padding: 30px;
  }
  .single-image-small {
    width: 140px;
    height: 120px;
  }
  .single-image-medium {
    width: 240px;
    height: 220px;
  }
  .single-image-large {
    width: 300px;
    height: 200px;
  }
  .multiple-image {
    width: 300px;
    height: 200px;
    margin-right: 20px;
    flex-shrink: 0;
  }
  .btn-save {
    position: absolute;
    bottom: 10px;
    left: 80px;
  }
}
.no-bottom{
  margin-bottom: 0;
}
.tip{
  margin: 0;
  font-size: 12px;
  color: #999999;
}
.btns{
  text-align: center;
  margin-top: 50px;
}
.search-box{
  width: 100%;
  height: 32px;
  box-shadow: none;
  border: 1px solid #DCDFE6;
}
</style>
