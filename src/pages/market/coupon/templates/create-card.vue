<template>
  <div class="create-card">
      <el-card size="mini" class="coupon-card">
        <el-row class="card-head">
          <el-col :span="12">满减券</el-col>
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="$router.push({ path: '/market/couponManager/form', query: { couponType: 'DOORFILL', type: 'add' }})">新建</el-button>
          </el-col>
        </el-row>
        <el-row class="card-content">
          <el-col :span="8">直减：</el-col>
          <el-col :span="16">无条件减 x 元</el-col>
        </el-row>
        <el-row class="card-content">
          <el-col :span="8">满减：</el-col>
          <el-col :span="16">满 x 减 x 元</el-col>
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="16">满 xx 减 x 元</el-col>
        </el-row>
        <el-row class="card-content">
          <el-col :span="8">每满减：</el-col>
          <el-col :span="16">每满 x 减 x 元</el-col>
        </el-row>
      </el-card>
      <el-card size="mini" class="coupon-card">
        <el-row class="card-head">
          <el-col :span="12">折扣券</el-col>
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="$router.push({ path: '/market/couponManager/form', query: { couponType: 'DISCOUNT', type: 'add' }})">新建</el-button>
          </el-col>
        </el-row>
        <el-row class="card-content">
          <el-col :span="8">直减：</el-col>
          <el-col :span="16">无条件享 x 折</el-col>
        </el-row>
        <el-row class="card-content">
          <el-col :span="8">满减：</el-col>
          <el-col :span="16">满 x 享 x 折</el-col>
          <el-col :span="8">&nbsp;</el-col>
          <el-col :span="16">满 x 享 x 折</el-col>
        </el-row>
      </el-card>
  </div>
</template>

<script>
  export default {
    name: 'CreateCard'
  }
</script>

<style scoped lang="scss">
  .create-card{display: flex;}
  .coupon-card{height:auto;width:240px;
    &:first-child{margin-right:20px;}
    >div{}
    .card-head{display: flex;align-items: center;margin-bottom:10px;
      >div{
        &:last-child{text-align: right;}
      }
    }
    .card-content{font-size:14px;margin-bottom:5px;
      >div{
        &:nth-child(2n-1) {text-align: right;}
      }
    }
  }
</style>
