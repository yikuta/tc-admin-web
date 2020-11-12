<template>
  <div>
    <el-form ref="form" :model="form" label-width="80px" size="mini">
      <el-row>
        <el-col :span="6">
          <el-form-item label="用户编号" prop="memberCode.value">
            <el-input v-model="form.memberCode.value" placeholder="用户编号" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户手机" prop="memberPhone.value">
            <el-input v-model="form.memberPhone.value" placeholder="用户手机" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="昵称" prop="nickName.value">
            <el-input v-model="form.nickName.value" placeholder="昵称" clearable></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="终端来源" prop="terminalType.value">
            <el-select v-model="form.terminalType.value">
              <el-option v-for="item of originOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户标签" prop="tag">
            <el-select v-model="form.tag" multiple clearable placeholder="请选择" :multiple-limit='3' @change="handleChangeTags">
              <el-option v-for="item in labelOptions" :key="item.value" :label="item.describe" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="用户标签（城市）" prop="citytags">
            <el-select v-model="form.citytags" multiple placeholder="请选择" :multiple-limit='3' @remove-tag='handleRemoveTag'>
              <el-option v-for="item in cityTagOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="province" label-width="20px">
            <el-select v-model="form.province" placeholder="省份" clearable @change="handleChange">
              <el-option v-for="item in provinceOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item label="" prop="city" label-width="20px">
            <el-select v-model="form.city" placeholder="城市" clearable @change="handleChangeCitys">
              <el-option v-for="item in cityOption" :key="item.code" :label="item.name" :value="item.code"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <div class="search-btn" style="text-align: right;">
            <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
            <el-button type="primary" size="mini" @click="handleSearch">查询</el-button>
          </div>
        </el-col>
      </el-row>
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
        memberCode: { value: '', name: 'memberCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        memberPhone: { value: '', name: 'memberPhone', matchType: MatchType.CONTAIN, type: DataType.STRING },
        nickName: { value: '', name: 'nickName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        terminalType: { value: '', name: 'terminalType', matchType: MatchType.EQUAL, type: DataType.STRING },
        citytag: { value: '', name: 'memberStayedCities.cityCode', matchType: MatchType.IN, type: DataType.LISTSTRING },
        label: { value: '', name: 'memberLabels.labelType', matchType: MatchType.IN, type: DataType.LISTENUM },
        tag: [],
        citytags: [],
        province: '',
        city: ''
      },
      labelOptions: [],
      originOptions: [
        { label: '天呈生活APP(IOS)', value: 1 },
        { label: '天呈生活APP(Android)', value: 2 },
        { label: '天呈净菜小程序', value: 4 },
        { label: '天呈生活小程序', value: 3 }
      ],
      provinceOption: [],
      cityOption: [],
      cityTagOption: []
    }
  },
  mounted() {
    this.handleTags()
    this.handleReceiveProvinceList()
  },
  methods: {
    handleReset() {
      this.form.citytag.value = ''
      this.form.label.value = ''
      this.$refs['form'].resetFields()
    },
    handleSearch() {
      this.$emit('search', this.form)
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
  }
}
</script>

<style lang='scss' scoped>
.search-content {
  /deep/ .el-form {
    display: flex;
    flex-wrap: wrap;
    .el-form-item {
      width: 25%;
      .el-select {
        width: 100%;
      }
    }
  }
}
</style>
