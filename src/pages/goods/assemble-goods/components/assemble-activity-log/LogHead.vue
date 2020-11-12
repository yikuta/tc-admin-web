<template>
  <el-card class="search-bar">
    <el-row>
      <el-col :span="12">
        <p class="head-text">商品标题：这个是在小程序前端展示的标题</p>
      </el-col>
      <el-col :span="12">
        <p class="head-text">商品分类：先是一级分类-再是二有分类</p>
      </el-col>
    </el-row>
    <el-row :style="{marginTop:'10px'}">
      <el-col :span="12">
        <p class="head-text">拼团城市：四川省 > 成都市</p>
      </el-col>
    </el-row>
  </el-card>
</template>
<style lang="scss" scoped>
.head-text {
  margin: 0;
  padding: 0;
}
.search-bar {
  margin: 0 0 20px 0;
}
</style>