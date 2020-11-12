<template>
  <div class="app-container">
    <p>有{{this.tableData.length}}个门店待提交审核<span class="show-detail" @click="handleDetail">查看详情</span></p>
    <el-form :model="form" :rules="rules" ref="ruleForm" label-width="100px" size="small">
      <el-row class="title">门店基本信息</el-row>
      <el-row class="content">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="门店名称：" prop="name">
              <el-input v-model="form.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="门店类型：" prop="shopType">
              <el-select v-model="form.shopType" placeholder="请选择门店类型" style="width:100%">
                <el-option v-for="item in typeList" :key="item.code" :label="item.name" :value="item.code"></el-option>
              </el-select>
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
        <el-row>
          <el-col :span="12">
            <el-form-item label="店铺招牌：" prop="shopSignList">
              <upload-file
                type="IMAGE"
                :limit="1"
                :fileList="form.shopSignList"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label='营业时间：'
              prop='shopTimes'
              >
                <!-- <el-time-picker
                  is-range
                  v-model="form.shopTimes"
                  style="width:100%;margin-bottom:10px"
                  range-separator="-"
                  value-format="HH:mm"
                  format='HH:mm'
                  ref="selectTime"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  @change='handleChangeDate'
                  :picker-options="{
                    selectableRange: '18:30:00 - 20:30:00'
                  }">
                </el-time-picker> -->
                <time-picker :isRange='true' rangeSeparator="-" :times="form.shopTimes" @change="handleChangeDate"/>
                  <!-- 预备多个营业时间 -->
                  <!-- <el-col :span="1" :offset="1">
                    <i class="el-icon-remove-outline iconClass" v-show="shopTimeList.length>1" @click="handleRemove(index)"></i>
                  </el-col>
                  <el-col :span="1" :offset="1">
                    <i class="el-icon-circle-plus-outline iconClass" @click="handleAdd"></i>
                  </el-col> -->
            </el-form-item>
          </el-col>
        </el-row>
      </el-row>

      <el-row class="title">营业资质</el-row>
      <el-row class="content">
        <el-row>
          <el-col :span="24">
            <el-form-item label="营业执照：" prop="businessLicenseImgList" :label-width="labelWidth">
              <p class="tip">支持jpg、png格式的图片，大小在1M以内</p>
              <upload-file
                type="IMAGE"
                :limit="1"
                :fileList="form.businessLicenseImgList"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-form-item label="公司名称：" prop="companyName" :label-width="labelWidth">
                  <el-input v-model="form.companyName"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="统一社会信用代码：" prop="creditCode" :label-width="labelWidth">
                  <el-input v-model="form.creditCode"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="法定代表人：" prop="legalPerson" :label-width="labelWidth">
                  <el-input v-model="form.legalPerson"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="住所：" prop="companyAddress" :label-width="labelWidth">
                  <el-input :maxlength="50" v-model="form.companyAddress"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="营业期限：" prop="businessTerm" :label-width="labelWidth">
                  <el-row :gutter="10">
                    <el-col :span="16" v-if="!form.businessTermCheck">
                      <el-date-picker
                        v-model="form.businessTerm"
                        type="date"
                        style="width:100%"
                        value-format="yyyy-MM-dd"
                        format='yyyy-MM-dd'
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-col>
                    <el-col :span="16" v-else>
                      <el-input disabled value="永久"></el-input>
                    </el-col>
                    <el-col :span="7">
                      <el-checkbox v-model="form.businessTermCheck">长期有效</el-checkbox>
                    </el-col>
                  </el-row>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="法人身份证：" prop="identity" :label-width="labelWidth">
              <p class="tip">支持jpg、png格式的图片，大小在1M以内</p>
              <div class="video-box">
                <div class="video-image">
                  <el-form-item prop="identityCardFrontImg" style='margin-bottom:0'>
                    <upload-file
                      type="IMAGE"
                      :limit="1"
                      :fileList="form.identityCardFrontImgList"
                    />
                  </el-form-item>
                  <div class="image-txt">正面</div>
                </div>
                <div class="video-file">
                  <el-form-item prop="identityCardBackImg" style='margin-bottom:0'>
                    <upload-file
                      type="IMAGE"
                      :limit="1"
                      :fileList="form.identityCardBackImgList"
                    />
                  </el-form-item>
                  <div class="image-txt">反面</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-form-item label="姓名：" prop="legalPersonName" :label-width="labelWidth">
                  <el-input v-model="form.legalPersonName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="民族：" prop="legalPersonNation" :label-width="labelWidth">
                  <el-input v-model="form.legalPersonNation"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="身份证号：" prop="legalPersonIdentityCard" :label-width="labelWidth">
                  <el-input v-model="form.legalPersonIdentityCard" @blur="handleBlur(form.legalPersonIdentityCard, 'legalPersonIdentityCard', 'legalPersonSex')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="性别：" prop="legalPersonSex" :label-width="labelWidth">
                  <el-radio-group v-model="form.legalPersonSex">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="地址：" prop="legalPersonAddress" :label-width="labelWidth">
                  <el-input v-model="form.legalPersonAddress"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="有效期：" prop="identityCardValidity" :label-width="labelWidth">
              <el-row :gutter="10">
                <el-col :span="16" v-if="!form.identityCardValidityCheck">
                    <el-date-picker
                      v-model="form.identityCardValidity"
                      type="date"
                      style="width:100%"
                      value-format="yyyy-MM-dd"
                      format='yyyy-MM-dd'
                      placeholder="选择日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="16" v-else>
                    <el-input disabled value="永久"></el-input>
                </el-col>
                <el-col :span="7">
                  <el-checkbox v-model="form.identityCardValidityCheck">长期有效</el-checkbox>
                </el-col>
              </el-row>
            </el-form-item>
            <el-row>
              <el-col :span="24">
                <el-form-item label="认证主体：" prop="authSubject" :label-width="labelWidth">
                  <el-radio-group v-model="form.authSubject">
                    <el-radio :label="1">法人</el-radio>
                    <el-radio :label="2">非法人</el-radio>
                  </el-radio-group>
                  <div class="tips">提示：以后只能绑定此认证主体的银行卡提现，以下信息还会传给银行开户，请仔细填写</div>
                </el-form-item>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-show="form.authSubject===2">
            <el-form-item label="非法人身份证：" prop="nonIdentity" :label-width="labelWidth">
              <p class="tip">支持jpg、png格式的图片，大小在1M以内</p>
              <div class="video-box">
                <div class="video-image">
                  <el-form-item prop="nonIdentityCardFrontImgList" style='margin-bottom:0'>
                    <upload-file
                      type="IMAGE"
                      :limit="1"
                      :fileList="form.nonIdentityCardFrontImgList"
                    />
                  </el-form-item>
                  <div class="image-txt">正面</div>
                </div>
                <div class="video-file">
                  <el-form-item prop="nonIdentityCardBackImgList" style='margin-bottom:0'>
                    <upload-file
                      type="IMAGE"
                      :limit="1"
                      :fileList="form.nonIdentityCardBackImgList"
                    />
                  </el-form-item>
                  <div class="image-txt">反面</div>
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row v-show="form.authSubject===2">
          <el-col :span="12">
            <el-row>
              <el-col :span="24">
                <el-form-item label="姓名：" prop="nonLegalPersonName" :label-width="labelWidth">
                  <el-input v-model="form.nonLegalPersonName"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="民族：" prop="nonLegalPersonNation" :label-width="labelWidth">
                  <el-input v-model="form.nonLegalPersonNation"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="身份证号：" prop="nonLegalPersonIdentityCard" :label-width="labelWidth">
                  <el-input v-model="form.nonLegalPersonIdentityCard" @blur="handleBlur(form.nonLegalPersonIdentityCard, 'nonLegalPersonIdentityCard', 'nonLegalPersonSex')"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="性别：" prop="nonLegalPersonSex" :label-width="labelWidth">
                  <el-radio-group v-model="form.nonLegalPersonSex">
                    <el-radio label="男">男</el-radio>
                    <el-radio label="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="地址：" prop="nonLegalPersonAddress" :label-width="labelWidth">
                  <el-input v-model="form.nonLegalPersonAddress"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="有效期：" prop="nonIdentityCardValidity" :label-width="labelWidth">
              <el-row :gutter="10">
                <el-col :span="16" v-if="!form.nonIdentityCardValidityCheck">
                    <el-date-picker
                      v-model="form.nonIdentityCardValidity"
                      type="date"
                      style="width:100%"
                      value-format="yyyy-MM-dd"
                      format='yyyy-MM-dd'
                      placeholder="选择日期">
                    </el-date-picker>
                </el-col>
                <el-col :span="16" v-else>
                    <el-input disabled value="永久"></el-input>
                </el-col>
                <el-col :span="7">
                  <el-checkbox v-model="form.nonIdentityCardValidityCheck">长期有效</el-checkbox>
                </el-col>
              </el-row>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-row v-show="form.authSubject===2">
              <el-col :span="24" class="map-col-style">
                <el-form-item label="法人授权书：" prop="licenseAgreementPdfList" :label-width="labelWidth">
                  <p class="tip">支持pdf格式的文件，只能上传1个文件，大小在不超过50M</p>
                  <upload-file
                    type="FILE"
                    :limit="1"
                    :fileList="form.licenseAgreementPdfList"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="入驻协议：" prop="joinAgreementPdfList" :label-width="labelWidth">
                  <p class="tip">支持pdf格式的文件，只能上传1个文件，大小在不超过50M</p>
                  <upload-file
                    type="FILE"
                    :limit="1"
                    :fileList="form.joinAgreementPdfList"
                  />
                </el-form-item>
              </el-col>
            </el-row>
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
      <el-row>
        <el-col :span="10">
          <el-form-item label="门店登录账号：" prop="bossAccount" :label-width="labelWidth">
            <el-input v-model="form.bossAccount"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" size="small" style="float:right" :loading="searchLoading" @click="handleSearchAccount(form.bossAccount)">查询</el-button>
        </el-col>
      </el-row>
    </el-form>
    <div class="btns">
      <el-button size="small" @click='handleDraft()'>保存草稿</el-button>
      <el-button size="small" type="primary" @click="handleSubmit('ruleForm')">提交审核</el-button>
    </div>
    <show-draft :visible.sync='visible' :tableData='tableData' @delete='handleTableDelete' @edit='handleTableDetail'/>
  </div>
</template>

<script>
import AliMap from '@/components/Map/AliMap.vue'
import ImageList from '@/components/UploadFile'
import TimePicker from '@/components/TimePicker'
import { findAllProvince, findAreasByCode, findDataListByCode } from '@/api/common'
import { asyncAddShop, asyncAddShopDraf, fetchShopDraf, asyncDelShopDraf, fetchShopDrafById, asyncRegistered } from '@/api/seller'
import { AddShop } from './components'
const map = new AMap.Map('container', {
  zoom: 16,
  resizeEnable: true
})
export default {
  name: 'shopDetail',
  components: {
    AliMap,
    ImageList,
    ...AddShop,
    TimePicker,
    UploadFile: resolve => {
      return require(['@/components/UploadFile/index'], resolve)
    }
  },
  data() {
    this.formatAddressArea = (provinceName, districtName, cityName) => {
      if (!provinceName && !districtName && !cityName) {
        return '-'
      }
      return `${provinceName}-${cityName}-${districtName}`
    }
    let checkIdentity = (rule, value, callback) => {
      if (this.form.identityCardFrontImgList.length === 0 || this.form.identityCardBackImgList.length === 0) {
        callback(new Error('请上传身份证件照'))
      } else {
        callback()
      }
    }
    let _this = this
    let validateCard1 = (rule, value, callback) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(value) === false) {
        callback(new Error('请输入正确的身份证号码'))
      } else {
        callback()
      }
    }
    let validateCard2 = (rule, value, callback) => {
      if (this.form.authSubject === 2) {
        let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
        if (reg.test(value) === false) {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      searchLoading: false,
      isAudit: false,
      visible: false,
      tableData: [],
      form: {
        name: '', // 门店名称
        shopType: '', // 门店类型
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        districtId: '',
        districtName: '',
        address: '', // 详细地址
        shopSignList: [], // 店招
        shopSign: '', // 店招url
        businessLicenseImgList: [], // 营业执照
        businessLicenseImg: '', // 营业执照url
        beginTime: '', // 营业开始时间
        endTime: '', // 营业结束时间
        companyName: '', // 公司名称
        creditCode: '', // 社会代码
        identityCardFrontImg: '',
        identityCardBackImg: '',
        identityCardFrontImgList: [],
        identityCardBackImgList: [],
        legalPersonName: '', // 法人姓名
        legalPersonSex: '', // 法人性别
        legalPersonNation: '', // 法人民族
        legalPersonIdentityCard: '', // 法人身份证号
        legalPersonAddress: '', // 法人地址
        identityCardValidity: '', // 法人有效期
        identityCardValidityCheck: false,
        authSubject: 1, // 认证主体
        nonIdentityCardFrontImgList: [], // 非法人身份证正面照
        nonIdentityCardBackImgList: [], // 非法人反面照
        nonIdentityCardFrontImg: '', // 非法人身份证正面照url
        nonIdentityCardBackImg: '', // 非法人反面照url
        nonLegalPersonName: '', // 非法人姓名
        nonLegalPersonSex: '', // 非法人性别
        nonLegalPersonNation: '', // 非法人民族
        nonLegalPersonIdentityCard: '', // 非法人身份证号码
        nonLegalPersonAddress: '', // 非法人地址
        nonIdentityCardValidity: '', // 非法人有效期
        nonIdentityCardValidityCheck: false,
        licenseAgreementPdfList: [], // 法人授权书
        licenseAgreementPdf: '', // 法人授权书url
        joinAgreementPdfList: [], // 入驻协议
        joinAgreementPdf: '', // 入驻协议url
        managerName: '', // 负责人姓名
        managerTel: '', // 负责人电话
        bossAccount: '', // 门店登录账号
        shopLatitude: '', // 门店纬度
        shopLongitude: '', // 门店经度
        shopTimes: ['', ''],
        businessTerm: '',
        businessTermCheck: false,
        legalPerson: '', // 法定代表人
        companyAddress: '' // 住所
      },
      rules: {
        name: [
          { required: true, message: '请填写门店名称', trigger: 'blur' },
          { max: 30, message: '最多30个字符', trigger: 'blur' }
        ],
        shopType: [
          { required: true, message: '请选择门店类型', trigger: 'change' }
        ],
        position: [
          { required: true, message: '请选择门店定位', trigger: 'blur' }
        ],
        provinceId: [{ required: true, message: '请选择省份', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }],
        districtId: [{ required: true, message: '请选择区', trigger: 'change' }],
        address: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
          { max: 50, message: '最多50个字符', trigger: 'blur' }
        ],
        shopTimes: [
          { type: 'array', required: true, message: '请填写营业时间', trigger: 'change' }
        ],
        businessLicenseImgList: [
          { type: 'array', required: true, message: '请上传营业执照', trigger: 'change' }
        ],
        identity: [
          { validator: checkIdentity, trigger: 'change' }
        ],
        authSubject: [
          { required: true, message: '请选择认证主体', trigger: 'change' }
        ],
        image: [
          { required: true, message: '请上传入驻协议', trigger: 'change' }
        ],
        managerName: [
          { required: true, message: '请填写负责人', trigger: 'blur' },
          { max: 30, message: '最多30个字符', trigger: 'blur' }
        ],
        managerTel: [
          { required: true, message: '请填写负责人电话', trigger: 'blur' },
          { pattern: /^[0-9]{11}$/, message: '请输入11位数字', trigger: 'blur' }
        ],
        bossAccount: [
          { required: true, message: '请填写门店登录账号', trigger: 'blur' },
          { pattern: /^[0-9]{11}$/, message: '请输入11位数字', trigger: 'blur' }
        ],
        legalPersonIdentityCard: [
          { validator: validateCard1, trigger: 'blur' }
        ],
        nonLegalPersonIdentityCard: [
          { validator: validateCard2, trigger: 'blur' }
        ]
      },
      provinceList: [],
      cityList: [],
      areaList: [],
      shopTimeList: [[]],
      labelWidth: '140px',
      searchOption: {
        city: '成都',
        citylimit: false
      },
      markers: [[121.59996, 31.197646]],
      mapCenter: [121.59996, 31.197646],
      // markers: [[104.06281, 30.54654]],
      // mapCenter: [104.06281, 30.54654],
      map: null,
      events: {
        'init': () => {
          AMapUI.loadUI(['misc/PositionPicker'], function() {
            AMap.plugin('AMap.Geolocation', function() {
              let geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,
                timeout: 10000,
                buttonPosition: 'RB',
                buttonOffset: new AMap.Pixel(10, 20),
                zoomToAccuracy: true,
                showMarker: true,
                extensions: 'all'
              })
              map.addControl(geolocation)
              // 获取当前位置
              geolocation.getCurrentPosition((status, data) => {
                if (data) {
                  let { lng, lat } = data.position
                  _this.markers = [[lng, lat]]
                  _this.mapCenter = [lng, lat]
                  if (_this.markers && _this.markers[0] && _this.markers[0].length > 0) {
                    _this.$set(_this.form, 'shopLatitude', _this.markers[0][1])
                    _this.$set(_this.form, 'shopLongitude', _this.markers[0][0])
                  }
                }
              })
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
      typeList: [] // 门店类型列表
    }
  },
  beforeMount() {
    const isAudit = this.$route.query.isAudit
    isAudit === '1' ? (this.isAudit = true) : (this.isAudit = false)
  },
  mounted() {
    this.handleReceiveProvinceList()
    this.handleTypeList()
    this.handleDraftList()
    this.initTime()
  },
  methods: {
    initTime() {
      let date = new Date()
      let hour = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
      this.form.shopTimes = [hour + ':00', hour + ':00']
    },
    // 查询门店类型
    handleTypeList() {
      findDataListByCode('shop_code_type').then(res => {
        if (res.code === 200 && res.result) {
          this.typeList = res.result || []
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
    },
    formatTime(time, format) {
      if (!time) return '-'
      let t = new Date(time)
      let tf = function(i) { return (i < 10 ? '0' : '') + i }
      return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
        switch (a) {
          case 'yyyy':
            return tf(t.getFullYear())
          case 'MM':
            return tf(t.getMonth() + 1)
          case 'mm':
            return tf(t.getMinutes())
          case 'dd':
            return tf(t.getDate())
          case 'HH':
            return tf(t.getHours())
          case 'ss':
            return tf(t.getSeconds())
        }
      })
    },
    handleDown(link) {
      window.open(link)
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
    handleAdd() {
      if (this.shopTimeList.length > 4) return
      this.shopTimeList.push([])
    },
    handleRemove(index) {
      if (index !== -1) {
        this.shopTimeList.splice(index, 1)
      }
    },
    // 获取草稿列表
    handleDraftList() {
      fetchShopDraf({}).then(res => {
        if (res.code === 200 && res.result) {
          this.tableData = res.result.itemVOs || []
        } else {
          this.tableData = []
        }
      }).catch(() => {
        this.tableData = []
      })
    },
    // 查看待提交审核
    handleDetail() {
      this.visible = true
    },
    handleSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const {
            id, name, shopType, provinceId, provinceName, cityId, cityName, districtId, districtName, address, legalPerson, companyAddress,
            shopSignList, businessLicenseImgList, beginTime, endTime, companyName, creditCode, identityCardFrontImgList,
            identityCardBackImgList, legalPersonName, legalPersonSex, legalPersonNation, legalPersonIdentityCard, legalPersonAddress,
            identityCardValidity, authSubject, nonIdentityCardFrontImgList, nonLegalPersonName, nonLegalPersonSex,
            nonLegalPersonNation, nonLegalPersonIdentityCard, nonLegalPersonAddress, nonIdentityCardValidity, nonIdentityCardBackImgList, licenseAgreementPdfList,
            joinAgreementPdfList, managerName, managerTel, bossAccount, shopLatitude, shopLongitude, businessTerm, businessTermCheck,
            identityCardValidityCheck, nonIdentityCardValidityCheck } = this.form
          asyncAddShop({
            id, name, shopType, provinceId, provinceName, cityId, cityName, districtId, districtName, address,
            shopSign: shopSignList[0] && shopSignList[0].fileUrl, legalPerson, companyAddress,
            businessLicenseImg: businessLicenseImgList[0] && businessLicenseImgList[0].fileUrl,
            beginTime, endTime, companyName, creditCode,
            identityCardFrontImg: identityCardFrontImgList[0] && identityCardFrontImgList[0].fileUrl,
            identityCardBackImg: identityCardBackImgList[0] && identityCardBackImgList[0].fileUrl,
            legalPersonName, legalPersonSex, legalPersonNation, legalPersonIdentityCard, legalPersonAddress,
            identityCardValidity: identityCardValidityCheck ? '永久' : identityCardValidity,
            authSubject,
            nonIdentityCardFrontImg: nonIdentityCardFrontImgList[0] && nonIdentityCardFrontImgList[0].fileUrl, // 非法人身份证正面照
            nonIdentityCardBackImg: nonIdentityCardBackImgList[0] && nonIdentityCardBackImgList[0].fileUrl, // 非法人反面照
            nonLegalPersonName, nonLegalPersonSex, nonLegalPersonNation, nonLegalPersonIdentityCard, nonLegalPersonAddress,
            nonIdentityCardValidity: nonIdentityCardValidityCheck ? '永久' : nonIdentityCardValidity,
            licenseAgreementPdf: licenseAgreementPdfList[0] && licenseAgreementPdfList[0].fileUrl, // 法人授权书
            joinAgreementPdf: joinAgreementPdfList[0] && joinAgreementPdfList[0].fileUrl, // 入驻协议
            managerName, managerTel, bossAccount, shopLatitude, shopLongitude,
            businessTerm: businessTermCheck ? '永久' : businessTerm
          }).then(res => {
            if (res.code === 200) {
              this.$message.success('添加成功~')
              this.handleDraftList()
              this.$refs[formName].resetFields()
              this.form.shopSignList = []
              this.form.businessLicenseImgList = []
              this.form.identityCardFrontImgList = []
              this.form.identityCardBackImgList = []
              this.form.identityCardBackImgList = []
              this.form.nonIdentityCardFrontImgList = []
              this.form.nonIdentityCardBackImgList = []
              this.form.licenseAgreementPdfList = []
              this.form.joinAgreementPdfList = []
            }
          })
        } else {
          return false
        }
      })
    },
    // 保存草稿
    handleDraft() {
      if (this.form.name) {
        const {
          id, name, shopType, provinceId, provinceName, cityId, cityName, districtId, districtName, address, legalPerson, companyAddress, legalPersonAddress,
          shopSignList, businessLicenseImgList, beginTime, endTime, companyName, creditCode, identityCardFrontImgList,
          identityCardBackImgList, legalPersonName, legalPersonSex, legalPersonNation, legalPersonIdentityCard,
          identityCardValidity, authSubject, nonIdentityCardFrontImgList, nonLegalPersonName, nonLegalPersonSex,
          nonLegalPersonNation, nonLegalPersonIdentityCard, nonLegalPersonAddress, nonIdentityCardValidity, nonIdentityCardBackImgList, licenseAgreementPdfList,
          joinAgreementPdfList, managerName, managerTel, bossAccount, shopLatitude, shopLongitude, businessTerm, businessTermCheck,
          identityCardValidityCheck, nonIdentityCardValidityCheck } = this.form
        asyncAddShopDraf({
          id, name, shopType, provinceId, provinceName, cityId, cityName, districtId, districtName, address,
          shopSign: shopSignList[0] && shopSignList[0].fileUrl, legalPerson, companyAddress,
          businessLicenseImg: businessLicenseImgList[0] && businessLicenseImgList[0].fileUrl,
          beginTime, endTime, companyName, creditCode,
          identityCardFrontImg: identityCardFrontImgList[0] && identityCardFrontImgList[0].fileUrl,
          identityCardBackImg: identityCardBackImgList[0] && identityCardBackImgList[0].fileUrl,
          legalPersonName, legalPersonSex, legalPersonNation, legalPersonIdentityCard, legalPersonAddress,
          identityCardValidity: identityCardValidityCheck ? '永久' : identityCardValidity,
          authSubject,
          nonIdentityCardFrontImg: nonIdentityCardFrontImgList[0] && nonIdentityCardFrontImgList[0].fileUrl, // 非法人身份证正面照
          nonIdentityCardBackImg: nonIdentityCardBackImgList[0] && nonIdentityCardBackImgList[0].fileUrl, // 非法人反面照
          nonLegalPersonName, nonLegalPersonSex, nonLegalPersonNation, nonLegalPersonIdentityCard, nonLegalPersonAddress,
          nonIdentityCardValidity: nonIdentityCardValidityCheck ? '永久' : nonIdentityCardValidity,
          licenseAgreementPdf: licenseAgreementPdfList[0] && licenseAgreementPdfList[0].fileUrl, // 法人授权书
          joinAgreementPdf: joinAgreementPdfList[0] && joinAgreementPdfList[0].fileUrl, // 入驻协议
          managerName, managerTel, bossAccount, shopLatitude, shopLongitude,
          businessTerm: businessTermCheck ? '永久' : businessTerm
        }).then(res => {
          if (res.code === 200) {
            this.$message.success('添加成功~')
            this.handleDraftList()
          }
        })
      }
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
        let source = poiResult.source // eslint-disable-line
        let poi = poiResult.item
        let { lng, lat } = poi.location
        _this.markers = [[lng, lat]]
        _this.mapCenter = [lng, lat]
        _this.form.position = poi.name
        // _this.$set(_this.form, 'shopLatitude', lat)
        // _this.$set(_this.form, 'shopLongitude', lng)
      })
      poiPicker.onCityReady(function() {
        poiPicker.suggest(position)
      })
    },
    handleImagesChange(name, fileList) {
      this.form[name] = fileList.map(file => {
        return {
          cover: false,
          type: 'VIDEO',
          typeValue: file.fileUrl
        }
      })
    },
    handleChangeDate(val) {
      if (val && val.length > 0) {
        this.form.beginTime = val[0]
        this.form.endTime = val[1]
      }
    },
    // 删除草稿
    handleTableDelete(id, index) {
      asyncDelShopDraf(id).then(res => {
        if (res.code === 200) {
          this.tableData.splice(index, 1)
        }
      })
    },
    // 查看草稿详情
    handleTableDetail(id) {
      fetchShopDrafById(id).then(res => {
        if (res.code === 200) {
          Object.keys(this.form).forEach(key => {
            if (Array.isArray(this.form[key]) && key !== 'shopTimes') {
              if (res.result[key.substr(0, key.length - 4)]) {
                this.form[key] = [{
                  fileUrl: res.result[key.substr(0, key.length - 4)],
                  name: res.result[key.substr(0, key.length - 4)]
                }]
              } else {
                this.form[key] = []
              }
            } else if (key === 'shopTimes') {
              this.form[key] = [res.result['beginTime'] || '', res.result['endTime'] || '']
            } else if (key === 'provinceId' || key === 'cityId' || key === 'districtId') {
              this.form[key] = res.result[key] ? res.result[key].toString() : ''
            } else if (key === 'businessTermCheck' || key === 'identityCardValidityCheck' || key === 'nonIdentityCardValidityCheck') {
              this.$set(this.form, key, res.result[key] === '永久')
            } else if (key === 'shopLatitude' || key === 'shopLongitude') {
              this.form[key] = res.result[key] || ''
              this.markers = [[res.result.shopLongitude, res.result.shopLatitude]]
              this.mapCenter = [res.result.shopLongitude, res.result.shopLatitude]
            } else {
              this.form[key] = res.result[key] || ''
            }
          })
          this.form.id = res.result.id
          this.handleInitCode(res.result.provinceId, 'city')
          this.handleInitCode(res.result.cityId, 'area')
          this.visible = false
        }
      })
    },
    // 身份证号最后一位如果是小写字母就转换为大写,并判断性别
    handleBlur(val, name, sex) {
      this.$refs.ruleForm.validateField(name, (errorMsg) => {
        if (!errorMsg) {
          let reg = /[a-z]$/
          if (reg.test(val)) {
            let str = val.substring(0, val.length - 1) + val.substring(val.length - 1).toUpperCase()
            this.$set(this.form, name, str)
          }
          // 获取出生日期
          let sexno = ''
          if (val.length === 15) { // 15位身份证号码
            sexno = val.substring(14, 15)
          } else {
            sexno = val.substring(16, 17)
          }
          let tempid = sexno % 2
          if (tempid === 0) {
            this.$set(this.form, sex, '女')
          } else {
            this.$set(this.form, sex, '男')
          }
        }
      })
    },
    // 查询门店登录账号是否注册
    handleSearchAccount(account) {
      asyncRegistered({ phone: account }).then(res => {
        if (res.code === 200) {
          if (res.result) {
            this.$message.info('存在该账号，可以添加门店')
          } else {
            this.$message.info('暂无此商家账号，请先注册账号')
          }
        }
      })
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
  .tips {
    color: red;
    font-size: 12px;
    margin-top: 5px;
    width: 200%;
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
.iconClass{
  font-size: 24px;
  cursor: pointer;
  color: #999999;
  line-height: 32px;
}
.btns{
  text-align: center;
  margin-top: 50px;
}
.show-detail{
  cursor: pointer;
  color: #0099CC;
  margin-left: 5px;
}
.search-box{
  width: 100%;
  height: 32px;
  box-shadow: none;
  border: 1px solid #DCDFE6;
}
.video-box {
  > div {
    display: inline-block;
    vertical-align: top;

    .image-txt {
      color: #606266;
      font-size: 12px;
      text-align: center;
      padding-top: 0;
      margin:0
    }
  }

  .video-image {
  }

  .video-file {
  }
}
</style>
