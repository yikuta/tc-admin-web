<template>
  <div class="goods-info-view">
    <div class="view-header">
      <div class=""><i class="el-icon-left"></i></div>
      <div class=""></div>
    </div>
    <div>
      <el-carousel height="150px">
        <el-carousel-item v-for="item in 4" :key="item">
          <h3 class="small">{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
  // 商品详情预览
  export default {
    name: 'GoodsInfoView'
  }
</script>

<style lang="scss" scoped></style>
