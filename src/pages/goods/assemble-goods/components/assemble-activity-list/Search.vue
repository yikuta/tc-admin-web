<template>
  <el-card class="search-content">
    <el-form ref="form" :model="form" label-width="100px" size="mini">
      <el-form-item label="拼团城市" prop="cityCategory.value">
        <el-cascader v-model="form.cityCategory.value" :props="props" clearable :placeholder="'请选择拼团城市'"></el-cascader>
      </el-form-item>
      <el-form-item label="活动名称" prop="activityName.value">
        <el-input v-model="form.activityName.value" placeholder="请输入活动名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="活动编号" prop="activityCode.value">
        <el-input v-model="form.activityCode.value" placeholder="请输入活动编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="业务商品编码" prop="channelCode.value">
        <el-input v-model="form.channelCode.value" placeholder="请输入业务商品编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="商品名称" prop="name.value">
        <el-input v-model="form.name.value" placeholder="请输入商品名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="活动类型" prop="activityType.value">
        <el-select v-model="form.activityType.value">
          <el-option v-for="item of activityTypeOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="团长编码" prop="colonelCode.value">
        <el-input v-model="form.colonelCode.value" placeholder="请输入团长编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="团长姓名" prop="colonelName.value">
        <el-input v-model="form.colonelName.value" placeholder="请输入团长姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="活动状态" prop="status.value">
        <el-select v-model="form.status.value">
          <el-option v-for="item of activityStatusOptions" :key="item.key" :label="item.key" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="search-btn">
      <el-button type="primary" size="mini" @click="submitQuery">查询</el-button>
      <el-button type="plain" size="mini" @click="handleReset">重置</el-button>
      <el-button v-np="'GROUP_ACTIVITY_ADD'" type="primary" size="mini" @click="handlePublishActivity">新增活动</el-button>
    </div>
  </el-card>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'
import { reqBusinessCityByCode } from '@/api/assembleGoods'

export default {
  name: 'Search',
  data() {
    return {
      form: {
        cityCategory: { value: [], name: 'channelCategories.id', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        activityName: { value: '', name: 'groupActivityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        activityCode: { value: '', name: 'groupActivityCode', matchType: MatchType.CONTAIN, type: DataType.STRING },
        channelCode: { value: '', name: 'channelCommodityNo', matchType: MatchType.CONTAIN, type: DataType.STRING },
        name: { value: '', name: 'channelCommodityName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        activityType: { value: '', name: 'groupActivityType', matchType: MatchType.EQUAL, type: DataType.INTEGER },
        colonelCode: { value: '', name: 'regimentalNo', matchType: MatchType.EQUAL, type: DataType.STRING },
        colonelName: { value: '', name: 'regimentalName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        status: { value: '', name: 'activityStatus', matchType: MatchType.EQUAL, type: DataType.INTEGER }
      },
      activityStatusOptions: [
        { key: '全部', value: '' },
        { key: '未开始', value: 1 },
        { key: '进行中', value: 2 },
        { key: '暂停中', value: 3 },
        { key: '已结束', value: 4 }
      ],
      activityTypeOptions: [
        { key: '全部', value: '' },
        { key: '单次活动', value: 1 },
        { key: '周期活动', value: 2 }
      ],
      props: {
        // 级联prop
        lazy: true,
        checkStrictly: true,
        lazyLoad(node, resolve) {
          if (node.root) {
            reqBusinessCityByCode({ status: false })
              .then(res => {
                let nodes = res.result || []
                nodes = nodes.map(item => ({
                  value: item.provinceCode,
                  label: item.provinceName,
                  leaf: false
                }))
                resolve(nodes)
              })
              .catch(() => {
                resolve([])
              })
          } else {
            reqBusinessCityByCode({ id: node.value, status: false })
              .then(res => {
                let result = res.result || []
                let province = result[0] || {}
                let nodes = province.cityList || []
                nodes = nodes.map(item => ({
                  value: item.cityCode,
                  label: item.cityName,
                  leaf: true
                }))
                resolve(nodes)
              })
              .catch(() => {
                resolve([])
              })
          }
        }
      }
    }
  },
  methods: {
    submitQuery() {
      this.$emit('on-search')
    },
    /**
     * @description: 新增活动
     */
    handlePublishActivity() {
      this.$router.push({ name: 'publishAssembleActivity' })
    },
    /**
     * @description: 重置
     */
    handleReset() {
      this.$refs['form'].resetFields()
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
      width: 33%;
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
