<template>
  <div class="create-card">
      <el-card size="mini" class="coupon-card">
        <el-row class="card-head">
          <el-col :span="12">满赠活动</el-col>
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="$router.push({ path: '/market/shopping/form', query: { type: 'add' }})">新建</el-button>
          </el-col>
        </el-row>
        <el-row class="card-content">
          <el-col :span="8">满赠：</el-col>
          <el-col :span="16">
            <el-col>满100元 赠 **** 商品</el-col>
            <el-col>满200元 赠 **** 商品</el-col>
          </el-col>
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
