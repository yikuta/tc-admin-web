<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="广告名称" prop="name.value">
        <el-input v-model="form.name.value" placeholder="请输入广告名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="状态" prop="status.value">
        <el-select v-model="form.status.value">
          <el-option v-for="item of statusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="有效期" prop="expire.value">
        <el-date-picker v-model="form.expire.value" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="handleTimeChange"></el-date-picker>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
      <el-button type="primary" size="mini" v-np="'ADV_CONTENT_CREATE'" @click="handleAdd">添加广告</el-button>
    </div>
  </el-card>
</template>

<script>
import { AD_TYPE } from '../../constants'
import { MatchType, DataType } from '@/constants/search'
import { reqAdvertisingInit } from '@/api/advertising'

export default {
  name: 'Search',
  mounted() {
    this._reqAdvertisingInit()
  },
  data() {
    return {
      form: {
        name: { value: '', name: 'advertName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        status: { value: '', name: 'advertDetailStatus', matchType: MatchType.EQUAL, type: DataType.STRING },
        expire: { value: [], name: 'expiryDate', matchType: MatchType.BETWEEN, type: DataType.DATE }
      },
      statusOptions: []
    }
  },
  methods: {
    /**
     * @description: 格式化时间
     */
    handleTimeChange(date) {
      if (date && date.length === 2) {
        date[0] += ' 00:00:00'
        date[1] += ' 23:59:59'
      }
    },
    submitQuery() {
      this.$emit('on-search')
    },
    /**
     * @description: 添加广告
     */
    handleAdd() {
      this.$router.push({
        name: 'advertisingForm',
        query: {
          type: this.$parent.type === AD_TYPE.TEXT ? 'text' : 'img',
          spaceId: this.$parent.spaceId
        }
      })
    },
    /**
     * @description: 重置
     */
    handleReset() {
      this.$refs['form'].resetFields()
    },
    /**
     * @description: 初始化
     */
    _reqAdvertisingInit() {
      return reqAdvertisingInit()
        .then(res => {
          if (res.code === 200) {
            const defaultItem = { key: '全部', value: '' }
            let result = res.result || {}
            let advertStatus = result.advertStatus || []
            this.statusOptions = advertStatus.map(item => {
              return { key: item.name, value: item.code }
            })
            this.statusOptions.unshift(defaultItem)
          }
        })
        .catch(() => {})
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
