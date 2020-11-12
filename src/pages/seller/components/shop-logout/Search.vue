<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="120px" inline size="mini">
      <el-form-item label="状态" prop="status.value" v-if="activeTab==='1'">
        <el-select v-model="form.status.value" placeholder="请选择" clearable>
          <el-option v-for="item in statusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门店名称" prop="name.value">
        <el-input v-model="form.name.value" placeholder="门店名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="门店编码" prop="shopCode.value">
        <el-input v-model="form.shopCode.value" placeholder="门店编码" clearable></el-input>
      </el-form-item>
      <el-form-item label="登录账号" prop="bossAccount.value">
        <el-input v-model="form.bossAccount.value" placeholder="登录账号" clearable></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import { Cascader } from '../common'
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'Search',
  // components: { Cascader },
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      form: {
        status: { value: '', name: 'auditStatus', matchType: MatchType.EQUAL, type: DataType.STRING },
        name: { value: '', name: 'shop.name', matchType: MatchType.CONTAIN, type: DataType.STRING },
        shopCode: { value: '', name: 'shopCode', matchType: MatchType.EQUAL, type: DataType.STRING },
        bossAccount: { value: '', name: 'shop.bossAccount', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      statusOption: [
        { value: '', label: '全部' },
        { value: '6', label: '被驳回' },
        { value: '1', label: '审核通过' }
      ],
      provinceList: [],
      cityList: [],
      areaList: []
    }
  },
  methods: {
  }
}
</script>

<style lang='scss' scoped>
</style>
