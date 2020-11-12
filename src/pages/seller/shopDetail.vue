<template>
  <div class="app-container">
    <el-row class="title">门店基本信息</el-row>
    <el-row class="content">
      <el-row>
        <el-col :span="12">
          <span class="label">门店编码：</span>
          <span>{{formatNoneValue(shop['shopCode'])}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="label">门店名称：</span>
          <span>{{formatNoneValue(shop['name'])}}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">门店类型：</span>
          <span>{{formatNoneValue(shop['shopTypeValue'])}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="label">地址区域：</span>
          <span>{{formatAddressArea(shop['provinceName'],shop['cityName'],shop['districtName'])}}</span>
        </el-col>
        <el-col :span="12">
          <span class="label">详细地址：</span>
          <span>{{formatNoneValue(shop['address'])}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="map-col-style">
          <span class="label">地图定位：</span>
          <ali-map :center="[shop['shopLongitude'],shop['shopLatitude']]" :markers='[[shop["shopLongitude"],shop["shopLatitude"]]]'/>
        </el-col>
        <el-col :span="12" class="map-col-style">
          <span class="label">门店电话：</span>
          <span>{{formatNoneValue(shop['contactTel'])}}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" class="map-col-style">
          <span class="label label-width">店招：</span>
          <el-image class="single-image-small" :src="shop['shopSign']" :preview-src-list="[shop['shopSign']]"></el-image>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="label">营业时间：</span>
          <span>{{formatNoneValue(shopTime)}}</span>
        </el-col>
      </el-row>
    </el-row>

    <el-row class="title">营业资质</el-row>
    <el-row class="content">
      <el-row>
        <el-col :span="24">营业执照信息</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">公司名称：</span>
              <span>{{formatNoneValue(qualify['companyName'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">统一社会信用代码：</span>
              <span>{{formatNoneValue(qualify['creditCode'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">法定代表人：</span>
              <span>{{formatNoneValue(qualify['legalPerson'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">住所：</span>
              <span>{{formatNoneValue(qualify['legalPersonAddress'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">营业期限：</span>
              <span>{{formatNoneValue(qualify['businessTerm'])}}</span>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-image class="single-image-medium" :src="qualify['businessLicenseImg']" :preview-src-list="[qualify['businessLicenseImg']]"></el-image>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">法人身份证</el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">姓名：</span>
              <span>{{formatNoneValue(master['legalPersonName'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">性别：</span>
              <span>{{formatNoneValue(master['legalPersonSex'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">民族：</span>
              <span>{{formatNoneValue(master['legalPersonNation'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">身份证号：</span>
              <span>{{formatNoneValue(master['legalPersonIdentityCard'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">地址：</span>
              <span>{{formatNoneValue(master['legalPersonAddress'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">有效期：</span>
              <span>{{formatNoneValue(master['identityCardValidity'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">认证主体：</span>
              <span>{{master['authSubject']===1?'法人':'非法人'}}</span>
              <div class="tips" style="margin-left:65px">审核通过后，此门店只能绑定“{{formatNoneValue(master['legalPerson'])}}”的银行卡</div>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12" :style="{display:'flex',flexWrap: 'nowrap'}">
          <el-image class="multiple-image" :src="master['identityCardFrontImg']" :preview-src-list="[master['identityCardFrontImg']]"></el-image>
          <el-image class="multiple-image" :src="master['identityCardBackImg']" :preview-src-list="[master['identityCardBackImg']]"></el-image>
        </el-col>
      </el-row>
      <el-row v-if="master['authSubject']===2">
        <el-col :span="24">非法人身份证</el-col>
      </el-row>
      <el-row v-if="master['authSubject']===2">
        <el-col :span="12">
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">姓名：</span>
              <span>{{formatNoneValue(master2['nonLegalPersonName'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">性别：</span>
              <span>{{formatNoneValue(master2['nonLegalPersonSex'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">民族：</span>
              <span>{{formatNoneValue(master2['nonLegalPersonNation'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">身份证号：</span>
              <span>{{formatNoneValue(master2['nonLegalPersonIdentityCard'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">地址：</span>
              <span>{{formatNoneValue(master2['nonLegalPersonAddress'])}}</span>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">有效期：</span>
              <span>{{formatNoneValue(master2['nonIdentityCardValidity'])}}</span>
            </el-col>
          </el-row> 
        </el-col>
        <el-col :span="12" :style="{display:'flex',flexWrap: 'nowrap'}">
          <el-image class="multiple-image" :src="master2['nonIdentityCardFrontImg']" :preview-src-list="[master2['nonIdentityCardFrontImg']]"></el-image>
          <el-image class="multiple-image" :src="master2['nonIdentityCardBackImg']" :preview-src-list="[master2['nonIdentityCardBackImg']]"></el-image>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-row v-if="master['authSubject']!==1">
            <el-col :span="24" class="map-col-style">
              <span class="label qualify-name">法人授权书：</span>
              <el-link type="primary" @click="handleDown(qualify['licenseAgreementPdf'])">{{qualify['licenseAgreementPdf']}}</el-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <span class="label qualify-name">入驻协议：</span>
              <el-link type="primary" @click="handleDown(qualify['joinAgreementPdf'])">{{qualify['joinAgreementPdf']}}</el-link>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="label qualify-name">负责人：</span>
          <span>{{formatNoneValue(shop['managerName'])}}</span>
        </el-col>
        <el-col :span="12">
          <span class="label qualify-name">负责人电话：</span>
          <span>{{formatNoneValue(shop['managerTel'])}}</span>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <span class="label qualify-name">门店登录账号：</span>
          <span>{{formatNoneValue(shop['bossAccount'])}}</span>
        </el-col>
      </el-row>
    </el-row>

    <el-card class="box-card" :style="{minHeight:'300px',position:'relative'}" v-if="isAudit == 0">
      <el-form ref="form" :model="form" label-width="120px" size="mini">
        <el-form-item label="审核结果" prop="audit">
          <el-radio-group v-model="form.audit">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="驳回原因" prop="reason" v-show="form.audit===2">
          <el-select v-model="form.reason" placeholder="请选择">
            <el-option v-for="item in rejectOption" :key="item.code" :label="item.name" :value="item.name"></el-option>
            <el-option label="其他" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" " prop="detail" v-show="form.audit===2 && form.reason==='other'">
          <el-input v-model="form.detail" type="textarea" :autosize="{ minRows: 4, maxRows: 6}" placeholder="请填写详细原因" :style="{width:'500px'}" />
        </el-form-item>
      </el-form>
      <el-button class="btn-save" type="primary" size="small" @click="handleSave" :loading="loading">保存</el-button>
    </el-card>
  </div>
</template>

<script>
import AliMap from '@/components/Map/AliMap.vue'
import { reqAuditDetail, asyncShopAudit } from '@/api/seller'
import { findDataListByCode } from '@/api/common'
export default {
  name: 'shopDetail',
  components: { AliMap },
  data() {
    this.formatAddressArea = (provinceName, cityName, districtName) => {
      if (!provinceName && !cityName && !districtName) {
        return '-'
      }
      return `${provinceName}-${cityName}-${districtName}`
    }
    return {
      isAudit: 0,
      form: {
        audit: '',
        reason: '',
        detail: ''
      },
      rejectOption: [],
      shop: {
        shopCode: '',
        name: '',
        shopTypeValue: '',
        provinceName: '',
        districtName: '',
        cityName: '',
        address: '',
        shopLongitude: '104.06306',
        shopLatitude: '30.54574',
        managerTel: '',
        shopSign: '',
        managerName: '',
        bossAccount: '',
        contactTel: ''
      },
      qualify: {
        joinAgreementPdf: '',
        companyName: '',
        creditCode: '',
        legalPerson: '',
        legalPersonAddress: '',
        businessTerm: '',
        legalPersonSex: '',
        legalPersonNation: '',
        businessLicenseImg: '',
        licenseAgreementPdf: ''
      },
      master: {
        legalPerson: '',
        legalPersonName: '',
        legalPersonSex: '',
        legalPersonNation: '',
        legalPersonIdentityCard: '',
        legalPersonAddress: '',
        identityCardValidity: '',
        identityCardFrontImg: '',
        identityCardBackImg: '',
        authSubject: 1
      },
      master2: {
        nonLegalPersonName: '小明',
        nonLegalPersonSex: '男',
        nonLegalPersonNation: '汉',
        nonLegalPersonIdentityCard: '51102592392839829829382',
        nonLegalPersonAddress: '四川省成都市高新区天府三街99号太平洋保险大厦',
        nonIdentityCardValidity: '',
        nonIdentityCardFrontImg: '',
        nonIdentityCardBackImg: ''
      },
      manage: [
        { bs: '自营业务', action: '申请开通', devops: '负责运维', person: '张三', phone: '15198298939' },
        { bs: '社区团购', action: '申请开通', devops: '负责运维', person: '张三', phone: '15198298939' }
      ],
      loading: false,
      shopTime: '' // 营业时间
    }
  },
  mounted() {
    this.isAudit = this.$route.query.isAudit
    this.handleDetail()
    this.handleReasonList()
  },
  methods: {
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
    handleDetail() {
      const { code } = this.$route.query
      reqAuditDetail(code).then(res => {
        if (res.code === 200) {
          Object.keys(this.shop).forEach(key => {
            this.shop[key] = res.result[key]
          })
          if (res.result && res.result.shopLicenseVo) {
            Object.keys(this.qualify).forEach(key => {
              this.qualify[key] = res.result.shopLicenseVo[key]
            })
            Object.keys(this.master).forEach(key => {
              this.master[key] = res.result.shopLicenseVo[key]
            })
            Object.keys(this.master2).forEach(key => {
              this.master2[key] = res.result.shopLicenseVo[key]
            })
          }
          if (res.result && res.result.times && res.result.times.length > 0) {
            let arr = res.result.times.map(item => {
              return item.beginTime + '-' + item.endTime
            })
            this.shopTime = arr.toString()
          } else {
            this.shopTime = ''
          }
        }
      })
    },
    handleDown(link) {
      window.open(link)
    },
    // 获取驳回原因
    handleReasonList() {
      findDataListByCode('shop_register_audit').then(res => {
        if (res.code === 200) {
          this.rejectOption = res.result || []
        } else {
          this.rejectOption = []
        }
      })
    },
    handleSave() {
      if (this.form.audit) {
        if (this.form.audit === 1) {
          this.handlePass()
        } else {
          this.handleReject()
        }
      } else {
        this.$message.error('请选择审核状态')
      }
    },
    /**
     * @description: 审核通过
     */
    handlePass() {
      const h = this.$createElement
      this.$msgbox({
        title: '确定通过？',
        message: h(
          'div',
          {
            style: {
              color: 'red'
            }
          },
          `审核通过后，此门店只能绑定"${this.master['legalPerson']}"的银行卡`
        ),
        showCancelButton: true,
        confirmButtonText: '通过',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          done()
        }
      })
        .then(() => {
          this.handleAudit(this.shop.shopCode, 1)
        })
        .catch(() => {
          return
        })
    },
    /**
     * @description: 审核拒绝
     */
    handleReject() {
      const { reason, detail } = this.form
      if (reason === 'other') {
        this.handleAudit(this.shop.shopCode, 6, detail)
      } else {
        this.handleAudit(this.shop.shopCode, 6, reason)
      }
    },
    handleAudit(code, status, reson) {
      this.loading = true
      asyncShopAudit({ auditStatus: status, shopCode: code, auditDesc: reson }).then(res => {
        this.loading = false
        if (res.code === 200) {
          this.$message.success(res.message || '审核操作成功')
          this.$router.go(-1)
        }
      }).catch(() => {
        this.loading = false
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
  .label-width{
    width: 70px;
    text-align: right;
  }
  .label {
    color: $secondColor;
  }
  .qualify-name{
    width: 135px;
    display: inline-block;
    text-align: right;
  }
  .content {
    padding: 30px;
  }
  .el-col {
    margin-bottom: 30px;
  }
  .map-col-style {
    display: flex;
  }
  .tips {
    color: red;
    font-size: 12px;
    margin-top: 5px;
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
</style>
