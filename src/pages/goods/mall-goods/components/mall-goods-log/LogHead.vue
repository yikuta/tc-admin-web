<template>
  <el-card class="search-bar">
    <el-row>
      <el-col :span="12">
        <p class="head-text">商品标题：{{fetchData.channelCommodityName}}</p>
      </el-col>
      <el-col :span="12">
        <p class="head-text">商品分类：{{formatCategory()}}</p>
      </el-col>
    </el-row>
    <el-row :style="{marginTop:'10px'}">
      <el-col :span="12">
        <p class="head-text">拼团城市：{{fetchData.cityStr}}</p>
      </el-col>
    </el-row>
  </el-card>
</template>
<script>
export default {
  props: {
    fetchData: { default: () => ({}) }
  },
  methods: {
    /**
     * @description: 格式化商品分类
     */
    formatCategory() {
      const categories = (this.fetchData.channelCategoryList || []).reduce((pre, item) => {
        pre.push(item.parent ? `${item.parent.name}-${item.name}` : `${item.name}`)
        return pre
      }, [])
      return categories.join(',')
    }
  }
}
</script>
<style lang="scss" scoped>
.head-text {
  margin: 0;
  padding: 0;
}
.search-bar {
  margin: 0 0 20px 0;
}
</style>
