<template>
  <div class="wrapper">
    <el-form ref="form" :model="form" label-width="80px" inline size="mini">
      <el-row>
        <el-col :span="8">
          <el-form-item label="状态" prop="type">
            <el-select v-model="form.type" placeholder="请选择" clearable @change="handleChange">
              <el-option v-for="item in typeOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="商品名称" prop="goods.value">
            <el-input v-model="form.goods.value" placeholder="商品名称" clearable></el-input>
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
          <el-form-item label="登录账号" prop="bossAccount.value">
            <el-input v-model="form.bossAccount.value" placeholder="登录账号" clearable></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { MatchType, DataType } from '@/constants/search'
export default {
  name: 'Search',
  data() {
    return {
      form: {
        auditStatus: { value: 'boss.ShopGoodsAuditStaus_10,11', name: 'auditStatus', matchType: MatchType.IN, type: DataType.LISTENUM },
        isUpshelf: { value: '', name: 'isUpshelf', matchType: MatchType.EQUAL, type: DataType.ENUM },
        type: '',
        goods: { value: '', name: 'productName', matchType: MatchType.CONTAIN, type: DataType.STRING },
        name: { value: '', name: 'shop.name', matchType: MatchType.CONTAIN, type: DataType.STRING },
        shopCode: { value: '', name: 'shop.shopCode', matchType: MatchType.EQUAL, type: DataType.STRING },
        bossAccount: { value: '', name: 'shop.bossAccount', matchType: MatchType.EQUAL, type: DataType.STRING }
      },
      typeOption: [
        { value: '', label: '全部' },
        { value: 'boss.ShopGoodsAuditStaus_10', label: '待审核' },
        { value: 'boss.ShopGoodsUpshelfType_1', label: '已上架' },
        { value: 'boss.ShopGoodsUpshelfType_0', label: '已下架' }
      ]
    }
  },
  methods: {
    handleChange(val) {
      if (val) {
        if (val === 'boss.ShopGoodsAuditStaus_10') {
          this.form.auditStatus.value = val
          this.form.isUpshelf.value = ''
        } else if (val === 'boss.ShopGoodsUpshelfType_0') {
          this.form.isUpshelf.value = val
          this.form.auditStatus.value = 'boss.ShopGoodsAuditStaus_11'
        } else {
          this.form.isUpshelf.value = val
          this.form.auditStatus.value = ''
        }
      } else {
        this.form.isUpshelf.value = ''
        this.form.auditStatus.value = ''
      }
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
