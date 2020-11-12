<template>
  <div class="wrapper">
    <el-form class="form" ref="form" :model="form" label-width="120px" inline size="small">
      <el-form-item label="用户编号" prop="name.value">
        <el-input v-model="form.name.value" :maxlength="11" clearable placeholder="用户编号"></el-input>
      </el-form-item>
      <el-form-item label="用户手机" prop="phone.value">
        <el-input v-model="form.phone.value" :maxlength="11" clearable placeholder="用户手机" @input='handlePhone'></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nick.value">
        <el-input v-model="form.nick.value" :maxlength="20" clearable placeholder="昵称"></el-input>
      </el-form-item>
      <el-form-item label="用户标签" prop="tag">
        <el-select v-model="form.tag" multiple clearable placeholder="请选择" :multiple-limit='3' @change="handleChangeTags">
          <el-option v-for="item in labelOptions" :key="item.value" :label="item.describe" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="终端来源" prop="source.value">
        <el-select v-model="form.source.value" clearable placeholder="请选择">
          <el-option
            v-for="item in sourceOption"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="注册时间" prop="registerTime.value">
        <el-date-picker
          v-model="form.registerTime.value"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="最后登录时间" prop="lastestTime.value">
        <el-date-picker
          v-model="form.lastestTime.value"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="用户标签（城市）" prop="citytags" label-width="140px">
        <el-select v-model="form.citytags" multiple placeholder="请选择" :multiple-limit='3' @remove-tag='handleRemoveTag'>
          <el-option v-for="item in cityTagOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="province" label-width="20px">
        <el-select v-model="form.province" placeholder="省份" clearable @change="handleChange">
          <el-option v-for="item in provinceOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="city" label-width="20px">
        <el-select v-model="form.city" placeholder="城市" clearable @change="handleChangeCitys">
          <el-option v-for="item in cityOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'
import { fetchUserLabesList } from '@/api/user'
import { findAllProvince, findAreasByCode } from '@/api/common'
export default {
  name: 'Search',
  data() {
    return {
      form: {
        name: { value: '', name: 'memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        enable: { value: true, name: 'enable', matchType: MatchType.EQUAL, type: DataType.BOOLAEN },
        // registerChannel: { value: '', name: 'memberTerminals.registerChannel', matchType: MatchType.EQUAL, type: DataType.BOOLAEN },
        phone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        nick: { value: '', name: 'nickName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        citytag: { value: '', name: 'memberStayedCities.cityCode', matchType: MatchType.IN, type: DataType.LISTSTRING },
        label: { value: '', name: 'memberLabels.labelType', matchType: MatchType.IN, type: DataType.LISTENUM },
        source: { value: '', name: 'memberTerminals.terminalType', matchType: MatchType.EQUAL, type: DataType.ENUM },
        registerTime: { value: [], name: 'createTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        lastestTime: { value: [], name: 'updateTime', matchType: MatchType.BETWEEN, type: DataType.DATE },
        tag: [],
        citytags: [],
        province: '',
        city: ''
      },
      labelOptions: [],
      provinceOption: [],
      cityOption: [],
      cityTagOption: [],
      sourceOption: [
        { label: '天呈生活APP(IOS)', value: 1 },
        { label: '天呈生活APP(Android)', value: 2 },
        { label: '天呈净菜小程序', value: 4 },
        { label: '天呈生活小程序', value: 3 }
      ]
    }
  },
  mounted() {
    this.handleTags()
    this.handleReceiveProvinceList()
  },
  methods: {
    /**
     * @description: 格式化时间
     */
    // handleTimeChange(date) {
    //   if (date && date.length === 2) {
    //     date[0] += ' 00:00:00'
    //     date[1] += ' 23:59:59'
    //   }
    // },
    resetFields() {
      this.form.label.value = ''
      this.form.citytag.value = ''
      this.$refs['form'].resetFields()
    },
    handlePhone(val) {
      let reg = /^[0-9]{1,11}$/
      if (reg.test(val)) {
        this.form.phone.value = val
      } else {
        if (isNaN(parseInt(val))) {
          this.form.phone.value = ''
        } else {
          this.form.phone.value = parseInt(val)
        }
      }
    },
    handleTags() {
      fetchUserLabesList().then(res => {
        if (res.code === 200) {
          this.labelOptions = res.result || []
        } else {
          this.labelOptions = []
        }
      })
    },
    handleChangeTags(val) {
      if (val && val.length) {
        this.form.label.value = 'member.LabelType_' + val.join(',')
      }
    },
    /**
     * @description: 查询省
     */
    handleReceiveProvinceList() {
      findAllProvince().then(res => {
        if (res.code === 200) {
          this.provinceOption = res.result || []
        } else {
          this.provinceOption = []
        }
      })
    },
    /**
     * @description: 根据code查询市，区
     */
    handleChange(code) {
      if (code) {
        findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this.cityOption = res.result || []
            this.form.city = ''
          } else {
            this.cityOption = []
          }
        })
      }
    },
    handleChangeCitys(value) {
      if (value) {
        let arr = this.cityOption.filter(item => item.code === value)
        if (this.form.citytags.length > 2) {
          this.$message.info('最多选择3个城市')
        } else {
          this.cityTagOption.push(...arr)
          this.form.citytags.push(arr[0].code)
          this.form.citytag.value = this.form.citytags.join(',')
        }
      }
    },
    handleRemoveTag(val) {
      if (val) {
        let idx = 0
        this.cityTagOption.map((item, index) => {
          if (item.code === val) {
            idx = index
          }
        })
        this.cityTagOption.splice(idx, 1)
        this.form.citytag.value = this.form.citytags.join(',')
      }
    }
    // handleChangeSource(val) {
    //   if (val) {
    //     this.form.registerChannel.value = true
    //   } else {
    //     this.form.registerChannel.value = ''
    //   }
    // }
  }
}
</script>

<style lang='scss' scoped>
.wrapper {
  .form {
    /deep/ .el-range-separator {
      width: 10%;
    }
  }
}
</style>
