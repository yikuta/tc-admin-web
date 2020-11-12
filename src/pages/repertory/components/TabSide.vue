<template>
  <div class="tab-side">
    <ul v-if="sideList.length>0">
      <li 
        v-for="item in sideList" 
        :key="item.id" 
        :title="item.name" 
        :class="{ active: item.id === activeId }"
        @click="handleChangeTab(item.id)">{{item.name}}</li>
    </ul>
    <p class="no-data" v-else>暂无数据</p>
  </div>
</template>
<script>
export default {
  props: {
    sideList: {
      type: Array,
      default: []
    }
  },
  watch: {
    sideList(newVal) {
      if (newVal && newVal.length > 0) {
        this.activeId = newVal[0].id
      }
    }
  },
  data() {
    return {
      activeId: 1
    }
  },
  methods: {
    handleChangeTab(id) {
      this.activeId = id
      this.$emit('update', this.activeId)
    }
  }
}
</script>
<style lang="scss" scoped>
.tab-side{
  max-height: 500px;
  overflow: auto;
  ul{
    margin: 0;
    padding: 0;
    min-height: 192px;
  }
  li{
    list-style: none;
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    text-align: center;
    // display: inline-block;
  }
  .active{
    background: #f9fafc;
    color: rgb(64, 158, 255);
  }
  .no-data{
    text-align: center;
    min-height: 116px;
    font-size: 14px;
    color: #909399;
  }
}
</style>