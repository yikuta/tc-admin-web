<template>
  <div class="wrapper">
    <search-area @resetFields="resetFields">
      <search ref="searchForm" />
    </search-area>
    <content-area contentTitle="用户活动收藏">
      <table-area :tableData="dataList" />
      <pagination :current="1" :total="1000" />
    </content-area>
  </div>
</template>

<script>
import { Common, ActivityCollection } from './components'
import Pagination from '@/components/Pagination'

export default {
  name: 'activityCollection',
  components: { ...Common, ...ActivityCollection, Pagination },
  data() {
    return {
      dataList: [
        {
          name: '清明踏青 尝青团',
          activityTime: '2020-4-1~2020-4-30',
          source: '平台',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        },
        {
          name: '清明踏青 尝青团',
          activityTime: '2020-4-1~2020-4-30',
          source: '平台',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        },
        {
          name: '清明踏青 尝青团',
          activityTime: '2020-4-1~2020-4-30',
          source: '平台',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        },
        {
          name: '清明踏青 尝青团',
          activityTime: '2020-4-1~2020-4-30',
          source: '平台',
          phone: '13988888888',
          nick: '测试',
          collectTime: '2020-04-09 10:21:21'
        }
      ]
    }
  },
  methods: {
    resetFields() {
      this.$refs['searchForm'].resetFields()
    }
  }
}
</script>

<style lang='scss'>
.wrapper {
}
</style>