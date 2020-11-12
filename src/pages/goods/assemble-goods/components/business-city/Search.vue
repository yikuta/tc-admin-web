<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-row>
        <el-col :span="16">
          <el-form-item label="城市" prop="address">
            <el-row>
              <el-col :span="12">
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
              <el-col :span="12">
                <el-form-item prop="cityId.value">
                  <el-select
                    v-model="form.cityId.value"
                    placeholder="请选择"
                    style="margin-left:10px"
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
            </el-row>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="状态" prop="status.value">
            <el-select v-model="form.status.value" placeholder="请选择" clearable>
              <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
      <el-button v-np="'GROUP_BIZCITY_ADD'" type="primary" size="mini" @click="handleOnService">开通新城市</el-button>
    </div>
  </el-card>
</template>

<script>
import Cascader from '@/components/Cascader'
import { MatchType, DataType } from '@/constants/search'
import { findAllProvince, findAreasByCode } from '@/api/common'
export default {
  name: 'Search',
  components: { Cascader },
  data() {
    return {
      form: {
        provinceId: { value: '', name: 'provinceCode', matchType: MatchType.EQUAL, type: DataType.LONG },
        cityId: { value: '', name: 'cityCode', matchType: MatchType.EQUAL, type: DataType.LONG },
        status: { value: '', name: 'enable', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      },
      provinceList: [],
      cityList: [],
      statusOption: [
        { value: '', label: '全部' },
        { value: 1, label: '启用' },
        { value: 0, label: '停用' }
      ]
    }
  },
  mounted() {
    this.handleReceiveProvinceList()
  },
  methods: {
    submitQuery() {
      this.$emit('on-search')
    },
    /**
     * @description: 查询省
     */
    handleReceiveProvinceList() {
      findAllProvince().then(res => {
        if (res.code === 200) {
          this.provinceList = res.result || []
        } else {
          this.provinceList = []
        }
      })
    },
    /**
     * @description: 根据code查询市，区
     */
    handleChange(code, name) {
      if (code && name) {
        findAreasByCode({ code }).then(res => {
          if (res.code === 200) {
            this[`${name}List`] = res.result || []
            this.form.cityId.value = ''
          } else {
            this[`${name}List`] = []
          }
        })
      }
    },
    /**
     * @description: 重置
     */
    handleReset() {
      this.$refs['form'].resetFields()
    },
    /**
     * @description: 开通新服务
     */
    handleOnService() {
      this.$emit('on-add-service')
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
      // width: 33%;
      .el-select {
        width: 100%;
      }
    }
  }
  .search-btn {
    text-align: right;
  }
}
</style>
